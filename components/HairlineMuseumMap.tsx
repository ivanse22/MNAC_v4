import React, { useMemo, useState, useRef } from 'react';

export type PointCategory = 'art' | 'service' | 'accessibility';

export interface MuseumPoint {
  id: string;
  level: 0 | 1 | 2;
  category: PointCategory;
  roomCode: string;
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
  activeLevel: 0 | 1 | 2;
  explodedView: boolean;
  selectedId: string | null;
  onSelectPoint: (id: string) => void;
  scale: number;
  pan: { x: number; y: number };
  onPanChange: (next: { x: number; y: number }) => void;
  showRoute: boolean;
}

// --- HAIRLINE ISOMETRIC PROJECTION KERNEL (Cam 45°, 0.5 elevation) ---
type Vec2 = [number, number];
type Sample = { u: number; v: number; nu: number; nv: number };

const RAD = Math.PI / 180;
const r2 = (n: number) => Math.round(n * 100) / 100;

function createIsoProj(cx = 200, cy = 165, scale = 1.38) {
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

  // Center around world (0,0,20)
  const [ox, oy] = raw(0, 0, 22);
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
  // Find front run for subtle top crease (Hairline Rule 09)
  const frontPts = inner.filter(front).map((q) => P(q.u, q.v, z1));
  const crease = openPath(frontPts);
  const topPoly = poly(top);
  return { sil, crease, topPoly };
}

// Level stairs / origin point for "You Are Here" & wayfinding paths
const LEVEL_ORIGIN: Record<0 | 1 | 2, [number, number]> = {
  0: [0, 34],
  1: [0, 12],
  2: [0, 12],
};

