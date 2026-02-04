
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import ArtworkDetail from './pages/ArtworkDetail';
import VisitPage from './pages/VisitPage';
import WelcomePage from './pages/WelcomePage';
import ChatGuide from './components/ChatGuide';
import NavigationOverlays from './components/NavigationOverlays';
import TeacherCollectionsPage from './pages/TeacherCollectionsPage';
import TeacherNetworkPage from './pages/TeacherNetworkPage';
import ToursPage from './pages/ToursPage';
import TourPlayer from './pages/TourPlayer'; 
import SavedPage from './pages/SavedPage'; 
import BadgesPage from './pages/BadgesPage'; 
import QuizPage from './pages/QuizPage'; 
import { UserRole } from './types';
import { Loader2 } from 'lucide-react';
import { useGamification } from './hooks/useGamification';
import { useAuth } from './hooks/useAuth';
import ToastContainer from './components/ToastContainer';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { hapticService } from './services/hapticService';
import QRScannerModal from './components/QRScannerModal';

// Nuevas Páginas Profesionales
import AiSearchPage from './pages/AiSearchPage';
import ExplorePage from './pages/ExplorePage';
import TimelinePage from './pages/TimelinePage';
import AuthorsPage from './pages/AuthorsPage';
import MapPage from './pages/MapPage';
import AccessibilityPage from './pages/AccessibilityPage';

