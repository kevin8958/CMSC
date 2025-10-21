/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import classNames from "classnames";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import isBetween from "dayjs/plugin/isBetween";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import Button from "@/components/Button";

dayjs.extend(isBetween);

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
    startDate,
    endDate,
    size = "md",
    onChange,
  } = props;
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  useEffect(() => {
    if (startDate) {
      setStart(startDate);
    }
    if (endDate) {
      setEnd(endDate);
    }
  }, [startDate, endDate]);

  return (
    <DatePicker
      portalId="datepicker-portal"
      className={classNames(
        "box-border h-full !rounded-lg px-4 text-center !text-sm !outline-none placeholder:text-gray-300 focus:z-10",
        classes,
        {
          "border-danger focus:!border-danger !border-2": isError,
          "focus:!border-primary-600 border-gray-100 focus:!border-2":
            !isError && !isFilter,
          "focus:!border-primary-600 border-gray-100": !isError && isFilter,
          "bg-newPrimary-50 cursor-not-allowed !text-[#8C9097]": disabled,
          "h-[32px] min-h-[32px]": size === "sm",
          "h-[40px] min-h-[40px]": size === "md",
          "h-[48px] min-h-[48px]": size === "lg",
          "hover:bg-primary-100 active:bg-primary-200 bg-white text-gray-800 disabled:hover:!bg-white disabled:active:!bg-white":
            variant === "contain",
          "border-primary-600 text-primary-100 border bg-transparent":
            variant === "outline",
          "text-primary-300 bg-transparent": variant === "clear",
        }
      )}
      dateFormat="MMM dd, yyyy"
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
      onChange={(update: any) => {
        if (!onChange) return;
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
      minDate={minDate || undefined}
      maxDate={maxDate || undefined}
      showPopperArrow={false}
      calendarClassName="bg-primary-900 text-white rounded-xl border border-primary-600 overflow-hidden p-2"
      dayClassName={(d) =>
        classNames(
          "inline-block size-8 text-center rounded-lg text-sm leading-8 cursor-pointer box-border hover:bg-primary-800/50",
          dayjs(d).isSame(dayjs(value), "day") && "bg-primary-700 text-white",
          isRange &&
            start &&
            end &&
            dayjs(d).isBetween(dayjs(start), dayjs(end), "day", "[]") &&
            "bg-primary-800 text-white",
          isRange &&
            start &&
            !end &&
            dayjs(d).isSame(start, "day") &&
            "border-2 border-primary-600 leading-[28px]"
        )
      }
      weekDayClassName={() => "hidden"}
      popperClassName="!z-[70]"
      renderCustomHeader={({
        date,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
        decreaseMonth,
        increaseMonth,
      }) => {
        const renderButton = (
          icon: React.ReactNode,
          onClick: () => void,
          disabled: boolean
        ) => (
          <Button
            classes="text-lg text-white !w-[34px]"
            variant="clear"
            onClick={onClick}
            disabled={disabled}
          >
            {icon}
          </Button>
        );

        const shortWeekDays = ["S", "M", "T", "W", "T", "F", "S"];

        return (
          <div className="bg-primary-900 flex w-[240px] flex-col">
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
                    decreaseMonth,
                    prevMonthButtonDisabled
                  )}
                </div>
              )}

              <p className="text-base font-semibold">
                {dayjs(date).format("MMMM YYYY")}
              </p>

              {!hideHeaderButtons && (
                <div className="flex items-center gap-1">
                  {renderButton(
                    <LuChevronRight />,
                    increaseMonth,
                    nextMonthButtonDisabled
                  )}
                </div>
              )}
            </div>

            {/* Custom Weekday Row */}
            <div className="text-primary-200 grid grid-cols-7 pb-1 text-center text-xs font-medium">
              {shortWeekDays.map((day, idx) => (
                <span key={idx}>{day}</span>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
};

export default CustomDatePicker;
