import { useEffect, useState } from "react";
import classNames from "classnames";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LuBuilding, LuMailCheck, LuChevronDown } from "react-icons/lu";
import { AiOutlineTeam } from "react-icons/ai";
import { useAuthStore } from "@/stores/authStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import Typography from "@/foundation/Typography";

const SNB = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.role);

  // 아코디언 상태 관리 (GNB와 동일 로직)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const { currentCompanyId, currentCompanyDetail, fetchCurrentCompanyDetail } =
    useCompanyStore();

  useEffect(() => {
    if (currentCompanyId) {
      fetchCurrentCompanyDetail();
    }
  }, [currentCompanyId]);

  const enabledMenus = currentCompanyDetail?.enabled_menus || [];

  const rawGroups =
    role === "super_admin"
      ? [
          {
            title: null,
            items: [
              {
                id: "company",
                label: "회사관리",
                href: "/company",
                icon: <LuBuilding />,
              },
              {
                id: "member",
                label: "멤버관리",
                href: "/member",
                icon: <AiOutlineTeam />,
              },
              {
                id: "inquiry",
                label: "문의관리",
                href: "/inquiry",
                icon: <LuMailCheck />,
              },
              {
                id: "company-intro-management",
                label: "회사소개서관리",
                href: "/company-intro-management",
                icon: <LuMailCheck />,
              },
            ],
          },
        ]
      : [
          {
            title: null, // GNB의 '기본항목' 역할
            items: [
              { id: "dashboard", label: "대시보드", href: "/dashboard" },
              {
                id: "communication",
                label: "업무소통",
                href: "/communication",
              },
            ],
          },
          {
            title: "인사지원",
            items: [
              { id: "worker", label: "근로자관리", href: "/worker" },
              { id: "salary", label: "급여대장", href: "/salary" },
              { id: "attendance", label: "연차휴가대장", href: "/attendance" },
              {
                id: "education",
                label: "교육관리",
                href: "/education",
              },
              {
                id: "time-management",
                label: "근태관리",
                href: "/under-construction",
              },
              {
                id: "welfare",
                label: "복리후생관리",
                href: "/under-construction",
              },
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
              { id: "income", label: "손익계산서", href: "/income" },
              { id: "expense", label: "고정비변동비", href: "/expense" },
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
            items: [{ id: "document", label: "자료관리", href: "/document" }],
          },
        ];

  // 필터링된 그룹 생성
  const snbGroups = rawGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (role === "super_admin") return true;
        const isMenuEnabled = enabledMenus.includes(item.id);
        if (!isMenuEnabled) return false;
        if ((role === "user_a" || role === "user_b") && item.id === "worker")
          return false;
        return true;
      }),
    }))
    .filter((group) => group.items.length > 0);

  // 현재 경로 기준 자동 펼침 로직
  useEffect(() => {
    const currentGroup = snbGroups.find((group) =>
      group.items.some(
        (item) =>
          pathname.includes(item.href) && item.href !== "/under-construction"
      )
    );

    if (currentGroup && currentGroup.title) {
      setExpandedGroup(currentGroup.title);
    } else {
      setExpandedGroup(null);
    }
  }, [pathname, currentCompanyDetail]); // 데이터 로드 후에도 체크되도록 detail 추가

  const toggleGroup = (title: string) => {
    setExpandedGroup((prev) => (prev === title ? null : title));
  };

  const handleMove = (url: string) => {
    navigate(url);
  };

  return (
    <aside className="scroll-thin z-40 hidden sm:flex flex-col h-[100dvh] overflow-y-auto pt-[60px] pb-4 w-[200px] border-r border-primary-100 bg-white">
      <nav className="w-full py-4 px-3">
        <ul className="flex flex-col w-full gap-1">
          {snbGroups.map((group) => {
            // 1. 타이틀이 없는 경우 (기본항목)
            if (!group.title) {
              return group.items.map((item) => (
                <li key={item.id} className="w-full">
                  <button
                    onClick={() => handleMove(item.href)}
                    className={classNames(
                      "flex items-center justify-between w-full rounded-lg py-2.5 px-3 text-sm transition-all duration-200 mb-1",
                      pathname === item.href &&
                        pathname !== "/under-construction"
                        ? "bg-primary-50 text-primary-900 !font-bold"
                        : "text-gray-700 hover:bg-gray-50 font-bold"
                    )}
                  >
                    <span className="truncate">{item.label}</span>
                    {pathname === item.href &&
                      pathname !== "/under-construction" && (
                        <div className="size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] shrink-0" />
                      )}
                  </button>
                </li>
              ));
            }

            // 2. 타이틀이 있는 경우 (아코디언)
            const isExpanded = expandedGroup === group.title;
            return (
              <li key={group.title} className="flex flex-col w-full mb-1">
                <button
                  onClick={() => toggleGroup(group.title!)}
                  className={classNames(
                    "flex items-center justify-between w-full py-2.5 px-3 rounded-md transition-colors",
                    isExpanded
                      ? "bg-green-100 text-primary-900"
                      : "bg-transparent text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Typography variant="B2" classes="font-bold">
                    {group.title}
                  </Typography>
                  <LuChevronDown
                    className={classNames(
                      "text-gray-400 transition-transform duration-300",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden flex flex-col pl-2 mt-1 gap-1"
                    >
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleMove(item.href)}
                          className={classNames(
                            "flex items-center justify-between w-full py-2 px-3 rounded-md text-sm transition-all",
                            pathname === item.href &&
                              pathname !== "/under-construction"
                              ? "bg-primary-50 text-primary-900 !font-bold"
                              : "text-gray-500 hover:text-primary-800 hover:bg-gray-50 font-normal"
                          )}
                        >
                          <span className="truncate">{item.label}</span>
                          {pathname === item.href &&
                            pathname !== "/under-construction" && (
                              <div className="size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] shrink-0" />
                            )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default SNB;
