import { useState } from "react";
import FlexWrapper from "@/layout/FlexWrapper";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import { useAlert } from "@/components/AlertProvider";
import { useDialog } from "@/hooks/useDialog";

export default function CompanyIntroDialogBody({
  onSubmit,
}: {
  onSubmit: (data: any) => Promise<void>;
}) {
  const { showAlert } = useAlert();
  const { close } = useDialog();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    clinic_name: "",
    position: "",
    name: "",
    phone: "",
    email: "",
  });

  // 에러 상태 관리
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  /** 연락처 포맷팅 (010-0000-0000) */
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length < 4) return numbers;
    if (numbers.length < 8) return numbers.replace(/(\d{3})(\d+)/, "$1-$2");
    return numbers.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
  };

  /** 이메일 형식 검증 로직 */
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    // 1. 필수 입력값 확인
    if (Object.values(form).some((val) => !val.trim())) {
      showAlert("모든 항목을 입력해주세요.", { type: "danger" });
      return;
    }

    // 2. 이메일 형식 검증
    if (!validateEmail(form.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "올바른 이메일 형식이 아닙니다.",
      }));
      showAlert("이메일 형식을 확인해주세요.", { type: "danger" });
      return;
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }

    // 3. 연락처 길이 검증 (최소 12자: 010-000-0000 이상)
    if (form.phone.length < 12) {
      setErrors((prev) => ({
        ...prev,
        phone: "연락처를 정확히 입력해주세요.",
      }));
      return;
    }

    try {
      setLoading(true);
      await onSubmit(form);
      close(true);
    } catch (e) {
      showAlert("요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", {
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <TextInput
        label="의료기관명"
        required
        placeholder="예: 에피스병원"
        value={form.clinic_name}
        onChange={(e) => setForm({ ...form, clinic_name: e.target.value })}
      />
      <FlexWrapper gap={4}>
        <TextInput
          label="이름"
          required
          classes="flex-1"
          placeholder="홍길동"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextInput
          label="직책"
          required
          classes="flex-1"
          placeholder="원장"
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        />
      </FlexWrapper>

      <TextInput
        label="연락처"
        required
        placeholder="010-0000-0000"
        value={form.phone}
        error={!!errors.phone}
        errorMsg={errors.phone}
        inputProps={{ maxLength: 13 }}
        onChange={(e) => {
          setForm({ ...form, phone: formatPhone(e.target.value) });
          if (errors.phone) setErrors({ ...errors, phone: "" });
        }}
      />

      <TextInput
        label="이메일"
        required
        type="email"
        placeholder="example@email.com"
        value={form.email}
        error={!!errors.email}
        errorMsg={errors.email}
        onChange={(e) => {
          setForm({ ...form, email: e.target.value });
          if (errors.email) setErrors({ ...errors, email: "" });
        }}
      />

      <Button
        variant="contain"
        color="green"
        size="lg"
        classes="w-full mt-2 !py-4 !text-lg"
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? "전송 중..." : "회사소개서 요청하기"}
      </Button>
    </div>
  );
}
