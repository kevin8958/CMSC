import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import { useNavigate } from "react-router-dom";
import { useAlert } from "@/components/AlertProvider";

function SignupInvite() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateNickname = (v: string) => {
    const regex = /^[a-zA-Z0-9가-힣]{2,20}$/;
    return regex.test(v);
  };
  // 영소문자 + 숫자 + 특수문자 포함 최소 8자
  const validatePassword = (value: string) => {
    const regex = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(value);
  };

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const params = new URLSearchParams(hash);

    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    console.log(params, access_token, refresh_token);

    if (!access_token || !refresh_token) {
      showAlert("초대 링크가 만료되었거나 유효하지 않습니다.", {
        type: "danger",
      });
      return;
    }

    supabase.auth.setSession({
      access_token,
      refresh_token,
    });
  }, []);

  const handleSubmit = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      showAlert("세션이 없습니다. 초대 링크가 만료됐습니다.", {
        type: "danger",
      });
      return;
    }

    //  update
    const { error } = await supabase.auth.updateUser({
      password,
      data: { nickname },
    });
    await supabase
      .from("profiles")
      .update({ nickname })
      .eq("id", session.user.id);

    await fetch("/api/member-join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session.user.id }),
    });

    if (error) {
      showAlert(error.message, { type: "danger" });
      return;
    }

    showAlert("가입이 완료되었습니다.", { type: "success" });
    navigate("/dashboard");
  };

  const onPasswordChange = (v: string) => {
    setPassword(v);
    if (!v) {
      setPasswordError("");
      return;
    }
    if (!validatePassword(v)) {
      setPasswordError("영문 소문자, 숫자, 특수문자를 포함해야 합니다.");
    } else {
      setPasswordError("");
    }
  };

  const onNicknameChange = (v: string) => {
    setNickname(v);
    if (!v) {
      setNicknameError("");
      return;
    }
    if (!validateNickname(v)) {
      setNicknameError("한글/영문/숫자 2~20자, 공백/특수문자 불가");
    } else {
      setNicknameError("");
    }
  };

  const isFormValid =
    validatePassword(password) &&
    password.length >= 8 &&
    password === passwordConfirm &&
    validateNickname(nickname);

  return (
    <FlexWrapper
      direction="col"
      items="center"
      justify="center"
      classes="w-full h-screen gap-6 px-4"
    >
      <Typography variant="H3" classes="text-center">
        EFFICE 가입
      </Typography>

      <div className="w-full max-w-[360px] flex flex-col gap-4">
        <TextInput
          label="닉네임"
          id="nickname"
          type="text"
          error={!!nicknameError}
          errorMsg={nicknameError}
          onChange={(e) => onNicknameChange(e.target.value)}
        />
        <TextInput
          label="비밀번호"
          id="password"
          type="password"
          error={!!passwordError}
          errorMsg={passwordError}
          onChange={(e) => onPasswordChange(e.target.value)}
        />

        <TextInput
          label="비밀번호 확인"
          id="passwordConfirm"
          type="password"
          error={passwordConfirm.length > 0 && password !== passwordConfirm}
          errorMsg="비밀번호가 일치하지 않습니다."
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />

        <Button
          variant="contain"
          size="lg"
          classes="w-full mt-4"
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          가입 완료
        </Button>
      </div>
    </FlexWrapper>
  );
}

export default SignupInvite;
