import { useEffect, useState } from "react";
import Drawer from "@/components/Drawer";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Label from "@/components/Label";
import CustomDatePicker from "@/components/DatePicker";
import TextInput from "@/components/TextInput";
import Textarea from "@/components/TextArea";
import dayjs from "dayjs";
import { useAttendanceStore } from "@/stores/useAttendanceStore";

interface AttendanceDetailDrawerProps {
  record: any | null;
  onClose: () => void;
}

export default function AttendanceDetailDrawer({
  record,
  onClose,
}: AttendanceDetailDrawerProps) {
  const { updateRecord, deleteRecord } = useAttendanceStore();
  const [form, setForm] = useState(record);
  const [isOpen, setIsOpen] = useState(false);
  const [rangeValue, setRangeValue] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  useEffect(() => {
    if (record) {
      setForm(record);
      setRangeValue([record.start_date || null, record.end_date || null]);
      setIsOpen(true);
    }
  }, [record]);

  if (!form) return null;

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleClose = () => {
    onClose();
    setIsOpen(false);
  };

  const handleSave = async () => {
    await updateRecord({
      id: form.id,
      start_date: dayjs(rangeValue[0]).format("YYYY-MM-DD"),
      end_date: dayjs(rangeValue[1]).format("YYYY-MM-DD"),
      reason: form.reason,
      note: form.note,
    });
    handleClose();
  };

  const handleDelete = async () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      await deleteRecord(form.id);
      handleClose();
    }
  };

  return (
    <Drawer
      open={isOpen}
      title="연차 내역 상세"
      showFooter
      confirmText="수정하기"
      deleteText="삭제"
      cancelText="닫기"
      onConfirm={handleSave}
      onDelete={handleDelete}
      onCancel={handleClose}
      onClose={handleClose}
    >
      <FlexWrapper direction="col" gap={4} classes="p-4">
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 !w-[80px]">
            <Label text="대상자" />
          </div>
          <Typography variant="B2" classes="!font-semibold">
            {form.user_name}
          </Typography>
        </FlexWrapper>

        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 !w-[80px]">
            <Label text="기간" />
          </div>
          <CustomDatePicker
            variant="outline"
            classes="w-[200px]"
            type="range"
            value={null}
            isRange
            dateFormat="YYYY.MM.dd"
            startDate={rangeValue[0] || undefined}
            endDate={rangeValue[1] || undefined}
            onChange={(value: any) => {
              setRangeValue(value as [Date | null, Date | null]);
            }}
          />
          <Typography variant="B2" classes="text-gray-600 font-semibold">
            총 {dayjs(form.end_date).diff(dayjs(form.start_date), "day") + 1}일
          </Typography>
        </FlexWrapper>

        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 !w-[80px]">
            <Label text="사유" />
          </div>
          <TextInput
            classes="!text-sm !h-[42px] max-h-[42px]"
            inputProps={{
              value: form.reason,
            }}
            placeholder="예: 병가 / 여행 / 개인용무"
            onChange={(e) => handleChange("reason", e.target.value)}
          />
        </FlexWrapper>

        <FlexWrapper direction="col" gap={2}>
          <Label text="비고" />
          <Textarea
            value={form.note || ""}
            onChange={(e) => handleChange("note", e.target.value)}
            placeholder="메모를 입력하세요"
          />
        </FlexWrapper>
      </FlexWrapper>
    </Drawer>
  );
}
