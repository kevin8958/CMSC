import { useEffect, useState } from "react";
import Drawer from "@/components/Drawer";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Label from "@/components/Label";
import TextInput from "@/components/TextInput";
import Dropdown from "@/components/Dropdown";
import CustomDatePicker from "@/components/DatePicker";
import dayjs from "dayjs";
import NoticePriorityBadge, { PRIORITY_CONFIG } from "./NoticePriorityBadge";
import Textarea from "../TextArea";

type PriorityKey = keyof typeof PRIORITY_CONFIG;

export default function NoticeDrawer({
  open,
  mode,
  notice,
  disabled,
  onClose,
  onSubmit,
  onDelete,
}: Dashboard.NoticeDrawerProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Dashboard.Priority>("medium");
  const [rangeValue, setRangeValue] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<{ title?: string; date?: string }>({});

  useEffect(() => {
    if (notice) {
      setTitle(notice.title);
      setPriority(notice.priority);
      setRangeValue([
        dayjs(notice.start_date).toDate(),
        dayjs(notice.end_date).toDate(),
      ]);
      setContent(notice.content || "");
    } else {
      setTitle("");
      setPriority("medium");
      setRangeValue([dayjs().toDate(), dayjs().toDate()]);
      setContent("");
    }
    setErrors({});
  }, [notice, open]);

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = "제목은 필수 입력 항목입니다.";
    if (!rangeValue[0] || !rangeValue[1])
      newErrors.date = "날짜를 선택해 주세요.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit({
      title: title.trim(),
      priority,
      start_date: dayjs(rangeValue[0])!.format("YYYY-MM-DD"),
      end_date: dayjs(rangeValue[1])!.format("YYYY-MM-DD"),
      content: content.trim() || "",
    });
  };

  return (
    <Drawer
      open={open}
      title={
        <Typography variant="H4">
          {mode === "create"
            ? "중요일정 추가"
            : disabled
              ? "중요일정 조회"
              : "중요일정 수정"}
        </Typography>
      }
      showFooter={!disabled}
      confirmText={mode === "create" ? "추가하기" : "수정하기"}
      deleteText={mode === "edit" ? "삭제" : undefined}
      onClose={onClose}
      onCancel={onClose}
      onDelete={mode === "edit" && onDelete ? onDelete : undefined}
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
            onChange={(e) => setTitle(e.target.value)}
            max={100}
            disabled={disabled}
            error={!!errors.title}
            errorMsg={errors.title}
            placeholder="공지 제목을 입력하세요"
          />
        </FlexWrapper>

        {/* 중요도 */}

        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 !w-[60px]">
            <Label text="중요도" />
          </div>
          <Dropdown
            hideDownIcon
            disabled={disabled}
            itemClasses="!px-1"
            buttonVariant="clear"
            items={Object.keys(PRIORITY_CONFIG).map((priority) => ({
              type: "item" as const,
              id: priority,
              label: (
                <NoticePriorityBadge
                  priority={priority as PriorityKey}
                  classes="!w-[120px] justify-center"
                />
              ),
            }))}
            onChange={(val) => setPriority(val as PriorityKey)}
            buttonItem={
              <NoticePriorityBadge
                priority={priority}
                classes="px-4 py-1 w-[120px] justify-center"
              />
            }
            buttonClasses="!font-normal text-primary-900 !h-fit !border-primary-300 hover:!bg-primary-50 !p-0"
          />
        </FlexWrapper>

        {/* 기간 */}
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 !w-[60px]">
            <Label text="기간" />
          </div>
          <CustomDatePicker
            variant="outline"
            classes="w-[200px]"
            type="range"
            size="sm"
            disabled={disabled}
            value={null}
            isRange
            dateFormat="YYYY.MM.dd"
            startDate={rangeValue[0] || undefined}
            endDate={rangeValue[1] || undefined}
            onChange={(value: any) => {
              setRangeValue(value as [Date | null, Date | null]);
            }}
          />
          {errors.date && (
            <Typography variant="C1" classes="!text-danger ml-2">
              {errors.date}
            </Typography>
          )}
        </FlexWrapper>

        <FlexWrapper items="start" gap={2}>
          <div className="shrink-0 !w-[60px] mt-2">
            <Label text="설명" />
          </div>
          <Textarea
            value={content}
            disabled={disabled}
            onChange={(e) => setContent(e.target.value)}
            placeholder="중요일정 설명을 입력하세요"
          />
        </FlexWrapper>
      </FlexWrapper>
    </Drawer>
  );
}
