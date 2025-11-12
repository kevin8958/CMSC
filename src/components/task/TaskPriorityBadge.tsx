import Badge from "@/components/Badge";
import { PRIORITY_CONFIG } from "@/constants/TaskConfigs_fixed";

interface TaskPriorityBadgeProps {
  priority: keyof typeof PRIORITY_CONFIG;
  size?: "sm" | "md";
  classes?: string;
}

export default function TaskPriorityBadge({
  priority,
  size = "sm",
  classes = "",
}: TaskPriorityBadgeProps) {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <Badge classes={`${cfg.color} ${classes}`} size={size}>
      <span className="text-sm font-normal">{cfg.label}</span>
    </Badge>
  );
}
