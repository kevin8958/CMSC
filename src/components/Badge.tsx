import classNames from "classnames";

const sizeMap = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2 py-1",
  lg: "text-base px-4 py-1.5",
} as const;

const colorMap = {
  gray: "bg-gray-100 text-gray-800",
  primary: "bg-primary-100 text-primary-800",
  secondary: "bg-secondary-100 text-secondary-800",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  green: "bg-green-100 text-green-800",
} as const;

const Badge = (props: Common.BadgeProps) => {
  const {
    children,
    size = "md",
    color = "gray",
    icon,
    disabled = false,
    classes,
  } = props;

  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full font-medium",
        sizeMap[size],
        colorMap[color],
        disabled && "pointer-events-none opacity-50",
        classes
      )}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
