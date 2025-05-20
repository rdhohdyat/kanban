import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PomodoroTimer() {
  // Timer modes and their durations in minutes
  const timerModes = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  };

  const [mode, setMode] = useState("pomodoro");
  const [secondsLeft, setSecondsLeft] = useState<number>(
    timerModes.pomodoro * 60
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(0);
  const intervalRef = useRef<any>(null);

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
            clearInterval(intervalRef.current);
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

    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  // Format time as MM:SS
  const formatTime = (secs : number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Reset timer to current mode's duration
  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setSecondsLeft(timerModes[mode] * 60);
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const total = timerModes[mode] * 60;
    const remaining = secondsLeft;
    return ((total - remaining) / total) * 100;
  };

  // Get background color based on mode
  const getBackgroundColor = () => {
    switch (mode) {
      case "pomodoro":
        return "from-red-500 to-rose-500";
      case "shortBreak":
        return "from-green-500 to-emerald-500";
      case "longBreak":
        return "from-blue-500 to-indigo-500";
      default:
        return "from-red-500 to-rose-500";
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      <Tabs
        defaultValue="pomodoro"
        value={mode}
        onValueChange={setMode}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="pomodoro" className="flex items-center">
            <Brain />
            <span>Fokus</span>
          </TabsTrigger>
          <TabsTrigger value="shortBreak" className="flex items-center">
            <Coffee />
            <span>Break</span>
          </TabsTrigger>
          <TabsTrigger value="longBreak" className="flex items-center">
            <Coffee />
            <span>Break Panjang</span>
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
              clipPath: `polygon(50% 50%, 50% 0%, ${
                calculateProgress() > 75 ? "100% 0%" : ""
              } ${calculateProgress() > 50 ? "100% 100%" : ""} ${
                calculateProgress() > 25 ? "0% 100%" : ""
              } ${calculateProgress() > 0 ? "0% 0%" : ""} 50% 0%)`,
              transform: "rotate(90deg)",
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
