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
import { motion } from "framer-motion";
import { useUserCompanies } from "@/hooks/useUserCompanies";

export default function DashboardGnb() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<string | null>("item1");
  const { companies, loading } = useUserCompanies();

  useEffect(() => {
    if (companies.length > 0) {
      setSelectedMenu(companies[0].id);
    }
  }, [companies, selectedMenu]);

  const dropdownItems: Common.DropdownItem[] = [
    ...companies.map((company) => ({
      type: "item" as const,
      id: company.id,
      label: company.name,
    })),
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
        "h-[60px] fixed w-full top-0 left-1/2 z-50 flex -translate-x-1/2 items-center justify-between bg-white p-4 transition-all duration-300 ease-in-out border !border-primary-100"
      )}
    >
      {loading ? (
        <FlexWrapper classes="w-[168px]" justify="center">
          <motion.div
            className="size-4 rounded-full border-[3px] border-primary-900 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 1,
            }}
          />
        </FlexWrapper>
      ) : (
        <FlexWrapper gap={2} items="center">
          <span className="size-10 flex items-center justify-center rounded-md bg-secondary-500 font-normal text-base">
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
      )}

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
