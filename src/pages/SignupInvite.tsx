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

  // 중복 클릭 방지를 위한 로딩 상태
  const [submitting, setSubmitting] = useState(false);

  const validateNickname = (v: string) => {
    const regex = /^[a-zA-Z0-9가-힣]{2,20}$/;
    return regex.test(v);
  };

  const validatePassword = (value: string) => {
    const regex = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(value);
  };

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) return;

    supabase.auth
      .setSession({ access_token, refresh_token })
      .then(() => {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async () => {
    if (submitting) return; // 이미 제출 중이면 차단

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      showAlert("세션이 없습니다. 초대 링크가 만료됐습니다.", {
        type: "danger",
      });
      return;
    }

    setSubmitting(true);

    try {
      // 1. Auth User MetaData 업데이트 (display_name 필드 사용)
      const { error: authError } = await supabase.auth.updateUser({
        password,
        data: { display_name: nickname }, // nickname을 display_name으로 저장
      });

      if (authError) throw authError;

      // 2. profiles 테이블 동기화
      // DB의 profiles 테이블 컬럼명도 display_name으로 맞추는 것을 추천합니다.
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ display_name: nickname })
        .eq("id", session.user.id);

      if (profileError) throw profileError;

      // 3. 백엔드 가입 처리
      const res = await fetch("/api/member-join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });

      if (!res.ok) throw new Error("멤버 정보 업데이트에 실패했습니다.");

      showAlert("가입이 완료되었습니다.", { type: "success" });
      navigate("/dashboard");
    } catch (error: any) {
      showAlert(error.message || "오류가 발생했습니다.", { type: "danger" });
    } finally {
      setSubmitting(false);
    }
  };

  const onPasswordChange = (v: string) => {
    setPassword(v);
    if (!v) {
      setPasswordError("");
      return;
    }
    setPasswordError(
      validatePassword(v)
        ? ""
        : "영문 소문자, 숫자, 특수문자를 포함해야 합니다."
    );
  };

  const onNicknameChange = (v: string) => {
    setNickname(v);
    if (!v) {
      setNicknameError("");
      return;
    }
    setNicknameError(
      validateNickname(v) ? "" : "한글/영문/숫자 2~20자, 공백/특수문자 불가"
    );
  };

  const isFormValid =
    validatePassword(password) &&
    password === passwordConfirm &&
    validateNickname(nickname) &&
    !submitting;

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
          label="닉네임 (표시 이름)"
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
          {submitting ? "처리 중..." : "가입 완료"}
        </Button>
      </div>
    </FlexWrapper>
  );
}

export default SignupInvite;
