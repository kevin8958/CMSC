import { useEffect, useState } from "react";
import Drawer from "@/components/Drawer";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Label from "@/components/Label";
import TextInput from "@/components/TextInput";
import Textarea from "@/components/TextArea";
import CustomDatePicker from "@/components/DatePicker";
import dayjs from "dayjs";
import ChecklistComments from "./ChecklistComments";

interface ChecklistItem {
  id: string;
  company_id: string;
  title: string;
  description: string | null;
  due_date: string | null; // DB에서는 date지만, 클라이언트에선 string으로 받는 패턴이면 string
  sort_index: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}
interface ChecklistDrawerProps {
  open: boolean;
  mode: "create" | "edit";
  item: ChecklistItem | null;
  disabled?: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string | null;
    due_date?: string | null;
  }) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function ChecklistDrawer({
  open,
  mode,
  item,
  disabled = false,
  onClose,
  onSubmit,
  onDelete,
}: ChecklistDrawerProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [errors, setErrors] = useState({ title: "" });

  useEffect(() => {
    if (item) {
      // 수정 모드
      setTitle(item.title);
      setDescription(item.description || "");
      setDueDate(item.due_date ? dayjs(item.due_date).toDate() : new Date());
    } else {
      // 생성 모드
      setTitle("");
      setDescription("");
      setDueDate(new Date());
    }
    setErrors({ title: "" });
  }, [item, open]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setErrors({ title: "제목은 필수 입력사항입니다." });
      return;
    }

    await onSubmit({
      title: title.trim(),
      description: description || null,
      due_date: dueDate ? dayjs(dueDate).format("YYYY-MM-DD") : null,
    });
  };

  return (
    <Drawer
      open={open}
      title={
        <Typography variant="H4">
          {mode === "create" ? "체크리스트 추가" : "체크리스트 수정"}
        </Typography>
      }
      showFooter={!disabled}
      confirmText={mode === "create" ? "추가하기" : "수정하기"}
      deleteText="삭제"
      onClose={onClose}
      onCancel={onClose}
      onDelete={onDelete}
      onConfirm={handleSubmit}
    >
      <FlexWrapper direction="col" gap={4} classes="pt-4 pb-6 px-4">
        {/* 제목 */}
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 !w-[60px]">
            <Label text="제목" required />
          </div>
          <TextInput
            classes="!text-sm !h-[42px]"
            inputProps={{ value: title }}
            disabled={disabled}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            errorMsg={errors.title}
            placeholder="제목을 입력하세요"
          />
        </FlexWrapper>

        {/* 마감기한 */}
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 !w-[60px]">
            <Label text="기한" />
          </div>
          <CustomDatePicker
            classes="w-[140px]"
            type="single"
            variant="outline"
            size="md"
            dateFormat="yyyy.MM.dd"
            disabled={disabled}
            value={dueDate}
            onChange={(date) => setDueDate(date)}
          />
        </FlexWrapper>

        {/* 설명 */}
        <FlexWrapper items="start" gap={2}>
          <div className="shrink-0 !w-[60px] pt-2">
            <Label text="설명" />
          </div>
          <Textarea
            value={description}
            disabled={disabled}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="설명을 입력하세요"
          />
        </FlexWrapper>
      </FlexWrapper>
      {mode === "edit" && item?.id && (
        <ChecklistComments checklistId={item.id} />
      )}
    </Drawer>
  );
}
