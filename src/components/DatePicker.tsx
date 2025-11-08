/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import classNames from "classnames";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import isBetween from "dayjs/plugin/isBetween";
import { LuChevronLeft, LuChevronRight, LuChevronDown } from "react-icons/lu";

import Button from "@/components/Button";

dayjs.extend(isBetween);
import { forwardRef } from "react";

// ✅ MonthPicker 전용 커스텀 인풋
const MonthPickerInput = forwardRef<
  HTMLDivElement,
  { value?: string; onClick?: () => void }
>(({ value, onClick }, ref) => {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className="flex items-center gap-1 text-gray-800 cursor-pointer select-none"
    >
      <span className="font-medium">{value || "-"}</span>
      <LuChevronDown size={16} className="text-gray-500" />
    </div>
  );
});
MonthPickerInput.displayName = "MonthPickerInput";

const CustomDatePicker = (props: Common.DatepickerProps) => {
  const {
    classes,
    variant = "contain",
    value,
    minDate,
    maxDate,
    isError,
    isFilter,
    disabled,
    hideHeaderButtons,
    placeholder,
    isRange = false,
    isMultiple = false,
    isMonthPicker = false,
    startDate,
    endDate,
    dateFormat = "MMM dd, yyyy",
    size = "md",
    onChange,
  } = props;

  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  useEffect(() => {
    if (startDate) setStart(startDate);
    if (endDate) setEnd(endDate);
  }, [startDate, endDate]);

  // ✅ 월 선택 모드일 경우 dateFormat 강제 변경
  const effectiveDateFormat = isMonthPicker ? "yy.MM" : dateFormat;

  // ✅ 현재 연도 기준으로 10년 전후 제한
  const currentYear = dayjs().year();
  const minYear = currentYear - 10;
  const maxYear = currentYear + 10;

  return (
    <div
      className={classNames("relative flex items-center", {
        "w-fit": isMonthPicker,
      })}
    >
      <DatePicker
        portalId="datepicker-portal"
        className={classNames(
          "box-border !rounded-lg text-center !text-sm !outline-none placeholder:text-gray-300 focus:z-10",
          classes,
          {
            // ✅ 일반 모드 스타일
            "px-4 h-full": !isMonthPicker,
            "border-danger focus:!border-danger !border-2":
              !isMonthPicker && isError,
            "focus:!border-primary-600 border-gray-100 focus:!border-2":
              !isMonthPicker && !isError && !isFilter,
            "focus:!border-primary-600 border-gray-100":
              !isMonthPicker && !isError && isFilter,
            "bg-newPrimary-50 cursor-not-allowed !text-[#8C9097]": disabled,
            "h-[32px] min-h-[32px]": size === "sm" && !isMonthPicker,
            "h-[40px] min-h-[40px]": size === "md" && !isMonthPicker,
            "h-[48px] min-h-[48px]": size === "lg" && !isMonthPicker,
            "hover:bg-primary-100 active:bg-primary-200 bg-white text-gray-800 disabled:hover:!bg-white disabled:active:!bg-white":
              !isMonthPicker && variant === "contain",
            "border-primary-100 text-primary-900 border bg-transparent":
              !isMonthPicker && variant === "outline",
            "text-primary-300 bg-transparent":
              !isMonthPicker && variant === "clear",

            // ✅ MonthPicker 전용 스타일
            "!border-none !bg-transparent !p-0 !text-gray-800 cursor-pointer !w-[40px]":
              isMonthPicker,
          }
        )}
        dateFormat={effectiveDateFormat}
        openToDate={value || undefined}
        selected={value || null}
        disabled={disabled}
        startDate={start || null}
        endDate={end || null}
        wrapperClassName={isRange ? "range" : "single"}
        {...(isRange
          ? { selectsRange: true as const }
          : isMultiple
            ? { selectsMultiple: true as const }
            : {})}
        placeholderText={placeholder || "-"}
        customInput={isMonthPicker ? <MonthPickerInput /> : undefined}
        showMonthYearPicker={isMonthPicker}
        onChange={(update: any) => {
          if (!onChange) return;

          if (isMonthPicker) {
            if (update) {
              const firstDay = dayjs(update).startOf("month").toDate();
              onChange(firstDay);
            } else {
              onChange(null);
            }
            return;
          }

          if (isRange) {
            onChange(update);
            setStart(update[0] || null);
            setEnd(update[1] || null);
            return;
          }

          if (update) {
            onChange(dayjs(update).endOf("day").toDate());
          } else {
            onChange(null);
          }
        }}
        tabIndex={0}
        minDate={minDate || dayjs(`${minYear}-01-01`).toDate()}
        maxDate={maxDate || dayjs(`${maxYear}-12-31`).toDate()}
        showPopperArrow={false}
        popperPlacement={isMonthPicker ? "bottom-start" : undefined}
        calendarClassName={classNames(
          "bg-white text-primary-900 rounded-xl border border-primary-100 overflow-hidden p-4 pt-0 [&_.react-datepicker__day-names]:hidden",
          { "!p-3 !pt-0": isMonthPicker }
        )}
        renderMonthContent={(monthIndex) => (
          <div className="text-center text-gray-800 text-sm font-medium">
            {monthIndex + 1}월
          </div>
        )}
        dayClassName={(d) =>
          classNames(
            "inline-block size-8 text-center rounded-lg text-sm leading-8 cursor-pointer box-border hover:bg-primary-200",
            dayjs(d).isSame(dayjs(value), "day") && "bg-primary-700 text-white",
            isRange &&
              start &&
              end &&
              dayjs(d).isBetween(dayjs(start), dayjs(end), "day", "[]") &&
              "bg-primary-100 text-primary-900",
            isRange &&
              start &&
              !end &&
              dayjs(d).isSame(start, "day") &&
              "border-2 border-primary-600 leading-[28px]"
          )
        }
        popperClassName="!z-[100]"
        renderCustomHeader={({
          date,
          // prevMonthButtonDisabled,
          // nextMonthButtonDisabled,
          decreaseMonth,
          increaseMonth,
          decreaseYear,
          increaseYear,
        }) => {
          const renderButton = (
            icon: React.ReactNode,
            onClick: () => void,
            disabled: boolean
          ) => (
            <Button
              classes="text-lg text-primary-900 !w-[34px]"
              variant="clear"
              onClick={onClick}
              disabled={disabled}
            >
              {icon}
            </Button>
          );

          const shortWeekDays = ["S", "M", "T", "W", "T", "F", "S"];
          const year = dayjs(date).year();

          return (
            <div className="bg-white text-primary-900 flex w-[224px] flex-col">
              {/* Month / Year Header */}
              <div
                className={classNames("flex items-center gap-4 py-2", {
                  "justify-center": hideHeaderButtons,
                  "justify-between": !hideHeaderButtons,
                })}
              >
                {!hideHeaderButtons && (
                  <div className="flex items-center gap-1">
                    {renderButton(
                      <LuChevronLeft />,
                      isMonthPicker ? decreaseYear : decreaseMonth,
                      year <= minYear // ✅ 10년 전까지만 가능
                    )}
                  </div>
                )}

                <p className="text-base font-semibold">
                  {dayjs(date).format(isMonthPicker ? "YYYY" : "YYYY.MM")}
                </p>

                {!hideHeaderButtons && (
                  <div className="flex items-center gap-1">
                    {renderButton(
                      <LuChevronRight />,
                      isMonthPicker ? increaseYear : increaseMonth,
                      year >= maxYear // ✅ 10년 후까지만 가능
                    )}
                  </div>
                )}
              </div>

              {/* Custom Weekday Row */}
              {!isMonthPicker && (
                <div className="text-primary-200 grid grid-cols-7 pb-1 text-center text-xs font-medium">
                  {shortWeekDays.map((day, idx) => (
                    <span key={idx}>{day}</span>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default CustomDatePicker;
