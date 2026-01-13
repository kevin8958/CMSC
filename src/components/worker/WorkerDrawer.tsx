import { useEffect, useState } from "react";
import Drawer from "@/components/Drawer";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Label from "@/components/Label";
import TextInput from "@/components/TextInput";
import CustomDatePicker from "@/components/DatePicker";
import Checkbox from "@/components/Checkbox";
import dayjs from "dayjs";

interface WorkerDrawerProps {
  open: boolean;
  disabled?: boolean;
  mode: "create" | "edit";
  worker: any | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  onEdit: (data: any) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function WorkerDrawer({
  open,
  disabled,
  mode,
  worker,
  onClose,
  onSubmit,
  onEdit,
  onDelete,
}: WorkerDrawerProps) {
  // --- 상태 관리 ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [position, setPosition] = useState<string | null>(null);
  const [duty, setDuty] = useState<string | null>(null); // ✅ 직무 상태 추가
  const [joinedAt, setJoinedAt] = useState<Date | null>(dayjs().toDate());
  const [totalLeave, setTotalLeave] = useState<number | null>(null);
  const [usedLeave, setUsedLeave] = useState<number | null>(null);

  // 공제 상태
  const [hasHealthInsuranceDependent, setHasHealthInsuranceDependent] =
    useState(false);
  const [hasDependentDeduction, setHasDependentDeduction] = useState(false);
  const [hasAdditionalDeduction, setHasAdditionalDeduction] = useState(false);
  const [hasStudentLoanDeduction, setHasStudentLoanDeduction] = useState(false);
  const [hasYouthDeduction, setHasYouthDeduction] = useState(false);

  const [memo, setMemo] = useState("");
  const [errors, setErrors] = useState({ name: "" });

  useEffect(() => {
    if (worker) {
      setName(worker.name || "");
      setEmail(worker.email ?? null);
      setPhone(worker.phone || "");
      setBirthDate(
        worker.birth_date ? dayjs(worker.birth_date).toDate() : null
      );
      setDepartment(worker.department ?? null);
      setPosition(worker.position ?? null);
      setDuty(worker.duty ?? null); // ✅ 직무 데이터 매핑
      setJoinedAt(worker.joined_at ? dayjs(worker.joined_at).toDate() : null);
      setTotalLeave(worker.total_leave ?? null);
      setUsedLeave(worker.used_leave ?? null);
      setHasHealthInsuranceDependent(!!worker.has_health_insurance_dependent);
      setHasDependentDeduction(!!worker.has_dependent_deduction);
      setHasAdditionalDeduction(!!worker.has_additional_deduction);
      setHasStudentLoanDeduction(!!worker.has_student_loan_deduction);
      setHasYouthDeduction(!!worker.has_youth_deduction);
      setMemo(worker.memo || "");
    } else {
      setName("");
      setEmail(null);
      setPhone("");
      setBirthDate(null);
      setDepartment(null);
      setPosition(null);
      setDuty(null); // ✅ 초기화
      setJoinedAt(dayjs().toDate());
      setTotalLeave(null);
      setUsedLeave(null);
      setMemo("");
      setHasHealthInsuranceDependent(false);
      setHasDependentDeduction(false);
      setHasAdditionalDeduction(false);
      setHasStudentLoanDeduction(false);
      setHasYouthDeduction(false);
    }
  }, [worker, open]);

  const handlePhoneChange = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    let formatted = numbers;
    if (numbers.length >= 11)
      formatted = numbers.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    else if (numbers.length >= 7)
      formatted = numbers.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    setPhone(formatted);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrors({ name: "이름은 필수 입력사항입니다." });
      return;
    }
    const payload = {
      name: name.trim(),
      email,
      phone,
      memo,
      birth_date: birthDate ? dayjs(birthDate).format("YYYY-MM-DD") : null,
      department,
      position,
      duty, // ✅ 페이로드에 포함
      joined_at: joinedAt ? dayjs(joinedAt).format("YYYY-MM-DD") : null,
      total_leave: totalLeave || 0,
      used_leave: usedLeave || 0,
      has_health_insurance_dependent: hasHealthInsuranceDependent,
      has_dependent_deduction: hasDependentDeduction,
      has_additional_deduction: hasAdditionalDeduction,
      has_student_loan_deduction: hasStudentLoanDeduction,
      has_youth_deduction: hasYouthDeduction,
    };
    if (mode === "create") await onSubmit(payload);
    else if (mode === "edit") await onEdit({ id: worker?.id, ...payload });
    onClose();
  };

  return (
    <Drawer
      open={open}
      title={
        <Typography variant="H4">
          {mode === "create"
            ? "근로자 추가"
            : disabled
              ? "근로자 조회"
              : "근로자 수정"}
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
      <div className="flex flex-col px-5 pt-4 pb-12 gap-6">
        {/* 섹션 1: 인적 사항 */}
        <div className="flex flex-col gap-4">
          <Typography variant="H4" classes="!font-extrabold">
            인적 사항
          </Typography>

          <FlexWrapper items="center" gap={2}>
            <div className="shrink-0 w-[60px]">
              <Label text="이름" required />
            </div>
            <TextInput
              inputProps={{ value: name }}
              onChange={(e) => setName(e.target.value)}
              disabled={disabled}
              classes="!h-[40px] flex-1"
              error={!!errors.name}
              errorMsg={errors.name}
            />
          </FlexWrapper>

          <FlexWrapper items="center" gap={2}>
            <div className="shrink-0 w-[60px]">
              <Label text="이메일" />
            </div>
            <TextInput
              inputProps={{ value: email ?? "" }}
              onChange={(e) => setEmail(e.target.value || null)}
              disabled={disabled}
              classes="!h-[40px] flex-1"
              placeholder="example@email.com"
            />
          </FlexWrapper>

          <FlexWrapper gap={2}>
            <FlexWrapper items="center" gap={2} classes="flex-1">
              <div className="shrink-0 w-[60px]">
                <Label text="생년월일" />
              </div>
              <CustomDatePicker
                type="single"
                size="md"
                variant="outline"
                classes="w-full flex-1"
                dateFormat="YYYY.MM.dd"
                disabled={disabled}
                value={birthDate}
                onChange={(d) => setBirthDate(d)}
              />
            </FlexWrapper>
            <FlexWrapper items="center" gap={2} classes="flex-1">
              <div className="shrink-0 w-[60px] text-right">
                <Label text="연락처" />
              </div>
              <TextInput
                inputProps={{ value: phone }}
                onChange={(e) => handlePhoneChange(e.target.value)}
                disabled={disabled}
                classes="!h-[40px] flex-1"
                placeholder="010-0000-0000"
              />
            </FlexWrapper>
          </FlexWrapper>
        </div>

        <hr className="border-gray-100" />

        {/* 섹션 2: 인사 정보 */}
        <div className="flex flex-col gap-4">
          <Typography variant="H4" classes="!font-extrabold">
            인사 정보
          </Typography>

          <FlexWrapper gap={2}>
            <FlexWrapper items="center" gap={2} classes="flex-1">
              <div className="shrink-0 w-[60px]">
                <Label text="입사일" />
              </div>
              <CustomDatePicker
                type="single"
                size="md"
                variant="outline"
                classes="w-full flex-1"
                dateFormat="YYYY.MM.dd"
                disabled={disabled}
                value={joinedAt}
                onChange={(d) => setJoinedAt(d)}
              />
            </FlexWrapper>
            <FlexWrapper items="center" gap={2} classes="flex-1">
              <div className="shrink-0 w-[60px]">
                <Label text="부서" />
              </div>
              <TextInput
                inputProps={{ value: department ?? "" }}
                onChange={(e) => setDepartment(e.target.value || null)}
                disabled={disabled}
                classes="!h-[40px]"
              />
            </FlexWrapper>
          </FlexWrapper>

          <FlexWrapper gap={2}>
            <FlexWrapper items="center" gap={2} classes="flex-1">
              <div className="shrink-0 w-[60px] text-right">
                <Label text="직급" />
              </div>
              <TextInput
                inputProps={{ value: position ?? "" }}
                onChange={(e) => setPosition(e.target.value || null)}
                disabled={disabled}
                classes="!h-[40px]"
              />
            </FlexWrapper>
            {/* ✅ 직무 필드 추가 */}
            <FlexWrapper items="center" gap={2} classes="flex-1">
              <div className="shrink-0 w-[60px]">
                <Label text="직무" />
              </div>
              <TextInput
                inputProps={{ value: duty ?? "" }}
                onChange={(e) => setDuty(e.target.value || null)}
                disabled={disabled}
                classes="!h-[40px]"
                placeholder="담당 직무 입력"
              />
            </FlexWrapper>
          </FlexWrapper>
        </div>

        <hr className="border-gray-100" />

        {/* 섹션 3: 공제 / 보험 설정 */}
        <div className="flex flex-col gap-4">
          <Typography variant="H4" classes="!font-extrabold">
            공제 / 보험 설정
          </Typography>
          <div className="grid grid-cols-1 gap-3.5 pl-1">
            <Checkbox
              id="health"
              label="건강보험 피부양자 등록"
              checked={hasHealthInsuranceDependent}
              onChange={() =>
                setHasHealthInsuranceDependent(!hasHealthInsuranceDependent)
              }
              disabled={disabled}
            />
            <Checkbox
              id="dependent"
              label="부양가족 공제"
              checked={hasDependentDeduction}
              onChange={() => setHasDependentDeduction(!hasDependentDeduction)}
              disabled={disabled}
            />
            <Checkbox
              id="additional"
              label="추가 공제"
              checked={hasAdditionalDeduction}
              onChange={() =>
                setHasAdditionalDeduction(!hasAdditionalDeduction)
              }
              disabled={disabled}
            />
            <Checkbox
              id="student"
              label="학자금 공제"
              checked={hasStudentLoanDeduction}
              onChange={() =>
                setHasStudentLoanDeduction(!hasStudentLoanDeduction)
              }
              disabled={disabled}
            />
            <Checkbox
              id="youth"
              label="청년내일채움 공제"
              checked={hasYouthDeduction}
              onChange={() => setHasYouthDeduction(!hasYouthDeduction)}
              disabled={disabled}
            />
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* 섹션 4: 메모 */}
        <div className="flex flex-col gap-4">
          <Typography variant="H4" classes="!font-extrabold">
            메모
          </Typography>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            disabled={disabled}
            placeholder="특이사항 입력"
            className="w-full h-24 p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:bg-gray-50 resize-none transition-colors"
          />
        </div>
      </div>
    </Drawer>
  );
}
