import { useDialog } from "@/hooks/useDialog";
import { useAlert } from "@/components/AlertProvider";
import { useState } from "react";
import FlexWrapper from "@/layout/FlexWrapper";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import { useIncomeStore } from "@/stores/useIncomeStore";

export default function AddCogsDialogBody() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);

  const { close } = useDialog();
  const { showAlert } = useAlert();
  const { createCogs } = useIncomeStore();
  const onSubmit = async () => {
    await createCogs(name, amount);
    showAlert(`매출원가가 추가되었습니다.`, {
      type: "success",
      durationMs: 3000,
    });
    close(true);
  };

  return (
    <FlexWrapper direction="col" gap={4} classes="w-full">
      <TextInput
        label="이름"
        id="name"
        classes="w-full"
        onChange={(e) => setName(e.target.value)}
      />
      <TextInput
        label="비용"
        type="number"
        id="amount"
        classes="w-full"
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <Button
        size="lg"
        variant="contain"
        color="green"
        classes="w-full"
        disabled={name.trim() === ""}
        onClick={() => {
          onSubmit();
        }}
      >
        추가하기
      </Button>
    </FlexWrapper>
  );
}
