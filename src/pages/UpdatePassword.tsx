import { useState, useEffect } from "react"; // useEffect 추가
import TextInput from "@/components/TextInput";
import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Button from "@/components/Button";
import Logo from "@/assets/image/effice_logo_t.png";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAlert } from "@/components/AlertProvider";
import { motion, AnimatePresence } from "framer-motion";

function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false); // 세션 준비 상태 추가
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // 1. 페이지 진입 시 세션 확인 및 대기 로직 추가
  useEffect(() => {
    const checkSession = async () => {
      // 현재 이미 세션이 잡혀있는지 확인
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setIsSessionReady(true);
        return;
      }

      // 세션이 없다면 URL 토큰이 세션으로 전환되는 이벤트를 감시
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        // PASSWORD_RECOVERY 이벤트나 세션이 생기면 준비 완료
        if (
          event === "PASSWORD_RECOVERY" ||
          (event === "SIGNED_IN" && session)
        ) {
          setIsSessionReady(true);
        }
      });

      return () => subscription.unsubscribe();
    };

    checkSession();
  }, []);

  const validatePassword = (value: string) => {
    const regex = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (!value) {
      setErrors((prev) => ({ ...prev, password: "" }));
      return;
    }
    setErrors((prev) => ({
      ...prev,
      password: validatePassword(value)
        ? ""
        : "영문 소문자, 숫자, 특수문자를 포함해야 합니다.",
    }));
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (!value) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      return;
    }
    setErrors((prev) => ({
      ...prev,
      confirmPassword:
        value === password ? "" : "비밀번호가 일치하지 않습니다.",
    }));
  };

  const handleSubmit = async () => {
    // 세션이 아직 준비되지 않았을 경우 방어 코드
    if (!isSessionReady) {
      showAlert("인증 세션을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.", {
        type: "warning",
      });
      return;
    }

    if (!validatePassword(password) || password !== confirmPassword) {
      showAlert("입력하신 비밀번호를 다시 확인해 주세요.", { type: "danger" });
      return;
    }

    setLoading(true);

    // 다시 한번 최신 세션을 강제로 확인 (동기화 보장)
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      showAlert(
        "인증 세션이 만료되었습니다. 다시 재설정 메일을 요청해 주세요.",
        { type: "danger" }
      );
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setLoading(false);
      // 구체적인 에러 메시지를 로그에 찍어 확인
      console.error("Update User Error:", error);
      showAlert(`비밀번호 변경 실패: ${error.message}`, {
        type: "danger",
        durationMs: 3000,
      });
      return;
    }

    setLoading(false);
    showAlert(
      "비밀번호가 성공적으로 변경되었습니다. 새로운 비밀번호로 로그인해 주세요.",
      {
        type: "success",
        durationMs: 3000,
      }
    );

    // 변경 성공 후 로그아웃 처리 (안전한 재로그인을 위해)
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="w-full h-screen justify-evenly flex flex-col gap-4 items-center">
      <FlexWrapper
        gap={2}
        items="start"
        direction="col"
        classes="w-[90%] sm:w-[400px] mt-[-60px]"
      >
        <a href="/">
          <img src={Logo} alt="Logo" className="w-[60px] pb-4" />
        </a>

        <FlexWrapper gap={4} items="start" direction="col" classes="w-full">
          <Typography variant="H3" classes="mb-2">
            새 비밀번호 설정
          </Typography>
          <Typography variant="B2" classes="text-gray-600 mb-4">
            {!isSessionReady
              ? "인증 정보를 확인하고 있습니다..."
              : "보안을 위해 새로운 비밀번호를 입력해 주세요."}
          </Typography>

          <div className="flex flex-col w-full items-center gap-[20px] mb-4">
            <TextInput
              label="새 비밀번호"
              tooltip="영문 소문자, 숫자, 특수문자를 포함해야 합니다."
              id="NewPassword"
              classes="w-full"
              type="password"
              autoFocus={true}
              error={!!errors.password}
              errorMsg={errors.password}
              onChange={handlePasswordChange}
              onKeyUp={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
            <TextInput
              label="비밀번호 확인"
              id="ConfirmPassword"
              classes="w-full"
              type="password"
              error={!!errors.confirmPassword}
              errorMsg={errors.confirmPassword}
              onChange={handleConfirmPasswordChange}
              onKeyUp={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
          </div>

          <Button
            classes="w-full"
            color="primary"
            variant="contain"
            size="lg"
            onClick={handleSubmit}
            disabled={
              !isSessionReady || // 세션 준비 안되면 비활성화
              !password ||
              !confirmPassword ||
              !!errors.password ||
              !!errors.confirmPassword
            }
          >
            비밀번호 변경 완료
          </Button>
        </FlexWrapper>
      </FlexWrapper>

      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
          >
            <div className="w-10 h-10 border-4 border-primary-900 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UpdatePassword;
