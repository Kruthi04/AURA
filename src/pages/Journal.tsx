// src/pages/Journal.tsx
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NotebookPen, Trash2, Heart, Mic, MicOff } from "lucide-react";

// Type declarations for Web Speech API
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new(): ISpeechRecognition;
    };
    webkitSpeechRecognition: {
      new(): ISpeechRecognition;
    };
  }
}

const dailyMoodOptions = [
  { id: "amazing", emoji: "😄", label: "Amazing" },
  { id: "happy", emoji: "😊", label: "Happy" },
  { id: "good", emoji: "🙂", label: "Good" },
  { id: "okay", emoji: "😐", label: "Okay" },
  { id: "sad", emoji: "😔", label: "Sad" },
  { id: "anxious", emoji: "😰", label: "Anxious" },
  { id: "tired", emoji: "😴", label: "Tired" },
  { id: "frustrated", emoji: "😤", label: "Frustrated" },
];

export default function Journal() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [dailyMood, setDailyMood] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // Check for speech recognition support
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setText(prev => prev + (prev ? ' ' : '') + finalTranscript);
          }
        };
        
        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, []);

  const startRecording = () => {
    if (recognitionRef.current && speechSupported) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  function clearAll() {
    setTitle("");
    setText("");
  }
  function saveDemo() {
    console.log({ title, text }); // placeholder
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3">
            Daily Journal
          </h1>
          <p className="text-white/60 text-lg">
            Capture your thoughts and track your mood
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Composer */}
          <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <NotebookPen className="h-5 w-5" /> New Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white/80">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="A headline for today…"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* Entry */}
              <div className="space-y-2">
                <Label htmlFor="entry" className="text-white/80">
                  Entry
                </Label>
                <div className="relative">
                  <Textarea
                    id="entry"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="How are you feeling today?"
                    className="min-h-44 bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-12"
                  />
                  {speechSupported && (
                    <Button
                      type="button"
                      onClick={toggleRecording}
                      className={`absolute top-3 right-3 p-2 h-8 w-8 rounded-full transition-all duration-200 ${
                        isRecording
                          ? 'bg-red-500/90 hover:bg-red-500 text-white animate-pulse'
                          : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                      }`}
                      disabled={!speechSupported}
                    >
                      {isRecording ? (
                        <MicOff className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                {isRecording && (
                  <p className="text-xs text-white/60 flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Recording... Click the microphone to stop
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button
                  onClick={clearAll}
                  variant="ghost"
                  className="text-white/80 hover:bg-white/10"
                  type="button"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Clear
                </Button>
                <Button
                  onClick={saveDemo}
                  className="bg-sky-400/90 hover:bg-sky-400 text-sky-950 shadow-[0_8px_24px_rgba(56,189,248,0.35)]"
                  type="button"
                >
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar: Daily Mood */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl p-0 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
            <CardHeader className="pb-3 pt-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <Heart className="h-5 w-5" />
                  How I'm Feeling Today
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {dailyMoodOptions.map((moodOption) => {
                  const isSelected = dailyMood === moodOption.id;
                  return (
                    <button
                      key={moodOption.id}
                      onClick={() => setDailyMood(moodOption.id)}
                      className={`
                        flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200
                        hover:bg-white/10 hover:scale-105
                        ${
                          isSelected
                            ? "bg-white/15 border-2 border-white/30 shadow-lg"
                            : "bg-white/5 border border-white/10"
                        }
                      `}
                      type="button"
                    >
                      <span className="text-2xl mb-1">{moodOption.emoji}</span>
                      <span className="text-xs text-white/80 text-center leading-tight">
                        {moodOption.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {dailyMood && (
                <div className="mt-4 p-3 rounded-xl bg-white/10 border border-white/20">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {dailyMoodOptions.find((m) => m.id === dailyMood)?.emoji}
                    </span>
                    <span className="text-sm text-white/90">
                      Feeling{" "}
                      {dailyMoodOptions
                        .find((m) => m.id === dailyMood)
                        ?.label.toLowerCase()}{" "}
                      today
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
