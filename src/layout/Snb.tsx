import classNames from "classnames";
import { useLocation } from "react-router-dom";
import {
  LuChartNoAxesCombined,
  LuListChecks,
  LuNotebook,
  LuArrowUpDown,
} from "react-icons/lu";
import { MdOutlineMedicalInformation } from "react-icons/md";
import { AiOutlineTeam } from "react-icons/ai";
const SNB = () => {
  const { pathname } = useLocation();

  // ✅ 그룹화된 메뉴 구조
  const snbGroups = [
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
          id: "employee",
          label: "인사정보",
          href: "/employee",
          icon: <MdOutlineMedicalInformation />,
        },
        // ✨ 추후 여기에 다른 인사지원 메뉴를 추가할 수 있습니다.
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
      title: "서류관리",
      items: [
        {
          id: "document",
          label: "서류관리",
          href: "/document",
          icon: <LuNotebook />,
        },
      ],
    },
    {
      title: null,
      items: [
        {
          id: "member",
          label: "멤버관리",
          href: "/member",
          icon: <AiOutlineTeam />,
        },
      ],
    },
  ];

  return (
    <aside className="scrollbar-thin scrollbar-thumb-primary-100 scrollbar-track-transparent z-40 flex h-[100dvh] overflow-y-auto pt-[60px] pr-0 w-[180px] border-r border-primary-100">
      <nav className="w-full rounded-xl py-4 px-2">
        <ul className="flex flex-col w-full">
          {snbGroups.map((group, gIdx) => (
            <li key={gIdx} className="mb-2 border-b border-primary-100 pb-4">
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
    </aside>
  );
};

export default SNB;
