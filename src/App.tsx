import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "@/pages/Home";
import Panic from "@/pages/Panic";
import Journal from "@/pages/Journal";
import MoodDetox from "@/pages/MoodDetox";
import Ballpit from "@/components/Ballpit";
import IntroScreen from "./components/IntroScreen";

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);
  const [showIntro, setShowIntro] = useState(false);
  const [introCompleted, setIntroCompleted] = useState(false);
  const [isIntroFadingOut, setIsIntroFadingOut] = useState(false);

  // Check if this is the first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem("panicpal-visited");

    if (!hasVisited) {
      setShowIntro(true);
      setIntroCompleted(false);
    } else {
      setShowIntro(false);
      setIntroCompleted(true);
    }
  }, []);

  // Function to reset intro for testing
  const resetIntro = () => {
    localStorage.removeItem("panicpal-visited");
    setShowIntro(true);
    setIntroCompleted(false);
  };

  // Add keyboard shortcut to reset intro (Ctrl/Cmd + Shift + R)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "R") {
        e.preventDefault();
        resetIntro();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem("panicpal-visited", "true");
    setIsIntroFadingOut(true);
    // Immediately set intro as completed to start rendering main app
    setIntroCompleted(true);
    setTimeout(() => {
      setShowIntro(false);
      setIsIntroFadingOut(false);
    }, 2000); // Match the IntroScreen fade duration
  };

  useEffect(() => {
    if (location !== displayLocation) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        const fadeInTimer = setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
        return () => clearTimeout(fadeInTimer);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  // Show intro screen if it's the first visit
  if (showIntro && !isIntroFadingOut) {
    return <IntroScreen onComplete={handleIntroComplete} />;
  }

  // During intro fade-out, show both intro and main app for smooth transition
  if (showIntro && isIntroFadingOut) {
    return (
      <>
        {/* Main app rendered behind intro */}
        <div className="fixed inset-0 z-30">{renderMainApp()}</div>
        {/* Intro screen fading out on top */}
        <IntroScreen onComplete={handleIntroComplete} />
      </>
    );
  }

  // Don't render main app until intro is completed
  if (!introCompleted) {
    return <div className="fixed inset-0 bg-black" />;
  }

  return renderMainApp();

  function renderMainApp() {
    return (
      <div className="relative min-h-screen bg-black">
        {isHome && (
          <>
            <div className="absolute inset-0 z-0">
              <Ballpit
                count={100}
                gravity={0.03}
                friction={0.9975}
                wallBounce={0.95}
                followCursor={true}
                minSize={0.5}
                maxSize={1.2}
                colors={[0x6b21a8, 0x0e7490, 0x0c1844, 0x7c3aed, 0x0f766e, 0x1e3a8a]}
                ambientIntensity={2}
                materialParams={{
                  metalness: 0.4,
                  roughness: 0.1,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.1,
                  emissive: 0x1a0b3d,
                  emissiveIntensity: 0.1,
                  transparent: true,
                  opacity: 0.9,
                }}
              />
            </div>
          </>
        )}

        <Navbar />

        <div
          className={`transition-all duration-500 ease-out ${
            isTransitioning
              ? "opacity-0 transform translate-y-2 scale-[0.98]"
              : "opacity-100 transform translate-y-0 scale-100"
          }`}
          style={{
            transitionTimingFunction: isTransitioning
              ? "cubic-bezier(0.4, 0, 0.6, 1)"
              : "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <Routes location={displayLocation}>
            <Route path="/" element={<Home />} />
            <Route path="/panic" element={<Panic />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/mood-detox" element={<MoodDetox />} />
          </Routes>
        </div>
      </div>
    );
  }
}
