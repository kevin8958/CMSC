import Typography from "@/foundation/Typography";

interface ExpenseGaugeItemProps {
  id: "fixed" | "variable" | "other";
  label: string;
  value: number;
  color: string;
  active: boolean; // currentTab === id
  hovered: boolean; // hoveredId === id
  onClick: (id: "fixed" | "variable" | "other") => void;
  onHover: (id: "fixed" | "variable" | "other" | null) => void;
  noBorder?: boolean;
}

export default function ExpenseGaugeItem({
  id,
  label,
  value,
  color,
  active,
  hovered,
  onClick,
  onHover,
  noBorder = false,
}: ExpenseGaugeItemProps) {
  return (
    <button
      onClick={() => onClick(id)}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      className={`
        flex-1 p-2 cursor-pointer transition-colors flex flex-col gap-1 transition-all duration-500
        ${!noBorder ? "border-r" : ""}
        ${active ? "bg-gray-200" : hovered ? "bg-gray-100" : ""}
      `}
    >
      <div className="flex items-center gap-1">
        <span
          className="h-3 w-1.5 rounded"
          style={{ backgroundColor: color }}
        />
        <Typography variant="B2">{label}</Typography>
      </div>
      <Typography variant="H4">{value.toLocaleString()}원</Typography>
    </button>
  );
}
