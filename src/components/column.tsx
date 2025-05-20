import TaskCard from "./task-card";
import { useDrop } from "react-dnd";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ListTodo, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Column({
  columnKey,
  column,
  columns,
  setColumns,
}: any) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "task",
    drop: (item : any) => {
      if (item.source === columnKey) return;

      const sourceItems = [...columns[item.source].items];
      const [movedItem] = sourceItems.splice(item.index, 1);

      const newTargetItems = [...columns[columnKey].items, movedItem];

      setColumns({
        ...columns,
        [item.source]: {
          ...columns[item.source],
          items: sourceItems,
        },
        [columnKey]: {
          ...column,
          items: newTargetItems,
        },
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Get column icon based on column key
  const getColumnIcon = () => {
    switch (columnKey) {
      case "todo":
        return <ListTodo size={18} className="text-blue-500" />;
      case "inProgress":
        return <Loader2 size={18} className="text-purple-500" />;
      case "done":
        return <CheckCircle size={18} className="text-green-500" />;
      default:
        return <ListTodo size={18} />;
    }
  };

  // Get column header styles based on column key
  const getColumnHeaderStyles = () => {
    switch (columnKey) {
      case "todo":
        return "border-b-2 border-blue-500";
      case "inProgress":
        return "border-b-2 border-purple-500";
      case "done":
        return "border-b-2 border-green-500";
      default:
        return "";
    }
  };

  // In your parent component (e.g., KanbanBoard.jsx)
  const removeTask = (index : any) => {
    const newItems = [...column.items];
    newItems.splice(index, 1);
    setColumns({
      ...columns,
      [columnKey]: {
        ...column,
        items: newItems,
      },
    });
  };

  // Get column background styles based on drag state
  const getColumnBackgroundStyles = () => {
    if (isOver && canDrop) {
      switch (columnKey) {
        case "todo":
          return "bg-blue-500/5";
        case "inProgress":
          return "bg-purple-500/5";
        case "done":
          return "bg-green-500/5";
        default:
          return "bg-primary/5";
      }
    }
    return "";
  };

  return (
    <Card
      ref={drop}
      className={cn(
        "min-h-[500px] max-h-[500px] min-w-[250px] flex flex-col transition-colors duration-200",
        getColumnBackgroundStyles(),
        isOver && canDrop ? "shadow-md" : "shadow"
      )}
    >
      <CardHeader className={cn("pb-3", getColumnHeaderStyles())}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getColumnIcon()}
            <CardTitle>{column.name}</CardTitle>
          </div>
          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted font-medium text-sm">
            {column.items.length}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 no-scroll overflow-y-auto px-3">
        {column.items.length > 0 ? (
          <div className="space-y-3">
            {column.items.map((item: any, index: any) => (
              <TaskCard
                key={item.id}
                item={item}
                index={index}
                columnKey={columnKey}
                onDelete={() => removeTask(index)}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-8">
            <div className="rounded-full bg-muted p-3 mb-3">
              {getColumnIcon()}
            </div>
            <p className="text-sm">Tidak ada tugas</p>
            <p className="text-xs">Drag tugas ke sini</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
