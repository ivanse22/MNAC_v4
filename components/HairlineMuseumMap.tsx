import React, { useMemo, useState, useRef } from 'react';

export type PointCategory = 'art' | 'service' | 'accessibility';

export interface MuseumPoint {
  id: string;
  level: 0 | 1;
  category: PointCategory;
  roomCode: string;
  wing: 'Centro' | 'Ala Oeste' | 'Ala Este';
  title: string;
  subtitle: string;
  desc: string;
  directions: string[];
  walkTime: string;
  x: number;
  y: number;
  artworkId?: string;
  tourFilter?: string;
  image?: string;
}

interface HairlineMuseumMapProps {
  points: MuseumPoint[];
  activeLevel: 0 | 1;
  explodedView: boolean;
  selectedId: string | null;
  onSelectPoint: (id: string) => void;
  scale: number;
  onScaleChange: (next: number) => void;
  pan: { x: number; y: number };
  onPanChange: (next: { x: number; y: number }) => void;
  showRoute: boolean;
  tourRoutePoints?: { id: string; level: 0 | 1; x: number; y: number }[];
}

type Vec2 = [number, number];
type Sample = { u: number; v: number; nu: number; nv: number };

const RAD = Math.PI / 180;
const r2 = (n: number) => Math.round(n * 100) / 100;

function createIsoProj(cx = 200, cy = 166, scale = 1.44) {
  const az = 45 * RAD;
  const k = 0.5;
  const ca = Math.cos(az);
  const sa = Math.sin(az);
  const kz = Math.sqrt(1 - k * k);

  const raw = (x: number, y: number, z: number): Vec2 => {
    const rx = x * ca - y * sa;
    const ry = x * sa + y * ca;
    return [rx * scale, (-ry * k - z * kz) * scale];
  };

  const [ox, oy] = raw(0, 0, 14);
  const P = (x: number, y: number, z: number): Vec2 => {
    const [px, py] = raw(x, y, z);
    return [r2(px - ox + cx), r2(py - oy + cy)];
  };

  const front = (q: Sample) => {
    const nx = q.nu * ca - q.nv * sa;
    const ny = q.nu * sa + q.nv * ca;
    return ny < 0 || (Math.abs(ny) < 1e-6 && nx > 0);
  };

  return { P, front };
}

function rrect(x0: number, y0: number, x1: number, y1: number, r: number, steps = 4): Sample[] {
  const rr = Math.min(r, Math.abs(x1 - x0) / 2, Math.abs(y1 - y0) / 2);
  const pts: Sample[] = [];
  const corners: [number, number, number][] = [
    [x1 - rr, y1 - rr, 0],
    [x0 + rr, y1 - rr, Math.PI / 2],
    [x0 + rr, y0 + rr, Math.PI],
    [x1 - rr, y0 + rr, (3 * Math.PI) / 2]
  ];
  for (const [cx, cy, a0] of corners) {
    for (let i = 0; i <= steps; i++) {
      const a = a0 + (i / steps) * (Math.PI / 2);
      const nu = Math.cos(a);
      const nv = Math.sin(a);
      pts.push({ u: cx + rr * nu, v: cy + rr * nv, nu, nv });
    }
  }
  return pts;
}

function poly(pts: Vec2[]): string {
  if (!pts.length) return '';
  return 'M' + pts.map((p) => `${p[0]},${p[1]}`).join('L') + 'Z';
}

function openPath(pts: Vec2[]): string {
  if (!pts.length) return '';
  return 'M' + pts.map((p) => `${p[0]},${p[1]}`).join('L');
}

function hull(pts: Vec2[]): Vec2[] {
  const sorted = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Vec2, a: Vec2, b: Vec2) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Vec2[] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0)
      lower.pop();
    lower.push(p);
  }
  const upper: Vec2[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0)
      upper.pop();
    upper.push(p);
  }
  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

