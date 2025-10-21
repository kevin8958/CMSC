"use client";

import classNames from "classnames";
import FlexWrapper from "../layout/FlexWrapper";

const Radio = (props: Common.RadioProps) => {
  const { title, options, value, onChange } = props;

  return (
    <FlexWrapper classes="w-full" gap={2} direction="col">
      {title && <p className="mb-1 text-lg font-bold text-white">{title}</p>}

      {options.map((option) => {
        const isSelected = value === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={classNames(
              "border-primary-700 bg-primary-900 hover:border-primary-500 flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 focus:outline-none",
              { "ring-primary-500 ring-2": isSelected }
            )}
          >
            {/* Radio Circle */}
            <span
              className={classNames(
                "mt-[3px] flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
                isSelected ? "border-primary-400" : "border-gray-400"
              )}
            >
              {isSelected && (
                <span className="bg-primary-400 size-2.5 rounded-full" />
              )}
            </span>

            {/* Label + Desc */}
            <div className="flex flex-col">
              <p
                className={classNames(
                  "font-medium",
                  isSelected ? "text-white" : "text-gray-200"
                )}
              >
                {option.label}
              </p>
              {option.desc && (
                <p className="text-sm text-gray-400">{option.desc}</p>
              )}
            </div>
          </button>
        );
      })}
    </FlexWrapper>
  );
};

export default Radio;
