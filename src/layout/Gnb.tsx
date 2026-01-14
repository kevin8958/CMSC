import FlexWrapper from "./FlexWrapper";
import { useEffect, useState } from "react";
import classNames from "classnames";
import BurgerButton from "@/interaction/BurgerButton";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import { motion, AnimatePresence } from "framer-motion";
import { useCompanyStore } from "@/stores/useCompanyStore";
import Logo from "@/assets/image/effice_logo_t.png";
import { useAuthStore } from "@/stores/authStore";
import Typography from "@/foundation/Typography";
import { supabase } from "@/lib/supabase";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LuChartNoAxesCombined,
  LuListChecks,
  LuWalletMinimal,
  LuCalendarCheck2,
  LuNotebookPen,
  LuCalculator,
  LuHardDrive,
  LuChevronDown,
} from "react-icons/lu";
import { AiOutlineTeam } from "react-icons/ai";

export default function Gnb() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const { pathname } = useLocation();
  const {
    companies,
    fetchCompanies,
    currentCompanyId,
    initialized,
    selectCompany,
  } = useCompanyStore();
  const role = useAuthStore((s) => s.role);
  const navigate = useNavigate();

  const adminMenuItems = [
    {
      title: "기본항목",
      items: [
        {
          id: "dashboard",
          label: "대시보드",
          href: "/dashboard",
          icon: <LuChartNoAxesCombined />,
        },
        {
          id: "communication",
          label: "업무소통",
          href: "/communication",
          icon: <LuListChecks />,
        },
      ],
    },
    {
      title: "인사지원",
      items: [
        {
          id: "worker",
          label: "근로자관리",
          href: "/worker",
          icon: <AiOutlineTeam />,
        },
        {
          id: "salary",
          label: "급여대장",
          href: "/salary",
          icon: <LuWalletMinimal />,
        },
        {
          id: "attendance",
          label: "연차휴가대장",
          href: "/attendance",
          icon: <LuCalendarCheck2 />,
        },
        { id: "education", label: "교육관리", href: "/education" },
        {
          id: "time-management",
          label: "근태관리",
          href: "/time-management",
        },
        { id: "welfare", label: "복리후생관리", href: "/under-construction" },
        {
          id: "health-check",
          label: "건강검진관리",
          href: "/under-construction",
        },
      ],
    },
    {
      title: "회계지원",
      items: [
        {
          id: "income",
          label: "손익계산서",
          href: "/income",
          icon: <LuCalculator />,
        },
        {
          id: "expense",
          label: "고정비변동비",
          href: "/expense",
          icon: <LuNotebookPen />,
        },
        {
          id: "card-usage",
          label: "카드사용내역",
          href: "/under-construction",
        },
        {
          id: "account-history",
          label: "계좌별거래내역",
          href: "/under-construction",
        },
        {
          id: "vendor-ledger",
          label: "거래처별원장",
          href: "/under-construction",
        },
        {
          id: "vehicle-log",
          label: "차량운행일지",
          href: "/under-construction",
        },
        {
          id: "severance-pension",
          label: "퇴직연금운용",
          href: "/under-construction",
        },
        {
          id: "loan-management",
          label: "대출/이자관리",
          href: "/under-construction",
        },
      ],
    },
    {
      title: "계약구매지원",
      items: [
        {
          id: "vendor-management",
          label: "거래처관리",
          href: "/client-management",
        },
        {
          id: "contract-management",
          label: "계약관리",
          href: "/contract-management",
        },
        {
          id: "equipment-purchase",
          label: "비품 구매내역",
          href: "/under-construction",
        },
        {
          id: "material-purchase",
          label: "재료대 구매내역",
          href: "/under-construction",
        },
        {
          id: "medicine-purchase",
          label: "의약품 구매내역",
          href: "/under-construction",
        },
        {
          id: "special-medical-device",
          label: "특수의료장비 관리",
          href: "/under-construction",
        },
        {
          id: "medical-waste",
          label: "의료폐기물 관리",
          href: "/under-construction",
        },
      ],
    },
    {
      title: "채용관리",
      items: [
        {
          id: "job-posting",
          label: "채용공고현황",
          href: "/under-construction",
        },
        {
          id: "applicant-management",
          label: "지원자관리",
          href: "/under-construction",
        },
        {
          id: "new-hire-management",
          label: "입사자관리",
          href: "/under-construction",
        },
        {
          id: "posting-design",
          label: "공고디자인",
          href: "/under-construction",
        },
        {
          id: "market-analysis",
          label: "시장지표분석",
          href: "/under-construction",
        },
      ],
    },
    {
      title: "자료관리",
      items: [
        {
          id: "document",
          label: "자료관리",
          href: "/document",
          icon: <LuHardDrive />,
        },
      ],
    },
  ];

  useEffect(() => {
    fetchCompanies();
  }, []);

  // 메뉴가 열리거나 경로가 바뀔 때 실행되는 로직 수정
  useEffect(() => {
    if (isOpen) {
      const currentGroup = adminMenuItems.find((group) =>
        group.items.some((item) => item.href === pathname)
      );

      // '기본항목'이거나 해당하는 그룹이 없으면 펼쳐진 그룹을 닫음 (null 처리)
      if (currentGroup && currentGroup.title !== "기본항목") {
        setExpandedGroup(currentGroup.title);
      } else {
        setExpandedGroup(null);
      }
    }
  }, [isOpen, pathname]);

  const toggleGroup = (title: string) => {
    setExpandedGroup((prev) => (prev === title ? null : title));
  };

  const onLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    navigate("/login");
  };

  const handleMove = (url: string) => {
    setIsOpen(false);
    navigate(url);
  };

  const superAdminMenus = [
    { label: "회사관리", path: "/company" },
    { label: "멤버관리", path: "/member" },
    { label: "문의관리", path: "/inquiry" },
    { label: "회사소개서관리", path: "/company-intro-management" },
  ];

  const dropdownItems = companies.map((c) => ({
    type: "item" as const,
    id: c.id,
    label: c.name,
  })) as Common.DropdownItem[];

  return (
    <div className="h-[60px] fixed w-full top-0 left-1/2 z-50 flex -translate-x-1/2 items-center justify-between bg-white p-4 transition-all duration-300 ease-in-out border !border-primary-100">
      <FlexWrapper gap={2} items="center">
        {!initialized ? (
          <motion.div
            className="size-4 rounded-full border-[3px] border-primary-900 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
          />
        ) : (
          <>
            <a href={role === "super_admin" ? "/company" : "/dashboard"}>
              <img src={Logo} alt="Logo" className="w-[60px]" />
            </a>
            {role === "super_admin" && (
              <Typography variant="H4" classes="text-gray-700">
                BACKOFFICE
              </Typography>
            )}
            {role === "admin" && (
              <>
                <Dropdown
                  buttonVariant="outline"
                  items={dropdownItems}
                  onChange={selectCompany}
                  dialogWidth={160}
                  buttonItem={
                    companies.find((c) => c.id === currentCompanyId)?.name ??
                    "회사 선택"
                  }
                  buttonClasses="w-[120px] !font-normal text-primary-900 !h-10 !border-primary-100"
                />
              </>
            )}
          </>
        )}
      </FlexWrapper>

      <FlexWrapper gap={2} items="center" classes="!hidden sm:!flex">
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
          <motion.div
            className="fixed top-[60px] right-0 h-[calc(100dvh-60px)] w-full bg-white shadow-xl z-[999] flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {role === "super_admin" ? (
                <div className="space-y-4 pt-4">
                  {superAdminMenus.map((menu) => (
                    <Button
                      key={menu.path}
                      variant="clear"
                      size="lg"
                      classes="w-full justify-start !text-primary-900 !px-4"
                      onClick={() => handleMove(menu.path)}
                    >
                      <Typography
                        variant="H3"
                        classes={
                          pathname.includes(menu.path)
                            ? "font-bold"
                            : "font-normal"
                        }
                      >
                        {menu.label}
                      </Typography>
                      {pathname.includes(menu.path) && (
                        <div className="ml-auto size-2 rounded-full bg-green-500" />
                      )}
                    </Button>
                  ))}
                </div>
              ) : (
                adminMenuItems.map((group) => {
                  if (group.title === "기본항목") {
                    return group.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleMove(item.href)}
                        className={classNames(
                          "w-full flex items-center justify-between py-3 px-3 rounded-md transition-colors mb-1"
                        )}
                      >
                        <Typography
                          variant="B1"
                          classes={
                            pathname === item.href &&
                            pathname !== "/under-construction"
                              ? "!font-bold"
                              : "font-bold"
                          }
                        >
                          {item.label}
                        </Typography>
                        {pathname === item.href &&
                          pathname !== "/under-construction" && (
                            <div className="size-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                          )}
                      </button>
                    ));
                  }

                  return (
                    <div key={group.title} className="space-y-1">
                      <button
                        onClick={() => toggleGroup(group.title)}
                        className={classNames(
                          "w-full flex justify-between items-center p-3 rounded-md transition-colors",
                          expandedGroup === group.title
                            ? "bg-green-100"
                            : "bg-gray-50"
                        )}
                      >
                        <Typography
                          variant="H4"
                          classes="font-bold text-primary-900"
                        >
                          {group.title}
                        </Typography>
                        <LuChevronDown
                          className={classNames(
                            "transition-transform text-gray-400",
                            expandedGroup === group.title && "rotate-180"
                          )}
                        />
                      </button>

                      <AnimatePresence>
                        {expandedGroup === group.title && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden space-y-1 pt-1"
                          >
                            {group.items.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => handleMove(item.href)}
                                className={classNames(
                                  "w-full flex items-center justify-between py-3 px-4 rounded-md transition-colors"
                                )}
                              >
                                <Typography
                                  variant="B1"
                                  classes={
                                    pathname === item.href &&
                                    pathname !== "/under-construction"
                                      ? "!font-bold"
                                      : "font-normal"
                                  }
                                >
                                  {item.label}
                                </Typography>
                                {pathname === item.href &&
                                  pathname !== "/under-construction" && (
                                    <div className="size-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                  )}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <Button
                variant="outline"
                color="primary"
                size="lg"
                classes="w-full justify-center bg-white"
                onClick={onLogout}
              >
                로그아웃
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
