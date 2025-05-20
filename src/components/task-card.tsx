import { useDrag } from "react-dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Grip, MoreVertical, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type StatusKey = "todo" | "inProgress" | "done";

interface TaskCardProps {
  item: {
    title: string;
    // Tambahkan properti lain dari `item` jika perlu
  };
  index: number;
  columnKey: StatusKey;
  onDelete: () => void;
}

export default function TaskCard({
  item,
  index,
  columnKey,
  onDelete,
}: TaskCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "task",
    item: { ...item, index, source: columnKey },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [isHovered, setIsHovered] = useState(false);

  // Determine status badge
  const getStatusBadge = () => {
    const statusMap: Record<StatusKey, { color: string; label: string }> = {
      todo: {
        color: "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30",
        label: "Todo",
      },
      inProgress: {
        color: "bg-purple-500/20 text-purple-500 hover:bg-purple-500/30",
        label: "Dikerjakan",
      },
      done: {
        color: "bg-green-500/20 text-green-500 hover:bg-green-500/30",
        label: "Selesai",
      },
    };

    const status = statusMap[columnKey] || statusMap.todo;

    return (
      <Badge
        variant="outline"
        className={cn("text-xs font-normal", status.color)}
      >
        {status.label}
      </Badge>
    );
  };

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      drag(ref.current);
    }
  }, [drag]);

  return (
    <Card
      ref={ref}
      className={cn(
        "mb-2 border border-border transition-all duration-200",
        isDragging ? "opacity-50" : "opacity-100",
        columnKey === "done"
          ? "border-l-4 border-l-green-500"
          : columnKey === "inProgress"
          ? "border-l-4 border-l-purple-500"
          : "border-l-4 border-l-blue-500",
        isHovered ? "shadow-md" : "shadow-sm"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Grip size={14} className="text-muted-foreground cursor-move" />
            {getStatusBadge()}
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical
                  size={14}
                  className="text-muted-foreground hover:text-white ml-2 cursor-pointer"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Action</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={onDelete}>
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="font-medium text-sm mb-2">{item.title}</div>

        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
          {columnKey === "done" && (
            <div className="flex items-center gap-1 text-green-500">
              <CheckCircle size={12} />
              <span>Selesai</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
