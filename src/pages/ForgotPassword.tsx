import { useState } from "react";
import TextInput from "@/components/TextInput";
import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Button from "@/components/Button";
import Logo from "@/assets/image/effice_logo_t.png";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAlert } from "@/components/AlertProvider";
import { motion, AnimatePresence } from "framer-motion";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false); // 메일 발송 완료 여부
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (!value) {
      setError("");
      return;
    }
    setError(validateEmail(value) ? "" : "이메일 형식이 올바르지 않습니다.");
  };

  const handleResetRequest = async () => {
    if (!validateEmail(email)) {
      setError("이메일 형식이 올바르지 않습니다.");
      return;
    }

    setLoading(true);

    // redirectTo: 메일 클릭 시 이동할 페이지 주소 (비밀번호 변경 페이지)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setLoading(false);
      showAlert("재설정 메일 발송에 실패했습니다. 이메일을 확인해 주세요.", {
        type: "danger",
        durationMs: 3000,
      });
      return;
    }

    setLoading(false);
    setIsSent(true);
    showAlert("비밀번호 재설정 링크가 이메일로 발송되었습니다.", {
      type: "success",
      durationMs: 5000,
    });
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
            비밀번호 재설정
          </Typography>

          {!isSent ? (
            <>
              <Typography variant="B2" classes="text-gray-600 mb-2">
                가입하신 이메일 주소를 입력하시면
                <br />
                비밀번호 재설정 링크를 보내드립니다.
              </Typography>

              <TextInput
                label="이메일"
                id="Email"
                classes="w-full"
                type="text"
                autoFocus={true}
                error={!!error}
                errorMsg={error}
                onChange={handleEmailChange}
                onKeyUp={(e) => {
                  if (e.key === "Enter") handleResetRequest();
                }}
              />

              <Button
                classes="w-full"
                color="primary"
                variant="contain"
                size="lg"
                onClick={handleResetRequest}
                disabled={!email || !!error}
              >
                재설정 링크 보내기
              </Button>
            </>
          ) : (
            <div className="w-full py-6 text-center bg-gray-50 rounded-lg">
              <Typography
                variant="B1"
                classes="text-primary-900 font-bold mb-2"
              >
                메일 발송 완료!
              </Typography>
              <Typography variant="B2" classes="text-gray-600">
                {email}로 발송된
                <br /> 확인 링크를 클릭해 주세요.
              </Typography>
            </div>
          )}

          <Button
            classes="w-full"
            variant="outline"
            size="lg"
            onClick={() => navigate("/login")}
          >
            로그인 페이지로 돌아가기
          </Button>
        </FlexWrapper>
      </FlexWrapper>

      {/* 로더 로직 동일 유지 */}
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

export default ForgotPassword;