function buildPrism(
  P: (x: number, y: number, z: number) => Vec2,
  front: (q: Sample) => boolean,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  z0: number,
  z1: number,
  r = 6,
  inset = 1.6
) {
  const outer = rrect(x0, y0, x1, y1, r, 4);
  const inner = rrect(x0 + inset, y0 + inset, x1 - inset, y1 - inset, Math.max(1, r - inset), 4);
  const foot = outer.map((q) => P(q.u, q.v, z0));
  const top = outer.map((q) => P(q.u, q.v, z1));
  const sil = poly(hull(foot.concat(top)));
  const frontPts = inner.filter(front).map((q) => P(q.u, q.v, z1));
  const crease = openPath(frontPts);
  return { sil, crease };
}

// Origin points per floor: North Main Entrance (P0) / Central Grand Staircase (P1)
const LEVEL_ORIGIN: Record<0 | 1, [number, number]> = {
  0: [0, 36],
  1: [0, 22],
};

const HairlineMuseumMap: React.FC<HairlineMuseumMapProps> = ({
  points,
  activeLevel,
  explodedView,
  selectedId,
  onSelectPoint,
  scale,
  onScaleChange,
  pan,
  onPanChange,
  showRoute,
  tourRoutePoints
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const gestureRef = useRef<{
    mode: 'none' | 'pan' | 'pinch';
    startX: number;
    startY: number;
    origPanX: number;
    origPanY: number;
    startDist: number;
    origScale: number;
  }>({
    mode: 'none',
    startX: 0,
    startY: 0,
    origPanX: 0,
    origPanY: 0,
    startDist: 0,
    origScale: 1
  });

  // Non-passive wheel zoom for trackpad/desktop
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.002;
      const next = Math.max(0.75, Math.min(3, Number((scale + delta).toFixed(2))));
      onScaleChange(next);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [scale, onScaleChange]);

  const { P, front } = useMemo(() => createIsoProj(200, 168, 1.44), []);

  const levelsGeometry = useMemo(() => {
    const gap = explodedView ? 38 : 16;
    return ([0, 1] as const).map((lvl) => {
      const lift = lvl === activeLevel ? 6 : lvl > activeLevel && !explodedView ? 44 : 0;
      const z0 = lvl * gap + lift;
      const z1 = z0 + 6;
      const slab = buildPrism(P, front, -80, -44, 80, 44, z0, z1, 8, 1.8);
      const westWing = buildPrism(P, front, -74, -34, -26, 32, z1, z1 + 3.4, 5, 1.2);
      const eastWing = buildPrism(P, front, 26, -34, 74, 32, z1, z1 + 3.4, 5, 1.2);
      const ovalRotunda = buildPrism(P, front, -21, -22, 21, 22, z1, z1 + (lvl === 0 ? 5.5 : 4.2), 18, 1.4);
      // North Entrance Staircase projection (towards Plaça d'Espanya)
      const northPortico = buildPrism(P, front, -16, 40, 16, 52, z0, z0 + 3, 4, 1);
      return { level: lvl, zBase: z1 + 4, slab, westWing, eastWing, ovalRotunda, northPortico };
    });
  }, [P, front, activeLevel, explodedView]);

  const selectedPoint = points.find((pt) => pt.id === selectedId) || null;

  // Isometric North vector (towards +y facade facing Plaça d'Espanya)
  const compassOrigin = P(-82, 34, 0);
  const compassNorth = P(-82, 54, 0);

  const clampPan = (x: number, y: number) => ({
    x: Math.max(-260, Math.min(260, x)),
    y: Math.max(-200, Math.min(200, y))
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-map-pin="true"]')) return;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignore synthetic pointer capture errors
    }
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setIsInteracting(true);

    if (pointersRef.current.size === 1) {
      gestureRef.current = {
        mode: 'pan',
        startX: e.clientX,
        startY: e.clientY,
        origPanX: pan.x,
        origPanY: pan.y,
        startDist: 0,
        origScale: scale
      };
    } else if (pointersRef.current.size === 2) {
      const pts = Array.from(pointersRef.current.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      const midX = (pts[0].x + pts[1].x) / 2;
      const midY = (pts[0].y + pts[1].y) / 2;
      gestureRef.current = {
        mode: 'pinch',
        startX: midX,
        startY: midY,
        origPanX: pan.x,
        origPanY: pan.y,
        startDist: Math.max(dist, 10),
        origScale: scale
      };
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 1 && gestureRef.current.mode === 'pan') {
      const dx = e.clientX - gestureRef.current.startX;
      const dy = e.clientY - gestureRef.current.startY;
      onPanChange(clampPan(gestureRef.current.origPanX + dx, gestureRef.current.origPanY + dy));
    } else if (pointersRef.current.size >= 2 && gestureRef.current.mode === 'pinch') {
      const pts = Array.from(pointersRef.current.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      const midX = (pts[0].x + pts[1].x) / 2;
      const midY = (pts[0].y + pts[1].y) / 2;
      const ratio = dist / gestureRef.current.startDist;
      const nextScale = Math.max(0.75, Math.min(3, Number((gestureRef.current.origScale * ratio).toFixed(2))));
      onScaleChange(nextScale);
      const dx = midX - gestureRef.current.startX;
      const dy = midY - gestureRef.current.startY;
      onPanChange(clampPan(gestureRef.current.origPanX + dx, gestureRef.current.origPanY + dy));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size === 1) {
      const remaining = Array.from(pointersRef.current.values())[0];
      gestureRef.current = {
        mode: 'pan',
        startX: remaining.x,
        startY: remaining.y,
        origPanX: pan.x,
        origPanY: pan.y,
        startDist: 0,
        origScale: scale
      };
    } else if (pointersRef.current.size === 0) {
      gestureRef.current.mode = 'none';
      setIsInteracting(false);
    }
  };

  // Native Touch fallback for iOS Safari 2-finger pinch-to-zoom
  const touchPinchRef = useRef<{ active: boolean; startDist: number; origScale: number; midX: number; midY: number; origPanX: number; origPanY: number }>({
    active: false,
    startDist: 0,
    origScale: 1,
    midX: 0,
    midY: 0,
    origPanX: 0,
    origPanY: 0
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setIsInteracting(true);
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      touchPinchRef.current = {
        active: true,
        startDist: Math.max(Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY), 10),
        origScale: scale,
        midX: (t0.clientX + t1.clientX) / 2,
        midY: (t0.clientY + t1.clientY) / 2,
        origPanX: pan.x,
        origPanY: pan.y
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchPinchRef.current.active) {
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      const midX = (t0.clientX + t1.clientX) / 2;
      const midY = (t0.clientY + t1.clientY) / 2;
      const ratio = dist / touchPinchRef.current.startDist;
      const nextScale = Math.max(0.75, Math.min(3, Number((touchPinchRef.current.origScale * ratio).toFixed(2))));
      onScaleChange(nextScale);
      onPanChange(
        clampPan(
          touchPinchRef.current.origPanX + (midX - touchPinchRef.current.midX),
          touchPinchRef.current.origPanY + (midY - touchPinchRef.current.midY)
        )
      );
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      touchPinchRef.current.active = false;
      if (e.touches.length === 0) setIsInteracting(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center overflow-hidden touch-none select-none cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={
        {
          touchAction: 'none',
          '--hl-plate': '#1F1F1F',
          '--hl-surface': '#262626',
          '--hl-edge': 'rgba(209, 204, 191, 0.48)',
          '--hl-mid': 'rgba(209, 204, 191, 0.2)',
          '--hl-lo': 'rgba(209, 204, 191, 0.08)',
          '--hl-hi': '#F14A32'
        } as React.CSSProperties
      }
    >
      <div
        className={`w-full max-w-[920px] aspect-[5/4] ${isInteracting ? '' : 'transition-transform duration-300 ease-out'}`}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`
        }}
      >
        <svg viewBox="0 0 400 320" className="w-full h-full overflow-visible">
          {/* Isometric Ground Reference Grid */}
          <g opacity="0.35">
            {[-90, -60, -30, 0, 30, 60, 90].map((v) => {
              const a = P(-95, v, -2);
              const b = P(95, v, -2);
              const c = P(v, -55, -2);
              const d = P(v, 55, -2);
              return (
                <React.Fragment key={v}>
                  <path d={`M${a[0]},${a[1]}L${b[0]},${b[1]}`} stroke="var(--hl-lo)" strokeWidth="0.7" fill="none" />
                  <path d={`M${c[0]},${c[1]}L${d[0]},${d[1]}`} stroke="var(--hl-lo)" strokeWidth="0.7" fill="none" />
                </React.Fragment>
              );
            })}
          </g>

          {/* Isometric North Orientation Vector (Rule 10: pure geometry) */}
          <g opacity="0.75">
            <path
              d={`M${compassOrigin[0]},${compassOrigin[1]}L${compassNorth[0]},${compassNorth[1]}`}
              stroke="#D1CCBF"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
            <circle cx={compassNorth[0]} cy={compassNorth[1]} r="2.2" fill="#F14A32" />
            <circle cx={compassOrigin[0]} cy={compassOrigin[1]} r="1.5" fill="#D1CCBF" />
          </g>

          {/* Render Floors Back-to-Front (P0 -> P1) */}
          {levelsGeometry.map(({ level, zBase, slab, westWing, eastWing, ovalRotunda, northPortico }) => {
            const isActiveFloor = level === activeLevel;
            const isUpperGhost = !explodedView && level > activeLevel;
            const floorPoints = points.filter((pt) => pt.level === level);
            const origin = LEVEL_ORIGIN[level];
            const originScreen = P(origin[0], origin[1], zBase + 1);
            const exitScreen = P(0, 49, level === 0 ? 9 : zBase);

            const selectedInFloor =
              selectedPoint && selectedPoint.level === level ? selectedPoint : null;

            return (
              <g
                key={level}
                style={{
                  opacity: isUpperGhost ? 0.14 : isActiveFloor ? 1 : 0.42,
                  pointerEvents: isUpperGhost ? 'none' : 'auto',
                  transition: 'opacity 500ms cubic-bezier(0.32, 0.72, 0, 1)'
                }}
              >
                {/* North Entrance Portico (P0) */}
                {level === 0 && (
                  <path
                    d={northPortico.sil}
                    fill="var(--hl-plate)"
                    stroke={isActiveFloor ? 'var(--hl-edge)' : 'var(--hl-mid)'}
                    strokeWidth="0.9"
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                  />
                )}

                {/* Main Floor Plate */}
                <path
                  d={slab.sil}
                  fill="var(--hl-plate)"
                  stroke={isActiveFloor ? 'var(--hl-edge)' : 'var(--hl-mid)'}
                  strokeWidth="1.05"
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                />
                <path
                  d={slab.crease}
                  fill="none"
                  stroke="var(--hl-lo)"
                  strokeWidth="0.8"
                  vectorEffect="non-scaling-stroke"
                />

                {/* West & East Gallery Wings + Central Oval Rotunda */}
                {[westWing, eastWing, ovalRotunda].map((wing, idx) => (
                  <g key={idx}>
                    <path
                      d={wing.sil}
                      fill={isActiveFloor ? 'var(--hl-surface)' : 'var(--hl-plate)'}
                      stroke={isActiveFloor ? 'var(--hl-edge)' : 'var(--hl-mid)'}
                      strokeWidth="0.9"
                      vectorEffect="non-scaling-stroke"
                      strokeLinejoin="round"
                    />
                    <path
                      d={wing.crease}
                      fill="none"
                      stroke="var(--hl-lo)"
                      strokeWidth="0.7"
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                ))}

                {/* Active Floor Wayfinding & Interactive Dots */}
                {isActiveFloor && (
                  <>
                    {/* Main Entrance / Exit Portico Marker */}
                    {level === 0 && (
                      <circle cx={exitScreen[0]} cy={exitScreen[1]} r="2.2" fill="#34D399" stroke="#1F1F1F" strokeWidth="0.8" />
                    )}

                    {/* "You Are Here" Origin Marker */}
                    <g>
                      <circle
                        cx={originScreen[0]}
                        cy={originScreen[1]}
                        r="5.5"
                        fill="none"
                        stroke="#D1CCBF"
                        strokeWidth="0.8"
                        opacity="0.65"
                      >
                        <animate attributeName="r" from="3" to="9" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.7" to="0" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={originScreen[0]} cy={originScreen[1]} r="2.8" fill="#D1CCBF" />
                    </g>

                    {/* Sequential Guided Tour Path (when inside TourPlayer) */}
                    {tourRoutePoints && (() => {
                      const floorStops = tourRoutePoints.filter((s) => s.level === level);
                      if (floorStops.length < 2) return null;
                      const pathD = floorStops
                        .map((s, idx) => {
                          const [sx, sy] = P(s.x, s.y, zBase + 1.5);
                          return `${idx === 0 ? 'M' : 'L'}${sx},${sy}`;
                        })
                        .join(' ');
                      return (
                        <path
                          d={pathD}
                          fill="none"
                          stroke="#D1CCBF"
                          strokeWidth="1.2"
                          strokeDasharray="2 3"
                          opacity="0.55"
                          vectorEffect="non-scaling-stroke"
                          strokeLinecap="round"
                        />
                      );
                    })()}

                    {/* Animated Dashed Hairline Route to Selected Room */}
                    {showRoute && selectedInFloor && (
                      (() => {
                        const targetScreen = P(selectedInFloor.x, selectedInFloor.y, zBase + 2);
                        const elbowScreen = P(selectedInFloor.x, origin[1], zBase + 1.5);
                        const routePath = `M${originScreen[0]},${originScreen[1]} L${elbowScreen[0]},${elbowScreen[1]} L${targetScreen[0]},${targetScreen[1]}`;
                        return (
                          <path
                            d={routePath}
                            fill="none"
                            stroke="#F14A32"
                            strokeWidth="2"
                            strokeDasharray="3 3"
                            vectorEffect="non-scaling-stroke"
                            strokeLinecap="round"
                          >
                            <animate
                              attributeName="stroke-dashoffset"
                              from="18"
                              to="0"
                              dur="1.1s"
                              repeatCount="indefinite"
                            />
                          </path>
                        );
                      })()
                    )}

                    {/* Room & Service Pins */}
                    {floorPoints.map((pt) => {
                      const [sx, sy] = P(pt.x, pt.y, zBase + 2);
                      const isSelected = selectedId === pt.id;
                      const isHovered = hoveredId === pt.id;
                      const isHighlighted = isSelected || isHovered;
                      const dotColor =
                        isHighlighted
                          ? '#F14A32'
                          : pt.category === 'art'
                          ? '#D1CCBF'
                          : pt.category === 'accessibility'
                          ? '#34D399'
                          : '#9CA3AF';

                      return (
                        <g
                          key={pt.id}
                          data-map-pin="true"
                          className="cursor-pointer"
                          onPointerEnter={() => setHoveredId(pt.id)}
                          onPointerLeave={() => setHoveredId(null)}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPoint(pt.id);
                          }}
                        >
                          <circle cx={sx} cy={sy} r="11" fill="transparent" />

                          {isSelected && (
                            <circle
                              cx={sx}
                              cy={sy}
                              r="7"
                              fill="none"
                              stroke="#F14A32"
                              strokeWidth="1.2"
                            >
                              <animate attributeName="r" from="4" to="11" dur="1.6s" repeatCount="indefinite" />
                              <animate attributeName="opacity" from="0.9" to="0" dur="1.6s" repeatCount="indefinite" />
                            </circle>
                          )}

                          <circle
                            cx={sx}
                            cy={sy}
                            r={isSelected ? 4.4 : isHovered ? 3.8 : 3}
                            fill={dotColor}
                            stroke="#1F1F1F"
                            strokeWidth="1"
                            style={{ transition: 'all 240ms cubic-bezier(0.32, 0.72, 0, 1)' }}
                          />
                        </g>
                      );
                    })}
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default HairlineMuseumMap;
