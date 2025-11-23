import Badge from "@/components/Badge";
import { CATEGORY_CONFIG } from "@/constants/ExpenseConfigs";

interface ExpenseCategoryBadgeProps {
  category: keyof typeof CATEGORY_CONFIG;
  size?: "sm" | "md";
  classes?: string;
}

export default function ExpenseCategoryBadge({
  category,
  size = "sm",
  classes = "",
}: ExpenseCategoryBadgeProps) {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <Badge classes={`${cfg.color} ${classes}`} size={size}>
      <span className="text-sm font-normal">{cfg.label}</span>
    </Badge>
  );
}
