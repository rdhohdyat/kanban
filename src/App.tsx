import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import KanbanBoard from "./components/kanban-board";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PomodoroTimer from "./components/pomodoro-timer";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { Plus, CheckCircle2, ListTodo, ClockIcon } from "lucide-react";
import Logo from "./components/logo";

const defaultColumns = {
  todo: {
    name: "Todo",
    items: [],
  },
  inProgress: {
    name: "In Progress",
    items: [],
  },
  done: {
    name: "Done",
    items: [],
  },
};

export default function App() {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem("kanban-data");
    return saved ? JSON.parse(saved) : defaultColumns;
  });
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    localStorage.setItem("kanban-data", JSON.stringify(columns));
  }, [columns]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      title: newTask,
    };
    setColumns((prev: any) => ({
      ...prev,
      todo: {
        ...prev.todo,
        items: [...prev.todo.items, newItem],
      },
    }));
    setNewTask("");
  };

  // Handle form submission on Enter key press
  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-background p-6">
          <div className="max-w-8xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Logo />
              </div>
              <ModeToggle />
            </div>

            {/* Main content area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Add task & stats */}
              <div className="space-y-6">
                {/* Add new task */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Plus className="h-5 w-5" /> Tambah Tugas Baru
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Masukkan tugas baru..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                      <Button onClick={addTask} className="flex-shrink-0">
                        Tambah
                      </Button>
                    </div>
                  </CardContent>
                </Card>


                {/* Pomodoro Timer */}
                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <ClockIcon className="h-4 w-4" /> Pomodoro Timer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PomodoroTimer />
                  </CardContent>
                </Card>
              </div>

              {/* Right column - Kanban Board (spans 2 columns) */}
              <div className="lg:col-span-2">
                <Card className="shadow-md h-full">
                  <CardHeader>
                    <CardTitle className="text-xl">Papan Kanban</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <KanbanBoard columns={columns} setColumns={setColumns} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </DndProvider>
    </ThemeProvider>
  );
}
