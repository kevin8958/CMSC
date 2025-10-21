"use client";

import classNames from "classnames";

import FlexWrapper from "../layout/FlexWrapper";

const ButtonGroup = (props: Common.ButtonGroupProps) => {
  const { title, classes, size = "md", value, options, onChange } = props;

  const sizeClasses = {
    sm: "h-[24px] text-xs w-max",
    md: "h-[34px] text-sm",
    lg: "h-[36px] !px-4 text-base",
  };

  return (
    <FlexWrapper items="center" justify="center" gap={2}>
      {title && <p className="font-bold">{title}</p>}
      <FlexWrapper
        classes={classNames(
          "shrink-0 rounded-lg p-1 shadow-custom-dark bg-white",
          classes
        )}
        items="center"
        justify="center"
        gap={0}
      >
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={classNames(
              "rounded-lg !border-0 !px-2 !py-[4px] text-gray-800 transition-all duration-200 ease-in-out",
              { "bg-primary-200": value.id === option.id },
              sizeClasses[size]
            )}
            onClick={() => onChange && onChange(option)}
          >
            {option.value}
          </button>
        ))}
      </FlexWrapper>
    </FlexWrapper>
  );
};

export default ButtonGroup;
