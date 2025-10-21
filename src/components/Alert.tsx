"use client";

import { useEffect, useState, useRef } from "react";
import classNames from "classnames";
import {
  LuCircleAlert,
  LuInfo,
  LuCircleX,
  LuCircleCheck,
} from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import Typography from "../foundation/Typography";

/**
 * 상태별 아이콘 매핑
 */
const ICONS: Record<Common.AlertState, any> = {
  danger: <LuCircleX className="text-lg" />,
  warning: <LuCircleAlert className="text-lg" />,
  info: <LuInfo className="text-lg" />,
  success: <LuCircleCheck className="text-lg" />,
};

/**
 * variant + state 조합별 색상 클래스 매핑
 */
const COLOR_CLASSES: Record<
  Common.AlertVariant,
  Record<Common.AlertState, string>
> = {
  contain: {
    danger: "bg-danger text-primary-100",
    warning: "bg-warning text-primary-100",
    info: "bg-info text-primary-100",
    success: "bg-success text-primary-100",
  },
  outline: {
    danger: "text-danger border border-danger bg-transparent",
    warning: "text-warning border border-warning bg-transparent",
    info: "text-info border border-info bg-transparent",
    success: "text-success border border-success bg-transparent",
  },
};

const Alert = (props: Common.AlertProps) => {
  const {
    classes,
    variant = "contain",
    state = "info",
    title,
    message,
    showClose = false,
    time,
    repeat = false,
    loading,
    icon,
    hideIcon = false,
    onClose,
  } = props;
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100); // 게이지 진행률(%)
  const manualClosedRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  /** 수동 닫기 */
  const handleClose = () => {
    manualClosedRef.current = true;
    setVisible(false);
    onClose?.();
  };

  const startTimer = () => {
    if (!time) return;
    const total = time * 1000;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.max(0, 100 - (elapsed / total) * 100);
      setProgress(pct);

      if (elapsed >= total) {
        setVisible(false);
        onClose?.();
        return;
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (!time || !visible) return;

    startTimer();
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [time, visible]);

  useEffect(() => {
    if (!repeat || visible || manualClosedRef.current) return;

    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    setProgress(100);
    setVisible(true);
  }, [repeat, visible]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      className={classNames(
        "ti-toast oveflow-hidden relative flex w-max max-w-full items-start justify-between rounded-lg p-4 text-sm shadow-md",
        COLOR_CLASSES[variant][state],
        classes
      )}
    >
      <div className="flex items-start gap-2">
        <div className="mt-[2px]">
          {!hideIcon && !loading && (icon ? icon : ICONS[state])}
          {!hideIcon && loading && (
            <motion.div
              className="size-4 rounded-full border-[3px] border-white border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 1,
              }}
            />
          )}
        </div>
        <div className="flex flex-col">
          {title && <Typography variant="H4">{title}</Typography>}
          {message && <Typography variant="B2">{message}</Typography>}
        </div>
      </div>

      {/* 닫기 버튼 */}
      {showClose && (
        <button
          type="button"
          aria-label="close-alert"
          onClick={handleClose}
          className="ml-4 shrink-0"
        >
          <IoClose className="text-lg" />
        </button>
      )}

      {/* 게이지 바 */}
      {time && (
        <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-lg bg-current/20">
          <div
            className="h-full bg-current transition-[width] duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default Alert;
