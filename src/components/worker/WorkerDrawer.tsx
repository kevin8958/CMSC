import { useEffect, useState } from "react";
import Drawer from "@/components/Drawer";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Label from "@/components/Label";
import TextInput from "@/components/TextInput";
import CustomDatePicker from "@/components/DatePicker";
import dayjs from "dayjs";
import { type Worker } from "@/actions/workerActions";

interface WorkerDrawerProps {
  open: boolean;
  mode: "create" | "edit";
  worker: Worker | null;
  onClose: () => void;
  onSubmit: (data: Partial<Worker>) => Promise<void>;
  onEdit: (data: Partial<Worker>) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function WorkerDrawer({
  open,
  mode,
  worker,
  onClose,
  onSubmit,
  onEdit,
  onDelete,
}: WorkerDrawerProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [position, setPosition] = useState<string | null>(null);
  const [duty, setDuty] = useState<string | null>(null);
  const [joinedAt, setJoinedAt] = useState<Date | null>(dayjs().toDate());

  const [totalLeave, setTotalLeave] = useState<number | null>(null);
  const [usedLeave, setUsedLeave] = useState<number | null>(null);

  const [errors, setErrors] = useState({ name: "" });

  useEffect(() => {
    if (worker) {
      setName(worker.name || "");
      setEmail(worker.email ?? null);
      setPosition(worker.position ?? null);
      setDuty(worker.duty ?? null);
      setJoinedAt(worker.joined_at ? dayjs(worker.joined_at).toDate() : null);

      setTotalLeave(worker.total_leave ?? null);
      setUsedLeave(worker.used_leave ?? null);
    } else {
      setName("");
      setEmail(null);
      setPosition(null);
      setDuty(null);
      setJoinedAt(dayjs().toDate());
      setTotalLeave(null);
      setUsedLeave(null);
    }
  }, [worker, open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrors({ name: "이름은 필수 입력사항입니다." });
      return;
    }

    if (mode === "create") {
      await onSubmit({
        name: name.trim(),
        email,
        position,
        duty,
        joined_at: joinedAt ? dayjs(joinedAt).format("YYYY-MM-DD") : null,
        total_leave: totalLeave || 0,
        used_leave: usedLeave || 0,
      });
    } else if (mode === "edit") {
      await onEdit({
        id: worker?.id,
        name: name.trim(),
        email,
        position,
        duty,
        joined_at: joinedAt ? dayjs(joinedAt).format("YYYY-MM-DD") : null,
        total_leave: totalLeave || 0,
        used_leave: usedLeave || 0,
      });
    }
    onClose();
  };

  return (
    <Drawer
      open={open}
      title={
        <Typography variant="H4">
          {mode === "create" ? "근로자 추가하기" : "근로자 수정하기"}
        </Typography>
      }
      showFooter
      confirmText={mode === "create" ? "추가하기" : "수정하기"}
      deleteText="삭제"
      onClose={onClose}
      onCancel={onClose}
      onDelete={onDelete}
      onConfirm={handleSubmit}
    >
      <FlexWrapper direction="col" gap={4} classes="pt-4 pb-6 px-4">
        {/* 이름 */}
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 w-[70px]">
            <Label text="이름" required />
          </div>
          <TextInput
            inputProps={{ value: name }}
            onChange={(e) => setName(e.target.value)}
            classes="!h-[42px]"
            placeholder="이름 입력"
            error={!!errors.name}
            errorMsg={errors.name}
          />
        </FlexWrapper>

        {/* 이메일 */}
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 w-[70px]">
            <Label text="이메일" />
          </div>
          <TextInput
            inputProps={{ value: email ?? "" }}
            onChange={(e) => setEmail(e.target.value || null)}
            classes="!h-[42px]"
            placeholder="email@example.com"
          />
        </FlexWrapper>

        {/* 직급 */}
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 w-[70px]">
            <Label text="직급" />
          </div>
          <TextInput
            inputProps={{ value: position ?? "" }}
            onChange={(e) => setPosition(e.target.value || null)}
            classes="!h-[42px]"
            placeholder="예: 대리, 과장"
          />
        </FlexWrapper>

        {/* 직책 */}
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 w-[70px]">
            <Label text="직책" />
          </div>
          <TextInput
            inputProps={{ value: duty ?? "" }}
            onChange={(e) => setDuty(e.target.value || null)}
            classes="!h-[42px]"
            placeholder="예: 개발팀, 운영팀"
          />
        </FlexWrapper>

        {/* 입사일 */}
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 w-[70px]">
            <Label text="입사일" />
          </div>
          <CustomDatePicker
            type="single"
            size="sm"
            variant="outline"
            classes="w-[140px]"
            value={joinedAt}
            onChange={(d) => setJoinedAt(d)}
            dateFormat="YYYY.MM.dd"
          />
        </FlexWrapper>

        {/* 총 연차 */}
        <FlexWrapper items="center" gap={2}>
          <FlexWrapper items="center" gap={2}>
            <div className="shrink-0 w-[70px]">
              <Label text="총 연차" />
            </div>
            <TextInput
              type="number"
              inputProps={{ value: totalLeave ?? "" }}
              onChange={(e) => setTotalLeave(Number(e.target.value))}
              classes="!h-[42px]"
              placeholder="예: 15"
            />
          </FlexWrapper>

          {/* 사용 연차 */}
          <FlexWrapper items="center" gap={2}>
            <div className="shrink-0 w-[70px]">
              <Label text="사용 연차" />
            </div>
            <TextInput
              type="number"
              inputProps={{ value: usedLeave ?? "" }}
              onChange={(e) => setUsedLeave(Number(e.target.value))}
              classes="!h-[42px]"
              placeholder="예: 3"
            />
          </FlexWrapper>
        </FlexWrapper>
      </FlexWrapper>
    </Drawer>
  );
}
