import { useState, useEffect } from "react";
import Drawer from "@/components/Drawer";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Label from "@/components/Label";
import Dropdown from "@/components/Dropdown";
import CustomDatePicker from "@/components/DatePicker";
import TextInput from "@/components/TextInput";
import Textarea from "@/components/TextArea";
import dayjs from "dayjs";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import Badge from "../Badge";
import { useWorkerStore } from "@/stores/useWorkerStore";

interface AttendanceAddDrawerProps {
  workers: Worker.Worker[];
  selectedMonth: Date | null;
  open: boolean;
  onClose: () => void;
}

export default function AttendanceAddDrawer({
  workers,
  selectedMonth,
  open,
  onClose,
}: AttendanceAddDrawerProps) {
  const { createRecord, fetchMonthlyRecords } = useAttendanceStore();
  const { fetchAll } = useWorkerStore();
  const { currentCompanyId } = useCompanyStore();
  const [form, setForm] = useState({
    worker: "",
    start_date: new Date(),
    end_date: new Date(),
    reason: "",
    note: "",
  });

  const [rangeValue, setRangeValue] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  // ✅ 자동 days 계산 (시작일, 종료일 변경 시)
  useEffect(() => {
    if (form.start_date && form.end_date) {
      const diff = dayjs(form.end_date).diff(dayjs(form.start_date), "day") + 1;
      setForm((prev) => ({ ...prev, days: Math.max(diff, 1) }));
    }
  }, [form.start_date, form.end_date]);

  useEffect(() => {
    if (open) {
      setForm({
        worker: "",
        start_date: new Date(),
        end_date: new Date(),
        reason: "",
        note: "",
      });
      setRangeValue([null, null]);
      setErrors({});
    }
  }, [open]);

  const handleChange = (key: string, value: any) => {
    if (key === "worker" && value) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.worker;
        return newErrors;
      });
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.worker) {
      setErrors({ worker: "멤버를 선택해주세요." });
      return;
    }
    if (!currentCompanyId) {
      console.error("❌ company_id 누락");
      return;
    }

    await createRecord({
      company_id: currentCompanyId,
      worker_id: form.worker,
      start_date: dayjs(rangeValue[0]).format("yyyy-MM-DD"),
      end_date: dayjs(rangeValue[1]).format("yyyy-MM-DD"),
      days: dayjs(rangeValue[1]).diff(dayjs(rangeValue[0]), "day") + 1,
      reason: form.reason,
      note: form.note,
    });

    const month = dayjs(selectedMonth).format("yyyy-MM");
    fetchAll(currentCompanyId);
    fetchMonthlyRecords(currentCompanyId, month);
    onClose();
  };

  const selectedWorker = workers.find((m) => m.id === form.worker);

  return (
    <Drawer
      open={open}
      title="연차 내역 추가"
      showFooter
      confirmText="추가하기"
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleSubmit}
      disableConfirm={!!errors.member}
    >
      <FlexWrapper direction="col" gap={4} classes="p-4">
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 !w-[60px]">
            <Label text="대상자" required />
          </div>
          <Dropdown
            hideDownIcon
            buttonSize="sm"
            buttonVariant="outline"
            items={workers.map((m) => ({
              type: "item",
              id: m.id,
              label: m.name,
            }))}
            dialogWidth={200}
            onChange={(val) => handleChange("worker", val)}
            buttonItem={
              form.worker
                ? workers.find((m) => m.id === form.worker)?.name
                : "선택"
            }
            buttonClasses="!font-normal text-primary-900 !w-[200px] !h-fit !border-primary-300 hover:!bg-primary-50 !text-sm !py-1"
          />
          <FlexWrapper gap={1} items="center">
            <Badge
              color="primary"
              size="sm"
              classes="!w-[80px] !justify-center"
            >
              총 연차 {selectedWorker ? selectedWorker.total_leave : "??"}
            </Badge>
            <Badge color="danger" size="sm" classes="!w-[80px] !justify-center">
              사용 연차 {selectedWorker ? selectedWorker.used_leave : "??"}
            </Badge>
            <Badge color="green" size="sm" classes="!w-[80px] !justify-center">
              잔여 연차{" "}
              {selectedWorker
                ? selectedWorker.total_leave - selectedWorker.used_leave
                : "??"}
            </Badge>
          </FlexWrapper>
        </FlexWrapper>

        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 !w-[60px]">
            <Label text="기간" required />
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
          <Typography variant="B2" classes="!text-gray-600 !font-bold">
            총{" "}
            {!!rangeValue[1] && !!rangeValue[0]
              ? dayjs(rangeValue[1]).diff(dayjs(rangeValue[0]), "day") + 1
              : "??"}
            일
          </Typography>
        </FlexWrapper>
        <FlexWrapper items="center" gap={2} classes="col-span-12">
          <div className="shrink-0 !w-[60px]">
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
        <FlexWrapper items="start" direction="col" gap={2}>
          <Label text="메모" />
          <Textarea
            value={form.note}
            onChange={(e) => handleChange("note", e.target.value)}
            placeholder="추가 메모를 입력하세요"
          />
        </FlexWrapper>
      </FlexWrapper>
    </Drawer>
  );
}
