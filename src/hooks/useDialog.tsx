"use client";

import FlexWrapper from "@/layout/FlexWrapper";
import Button from "@/components/Button";

import { Dialog, Transition } from "@headlessui/react";
import {
  Fragment,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import classNames from "classnames";

const DialogContext = createContext<Common.DialogContextValue | null>(null);

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used inside <DialogProvider>");
  return ctx;
}

const PANEL_BORDER: Record<Common.DialogState, string> = {
  info: "border-info border",
  success: "border-success border",
  warning: "border-warning border",
  danger: "border-danger border",
  default: "border-primary-50 border",
};

const CONFIRM_BTN: Record<Common.DialogState, string> = {
  info: "bg-info hover:bg-info/90",
  success: "bg-success hover:bg-success/90",
  warning: "bg-warning hover:bg-warning/90",
  danger: "bg-danger hover:bg-danger/90",
  default: "",
};

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<Common.DialogProps | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const close = useCallback((value: boolean = false) => {
    setIsOpen(false);
    resolver.current?.(value);
  }, []);

  const openDialog = useCallback(
    ({
      title,
      message,
      body,
      confirmText = "Confirm",
      cancelText = "Cancel",
      hideBottom = false,
      placement = "center",
      state,
      onConfirm,
    }: Common.DialogProps) => {
      setOptions({
        title,
        message,
        body,
        confirmText,
        cancelText,
        hideBottom,
        placement,
        state,
        onConfirm,
      });
      setIsOpen(true);
      return new Promise<boolean>((resolve) => {
        resolver.current = resolve;
      });
    },
    []
  );

  const placement = options?.placement ?? "center";
  const items: "start" | "center" | "end" =
    placement === "top" ? "start" : placement === "bottom" ? "end" : "center";

  const hideCancel =
    options?.state === "info" ||
    options?.state === "success" ||
    options?.cancelText === "";

  return (
    <DialogContext.Provider value={{ openDialog, close }}>
      {children}

      {/* 모달 */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[999]"
          onClose={() => close(false)}
        >
          {/* overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
          </Transition.Child>

          <FlexWrapper
            classes="fixed inset-0 p-10"
            justify="center"
            items={items}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={classNames(
                  "relative bg-white w-full max-w-md rounded-xl p-6 shadow-xl",
                  PANEL_BORDER[options?.state || "default"]
                )}
              >
                <button
                  onClick={() => close(false)}
                  aria-label="닫기"
                  className="absolute top-6 right-6 text-primary-900 hover:text-primary-600 transition-colors"
                >
                  ✕
                </button>
                <div className="space-y-4">
                  {options?.title && (
                    <Dialog.Title className="text-lg font-medium text-primary-900">
                      {options.title}
                    </Dialog.Title>
                  )}
                  {options?.body ? (
                    <>{options.body}</>
                  ) : (
                    options?.message && (
                      <p className="text-sm whitespace-pre-line text-gray-900">
                        {options.message}
                      </p>
                    )
                  )}
                </div>

                {!options?.hideBottom && (
                  <div className="w-full mt-10 flex justify-end gap-3">
                    {!hideCancel && (
                      <Button
                        variant="outline"
                        classes="min-w-[80px]"
                        onClick={() => close(false)}
                      >
                        {options?.cancelText ?? "Cancel"}
                      </Button>
                    )}
                    <Button
                      variant="contain"
                      classes={classNames(
                        "min-w-[80px]",
                        { "w-full": hideCancel },
                        options?.state && CONFIRM_BTN[options.state]
                      )}
                      color={
                        options?.state === "default"
                          ? "primary"
                          : options?.state
                      }
                      onClick={() => {
                        if (options?.onConfirm) {
                          const isConfirmed = options?.onConfirm();
                          if (isConfirmed) {
                            close(true);
                          }
                        } else {
                          close(true);
                        }
                      }}
                    >
                      {options?.confirmText ?? "Confirm"}
                    </Button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </FlexWrapper>
        </Dialog>
      </Transition>
    </DialogContext.Provider>
  );
}
