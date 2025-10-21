import classNames from "classnames";

import { BsCheck } from "react-icons/bs";

const boxSize: Record<Common.CheckboxSize, string> = {
  sm: "size-5 rounded-md",
  md: "size-6 rounded-md",
  lg: "size-8 rounded-lg",
};

const textSizeMap = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-4xl",
} as const;

const Checkbox = (props: Common.CheckboxProps) => {
  const {
    id,
    label = "",
    checked = false,
    disabled = false,
    invalid = false,
    size = "sm",
    classes = "",
    onChange,
  } = props;

  return (
    <label
      htmlFor={id}
      className={classNames(
        "flex items-center gap-2 select-none",
        disabled
          ? "cursor-not-allowed text-gray-600"
          : "cursor-pointer text-white",
        classes
      )}
    >
      {/* 실제 폼 컨트롤(스크린리더용) */}
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.({ id, checked: e.target.checked })}
        className="peer sr-only"
      />

      {/* 시각적 박스 */}
      <span
        className={classNames(
          "flex shrink-0 items-center justify-center border transition-colors",
          boxSize[size],
          disabled
            ? "border-primary-700 text-transparent"
            : "border-primary-700 text-transparent transition peer-checked:text-white",
          disabled && checked && "bg-gray-300 !text-gray-500/70",
          invalid && "!border-danger"
        )}
      >
        <BsCheck className={textSizeMap[size]} />
      </span>

      {label && <span className="text-sm break-keep">{label}</span>}
    </label>
  );
};

export default Checkbox;
