"use client";

import GnbButton from "@/layout/GnbButton";
import FlexWrapper from "./FlexWrapper";
import { useEffect, useState } from "react";
import classNames from "classnames";
import BurgerButton from "@/interaction/BurgerButton";
import LogoBlack from "@/assets/image/logo_hands_black.png";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";

export default function IntroGnb() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menus = [
    { id: 1, label: "업무보드", href: "/work" },
    { id: 2, label: "채용지원", href: "/recruitment" },
    { id: 3, label: "인사지원", href: "/hr" },
    { id: 3, label: "회계지원", href: "/accounting" },
    { id: 4, label: "구매지원", href: "/purchasing" },
    { id: 5, label: "기타지원", href: "/etc" },
  ];

  return (
    <>
      <div
        className={classNames(
          "fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center backdrop-blur-md justify-between rounded-full bg-white/60 px-[32px] py-1 transition-all duration-300 ease-in-out border sm:border-transparent",
          scrolled
            ? "max-w-[1160px] w-[calc(100%-16px)] !border-primary-100 shadow-custom-light "
            : "max-w-[1200px] w-[calc(100%-16px)] sm:w-full border-primary-100 shadow-custom-light  sm:shadow-none"
        )}
      >
        <FlexWrapper gap={4} items="center">
          <a href="/">
            <img src={LogoBlack} alt="HandS Logo" className="w-[60px]" />
          </a>

          <FlexWrapper gap={2} items="center" classes="!hidden sm:!flex">
            {menus.map((menu) => {
              return (
                <GnbButton key={menu.id} href={menu.href}>
                  {menu.label}
                </GnbButton>
              );
            })}
          </FlexWrapper>
        </FlexWrapper>

        <FlexWrapper gap={4} items="center" classes="!hidden sm:!flex">
          <GnbButton href="/login">로그인</GnbButton>
          <GnbButton href="/login">문의하기</GnbButton>
        </FlexWrapper>

        <BurgerButton isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <header
        className={
          "bg-white scrollbar-thin scrollbar-thumb-primary-900 scrollbar-track-transparent fixed top-0 z-40 pt-[120px] flex h-[100dvh] w-full overflow-y-auto pr-0 " +
          (isOpen ? "left-0" : "-left-full")
        }
      >
        <nav className="w-full rounded-xl px-8">
          <ul className="w-full flex flex-col pb-10">
            {menus.map((menu) => {
              const isActiveMenu = pathname === menu.href;
              return (
                <li key={menu.id} className="w-full border-b">
                  <a
                    key={menu.id}
                    href={menu.href}
                    className={classNames(
                      "flex justify-start items-center !text-left text-primary-600 hover:bg-primary-600/20 w-full py-4 text-lg transition-all duration-100 ease-in-out",
                      {
                        "!text-primary-900 font-bold": isActiveMenu,
                      }
                    )}
                  >
                    {menu.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <FlexWrapper gap={4} items="center">
            <Button
              variant="outline"
              classes="flex-1"
              onClick={() => navigate("/login")}
            >
              로그인
            </Button>
            <Button
              variant="contain"
              classes="flex-1"
              onClick={() => navigate("/login")}
            >
              문의하기
            </Button>
          </FlexWrapper>
        </nav>
      </header>
    </>
  );
}
