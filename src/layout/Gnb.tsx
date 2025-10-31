import FlexWrapper from "./FlexWrapper";
import { useEffect, useState } from "react";
import classNames from "classnames";
import BurgerButton from "@/interaction/BurgerButton";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import { LuRefreshCcw, LuBell, LuPlus } from "react-icons/lu";
import { motion } from "framer-motion";
import { useDialog } from "@/hooks/useDialog";
import { useAlert } from "@/components/AlertProvider";
import TextInput from "@/components/TextInput";
import { useCompanyStore } from "@/stores/useCompanyStore";
import LogoBlack from "@/assets/image/logo_hands_black.png";

export default function Gnb() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    companies,
    fetchCompanies,
    currentCompanyId,
    initialized,
    selectCompany,
    createCompany,
  } = useCompanyStore();
  const { openDialog } = useDialog();
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const dropdownItems = [
    ...companies.map((c) => ({
      type: "item" as const,
      id: c.id,
      label: c.name,
    })),
    {
      type: "item",
      id: "add",
      icon: <LuPlus className="text-base text-primary-500" />,
      label: <p className="text-primary-500">회사 추가</p>,
    },
  ] as Common.DropdownItem[];

  function DialogBody() {
    const { close } = useDialog();
    const [companyName, setCompanyName] = useState("");

    const onSubmit = async (companyName: string) => {
      try {
        const company = await createCompany(companyName);
        if (company) {
          showAlert(`회사 "${company.name}"가 생성되었습니다.`, {
            type: "success",
            durationMs: 3000,
          });
        }
        fetchCompanies();
        close(true);
      } catch (err: any) {
        showAlert(err?.message || "회사 생성 중 오류가 발생했습니다.", {
          type: "danger",
          durationMs: 3000,
        });
      }
    };
    return (
      <FlexWrapper direction="col" gap={4} classes="w-full">
        <TextInput
          label="회사 이름"
          id="companyName"
          classes="w-full"
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <Button
          size="lg"
          variant="contain"
          classes="w-full"
          disabled={companyName.trim() === ""}
          onClick={() => {
            onSubmit(companyName);
          }}
        >
          추가하기
        </Button>
      </FlexWrapper>
    );
  }

  return (
    <div
      className={classNames(
        "h-[60px] fixed w-full top-0 left-1/2 z-50 flex -translate-x-1/2 items-center justify-between bg-white p-4 transition-all duration-300 ease-in-out border !border-primary-100"
      )}
    >
      {!initialized ? (
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
          <a href="/dashboard">
            <img src={LogoBlack} alt="HandS Logo" className="w-[60px]" />
          </a>
          <Dropdown
            buttonVariant="outline"
            items={dropdownItems}
            onChange={async (val) => {
              if (val === "add") {
                await openDialog({
                  title: "회사 추가",
                  hideBottom: true,
                  body: <DialogBody />,
                });
                return;
              } else {
                await selectCompany(val);
              }
            }}
            dialogWidth={160}
            buttonItem={
              companies.find((c) => c.id === currentCompanyId)?.name ??
              "회사 선택"
            }
            buttonClasses="w-[120px] !font-normal text-primary-900 !h-10 !border-primary-100"
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
