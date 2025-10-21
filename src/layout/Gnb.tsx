"use client";

import GnbButton from "@/layout/GnbButton";
import FlexWrapper from "./FlexWrapper";
import { useEffect, useState } from "react";
import classNames from "classnames";

export default function Gnb() {
  const [scrolled, setScrolled] = useState(false);

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
        "fixed top-4 left-1/2 z-50 flex w-full -translate-x-1/2 items-center justify-between rounded-full bg-white px-[32px] py-4 transition-all duration-300 ease-in-out border border-transparent",
        scrolled
          ? "max-w-[1160px] !border-primary-100 shadow-custom-dark"
          : "max-w-[1200px]"
      )}
    >
      <FlexWrapper gap={4} items="center">
        <a href="/" className="font-extrabold text-2xl">
          CMSC
        </a>
        <GnbButton href="/">CMSC소개</GnbButton>
        <GnbButton href="/">이용사례</GnbButton>
        <GnbButton href="/">요금제</GnbButton>
        <GnbButton href="/">리소스</GnbButton>
      </FlexWrapper>

      <FlexWrapper gap={4} items="center">
        <GnbButton href="/login">로그인</GnbButton>
        <GnbButton href="/login">무료로 시작하기</GnbButton>
      </FlexWrapper>
    </div>
  );
}
