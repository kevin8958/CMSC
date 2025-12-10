import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import classNames from "classnames";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import Button from "@/components/Button";

interface InlineDatePickerProps {
  selected?: Date | null;
  currentMonth: Date;
  onChange?: (date: Date) => void;
  onMonthChange?: (date: Date) => void;

  /** 공지사항 매핑 */
  noticeByDate?: Record<string, any[]>;

  /** Hover sync */
  hoveredDate: string | null;
  hoveredNotices: string[] | null;
  setHoveredDate: (date: string | null) => void;
  setHoveredNotices: (noticeIds: string[] | null) => void;
}

const priorityColor: any = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};
const priorityOrder = {
  high: 1,
  medium: 2,
  low: 3,
};

export default function InlineDatePicker({
  selected,
  currentMonth,
  onChange,
  onMonthChange,

  noticeByDate = {},

  hoveredDate,
  hoveredNotices,
  setHoveredDate,
  setHoveredNotices,
}: InlineDatePickerProps) {
  const currentYear = dayjs().year();
  const minYear = currentYear - 10;
  const maxYear = currentYear + 10;

  const shortWeekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="w-full p-2">
      <DatePicker
        inline
        selected={selected}
        onChange={(date) => {
          if (date) onChange?.(date);
        }}
        onMonthChange={onMonthChange}
        calendarClassName={classNames(
          "bg-white text-primary-900 overflow-hidden p-2 pt-0",
          "[&_.react-datepicker__day-names]:hidden"
        )}
        /* ⭐ 날짜 셀 기본 스타일 */
        dayClassName={(d) => {
          const key = dayjs(d).format("yyyy-MM-DD");
          const isSelected = dayjs(d).isSame(selected, "day");
          const isCurrentMonth = dayjs(d).isSame(currentMonth, "month");

          const isHovered =
            hoveredDate === key ||
            (hoveredNotices &&
              noticeByDate[key]?.some?.((n) => hoveredNotices.includes(n.id)));

          return classNames(
            "inline-block h-8 min-w-8 w-[calc(100%/7)] text-center rounded-lg text-sm leading-8 cursor-pointer box-border transition-all duration-300",
            "transition-colors",
            isSelected && "!bg-green-600 text-white font-semibold",
            !isSelected && isHovered && "bg-gray-200",
            !isCurrentMonth && "text-gray-400"
          );
        }}
        /* ⭐ 날짜 내부 UI 커스터마이즈 (● 표시) */
        renderDayContents={(day, date) => {
          const key = dayjs(date).format("yyyy-MM-DD");
          const notices = noticeByDate[key];

          const highlight =
            hoveredDate === key ||
            (hoveredNotices &&
              notices?.some?.((n) => hoveredNotices.includes(n.id)));

          return (
            <div
              onMouseEnter={() => {
                setHoveredDate(key);
                if (notices.length > 0) {
                  setHoveredNotices(notices.map((n) => n.id));
                }
              }}
              onMouseLeave={() => setHoveredDate(null)}
              className={classNames(
                "relative flex items-center justify-center w-full h-full",
                highlight && "bg-gray-200 rounded-lg"
              )}
            >
              {day}

              {notices && (
                <div className="absolute top-[3px] right-[3px] flex gap-[1px] pb-[2px] max-w-full">
                  {notices
                    .slice()
                    .sort((a, b) => {
                      return (
                        priorityOrder[
                          a.priority as keyof typeof priorityOrder
                        ] -
                        priorityOrder[b.priority as keyof typeof priorityOrder]
                      );
                    })
                    .slice(0, 2)
                    .map((n) => (
                      <div
                        key={n.id}
                        className={classNames(
                          "size-2 rounded-full",
                          priorityColor[n.priority]
                        )}
                      />
                    ))}
                  {/* 3개 이상이면 +N 표시 */}
                  {notices.length > 2 && (
                    <span className="text-[8px] text-gray-400 font-semibold leading-none">
                      +{notices.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        }}
        /* ⭐ 커스텀 헤더 (이전/다음 월 버튼 + 요일) */
        renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => {
          const year = dayjs(date).year();

          return (
            <div className="text-primary-900 flex w-full flex-col">
              {/* Month Header */}
              <div className="flex items-center justify-between py-2">
                <Button
                  variant="clear"
                  onClick={decreaseMonth}
                  disabled={year <= minYear}
                  classes="!text-gray-600"
                >
                  <LuChevronLeft className="text-lg" />
                </Button>

                <p className="text-base font-semibold">
                  {dayjs(date).format("YYYY.MM")}
                </p>

                <Button
                  variant="clear"
                  onClick={increaseMonth}
                  disabled={year >= maxYear}
                  classes="!text-gray-600"
                >
                  <LuChevronRight className="text-lg" />
                </Button>
              </div>

              {/* 요일 표시 */}
              <div className="text-green-700 grid grid-cols-7 pb-1 text-center text-xs font-semibold">
                {shortWeekDays.map((day, idx) => (
                  <span key={idx}>{day}</span>
                ))}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
