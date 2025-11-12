import Badge from "@/components/Badge";
import { STATUS_CONFIG } from "@/constants/TaskConfigs";

interface TaskStatusBadgeProps {
  status: keyof typeof STATUS_CONFIG;
  size?: "sm" | "md";
  classes?: string;
}

export default function TaskStatusBadge({
  status,
  size = "sm",
  classes = "",
}: TaskStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <Badge classes={`${cfg.color} ${classes}`} size={size}>
      {cfg.icon}
      <span className="ml-2 text-sm font-normal">{cfg.label}</span>
    </Badge>
  );
}
