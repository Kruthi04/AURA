import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Play, Pause, Volume2, Waves, Sparkles, Quote, Heart, Plus } from "lucide-react";

type Track = { id: string; name: string; src: string };

const tracks: Track[] = [
  { id: "rain",  name: "Gentle Rain", src: "/audio/rain.mp3" },
  { id: "ocean", name: "Ocean Waves", src: "/audio/waves.mp3" },
  { id: "brown", name: "Brown Noise", src: "/audio/brown-noise.mp3" },
];

function CalmBlobsBG() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-black">
      {/* floating, blurred gradient blobs */}
      <div className="blob left-[-10%] top-[-10%] h-[45vmax] w-[45vmax] bg-gradient-to-br from-cyan-400 to-blue-600" />
      <div className="blob right-[-10%] top-[20%] h-[35vmax] w-[35vmax] bg-gradient-to-br from-fuchsia-400 to-blue-500"
           style={{ animationDelay: "2s" }}/>
      <div className="blob left-[20%] bottom-[-10%] h-[40vmax] w-[40vmax] bg-gradient-to-br from-emerald-400 to-teal-600"
           style={{ animationDelay: "4s" }}/>
    </div>
  );
}

function BreathGuide({ enabled }: { enabled: boolean }) {
  // subtle “inhale/exhale” circle using CSS animation
  return (
    <div className={`relative grid place-items-center ${enabled ? "opacity-100" : "opacity-0"} transition-opacity`}>
      <div
        className="h-28 w-28 rounded-full bg-white/10 ring-1 ring-white/20"
        style={{
          animation: enabled ? "breathe 8s ease-in-out infinite" : undefined,
        }}
      />
      <style>{`
        @keyframes breathe {
          0% { transform: scale(1); }
          25% { transform: scale(1.12); }   /* inhale */
          50% { transform: scale(1.2); }
          75% { transform: scale(1.12); }   /* exhale */
          100% { transform: scale(1); }
        }
      `}</style>
      <div className="mt-3 text-xs text-white/60">Breathe in • Hold • Breathe out • Hold</div>
    </div>
  );
}

export default function MoodDetox() {
  const [selected, setSelected] = useState<string>(tracks[0].id);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState<number>(70);
  const [loop, setLoop] = useState(true);
  const [showBreath, setShowBreath] = useState(true);
  const [gratitudeItems, setGratitudeItems] = useState<string[]>([]);
  const [newGratitudeItem, setNewGratitudeItem] = useState("");

  // Sample quotes - in a real app, this could be fetched from an API
  const quotes = [
    { text: "The present moment is the only time over which we have dominion.", author: "Thích Nhất Hạnh" },
    { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
    { text: "Wherever you are, be there totally.", author: "Eckhart Tolle" },
    { text: "The best way to take care of the future is to take care of the present moment.", author: "Thích Nhất Hạnh" },
    { text: "Mindfulness is about being fully awake in our lives.", author: "Jon Kabat-Zinn" }
  ];

  // Get today's quote based on the day of the year
  const todaysQuote = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return quotes[dayOfYear % quotes.length];
  }, []);

  const addGratitudeItem = () => {
    if (newGratitudeItem.trim()) {
      setGratitudeItems([...gratitudeItems, newGratitudeItem.trim()]);
      setNewGratitudeItem("");
    }
  };

  const removeGratitudeItem = (index: number) => {
    setGratitudeItems(gratitudeItems.filter((_, i) => i !== index));
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const current = useMemo(
    () => tracks.find(t => t.id === selected) ?? tracks[0],
    [selected]
  );

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.loop = loop;
  }, [loop]);

  useEffect(() => {
    // load new src on track change
    if (!audioRef.current) return;
    audioRef.current.src = current.src;
    if (playing) {
      audioRef.current.play().catch(() => setPlaying(false));
    }
  }, [current, playing]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch {
        console.warn("Audio failed to play. Check /public/audio files exist.");
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      <CalmBlobsBG />

      <div className="mx-auto max-w-5xl p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6" /> Mood Detox
          </h1>
          <div className="text-sm text-white/60">designed for calm, focus, and reset</div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-2">
          {/* Sound card */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl h-80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-5 w-5" /> Soothing soundscape
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 flex flex-col h-full">
              <div className="flex flex-col gap-3">
                <Label className="text-white/80">Track</Label>
                <Select value={selected} onValueChange={setSelected}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Choose a track" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 text-white border-white/20">
                    {tracks.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between gap-4">
                <Button
                  onClick={togglePlay}
                  className="rounded-xl bg-white/20 hover:bg-white/30 text-white"
                >
                  {playing ? (
                    <span className="inline-flex items-center gap-2"><Pause className="h-4 w-4" /> Pause</span>
                  ) : (
                    <span className="inline-flex items-center gap-2"><Play className="h-4 w-4" /> Play</span>
                  )}
                </Button>

                <div className="flex items-center gap-3 w-full">
                  <Volume2 className="h-4 w-4 text-white/70" />
                  <Slider
                    value={[volume]}
                    onValueChange={(v) => setVolume(v[0] ?? 70)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="w-10 text-right text-sm text-white/70">{volume}%</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch checked={loop} onCheckedChange={setLoop} id="loop" />
                <Label htmlFor="loop" className="text-white/80">Loop seamlessly</Label>
              </div>

              {/* hidden audio element */}
              <audio ref={audioRef} src={current.src} preload="auto" />
            </CardContent>
          </Card>

          {/* Breath + quick reset */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl h-80">
            <CardHeader>
              <CardTitle>Reset the nervous system</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex flex-col h-full justify-center">
              <BreathGuide enabled={showBreath} />
              <div className="flex items-center gap-3">
                <Switch checked={showBreath} onCheckedChange={setShowBreath} id="breathe" />
                <Label htmlFor="breathe" className="text-white/80">Breathing guide</Label>
              </div>
              <p className="text-sm text-white/70">
                Try 4–4–6 breathing: inhale 4s • hold 4s • exhale 6s. Two minutes can noticeably calm arousal.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* New cards row */}
        <div className="grid gap-6 lg:grid-cols-2 mt-6">
          {/* Quote of the Day card */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl h-80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Quote className="h-5 w-5" /> Quote of the Day
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col h-full justify-center">
              <blockquote className="text-white/90 italic text-lg leading-relaxed">
                "{todaysQuote.text}"
              </blockquote>
              <cite className="text-white/70 text-sm block text-right">
                — {todaysQuote.author}
              </cite>
            </CardContent>
          </Card>

          {/* Gratitude card */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl h-80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" /> Things You Are Grateful For
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col h-full">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGratitudeItem}
                  onChange={(e) => setNewGratitudeItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGratitudeItem()}
                  placeholder="What are you grateful for today?"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Button
                  onClick={addGratitudeItem}
                  className="bg-white/20 hover:bg-white/30 text-white px-3"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {gratitudeItems.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {gratitudeItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-2">
                      <span className="text-white/90 text-sm">{item}</span>
                      <button
                        onClick={() => removeGratitudeItem(index)}
                        className="text-white/70 hover:text-white text-xs ml-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {gratitudeItems.length === 0 && (
                <p className="text-white/70 text-sm text-center py-4">
                  Add something you're grateful for to get started
                </p>
              )}
            </CardContent>
          </Card>
        </div>


      </div>
    </div>
  );
}
