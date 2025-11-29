import { useState } from "react";
import { LuCircleHelp } from "react-icons/lu";
import classNames from "classnames";

interface TooltipProps {
  text: string;
  size?: "sm" | "md" | "lg";
  position?: "top" | "bottom" | "left" | "right" | "top-right";
}

export default function Tooltip({
  text,
  position = "top",
  size = "sm",
}: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <LuCircleHelp
        className={classNames(
          "text-gray-400 hover:text-gray-600 cursor-pointer",
          {
            "text-sm": size === "sm",
            "text-lg": size === "md",
            "text-xl": size === "lg",
          }
        )}
      />

      {/* 말풍선 */}
      {show && (
        <div
          className={classNames(
            "border-2 border-black absolute z-50 whitespace-nowrap rounded-md bg-gray-800 px-3 py-1 text-xs text-white transition-opacity duration-150",
            {
              "bottom-full left-1/2 -translate-x-1/2 mb-2": position === "top",
              "top-full left-1/2 -translate-x-1/2 mt-2": position === "bottom",
              "right-full top-1/2 -translate-y-1/2 mr-2": position === "left",
              "left-full top-1/2 -translate-y-1/2 ml-2": position === "right",
              "bottom-full left-0 -translate-x-[16px] mb-2":
                position === "top-right",
            }
          )}
        >
          {text}
          {/* 꼬리 */}
          <div
            className={classNames(
              "absolute w-0 h-0 border-[6px] border-transparent",
              {
                "border-t-gray-800 bottom-[-12px] left-1/2 -translate-x-1/2":
                  position === "top",
                "border-b-gray-800 top-[-12px] left-1/2 -translate-x-1/2":
                  position === "bottom",
                "border-l-gray-800 top-1/2 right-[-12px] -translate-y-1/2":
                  position === "right",
                "border-r-gray-800 top-1/2 left-[-12px] -translate-y-1/2":
                  position === "left",
                "border-t-gray-800 bottom-[-12px] left-0 translate-x-[16px]":
                  position === "top-right",
              }
            )}
          />
        </div>
      )}
    </div>
  );
}
