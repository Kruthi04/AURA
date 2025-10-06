import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import Aurora from "./Aurora";

interface CelebrationScreenProps {
  isVisible: boolean;
  onClose?: () => void;
}

const affirmingQuotes = [
  "You are stronger than you know",
  "This feeling will pass",
  "You are safe and in control",
  "Every breath brings you peace",
  "You handled that with courage",
  "You are worthy of love and support",
  "Progress, not perfection",
  "You are not alone in this journey",
  "You choose calm over chaos",
  "You trust in your ability to heal",
];

export const CelebrationScreen: React.FC<CelebrationScreenProps> = ({
  isVisible,
  onClose,
}) => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isQuoteFading, setIsQuoteFading] = useState(false);
  const [isScreenVisible, setIsScreenVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Trigger fade-in animation
      setTimeout(() => setIsScreenVisible(true), 50);

      const quoteInterval = setInterval(() => {
        setIsQuoteFading(true);

        setTimeout(() => {
          setCurrentQuote((prev) => (prev + 1) % affirmingQuotes.length);
          setIsQuoteFading(false);
        }, 800); // Longer fade out duration
      }, 4500); // Longer interval for more peaceful transitions

      return () => {
        clearInterval(quoteInterval);
      };
    } else {
      // Trigger fade-out animation
      setIsScreenVisible(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center bg-black transition-all duration-500 ease-out ${
        isScreenVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      {/* Aurora starting from very top of screen including padding */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-60">
        <Aurora
          colorStops={["#8B5CF6", "#3B82F6", "#8B5CF6"]}
          amplitude={2.0}
          speed={0.5}
          blend={0.5}
        />
      </div>

      {/* Main Content */}
      <div
        className={`relative max-w-2xl mx-auto px-6 text-center mt-16 transition-all duration-700 ease-out delay-200 ${
          isScreenVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"
          aria-label="Close"
        >
          ×
        </button>

        {/* Main Message */}
        <div className="mb-12">
          <div className="flex justify-center mb-6">
            <Heart className="w-12 h-12 text-purple-400" fill="currentColor" />
          </div>

          <h1
            className={`text-3xl md:text-4xl font-semibold text-white/70 mb-4 transition-all duration-700 ease-in-out min-h-[3rem] flex items-center justify-center transform ${
              isQuoteFading
                ? "opacity-0 translate-y-2 scale-95"
                : "opacity-100 translate-y-0 scale-100"
            }`}
          >
            {affirmingQuotes[currentQuote]}
          </h1>

          <p className="text-lg text-white/70">You took a brave step today.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/journal"
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            Write in Journal
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/mood-detox"
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            Mood Detox
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/"
            className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            Go Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