const HairlineMuseumMap: React.FC<HairlineMuseumMapProps> = ({
  points,
  activeLevel,
  explodedView,
  selectedId,
  onSelectPoint,
  scale,
  pan,
  onPanChange,
  showRoute
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; origX: number; origY: number }>({
    active: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0
  });

  const { P, front } = useMemo(() => createIsoProj(200, 168, 1.42), []);

  // Build Hairline isometric architectural plates for all 3 levels (Rule 06: back-to-front painter's order)
  const levelsGeometry = useMemo(() => {
    const gap = explodedView ? 32 : 13;
    const defs: {
      level: 0 | 1 | 2;
      zBase: number;
      slab: ReturnType<typeof buildPrism>;
      westWing: ReturnType<typeof buildPrism>;
      eastWing: ReturnType<typeof buildPrism>;
      ovalRotunda: ReturnType<typeof buildPrism>;
    }[] = ([0, 1, 2] as const).map((lvl) => {
      const lift = lvl === activeLevel ? 5 : lvl > activeLevel && !explodedView ? 42 : 0;
      const z0 = lvl * gap + lift;
      const z1 = z0 + 5.5;
      // Palau Nacional monumental H-shaped footprint + central Oval Rotunda
      const slab = buildPrism(P, front, -78, -42, 78, 42, z0, z1, 8, 1.8);
      const westWing = buildPrism(P, front, -72, -34, -26, 34, z1, z1 + 3.2, 5, 1.2);
      const eastWing = buildPrism(P, front, 26, -34, 72, 34, z1, z1 + 3.2, 5, 1.2);
      const ovalRotunda = buildPrism(P, front, -22, -24, 22, 24, z1, z1 + (lvl === 1 ? 6.5 : 3.5), 18, 1.5);
      return { level: lvl, zBase: z1 + 4, slab, westWing, eastWing, ovalRotunda };
    });
    return defs;
  }, [P, front, activeLevel, explodedView]);

  const selectedPoint = points.find((pt) => pt.id === selectedId) || null;

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-map-pin="true"]')) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: pan.x,
      origY: pan.y
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    onPanChange({
      x: Math.max(-180, Math.min(180, dragRef.current.origX + dx)),
      y: Math.max(-140, Math.min(140, dragRef.current.origY + dy))
    });
  };

  const handlePointerUp = () => {
    dragRef.current.active = false;
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center overflow-hidden touch-none select-none cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={
        {
          '--hl-plate': '#1F1F1F',
          '--hl-surface': '#262626',
          '--hl-edge': 'rgba(209, 204, 191, 0.45)',
          '--hl-mid': 'rgba(209, 204, 191, 0.18)',
          '--hl-lo': 'rgba(209, 204, 191, 0.08)',
          '--hl-hi': '#F14A32'
        } as React.CSSProperties
      }
    >
      <div
        className="w-full max-w-[920px] aspect-[5/4] transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`
        }}
      >
        <svg viewBox="0 0 400 320" className="w-full h-full overflow-visible">
          {/* Isometric Ground Reference Grid (Rule 06: painted behind everything) */}
          <g opacity="0.35">
            {[-90, -60, -30, 0, 30, 60, 90].map((v) => {
              const a = P(-95, v, -2);
              const b = P(95, v, -2);
              const c = P(v, -60, -2);
              const d = P(v, 60, -2);
              return (
                <React.Fragment key={v}>
                  <path d={`M${a[0]},${a[1]}L${b[0]},${b[1]}`} stroke="var(--hl-lo)" strokeWidth="0.7" fill="none" />
                  <path d={`M${c[0]},${c[1]}L${d[0]},${d[1]}`} stroke="var(--hl-lo)" strokeWidth="0.7" fill="none" />
                </React.Fragment>
              );
            })}
          </g>

          {/* Render Floors Back-to-Front (P0 -> P1 -> P2) */}
          {levelsGeometry.map(({ level, zBase, slab, westWing, eastWing, ovalRotunda }) => {
            const isActiveFloor = level === activeLevel;
            const isUpperGhost = !explodedView && level > activeLevel;
            const floorPoints = points.filter((pt) => pt.level === level);
            const origin = LEVEL_ORIGIN[level];
            const originScreen = P(origin[0], origin[1], zBase + 1);

            const selectedInFloor =
              selectedPoint && selectedPoint.level === level ? selectedPoint : null;

            return (
              <g
                key={level}
                style={{
                  opacity: isUpperGhost ? 0.12 : isActiveFloor ? 1 : 0.42,
                  pointerEvents: isUpperGhost ? 'none' : 'auto',
                  transition: 'opacity 500ms cubic-bezier(0.32, 0.72, 0, 1)'
                }}
              >
                {/* Main Floor Plate */}
                <path
                  d={slab.sil}
                  fill="var(--hl-plate)"
                  stroke={isActiveFloor ? 'var(--hl-edge)' : 'var(--hl-mid)'}
                  strokeWidth="1"
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
                      strokeWidth="0.85"
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

                {/* Active Floor Wayfinding & Interactive Dots (Rule 04 & Rule 10: geometry + dots, zero words inside SVG) */}
                {isActiveFloor && (
                  <>
                    {/* "You Are Here" Entrance/Stair Origin Marker */}
                    <g>
                      <circle
                        cx={originScreen[0]}
                        cy={originScreen[1]}
                        r="5.5"
                        fill="none"
                        stroke="#D1CCBF"
                        strokeWidth="0.8"
                        opacity="0.6"
                      >
                        <animate attributeName="r" from="3" to="9" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.7" to="0" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={originScreen[0]} cy={originScreen[1]} r="2.6" fill="#D1CCBF" />
                    </g>

                    {/* Animated Dashed Hairline Route to Selected Room */}
                    {showRoute && selectedInFloor && (
                      (() => {
                        const targetScreen = P(selectedInFloor.x, selectedInFloor.y, zBase + 2);
                        const midWorldX = selectedInFloor.x;
                        const midWorldY = origin[1];
                        const elbowScreen = P(midWorldX, midWorldY, zBase + 1.5);
                        const routePath = `M${originScreen[0]},${originScreen[1]} L${elbowScreen[0]},${elbowScreen[1]} L${targetScreen[0]},${targetScreen[1]}`;
                        return (
                          <path
                            d={routePath}
                            fill="none"
                            stroke="#F14A32"
                            strokeWidth="1.8"
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
                          {/* Static invisible hit area so targets never jitter (Hairline Rule 01) */}
                          <circle cx={sx} cy={sy} r="10" fill="transparent" />

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
                            r={isSelected ? 4.2 : isHovered ? 3.6 : 2.8}
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
