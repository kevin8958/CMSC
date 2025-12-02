import { useEffect, useState } from "react";
import Drawer from "@/components/Drawer";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Label from "@/components/Label";
import TextInput from "@/components/TextInput";
import CustomDatePicker from "@/components/DatePicker";
import Dropdown from "../Dropdown";
import { CATEGORY_CONFIG, type CategoryKey } from "@/constants/ExpenseConfigs";
import ExpenseCategoryBadge from "./ExpenseCategoryBadge";
import { useAlert } from "@/components/AlertProvider";

interface ExpenseDrawerProps {
  open: boolean;
  disabled: boolean;
  mode: "create" | "edit";
  data?: any;
  category: "fixed" | "variable" | "other"; // 현재 선택된 탭
  onClose: () => void;
  onSubmit: (data: {
    date: string;
    method: string;
    place: string;
    amount: number;
    category: "fixed" | "variable" | "other";
  }) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
}

export default function ExpenseDrawer({
  open,
  disabled,
  mode,
  data,
  category,
  onClose,
  onSubmit,
  onDelete,
}: ExpenseDrawerProps) {
  const [date, setDate] = useState<Date | null>(new Date());
  const [method, setMethod] = useState(""); // 거래수단
  const [place, setPlace] = useState("");
  const [amount, setAmount] = useState("");
  const [currentCategory, setCurrentCategory] = useState<CategoryKey>("fixed");
  const { showAlert } = useAlert();

  useEffect(() => {
    if (open && mode === "edit" && data) {
      setDate(new Date(data.date));
      setMethod(data.method);
      setPlace(data.place);
      setAmount(String(data.amount));
    } else if (open && mode === "create") {
      setDate(new Date());
      setMethod("");
      setPlace("");
      setAmount("");
    }
    setCurrentCategory(category);
  }, [open, mode, data]);

  const handleSubmit = () => {
    if (!date) {
      showAlert("날짜를 선택해주세요.", { type: "danger" });
      return;
    }
    if (!method.trim()) {
      showAlert("거래수단을 입력해주세요.", { type: "danger" });
      return;
    }
    if (!place.trim()) {
      showAlert("사용처를 입력해주세요.", { type: "danger" });
      return;
    }
    if (!amount.trim() || isNaN(Number(amount))) {
      showAlert("금액을 올바르게 입력해주세요.", { type: "danger" });
      return;
    }

    onSubmit({
      date: date.toISOString(),
      method: method.trim(),
      place: place.trim(),
      amount: Number(amount.replace(/[^0-9]/g, "")),
      category: currentCategory,
    });
  };

  return (
    <Drawer
      open={open}
      title={
        <FlexWrapper direction="row" items="center" gap={2}>
          <Typography variant="H4">
            {mode === "create"
              ? "소비내역 추가"
              : disabled
                ? "소비내역 조회"
                : "소비내역 수정"}
          </Typography>
        </FlexWrapper>
      }
      showFooter={!disabled}
      confirmText={mode === "create" ? "추가하기" : "수정하기"}
      deleteText={mode === "edit" ? "삭제" : undefined}
      cancelText="취소"
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleSubmit}
      onDelete={onDelete}
    >
      <FlexWrapper direction="col" gap={4} classes="pt-4 pb-6 px-4">
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 !w-[60px]">
            <Label text="카테고리" />
          </div>
          <Dropdown
            hideDownIcon
            itemClasses="!px-1"
            buttonVariant="clear"
            items={Object.keys(CATEGORY_CONFIG).map((currentCategory) => ({
              type: "item" as const,
              id: currentCategory,
              label: (
                <ExpenseCategoryBadge
                  category={currentCategory as CategoryKey}
                  classes="!w-[120px] justify-center"
                />
              ),
            }))}
            disabled={disabled}
            onChange={(val) => setCurrentCategory(val as CategoryKey)}
            buttonItem={
              <ExpenseCategoryBadge
                category={currentCategory}
                classes="px-4 py-1 w-[120px] justify-center"
              />
            }
            buttonClasses="!font-normal text-primary-900 !h-fit !border-primary-300 hover:!bg-primary-50 !p-0"
          />
        </FlexWrapper>
        {/* 날짜 */}
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 !w-[60px]">
            <Label text="날짜" required />
          </div>
          <CustomDatePicker
            classes="w-[120px]"
            type="single"
            disabled={disabled}
            variant="outline"
            size="sm"
            dateFormat="YYYY.MM.dd"
            value={date}
            onChange={(v) => setDate(v)}
          />
        </FlexWrapper>

        {/* 거래수단 */}
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 !w-[60px]">
            <Label text="거래수단" required />
          </div>
          <TextInput
            classes="!text-sm !h-[42px]"
            inputProps={{ value: method }}
            disabled={disabled}
            placeholder="예: 카드, 계좌이체, 현금"
            onChange={(e) => setMethod(e.target.value)}
          />
        </FlexWrapper>

        {/* 사용처 */}
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 !w-[60px]">
            <Label text="사용처" required />
          </div>
          <TextInput
            classes="!text-sm !h-[42px]"
            inputProps={{ value: place }}
            disabled={disabled}
            placeholder="예: 스타벅스"
            onChange={(e) => setPlace(e.target.value)}
          />
        </FlexWrapper>

        {/* 금액 */}
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 !w-[60px]">
            <Label text="금액" required />
          </div>
          <TextInput
            classes="!text-sm !h-[42px]"
            inputProps={{ value: amount }}
            disabled={disabled}
            placeholder="예: 15000"
            onChange={(e) => {
              // 숫자만 입력
              const filtered = e.target.value.replace(/[^0-9]/g, "");
              setAmount(filtered);
            }}
          />
        </FlexWrapper>
      </FlexWrapper>
    </Drawer>
  );
}
