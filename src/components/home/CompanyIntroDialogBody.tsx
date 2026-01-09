import { useState } from "react";
import FlexWrapper from "@/layout/FlexWrapper";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox"; // ✅ Checkbox 컴포넌트 추가
import Typography from "@/foundation/Typography"; // ✅ Typography 추가
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
  const [isAgreed, setIsAgreed] = useState(false); // ✅ 동의 상태 추가

  const [form, setForm] = useState({
    clinic_name: "",
    position: "",
    name: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length < 4) return numbers;
    if (numbers.length < 8) return numbers.replace(/(\d{3})(\d+)/, "$1-$2");
    return numbers.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
  };

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
    }

    // 3. 연락처 길이 검증
    if (form.phone.length < 12) {
      setErrors((prev) => ({
        ...prev,
        phone: "연락처를 정확히 입력해주세요.",
      }));
      return;
    }

    // ✅ 4. 개인정보 동의 여부 확인
    if (!isAgreed) {
      showAlert("개인정보 수집 및 이용에 동의해주세요.", { type: "danger" });
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

      {/* ✅ 개인정보 동의 섹션 추가 */}
      <div className="flex flex-col gap-1.5 mt-2 py-3 border-t border-gray-100">
        <Checkbox
          id="intro-agree"
          checked={isAgreed}
          onChange={() => setIsAgreed(!isAgreed)}
          label="(필수) 개인정보 수집 및 이용에 동의합니다"
        />
        <Typography variant="B2" classes="text-gray-400 ml-7">
          * 동의하지 않는 경우 상담이 어려울 수 있습니다
        </Typography>
      </div>

      <Button
        variant="contain"
        color="green"
        size="lg"
        classes="w-full !py-4 !text-lg shadow-md"
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? "전송 중..." : "회사소개서 요청하기"}
      </Button>
    </div>
  );
}
