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
import { useDialog } from "@/hooks/useDialog";
import { useAlert } from "@/components/AlertProvider";
import TextInput from "@/components/TextInput";
import { useCreateCompany } from "@/hooks/useCreateCompany";
import { supabase } from "@/lib/supabase";

export default function Gnb() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    "item1"
  );
  const { companies, loading, refetch, lastSelectedId } = useUserCompanies();
  const { handleCreateCompany, error } = useCreateCompany();
  const { openDialog } = useDialog();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (lastSelectedId) {
      setSelectedCompanyId(lastSelectedId);
    } else if (companies.length > 0) {
      setSelectedCompanyId(companies[0].id);
    }
  }, [companies, lastSelectedId]);

  const dropdownItems: Common.DropdownItem[] = [
    ...companies
      .slice() // 원본 배열 변경 방지
      .sort((a, b) => a.name.localeCompare(b.name, "ko")) // ✅ 한글/영문 모두 안정적 정렬
      .map((company) => ({
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

  const handleSelectCompany = async (companyId: string) => {
    setSelectedCompanyId(companyId);

    // DB에 마지막 선택 회사 저장
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ last_selected_company_id: companyId })
      .eq("id", user.id);

    if (error) {
      console.error("Failed to save last selected company:", error);
    }
  };

  const onSubmit = async (companyName: string) => {
    const company = await handleCreateCompany(companyName);
    if (company) {
      showAlert(`회사 "${company.name}"가 생성되었습니다`, {
        type: "success",
        durationMs: 3000,
      });
      await refetch();
    }
    if (error) {
      showAlert(error, {
        type: "danger",
        durationMs: 3000,
      });
    }
  };

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
            {selectedCompanyId
              ? String(
                  dropdownItems.find((item) => item.id === selectedCompanyId)
                    ?.label || ""
                )
                  .charAt(0)
                  .toUpperCase()
              : ""}
          </span>
          <Dropdown
            items={dropdownItems}
            onChange={async (val) => {
              if (val === "add") {
                let companyName = "";
                await openDialog({
                  title: "회사 추가",
                  body: (
                    <TextInput
                      label="회사 이름"
                      id="companyName"
                      classes="w-full"
                      onChange={(e) => (companyName = e.target.value)}
                    />
                  ),
                  onConfirm: () => {
                    if (companyName.trim() === "") {
                      showAlert("회사 이름을 입력해주세요.", {
                        type: "danger",
                        durationMs: 3000,
                      });
                      return false;
                    } else {
                      onSubmit(companyName);
                      return true;
                    }
                  },
                });
                return;
              } else {
                handleSelectCompany(val);
              }
            }}
            dialogWidth={160}
            buttonVariant="clear"
            buttonItem={
              dropdownItems.find((item) => item.id === selectedCompanyId)
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
