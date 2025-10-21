"use client";

import { useClickAway } from "@uidotdev/usehooks";
import classNames from "classnames";
import React, { useRef, useState } from "react";
import Button from "@/components/Button";
import { LuChevronRight } from "react-icons/lu";

const Dropdown = (props: Common.DropdownProps) => {
  const {
    items,
    dialogPosition = "left",
    dialogWidth,
    onChange,
    buttonItem,
    buttonClasses,
  } = props;
  const [isOpen, setIsOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useClickAway<HTMLDialogElement>((event) => {
    if (buttonRef.current?.contains(event.target as Node)) return;
    setIsOpen(false);
  });

  const renderItems = (items: Common.DropdownItem[]) => {
    return items.map((item, index) => {
      const itemWidthStyle = dialogWidth ? { width: dialogWidth } : {};
      const itemTitle = item.label;

      switch (item.type) {
        case "item":
          return (
            <li
              key={item.id}
              className={classNames(dialogWidth ? "" : "w-full")}
              style={itemWidthStyle}
              title={itemTitle}
            >
              <Button
                type="button"
                variant="clear"
                size="sm"
                color={item.danger ? "danger" : "primary"}
                classes="!px-2 !w-full !justify-start truncate"
                onClick={() => {
                  item.onClick?.();
                  onChange?.(item.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex w-full items-center gap-2">
                  {item.icon}
                  <span className="block truncate">{item.label}</span>
                </div>
              </Button>
            </li>
          );

        case "group":
          const prev = items[index - 1];
          const next = items[index + 1];

          const isFirst = index === 0;
          const isLast = index === items.length - 1;

          const showTopBorder = !isFirst;
          const showBottomBorder = !isLast && next?.type !== "group";

          return (
            <li
              key={item.id}
              className={classNames("relative w-full", {
                '!mt-1 !pt-1 [&::before]:absolute [&::before]:top-0 [&::before]:-right-2 [&::before]:-left-2 [&::before]:h-px [&::before]:bg-gray-100/30 [&::before]:content-[""]':
                  showTopBorder,
                '[&::after]:absolute [&::after]:-right-2 [&::after]:bottom-0 [&::after]:-left-2 [&::after]:h-px [&::after]:bg-gray-100/30 [&::after]:content-[""]':
                  showBottomBorder,
              })}
              style={itemWidthStyle}
            >
              {item.label && (
                <div
                  className="truncate px-2 py-1 text-xs font-semibold text-gray-100"
                  title={item.label}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="block truncate">{item.label}</span>
                  </div>
                </div>
              )}
              <ul>{renderItems(item.items)}</ul>
            </li>
          );
        case "submenu":
          return (
            <li
              key={item.id}
              className={classNames(
                "group relative",
                dialogWidth ? "" : "w-full"
              )}
              style={itemWidthStyle}
              title={item.label}
            >
              <Button
                type="button"
                variant="clear"
                size="sm"
                classes="!px-2 !w-full !justify-between truncate gap-2"
              >
                <span className="block truncate">{item.label}</span>
                <span className="ml-auto">
                  <LuChevronRight />
                </span>
              </Button>
              <div className="absolute top-0 left-[calc(100%-4px)] ml-1 hidden group-hover:block">
                <ul className="bg-primary-900 border-primary-600 rounded-xl border p-2">
                  {renderItems(item.items)}
                </ul>
              </div>
            </li>
          );
      }
    });
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="md"
        ref={buttonRef}
        classes={buttonClasses}
        onClick={() => setIsOpen(!isOpen)}
      >
        {buttonItem || "Menu"}
      </Button>
      <dialog
        className={classNames(
          "bg-primary-900 border-primary-600 right-0 z-50 mt-2 !block rounded-xl border p-2 transition-all duration-200 ease-in-out",
          {
            "left-0": dialogPosition === "left",
            "right-0 left-[unset]": dialogPosition === "right",
            "pointer-events-none opacity-0": !isOpen,
            "opacity-100": isOpen,
          }
        )}
        ref={dialogRef}
        open={isOpen}
      >
        <ul>{renderItems(items)}</ul>
      </dialog>
    </div>
  );
};

export default Dropdown;