const App: React.FC = () => {
  // Use Real Auth Hook instead of local state only
  const { role: userRole, signIn, signOut, isLoading: isAuthLoading } = useAuth();
  
  // Gamification Hook
  const { 
    progress, 
    badges, 
    leaderboard,
    challenges,
    trackArtworkVisit, 
    trackSaveArtwork, 
    trackAiUsage,
    trackShare,
    setAvatar,
    toasts, 
    removeToast, 
    addToast 
  } = useGamification(userRole);

  // Accessibility States
  const [easyReading, setEasyReading] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  
  const [savedArtIds, setSavedArtIds] = useState<string[]>([]);
  
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  // Scroll & Header State
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  // --- CAPACITOR INITIALIZATION ---
  useEffect(() => {
    const initNativeFeatures = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Ocultar Splash Screen nativo cuando React monte
          await SplashScreen.hide();
          
          // Configurar Barra de Estado (Dark para coincidir con el fondo)
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setOverlaysWebView({ overlay: true });
        } catch (e) {
          console.warn("Error initializing native features", e);
        }
      }
    };
    initNativeFeatures();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY === 0) return; 

      setIsScrolled(currentScrollY > 50);

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsHeaderVisible(false); // Bajando
      } else if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
        setIsHeaderVisible(true); // Subiendo o en el top
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (userRole) {
      const storage = userRole === 'student' ? localStorage : sessionStorage;
      const saved = storage.getItem(`saved_art_${userRole}`);
      if (saved) {
        setSavedArtIds(JSON.parse(saved));
      } else {
        setSavedArtIds([]);
      }
    }
  }, [userRole]);

  useEffect(() => {
    if (userRole) {
      const storage = userRole === 'student' ? localStorage : sessionStorage;
      storage.setItem(`saved_art_${userRole}`, JSON.stringify(savedArtIds));
      trackSaveArtwork(savedArtIds.length);
    }
  }, [savedArtIds, userRole]);

  // Apply Accessibility Classes Globally to Body
  useEffect(() => {
    if (easyReading) {
      document.body.classList.add('easy-reading');
    } else {
      document.body.classList.remove('easy-reading');
    }
  }, [easyReading]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const handleToggleSave = (id: string) => {
    const isSaving = !savedArtIds.includes(id);
    setSavedArtIds(prev => 
      isSaving ? [...prev, id] : prev.filter(a => a !== id)
    );
    if (isSaving) {
      addToast('success', 'Obra Guardada', 'Se ha añadido a tu colección personal');
      hapticService.success();
    } else {
      hapticService.light();
    }
  };

  const handleLogout = () => {
    signOut(); // Use real sign out
    setIsRightMenuOpen(false);
    setIsLeftMenuOpen(false);
    setEasyReading(false);
    setHighContrast(false);
  };

  const handleRoleSelect = (role: UserRole) => {
    window.location.hash = '/';
    signIn(role); // Use real sign in (or mock wrapper)
  };

  // Abrir Chat con Feedback
  const handleOpenChat = () => {
    hapticService.medium();
    setIsChatOpen(true);
    trackAiUsage();
  };

  // Abrir Scanner con Feedback
  const handleOpenScanner = () => {
    hapticService.medium();
    setIsQRScannerOpen(true);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mnac-bg">
         <Loader2 className="animate-spin text-mnac-accent" size={48} />
      </div>
    );
  }

  if (!userRole) {
    return <WelcomePage onSelectRole={handleRoleSelect} />;
  }

  return (
    <Router>
      {/* Dark Theme Base */}
      <div className={`min-h-screen relative transition-all duration-500 pb-40 bg-mnac-bg text-mnac-textPrimary`}>
        
        <Header 
          onOpenLeftMenu={() => setIsLeftMenuOpen(true)} 
          onOpenRightMenu={() => setIsRightMenuOpen(true)} 
          role={userRole} 
          isVisible={isHeaderVisible}
          isScrolled={isScrolled}
        />

        <ToastContainer toasts={toasts} onRemove={removeToast} />
        
        <Routes>
          <Route path="/" element={<HomePage role={userRole} onSetScrolled={setIsScrolled} onSetHeaderVisible={setIsHeaderVisible} />} />
          
          {/* --- COLECCIÓN ONLINE --- */}
          <Route path="/collection" element={
              <GalleryPage 
                userRole={userRole} 
                easyReading={easyReading} 
                setEasyReading={setEasyReading}
                savedArtIds={savedArtIds}
                onToggleSave={handleToggleSave}
                isHeaderVisible={isHeaderVisible}
              />
            } 
          />
          <Route path="/collection/ai-search" element={
             <AiSearchPage userRole={userRole} />
          } />
          <Route path="/collection/explore" element={<ExplorePage userRole={userRole} savedArtIds={savedArtIds} onToggleSave={handleToggleSave} />} />
          
          {/* Inject Gamification Tracker into Detail */}
          <Route path="/artwork/:id" element={
             <ArtworkDetail 
                userRole={userRole} 
                easyReading={easyReading} 
                savedArtIds={savedArtIds} 
                onToggleSave={handleToggleSave}
                onVisit={trackArtworkVisit}
             />
          } />

          {/* --- RECORRIDOS TEMÁTICOS --- */}
          <Route path="/tours" element={<ToursPage userRole={userRole} />} />
          <Route path="/tours/timeline" element={<TimelinePage userRole={userRole} />} />
          <Route path="/tours/authors" element={<AuthorsPage userRole={userRole} />} />
          <Route path="/tour/:tourId/play" element={<TourPlayer userRole={userRole} />} />

          {/* --- VISITA --- */}
          <Route path="/visit" element={<VisitPage role={userRole} />} />
          <Route path="/visit/map" element={<MapPage userRole={userRole} />} />
          <Route path="/visit/accessibility" element={<AccessibilityPage userRole={userRole} />} />

          {/* --- ÁREA PERSONAL --- */}
          <Route path="/collections" element={<TeacherCollectionsPage savedArtIds={savedArtIds} onToggleSave={handleToggleSave} />} />
          <Route path="/network" element={<TeacherNetworkPage />} />
          <Route path="/saved" element={<SavedPage savedArtIds={savedArtIds} onToggleSave={handleToggleSave} />} />
          
          {/* Inject Expanded Badges Data */}
          <Route path="/badges" element={
             <BadgesPage 
                badges={badges} 
                progress={progress} 
                leaderboard={leaderboard}
                challenges={challenges}
                setAvatar={setAvatar}
                onShare={trackShare}
             />
          } />
          <Route path="/quiz" element={<QuizPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <NavigationOverlays 
          side="left" 
          isOpen={isLeftMenuOpen} 
          onClose={() => setIsLeftMenuOpen(false)} 
          role={userRole}
          onLogout={handleLogout}
          savedCount={savedArtIds.length}
        />
        
        <NavigationOverlays 
          side="right" 
          isOpen={isRightMenuOpen} 
          onClose={() => setIsRightMenuOpen(false)} 
          role={userRole}
          onLogout={handleLogout}
          savedCount={savedArtIds.length}
          easyReading={easyReading}
          setEasyReading={setEasyReading}
          highContrast={highContrast}
          setHighContrast={setHighContrast}
        />

        {/* MUSEUM DOCK - Updated for Dark Theme */}
        <BottomNavigation 
           onScan={handleOpenScanner} 
           onChat={handleOpenChat} 
           role={userRole}
        />

        <ChatGuide isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        <QRScannerModal isOpen={isQRScannerOpen} onClose={() => setIsQRScannerOpen(false)} />
      </div>
    </Router>
  );
};

export default App;
