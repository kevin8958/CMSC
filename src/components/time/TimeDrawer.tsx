import { useEffect, useState } from "react";
import Drawer from "@/components/Drawer";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Label from "@/components/Label";
import CustomDatePicker from "@/components/DatePicker";
import CustomTimePicker from "./CustomTimePicker"; // ✅ 신규 컴포넌트 임포트
import dayjs from "dayjs";

interface TimeDrawerProps {
  open: boolean;
  disabled?: boolean;
  mode: "create" | "edit";
  log: any | null;
  workers: any[];
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  onEdit?: (id: string, data: any) => Promise<void>; // ✅ id를 별도로 받도록 수정
  onDelete?: (id: string) => Promise<void>; // ✅ id를 인자로 받도록 수정
}

export default function TimeDrawer({
  open,
  disabled,
  mode,
  log,
  workers,
  onClose,
  onSubmit,
  onEdit,
  onDelete,
}: TimeDrawerProps) {
  const [selectedWorkerId, setSelectedWorkerId] = useState("");
  const [workDate, setWorkDate] = useState<Date | null>(new Date());
  const [clockIn, setClockIn] = useState("09:00");
  const [clockOut, setClockOut] = useState("18:00");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (log) {
      setSelectedWorkerId(log.worker_id || "");
      setWorkDate(dayjs(log.work_date).toDate());
      setClockIn(dayjs(log.clock_in).format("HH:mm"));
      setClockOut(dayjs(log.clock_out).format("HH:mm"));
      setRemarks(log.remarks || "");
    } else {
      setSelectedWorkerId("");
      setWorkDate(new Date());
      setClockIn("09:00");
      setClockOut("18:00");
      setRemarks("");
    }
  }, [log, open]);

  const handleSubmit = async () => {
    const payload = {
      worker_id: selectedWorkerId,
      work_date: dayjs(workDate).format("YYYY-MM-DD"),
      clock_in: dayjs(
        `${dayjs(workDate).format("YYYY-MM-DD")} ${clockIn}`
      ).toISOString(),
      clock_out: dayjs(
        `${dayjs(workDate).format("YYYY-MM-DD")} ${clockOut}`
      ).toISOString(),
      remarks,
    };

    if (mode === "create") {
      await onSubmit(payload);
    } else if (mode === "edit" && onEdit && log?.id) {
      // ✅ 수정 모드일 때 id와 payload를 분리하여 전달
      await onEdit(log.id, payload);
    }
    onClose();
  };

  return (
    <Drawer
      open={open}
      title={
        <Typography variant="H4">
          {mode === "create" ? "근무 기록 등록" : "근무 기록 수정"}
        </Typography>
      }
      showFooter={!disabled}
      confirmText={mode === "create" ? "등록하기" : "수정하기"}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleSubmit}
      // ✅ 삭제 기능 연결 (id가 있을 때만 실행)
      onDelete={
        onDelete && log?.id
          ? async () => {
              await onDelete(log.id);
              onClose();
            }
          : undefined
      }
    >
      <div className="flex flex-col px-5 pt-4 pb-12 gap-8">
        {/* 섹션 1: 근무자 정보 */}
        <section className="flex flex-col gap-4">
          <FlexWrapper items="center" gap={2}>
            <span className="w-2 h-5 bg-gray-400 rounded-full" />
            <Typography variant="B1" classes="font-extrabold text-gray-900">
              근무자 정보
            </Typography>
          </FlexWrapper>
          <div className="flex flex-col gap-4 pl-1">
            <FlexWrapper items="center" gap={2}>
              <div className="shrink-0 w-[80px] text-right">
                <Label text="근무자" required />
              </div>
              <select
                value={selectedWorkerId}
                onChange={(e) => setSelectedWorkerId(e.target.value)}
                className="flex-1 h-[40px] px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-50 transition-colors"
                disabled={mode === "edit" || disabled}
              >
                <option value="">근무자 선택</option>
                {workers.map((w) => (
                  <option key={w.id} value={w.id}>
                    {`${w.name} (${w.department || "미지정"})`}
                  </option>
                ))}
              </select>
            </FlexWrapper>
            <FlexWrapper items="center" gap={2}>
              <div className="shrink-0 w-[80px] text-right">
                <Label text="근무 일자" required />
              </div>
              <CustomDatePicker
                type="single"
                size="md"
                variant="outline"
                dateFormat="YYYY.MM.dd"
                classes="flex-1"
                disabled={disabled}
                value={workDate}
                onChange={setWorkDate}
              />
            </FlexWrapper>
          </div>
        </section>

        {/* 섹션 2: 시간 설정 */}
        <section className="flex flex-col gap-4">
          <FlexWrapper items="center" gap={2}>
            <span className="w-2 h-5 bg-blue-500 rounded-full" />
            <Typography variant="B1" classes="font-extrabold text-blue-700">
              시간 기록
            </Typography>
          </FlexWrapper>
          <div className="flex flex-col gap-4 pl-1">
            <FlexWrapper items="center" gap={2}>
              <div className="shrink-0 w-[80px] text-right">
                <Label text="출근 시간" />
              </div>
              <CustomTimePicker
                value={clockIn}
                onChange={setClockIn}
                disabled={disabled}
              />
            </FlexWrapper>
            <FlexWrapper items="center" gap={2}>
              <div className="shrink-0 w-[80px] text-right">
                <Label text="퇴근 시간" />
              </div>
              <CustomTimePicker
                value={clockOut}
                onChange={setClockOut}
                disabled={disabled}
              />
            </FlexWrapper>
          </div>
        </section>

        {/* 섹션 3: 적요 */}
        <section className="flex flex-col gap-4">
          <FlexWrapper items="center" gap={2}>
            <span className="w-2 h-5 bg-purple-500 rounded-full" />
            <Typography variant="B1" classes="font-extrabold text-purple-700">
              비고
            </Typography>
          </FlexWrapper>
          <div className="pl-1">
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              disabled={disabled}
              placeholder="특이사항이나 근무 내용 입력 (예: 야간 근무, 외부 출장 등)"
              className="w-full h-24 p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none transition-colors disabled:bg-gray-50"
            />
          </div>
        </section>
      </div>
    </Drawer>
  );
}
