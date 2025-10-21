import TextInput from "@/components/TextInput";
import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Button from "@/components/Button";
import LogoBlack from "@/assets/image/logo_black.png";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

function Login() {
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
    },
    onError: () => console.log("Login Failed"),
  });
  return (
    <div className="w-full h-screen justify-evenly flex flex-col gap-4 items-center">
      <FlexWrapper
        gap={10}
        items="start"
        direction="col"
        classes="w-[90%] sm:w-[400px]"
      >
        <a href="/" className="font-extrabold text-2xl">
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
            onKeyUp={(e) => console.log("Key pressed:", e.key)}
            inputProps={{ "aria-label": "Default Text Input" }}
          />
          <FlexWrapper justify="between" items="center" classes="w-full">
            <Typography variant="B2" classes="!text-primary-900 !font-normal">
              비밀번호를 잊으셨나요?
            </Typography>
            <a
              href="/"
              className="font-semibold text-sm text-primary-900 underline"
            >
              비밀번호 재설정
            </a>
          </FlexWrapper>
          <Button classes="w-full" color="primary" variant="contain" size="lg">
            로그인
          </Button>
          <Button classes="w-full" color="primary" variant="outline" size="lg">
            회원가입
          </Button>
        </FlexWrapper>
      </FlexWrapper>
    </div>
  );
}

export default Login;
