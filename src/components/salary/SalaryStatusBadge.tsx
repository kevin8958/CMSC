import Badge from "@/components/Badge";
import { STATUS_CONFIG } from "@/constants/SalaryConfigs_fixed";

interface SalaryStatusBadgeProps {
  status: keyof typeof STATUS_CONFIG;
  size?: "sm" | "md";
  classes?: string;
}

export default function SalaryStatusBadge({
  status,
  size = "sm",
  classes = "",
}: SalaryStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <Badge classes={`${cfg.color} ${classes}`} size={size}>
      {cfg.icon}
      <span className="ml-1 text-sm font-normal">{cfg.label}</span>
    </Badge>
  );
}
