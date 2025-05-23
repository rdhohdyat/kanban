import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

export default function PomodoroTimer() {
  const timerModes: Record<TimerMode, number> = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  };

  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [secondsLeft, setSecondsLeft] = useState<number>(timerModes.pomodoro * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(0);
  // Perbaikan tipe untuk intervalRef
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset timer when mode changes
  useEffect(() => {
    handleReset();
  }, [mode]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            setIsRunning(false);

            // If pomodoro is complete, increment counter
            if (mode === "pomodoro") {
              setCompletedPomodoros((prev) => prev + 1);

              // Play notification sound if available
              const audio = new Audio("/notification.mp3");
              audio
                .play()
                .catch((err) => console.log("Audio notification failed:", err));
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  // Format time as MM:SS
  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Reset timer to current mode's duration
  const handleReset = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    setSecondsLeft(timerModes[mode] * 60);
  };

  // Calculate progress percentage
  const calculateProgress = (): number => {
    const total = timerModes[mode] * 60;
    const remaining = secondsLeft;
    return ((total - remaining) / total) * 100;
  };

  // Get background color based on mode
  const getBackgroundColor = (): string => {
    switch (mode) {
      case "pomodoro":
        return "from-red-500 to-rose-500";
      case "shortBreak":
        return "from-green-500 to-emerald-500";
      case "longBreak":
        return "from-blue-500 to-indigo-500";
    }
  };

  // Perbaikan untuk clipPath pada progress circle
  const getProgressClipPath = (): string => {
    const progress = calculateProgress();
    let clipPath = "polygon(50% 50%, 50% 0%";
    
    if (progress >= 12.5) clipPath += ", 75% 0%";
    if (progress >= 25) clipPath += ", 100% 0%";
    if (progress >= 37.5) clipPath += ", 100% 25%";
    if (progress >= 50) clipPath += ", 100% 50%";
    if (progress >= 62.5) clipPath += ", 100% 75%";
    if (progress >= 75) clipPath += ", 100% 100%";
    if (progress >= 87.5) clipPath += ", 75% 100%";
    if (progress >= 100) clipPath += ", 50% 100%";
    if (progress >= 100) clipPath += ", 25% 100%";
    if (progress >= 100) clipPath += ", 0% 100%";
    if (progress >= 100) clipPath += ", 0% 75%";
    if (progress >= 100) clipPath += ", 0% 50%";
    if (progress >= 100) clipPath += ", 0% 25%";
    if (progress >= 100) clipPath += ", 0% 0%";
    
    clipPath += ")";
    return clipPath;
  };

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      <Tabs
        defaultValue="pomodoro"
        value={mode}
        onValueChange={(value) => setMode(value as TimerMode)}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="pomodoro" className="flex items-center">
            <Brain size={16} className="mr-1" />
            <span className="hidden sm:block">Fokus</span>
          </TabsTrigger>
          <TabsTrigger value="shortBreak" className="flex items-center">
            <Coffee size={16} className="mr-1" />
            <span className="hidden sm:block">Break</span>
          </TabsTrigger>
          <TabsTrigger value="longBreak" className="flex items-center">
            <Coffee size={16} className="mr-1" />
            <span className="hidden sm:block">Break Panjang</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Timer display */}
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 mb-4">
          {/* Background circle */}
          <div className="absolute inset-0 rounded-full bg-muted opacity-20"></div>

          {/* Progress circle */} 
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-gradient-to-br",
              getBackgroundColor()
            )}
            style={{
              clipPath: getProgressClipPath(),
              transform: "rotate(-90deg)",
            }}
          ></div>

          {/* Inner circle with time */}
          <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center flex-col">
            <div className="text-4xl font-mono font-bold">
              {formatTime(secondsLeft)}
            </div>
            <div className="text-sm text-muted-foreground">
              {mode === "pomodoro"
                ? "Fokus"
                : mode === "shortBreak"
                ? "Break Pendek"
                : "Break Panjang"}
            </div>
          </div>
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex justify-center gap-2">
        {!isRunning ? (
          <Button
            onClick={() => setIsRunning(true)}
            className={cn(
              "flex items-center gap-1",
              mode === "pomodoro"
                ? "bg-red-500 hover:bg-red-600"
                : mode === "shortBreak"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            )}
          >
            <Play size={16} />
            <span>Mulai</span>
          </Button>
        ) : (
          <Button
            onClick={() => setIsRunning(false)}
            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600"
          >
            <Pause size={16} />
            <span>Jeda</span>
          </Button>
        )}
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center gap-1"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </Button>
      </div>

      {/* Stats section */}
      <div className="text-center text-sm text-muted-foreground mt-4">
        <div className="flex justify-center items-center gap-2">
          <Brain size={14} />
          <span>Pomodoro selesai: {completedPomodoros}</span>
        </div>
      </div>
    </div>
  );
}