import { useEffect, useState } from "react";
import TextInput from "@/components/TextInput";
import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import LogoBlack from "@/assets/image/logo_black.png";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
    },
    onError: () => console.log("Login Failed"),
  });

  const login = async () => {
    if (isError) return;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setIsError(true);
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="w-full h-screen justify-evenly flex flex-col gap-4 items-center">
      <FlexWrapper
        gap={10}
        items="start"
        direction="col"
        classes="w-[90%] sm:w-[400px] mt-[-60px]"
      >
        <a href="/">
          <img src={LogoBlack} alt="CMSC Logo" className="w-[60px]" />
        </a>
        <FlexWrapper gap={4} items="start" direction="col" classes="w-full">
          <Button
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
          </div>
          <TextInput
            label="이메일"
            id="Email"
            classes="w-full"
            type="text"
            max={100}
            autoFocus={false}
            onFocus={() => console.log("Input focused")}
            onBlur={() => console.log("Input blurred")}
            onKeyUp={(e) => console.log("Key pressed:", e.key)}
            onChange={(e) => setEmail(e.target.value)}
            inputProps={{ "aria-label": "Default Text Input" }}
          />
          <TextInput
            label="비밀번호"
            id="Password"
            classes="w-full"
            type="password"
            max={100}
            autoFocus={false}
            onFocus={() => console.log("Input focused")}
            onBlur={() => console.log("Input blurred")}
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={(e) => console.log("Key pressed:", e.key)}
            inputProps={{ "aria-label": "Default Text Input" }}
          />
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
            onClick={login}
          >
            로그인
          </Button>
        </FlexWrapper>
      </FlexWrapper>
      {isError && (
        <Alert
          classes="!w-[60%] !fixed top-2 left-1/2 -translate-x-1/2"
          variant="contain"
          state="danger"
          title="이메일 또는 비밀번호가 올바르지 않습니다."
          time={3}
          onClose={() => setIsError(false)}
        />
      )}
    </div>
  );
}

export default Login;
