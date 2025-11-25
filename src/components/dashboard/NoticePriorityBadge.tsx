import Badge from "@/components/Badge";

interface NoticePriorityBadgeProps {
  priority: keyof typeof PRIORITY_CONFIG;
  size?: "sm" | "md";
  classes?: string;
}

export const PRIORITY_CONFIG = {
  low: {
    label: "낮음",
    color: "bg-green-200 text-green-800",
  },
  medium: {
    label: "보통",
    color: "bg-yellow-200 text-yellow-800",
  },
  high: {
    label: "높음",
    color: "bg-red-200 text-red-800",
  },
} as const;

export default function NoticePriorityBadge({
  priority,
  size = "sm",
  classes = "",
}: NoticePriorityBadgeProps) {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <Badge classes={`${cfg.color} ${classes}`} size={size}>
      <span className="text-sm font-normal">{cfg.label}</span>
    </Badge>
  );
}
