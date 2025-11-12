import classNames from "classnames";
import { useLocation } from "react-router-dom";
import {
  LuChartNoAxesCombined,
  LuListChecks,
  LuArrowUpDown,
  LuHardDrive,
  LuBuilding,
  LuSettings,
  LuCalendarCheck2,
  LuWalletMinimal,
  LuMailCheck,
} from "react-icons/lu";
import { AiOutlineTeam } from "react-icons/ai";
import { useAuthStore } from "@/stores/authStore";

const SNB = () => {
  const { pathname } = useLocation();
  const role = useAuthStore((s) => s.role);

  // ✅ 그룹화된 메뉴 구조
  const snbGroups =
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
            title: null, // 대시보드, 업무소통은 상단 공통 그룹 (타이틀 없음)
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
                id: "salary",
                label: "급여대장",
                href: "/salary",
                icon: <LuWalletMinimal />,
              },
              {
                id: "vacation",
                label: "휴가관리",
                href: "/vacation",
                icon: <LuCalendarCheck2 />,
              },
            ],
          },
          {
            title: "회계정보",
            items: [
              {
                id: "income",
                label: "손익계산서",
                href: "/income",
                icon: <LuArrowUpDown />,
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

  return (
    <aside className="scroll-thin z-40 flex flex-col justify-between h-[100dvh] overflow-y-auto pt-[60px] pb-4 pr-0 w-[180px] border-r border-primary-100">
      <nav className="w-full rounded-xl py-4 px-2">
        <ul className="flex flex-col w-full">
          {snbGroups.map((group, gIdx) => (
            <li
              key={gIdx}
              className="mb-2 border-b border-primary-100 pb-4 last:border-none"
            >
              {group.title && (
                <p className="px-4 py-2 text-xs font-semibold text-primary-500 tracking-wide uppercase">
                  {group.title}
                </p>
              )}
              <ul className="flex flex-col w-full">
                {group.items.map((item) => (
                  <li key={item.id} className="w-full">
                    <a
                      href={item.href}
                      className={classNames(
                        "flex items-center gap-3 w-full text-primary-800 hover:bg-primary-100/70 rounded-lg py-3 px-4 text-sm transition-all duration-100 ease-in-out",
                        {
                          "!text-primary-900 bg-primary-100 font-bold":
                            pathname.includes(item.id),
                        }
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
      {/* <div className="px-2">
        <a
          href="/settings"
          className={classNames(
            "flex items-center gap-3 w-full text-primary-800 hover:bg-primary-100/70 rounded-lg py-3 px-4 text-sm transition-all duration-100 ease-in-out",
            {
              "!text-primary-900 bg-primary-100 font-bold":
                pathname.includes("settings"),
            }
          )}
        >
          <LuSettings />
          설정
        </a>
      </div> */}
    </aside>
  );
};

export default SNB;
