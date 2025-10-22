"use client";

import FlexWrapper from "./FlexWrapper";
import { useEffect, useState } from "react";
import classNames from "classnames";
import BurgerButton from "@/interaction/BurgerButton";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import { LuRefreshCcw } from "react-icons/lu";
import { LuBell } from "react-icons/lu";
import { LuPlus } from "react-icons/lu";

export default function DashboardGnb() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<string | null>("item1");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dropdownItems: Common.DropdownItem[] = [
    { type: "item", id: "item1", label: "트립트먼트" },
    { type: "item", id: "item2", label: "회사A" },
    { type: "item", id: "item3", label: "회사B" },
    {
      type: "item",
      id: "add",
      icon: <LuPlus className="text-base text-primary-500" />,
      label: <p className="text-primary-500">회사 추가</p>,
    },
  ];

  return (
    <div
      className={classNames(
        "fixed top-2 left-1/2 z-50 flex -translate-x-1/2 items-center justify-between rounded-full bg-white px-[32px] py-4 transition-all duration-300 ease-in-out border sm:border-transparent",
        scrolled
          ? "max-w-[1160px] w-[calc(100%-16px)] !border-primary-100 shadow-custom-light "
          : "max-w-[1200px] w-[calc(100%-16px)] sm:w-full border-primary-100 shadow-custom-light  sm:shadow-none"
      )}
    >
      <FlexWrapper gap={2} items="center">
        <span className=" size-10 flex items-center justify-center rounded-md bg-primary-100 font-normal text-base">
          트
        </span>
        <Dropdown
          items={dropdownItems}
          onChange={(val) => {
            if (val !== "add") {
              setSelectedMenu(val);
            }
          }}
          dialogWidth={160}
          buttonVariant="clear"
          buttonItem={
            dropdownItems.find((item) => item.id === selectedMenu)
              ?.label as string
          }
          buttonClasses="w-[120px] !font-normal text-primary-900 !h-10"
        />
      </FlexWrapper>

      <FlexWrapper gap={2} items="center" classes="!hidden sm:!flex">
        <Button variant="clear" classes="!size-10 !p-2 !text-primary-900">
          <LuRefreshCcw className="text-lg" />
        </Button>
        <Button variant="clear" classes="!size-10 !p-2 !text-primary-900">
          <LuBell className="text-lg" />
        </Button>
      </FlexWrapper>

      <BurgerButton isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
