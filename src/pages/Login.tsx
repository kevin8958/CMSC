import { useState } from "react";
import TextInput from "@/components/TextInput";
import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Button from "@/components/Button";
import Logo from "@/assets/image/effice_logo_t.png";
// import { FcGoogle } from "react-icons/fc";
// import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAlert } from "@/components/AlertProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // const googleLogin = useGoogleLogin({
  //   onSuccess: (tokenResponse) => {
  //     console.log(tokenResponse);
  //   },
  //   onError: () => console.log("Login Failed"),
  // });

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const validatePassword = (value: string) => {
    // 영어 소문자 + 숫자 + 특수문자 포함, 최소 8자
    const regex = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (!value) {
      setErrors((prev) => ({
        ...prev,
        email: "",
      }));
      return;
    }
    setErrors((prev) => ({
      ...prev,
      email: validateEmail(value) ? "" : "이메일 형식이 올바르지 않습니다.",
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (!value) {
      setErrors((prev) => ({
        ...prev,
        password: "",
      }));
      return;
    }
    setErrors((prev) => ({
      ...prev,
      password: validatePassword(value)
        ? ""
        : "영문 소문자, 숫자, 특수문자를 포함해야 합니다.",
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      showAlert("이메일 또는 비밀번호가 올바르지 않습니다.", {
        type: "danger",
        durationMs: 3000,
      });
      return;
    }
    if (data) {
      // 1) auth user 저장
      useAuthStore.getState().setUser(data.user);

      // 2) role 불러오기
      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (!pErr && profile) {
        useAuthStore.getState().setRole(profile.role);
      }

      // 3) 라우팅
      navigate(profile?.role === "super_admin" ? "/company" : "/dashboard");
      setLoading(false);
    }
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
          <img src={Logo} alt="USP Logo" className="w-[60px] pb-4" />
        </a>
        <FlexWrapper gap={4} items="start" direction="col" classes="w-full">
          {/* <Button
            classes="w-full"
            variant="outline"
            size="lg"
            onClick={() => {
              localStorage.removeItem("_s_pat__");
              localStorage.removeItem("_s_prt__");
              googleLogin();
            }}
            disabled={navigator.userAgent.indexOf("KAKAO") > -1}
          >
            <FlexWrapper gap={2} items="center">
              <FcGoogle className="text-[24px]" />
              <p className="text-sm font-normal text-[#383838]">
                Google 계정으로 로그인
              </p>
            </FlexWrapper>
          </Button>
          <div className="flex w-full items-center gap-4">
            <span className="h-px flex-1 bg-gray-200" />
            <p className="my-2 text-sm text-gray-400">OR</p>
            <span className="h-px flex-1 bg-gray-200" />
          </div> */}
          <div className="flex flex-col w-full items-center gap-[20px] mb-2">
            <TextInput
              label="이메일"
              id="Email"
              classes="w-full"
              type="text"
              max={100}
              autoFocus={true}
              error={!!errors.email}
              errorMsg={errors.email}
              onChange={handleEmailChange}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              inputProps={{ "aria-label": "Default Text Input" }}
            />
            <TextInput
              label="비밀번호"
              tooltip="영문 소문자, 숫자, 특수문자를 포함해야 합니다."
              id="Password"
              classes="w-full"
              type="password"
              max={100}
              autoFocus={false}
              error={!!errors.password}
              errorMsg={errors.password}
              onChange={handlePasswordChange}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              inputProps={{ "aria-label": "Default Text Input" }}
            />
          </div>
          <FlexWrapper justify="between" items="center" classes="w-full">
            <Typography variant="B2" classes="!font-normal">
              비밀번호를 잊으셨나요?
            </Typography>
            <a
              href="/"
              className="font-semibold text-sm text-primary-900 underline"
            >
              비밀번호 재설정
            </a>
          </FlexWrapper>
          <Button
            classes="w-full"
            color="primary"
            variant="contain"
            size="lg"
            onClick={handleSubmit}
          >
            로그인
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
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
          >
            <motion.div
              className="flex flex-col items-center justify-center"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
            >
              <motion.div
                className="w-10 h-10 border-4 border-primary-900 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Login;
