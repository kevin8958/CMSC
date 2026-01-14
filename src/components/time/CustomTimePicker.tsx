import { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import { LuClock } from "react-icons/lu";
import Typography from "@/foundation/Typography";

interface CustomTimePickerProps {
  value: string; // "HH:mm" 형식
  onChange: (time: string) => void;
  disabled?: boolean;
}

export default function CustomTimePicker({
  value,
  onChange,
  disabled,
}: CustomTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 12 }, (_, i) =>
    (i * 5).toString().padStart(2, "0")
  ); // 5분 단위 예시

  const [currentHour, currentMinute] = value.split(":");

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (h: string, m: string) => {
    onChange(`${h}:${m}`);
  };

  return (
    <div className="relative flex-1" ref={containerRef}>
      {/* Input Display Area */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={classNames(
          "flex items-center justify-between h-[40px] px-3 border rounded-lg cursor-pointer transition-all bg-white",
          {
            "border-blue-500 ring-2 ring-blue-50": isOpen,
            "border-gray-200 hover:border-blue-300": !isOpen && !disabled,
            "bg-gray-50 cursor-not-allowed opacity-60": disabled,
          }
        )}
      >
        <Typography
          variant="B2"
          classes={value ? "text-gray-900" : "text-gray-400"}
        >
          {value || "시간 선택"}
        </Typography>
        <LuClock
          className={classNames(
            "text-lg",
            isOpen ? "text-blue-500" : "text-gray-400"
          )}
        />
      </div>

      {/* Custom Picker Popup */}
      {isOpen && (
        <div className="absolute top-[44px] left-0 z-[110] flex bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
          {/* Hours Column */}
          <div className="flex flex-col w-20 h-60 overflow-y-auto scroll-thin border-r border-gray-100">
            <div className="sticky top-0 bg-gray-50 py-1 px-2 text-[10px] font-bold text-gray-400 text-center">
              시
            </div>
            {hours.map((h) => (
              <button
                key={h}
                onClick={() => handleSelect(h, currentMinute)}
                className={classNames("py-2 text-sm transition-colors", {
                  "bg-green-600 text-white font-bold": h === currentHour,
                  "hover:bg-green-50 text-gray-600": h !== currentHour,
                })}
              >
                {h}
              </button>
            ))}
          </div>

          {/* Minutes Column */}
          <div className="flex flex-col w-20 h-60 overflow-y-auto scroll-thin">
            <div className="sticky top-0 bg-gray-50 py-1 px-2 text-[10px] font-bold text-gray-400 text-center">
              분
            </div>
            {minutes.map((m) => (
              <button
                key={m}
                onClick={() => {
                  handleSelect(currentHour, m);
                  setIsOpen(false); // 분까지 선택하면 자동으로 닫힘
                }}
                className={classNames("py-2 text-sm transition-colors", {
                  "bg-green-600 text-white font-bold": m === currentMinute,
                  "hover:bg-green-50 text-gray-600": m !== currentMinute,
                })}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
