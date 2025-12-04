import { useState } from "react";
import FlexWrapper from "@/layout/FlexWrapper";
import Label from "@/components/Label";
import TextInput from "@/components/TextInput";
import Textarea from "@/components/TextArea";
import Button from "@/components/Button";
import { useAlert } from "@/components/AlertProvider";

export default function InquiryDialogBody({
  onSubmit,
}: {
  onSubmit: (data: any) => void;
}) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [content, setContent] = useState("");
  const { showAlert } = useAlert();
  const formatPhone = (value: string) => {
    // 숫자만 남김
    const numbers = value.replace(/\D/g, "");

    // 010-1234-5678 포맷
    if (numbers.length < 4) return numbers;
    if (numbers.length < 8) return numbers.replace(/(\d{3})(\d+)/, "$1-$2");

    return numbers.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
  };
  const handleSubmit = () => {
    if (!phone.trim()) {
      showAlert("연락처를 입력해주세요.", { type: "danger" });
      return;
    }
    if (!name.trim()) {
      showAlert("담당자명을 입력해주세요.", { type: "danger" });
      return;
    }
    if (!content.trim()) {
      showAlert("문의 내용을 입력해주세요.", { type: "danger" });
      return;
    }

    onSubmit({ phone, name, position, content });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <FlexWrapper gap={2} items="center">
        <div className="shrink-0 !w-[60px]">
          <Label text="연락처" required />
        </div>
        <TextInput
          inputProps={{ value: phone, maxLength: 13 }}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          placeholder="010-1234-5678"
        />
      </FlexWrapper>

      <FlexWrapper gap={2} items="center">
        <div className="shrink-0 !w-[60px]">
          <Label text="담당자명" required />
        </div>
        <TextInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동"
        />
      </FlexWrapper>

      <FlexWrapper gap={2} items="center">
        <div className="shrink-0 !w-[60px]">
          <Label text="직책" />
        </div>
        <TextInput
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="인사총괄"
        />
      </FlexWrapper>

      <FlexWrapper gap={2} items="start">
        <div className="shrink-0 !w-[60px] pt-2">
          <Label text="문의내용" required />
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="문의 내용을 간단히 적어주세요"
        />
      </FlexWrapper>

      <Button
        variant="contain"
        color="green"
        size="lg"
        classes="w-full mt-2"
        onClick={handleSubmit}
      >
        문의 보내기
      </Button>
    </div>
  );
}
