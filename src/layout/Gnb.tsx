import FlexWrapper from "./FlexWrapper";
import { useEffect, useState } from "react";
import classNames from "classnames";
import BurgerButton from "@/interaction/BurgerButton";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
// import { LuRefreshCcw, LuBell } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { useCompanyStore } from "@/stores/useCompanyStore";
import UspLogo from "@/assets/image/usp_logo.png";
import { useAuthStore } from "@/stores/authStore";
import Typography from "@/foundation/Typography";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Gnb() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    companies,
    fetchCompanies,
    currentCompanyId,
    initialized,
    selectCompany,
  } = useCompanyStore();
  const role = useAuthStore((s) => s.role);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const dropdownItems = [
    ...companies.map((c) => ({
      type: "item" as const,
      id: c.id,
      label: c.name,
    })),
  ] as Common.DropdownItem[];

  const onLogout = async () => {
    await supabase.auth.signOut(); // ✅ 세션 제거
    setIsOpen(false);
    navigate("/login"); // ✅ 로그인페이지로 이동
  };

  const handleMove = (url: string) => {
    setIsOpen(false);
    navigate(url);
  };

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
          <a href={role === "super_admin" ? "/company" : "/dashboard"}>
            <img src={UspLogo} alt="HandS Logo" className="w-[60px]" />
          </a>
          {role === "super_admin" && (
            <Typography variant="H4" classes="text-gray-700">
              BACKOFFICE
            </Typography>
          )}
          {role === "admin" && (
            <>
              <span className="w-[1px] h-4 bg-primary-100 mr-2"></span>
              <Dropdown
                buttonVariant="outline"
                items={dropdownItems}
                onChange={async (val) => {
                  await selectCompany(val);
                }}
                dialogWidth={160}
                buttonItem={
                  companies.find((c) => c.id === currentCompanyId)?.name ??
                  "회사 선택"
                }
                buttonClasses="w-[120px] !font-normal text-primary-900 !h-10 !border-primary-100"
              />
            </>
          )}
        </FlexWrapper>
      )}

      <FlexWrapper gap={2} items="center" classes="!hidden sm:!flex">
        {/* <Button variant="clear" classes="!size-10 !p-2 !text-primary-900">
          <LuRefreshCcw className="text-lg" />
        </Button>
        <Button variant="clear" classes="!size-10 !p-2 !text-primary-900">
          <LuBell className="text-lg" />
        </Button> */}
        <Button
          variant="outline"
          classes="!text-primary-900"
          onClick={onLogout}
        >
          로그아웃
        </Button>
      </FlexWrapper>

      <BurgerButton isOpen={isOpen} setIsOpen={setIsOpen} />
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed top-[60px] right-0 h-[calc(100dvh-60px)] w-full bg-white shadow-xl z-[999] flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="flex-1 overflow-y-auto pb-4 px-4 space-y-3">
                <FlexWrapper
                  direction="col"
                  items="start"
                  justify="between"
                  classes="h-full"
                >
                  <FlexWrapper direction="col" gap={0} classes="w-full">
                    <Button
                      variant="clear"
                      size="lg"
                      classes="w-full justify-center !text-primary-900 border-b !rounded-none !py-8 !font-bold"
                      onClick={() => handleMove("/dashboard")}
                    >
                      대시보드
                    </Button>
                    <Button
                      variant="clear"
                      size="lg"
                      classes="w-full justify-center !text-primary-900 border-b !rounded-none !py-8 !font-bold"
                      onClick={() => handleMove("/communication")}
                    >
                      업무소통
                    </Button>
                    <Button
                      variant="clear"
                      size="lg"
                      classes="w-full justify-center !text-primary-900 border-b !rounded-none !py-8 !font-bold"
                      onClick={() => handleMove("/salary")}
                    >
                      급여대장
                    </Button>
                    <Button
                      variant="clear"
                      size="lg"
                      classes="w-full justify-center !text-primary-900 border-b !rounded-none !py-8 !font-bold"
                      onClick={() => handleMove("/attendance")}
                    >
                      연차관리
                    </Button>
                    <Button
                      variant="clear"
                      size="lg"
                      classes="w-full justify-center !text-primary-900 border-b !rounded-none !py-8 !font-bold"
                      onClick={() => handleMove("/expense")}
                    >
                      고정비와 변동비
                    </Button>
                    <Button
                      variant="clear"
                      size="lg"
                      classes="w-full justify-center !text-primary-900 border-b !rounded-none !py-8 !font-bold"
                      onClick={() => handleMove("/income")}
                    >
                      손익계산서
                    </Button>
                    <Button
                      variant="clear"
                      size="lg"
                      classes="w-full justify-center !text-primary-900 border-b !rounded-none !py-8 !font-bold"
                      onClick={() => handleMove("/document")}
                    >
                      자료관리
                    </Button>
                  </FlexWrapper>
                  <Button
                    variant="clear"
                    size="lg"
                    classes="w-full justify-center !text-primary-900"
                    onClick={onLogout}
                  >
                    로그아웃
                  </Button>
                </FlexWrapper>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
