import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Alert from "@/components/Alert";

type AlertState = "danger" | "success" | "info" | "warning";
type ShowAlertOptions = {
  type?: AlertState;
  durationMs?: number;
  classes?: string;
};

type AlertContextValue = {
  showAlert: (message: string, opts?: ShowAlertOptions) => void;
  hideAlert: () => void;
};

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [type, setType] = useState<AlertState>("info");
  const [classes, setClasses] = useState<string>("");
  const [key, setKey] = useState<number>(0); // re-mount용 (애니메이션 재생)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const hideAlert = () => {
    clearTimer();
    setVisible(false);
  };

  const showAlert = (msg: string, opts?: ShowAlertOptions) => {
    clearTimer();
    setMessage(msg);
    setType(opts?.type ?? "info");
    setClasses(opts?.classes ?? "");
    setKey((k) => k + 1);
    setVisible(true);

    const duration = opts?.durationMs ?? 3000;
    if (duration > 0) {
      timerRef.current = setTimeout(() => setVisible(false), duration);
    }
  };

  useEffect(() => () => clearTimer(), []);

  const value = useMemo<AlertContextValue>(
    () => ({ showAlert, hideAlert }),
    []
  );

  return (
    <AlertContext.Provider value={value}>
      {children}

      {visible &&
        createPortal(
          <div key={key} className="z-[9999]">
            <Alert
              classes={`!w-[60%] !fixed top-2 left-1/2 -translate-x-1/2 transition-all duration-500 ease-out animate-slide-down ${classes}`}
              variant="contain"
              state={type}
              title={message}
              time={3}
              onClose={hideAlert}
            />
          </div>,
          document.body
        )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx)
    throw new Error(
      "useAlert는 <AlertProvider> 내부에서만 사용할 수 있습니다."
    );
  return ctx;
}
