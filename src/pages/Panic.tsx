import { VapiButton } from "../components/VapiButton";
import { useVapi } from "../hooks/useVapi";
import CalmBlobsBG from "@/components/CalmBlobsBG";
import { CelebrationScreen } from "../components/CelebrationScreen";
import { useEffect, useRef, useState, useCallback } from "react";

export default function Panic() {
  const { startCall, endCall, isSessionActive, isLoading } = useVapi({
    publicKey: import.meta.env.VITE_VAPI_PUBLIC_KEY || "",
    assistantId: import.meta.env.VITE_VAPI_ASSISTANT_ID || "",
    baseUrl: import.meta.env.VITE_VAPI_BASE_URL,
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const [vapiError, setVapiError] = useState<string | null>(null);
  const [autoStartAttempted, setAutoStartAttempted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [wasSessionActive, setWasSessionActive] = useState(false);

  // Handle audio playback
  const playAudio = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsAudioPlaying(true);
        setAudioError(null);
      } catch (error) {
        console.warn('Audio autoplay blocked:', error);
        setAudioError('Click anywhere to enable calming sounds');
      }
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    }
  };

  // Auto-start Vapi with error handling
  const autoStartVapi = useCallback(async () => {
    console.log('autoStartVapi called, autoStartAttempted:', autoStartAttempted, 'isSessionActive:', isSessionActive);
    
    if (!autoStartAttempted && !isSessionActive) {
      try {
        console.log('Starting Vapi auto-start...');
        setAutoStartAttempted(true);
        await startCall();
        console.log('Vapi auto-start successful');
        setVapiError(null);
      } catch (error) {
        console.warn('Vapi auto-start failed:', error);
        setVapiError('Voice agent auto-start failed. Click the button to start manually.');
      }
    } else {
      console.log('Auto-start skipped - already attempted or session active');
    }
  }, [autoStartAttempted, isSessionActive, startCall]);

  // Handle user interaction for autoplay policy
  const handleUserInteraction = () => {
    if (!userInteracted) {
      setUserInteracted(true);
      if (!isAudioPlaying && audioRef.current) {
        playAudio();
      }
      // Also try to auto-start Vapi on user interaction if it hasn't started yet
      if (!autoStartAttempted && !isSessionActive) {
        autoStartVapi();
      }
    }
  };

  // Initialize audio on component mount
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3; // Set to 30% volume
      audio.loop = true;
      
      // Try to play immediately (may be blocked by browser)
      playAudio();
    }

    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  // Auto-start Vapi after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      startCall().catch((error) => {
        console.error('Auto-start failed:', error);
      });
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [startCall]);

  // Add click listener for autoplay fallback
  useEffect(() => {
    if (audioError && !userInteracted) {
      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('touchstart', handleUserInteraction);
      
      return () => {
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };
    }
  }, [audioError, userInteracted]);

  // Detect when Vapi call ends to show celebration
  useEffect(() => {
    if (wasSessionActive && !isSessionActive) {
      // Call just ended, show celebration and stop ocean audio
      setShowCelebration(true);
      pauseAudio();
    }
    
    // Track session state
    setWasSessionActive(isSessionActive);
  }, [isSessionActive, wasSessionActive]);

  // Handle closing celebration screen
  const handleCloseCelebration = () => {
    setShowCelebration(false);
  };

  return (
    <main className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      {/* Ocean background audio */}
      <audio
        ref={audioRef}
        preload="auto"
        aria-label="Calming ocean sounds"
      >
        <source src="/ocean-waves.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Audio error notification */}
      {audioError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-blue-500/20 border border-blue-400/50 text-blue-100 px-4 py-2 rounded-lg backdrop-blur-md text-sm">
            {audioError}
          </div>
        </div>
      )}

      {/* Vapi error notification */}
      {vapiError && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-orange-500/20 border border-orange-400/50 text-orange-100 px-4 py-2 rounded-lg backdrop-blur-md text-sm">
            {vapiError}
          </div>
        </div>
      )}

      {/* Audio controls */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={isAudioPlaying ? pauseAudio : playAudio}
          className="bg-white/10 border border-white/30 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-all duration-300"
          aria-label={isAudioPlaying ? "Pause ocean sounds" : "Play ocean sounds"}
        >
          {isAudioPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      {/* Center wrapper */}
      <section
        aria-label="Panic Support Voice Agent"
        className="w-full max-w-4xl flex flex-col items-center text-center"
      >
        <div className="space-y-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Stay calm. A voice agent will guide you here.
          </h1>
        </div>

        {/* Orb - purely visual element */}
        <div className="relative flex items-center justify-center -mt-24">
          {/* Soft outer glow */}
          <div className="absolute -inset-16 rounded-full blur-3xl opacity-50 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.3),rgba(56,189,248,0.25)_40%,transparent_70%)]" />

          {/* Orb container - visual only */}
          <div className="relative h-80 w-80 md:h-96 md:w-96">
            <CalmBlobsBG />
          </div>
        </div>

        {/* Start Call Button - positioned below orb */}
        <div className="mt-26">
          <VapiButton
            publicKey={import.meta.env.VITE_VAPI_PUBLIC_KEY || ""}
            assistantId={import.meta.env.VITE_VAPI_ASSISTANT_ID || ""}
            baseUrl={import.meta.env.VITE_VAPI_BASE_URL}
            startCall={startCall}
            endCall={endCall}
            isSessionActive={isSessionActive}
            isLoading={isLoading}
            className={`
              px-8 py-4 rounded-full text-white font-medium text-lg
              backdrop-blur-md border transition-all duration-300 ease-in-out
              shadow-lg hover:shadow-xl transform hover:scale-105
              ${
                isSessionActive
                  ? "bg-red-500/20 border-red-400/50 hover:bg-red-500/30 text-red-100 animate-pulse"
                  : "bg-white/10 border-white/30 hover:bg-white/20 text-white"
              }
            `}
          />
        </div>

        {/* Status indicator - completely separate from orb */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            {isLoading
              ? "Connecting..."
              : isSessionActive
              ? "Voice agent active"
              : "Tap to speak with voice agent"}
          </p>
        </div>
      </section>

      {/* Celebration Screen */}
      <CelebrationScreen 
        isVisible={showCelebration} 
        onClose={handleCloseCelebration} 
      />
    </main>
  );
}
