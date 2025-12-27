import { useEffect } from "react"; // ✅ 추가
import classNames from "classnames";
import { useLocation } from "react-router-dom";
import {
  // LuChartNoAxesCombined,
  // LuListChecks,
  // LuCalculator,
  // LuNotebookPen,
  // LuHardDrive,
  LuBuilding,
  // LuCalendarCheck2,
  // LuWalletMinimal,
  LuMailCheck,
} from "react-icons/lu";
import { AiOutlineTeam } from "react-icons/ai";
import { useAuthStore } from "@/stores/authStore";
import { useCompanyStore } from "@/stores/useCompanyStore";

const SNB = () => {
  const { pathname } = useLocation();
  const role = useAuthStore((s) => s.role);

  // ✅ 스토어에서 상태와 페칭 함수 가져오기
  const { currentCompanyId, currentCompanyDetail, fetchCurrentCompanyDetail } =
    useCompanyStore();

  // ✅ [추가] 상세 정보가 없으면 불러오는 로직
  useEffect(() => {
    if (currentCompanyId) {
      fetchCurrentCompanyDetail();
    }
  }, [currentCompanyId]);

  // ✅ 필터링에 사용할 메뉴 ID 배열 (데이터가 아직 없다면 빈 배열)
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
            ],
          },
        ]
      : [
          {
            title: null,
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
              // {
              //   id: "bonus",
              //   label: "수당/상여대장",
              //   href: "/under-construction",
              // },
              { id: "attendance", label: "연차휴가대장", href: "/attendance" },
              {
                id: "education",
                label: "교육관리",
                href: "/under-construction",
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
                href: "/under-construction",
              },
              {
                id: "contract-management",
                label: "계약관리",
                href: "/under-construction",
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

  // ✅ 필터링 logic (이전과 동일)
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

  return (
    <aside className="scroll-thin z-40 hidden sm:flex flex-col justify-between h-[100dvh] overflow-y-auto pt-[60px] pb-4 pr-0 w-[180px] border-r border-primary-100">
      <nav className="w-full rounded-xl py-4 px-2">
        <ul className="flex flex-col w-full">
          {snbGroups.map((group, gIdx) => (
            <li
              key={gIdx}
              className="mb-2 border-b border-primary-100 last:border-none"
            >
              {group.title && (
                <p className="px-2 py-1 text-xs font-semibold tracking-wide uppercase bg-green-600 text-white w-max rounded-md mb-1">
                  {group.title}
                </p>
              )}
              <ul className="flex flex-col w-full">
                {group.items.map((item) => (
                  <li key={item.id} className="w-full">
                    <a
                      href={item.href}
                      className={classNames(
                        "flex items-center gap-3 w-full text-primary-800 hover:bg-green-100/70 rounded-lg py-2 px-4 text-sm transition-all duration-100 ease-in-out",
                        {
                          "!text-primary-900 bg-green-100 font-bold":
                            pathname.includes(item.id),
                        }
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SNB;
