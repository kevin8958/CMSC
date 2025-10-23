import classNames from "classnames";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { LuListChecks } from "react-icons/lu";
import { LuCalculator } from "react-icons/lu";
import { LuNotebook } from "react-icons/lu";

const SNB = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const snbMenus = [
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
    {
      id: "accounting",
      label: "회계지원",
      href: "/accounting",
      icon: <LuCalculator />,
    },
    {
      id: "document",
      label: "서류관리",
      href: "/document",
      icon: <LuNotebook />,
    },
  ];

  return (
    <header
      className={
        "scrollbar-thin scrollbar-thumb-primary-100 scrollbar-track-transparent z-40 flex h-[100dvh] overflow-y-auto pt-[70px] pr-0 w-[180px] border-r border-primary-100 "
      }
    >
      <nav className="w-full rounded-xl py-4 px-2">
        <ul className="flex flex-col w-full ">
          {snbMenus.map((item) => {
            return (
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
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

export default SNB;
