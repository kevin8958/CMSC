"use client";

import classNames from "classnames";

const sizeMap = {
  sm: { height: "h-1.5", radius: 36, stroke: 4 },
  md: { height: "h-3", radius: 48, stroke: 6 },
  lg: { height: "h-4", radius: 60, stroke: 8 },
};

const Progress = (props: Common.ProgressProps) => {
  const {
    value = 0,
    width,
    size = "md",
    isCircle = false,
    label = "",
    labelPosition = "bottom",
  } = props;

  const clampedValue = Math.min(100, Math.max(0, value));
  const sizeProps = sizeMap[size];

  const containerStyle = width
    ? { width: typeof width === "number" ? `${width}px` : width }
    : undefined;

  if (isCircle) {
    const radius = sizeProps.radius;
    const stroke = sizeProps.stroke;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clampedValue / 100) * circumference;

    const dimension = (radius + stroke) * 2;

    return (
      <div className="flex items-center justify-center" style={containerStyle}>
        <div
          className="flex items-center justify-center"
          style={{ width: dimension, height: dimension }}
        >
          <svg
            width={dimension}
            height={dimension}
            className="-rotate-90 transform"
            role="Progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={clampedValue}
          >
            <circle
              cx={dimension / 2}
              cy={dimension / 2}
              r={radius}
              stroke="#e5e7eb"
              strokeWidth={stroke}
              fill="none"
            />
            <circle
              cx={dimension / 2}
              cy={dimension / 2}
              r={radius}
              stroke="#3b82f6"
              strokeWidth={stroke}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <div className="absolute text-center text-sm font-medium text-gray-400">
            {label || clampedValue + "%"}
          </div>
        </div>
      </div>
    );
  }

  const barHeight = sizeProps.height;

  return (
    <div className="w-full" style={containerStyle}>
      {labelPosition === "top" && (
        <div className="mb-1 text-center text-sm font-medium text-gray-400">
          {label || clampedValue + "%"}
        </div>
      )}
      <div
        className={classNames(
          "relative w-full overflow-hidden rounded-xl bg-gray-200",
          barHeight
        )}
        role="Progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clampedValue}
      >
        <div
          className={classNames(
            "bg-info transition-all duration-300",
            barHeight
          )}
          style={{ width: `${clampedValue}%` }}
        />
        {labelPosition === "inside" && (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-900">
            {label || clampedValue + "%"}
          </div>
        )}
      </div>
      {labelPosition === "bottom" && (
        <div className="mt-1 text-center text-sm font-medium text-gray-400">
          {label || clampedValue + "%"}
        </div>
      )}
    </div>
  );
};

export default Progress;
