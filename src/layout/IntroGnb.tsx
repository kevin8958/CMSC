"use client";

import GnbButton from "@/layout/GnbButton";
import FlexWrapper from "./FlexWrapper";
import { useEffect, useState } from "react";
import classNames from "classnames";
import BurgerButton from "@/interaction/BurgerButton";
import LogoBlack from "@/assets/image/logo_black.png";

export default function IntroGnb() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={classNames(
        "fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center justify-between rounded-full bg-white px-[32px] py-4 transition-all duration-300 ease-in-out border sm:border-transparent",
        scrolled
          ? "max-w-[1160px] w-[calc(100%-16px)] !border-primary-100 shadow-custom-light "
          : "max-w-[1200px] w-[calc(100%-16px)] sm:w-full border-primary-100 shadow-custom-light  sm:shadow-none"
      )}
    >
      <FlexWrapper gap={4} items="center">
        <a href="/">
          <img src={LogoBlack} alt="CMSC Logo" className="w-[60px]" />
        </a>

        <FlexWrapper gap={4} items="center" classes="!hidden sm:!flex">
          <GnbButton href="/">CMSC소개</GnbButton>
          <GnbButton href="/">이용사례</GnbButton>
          <GnbButton href="/">요금제</GnbButton>
          <GnbButton href="/">리소스</GnbButton>
        </FlexWrapper>
      </FlexWrapper>

      <FlexWrapper gap={4} items="center" classes="!hidden sm:!flex">
        <GnbButton href="/login">로그인</GnbButton>
        <GnbButton href="/login">무료로 시작하기</GnbButton>
      </FlexWrapper>

      <BurgerButton isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
