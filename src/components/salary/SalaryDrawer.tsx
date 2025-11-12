import { useEffect, useState } from "react";
import Drawer from "@/components/Drawer";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Label from "@/components/Label";
import Dropdown from "@/components/Dropdown";
import TextInput from "@/components/TextInput";
import Textarea from "@/components/TextArea";
import dayjs from "dayjs";
import SalaryStatusBadge from "./SalaryStatusBadge";
import { STATUS_CONFIG } from "@/constants/SalaryConfigs_fixed";

interface SalaryDrawerProps {
  open: boolean;
  month: Date | null;
  mode: "create" | "edit";
  salary?: any;
  members: { user_id: string; nickname: string }[];
  onClose: () => void;
  onConfirm: (data: Omit<Salary.Insert, "company_id">) => Promise<void>;
  onEdit: (data: Omit<Salary.Update, "company_id">) => Promise<void>;
  onDelete?: () => Promise<void>;
}

type StatusKey = keyof typeof STATUS_CONFIG;
const statusKeys = Object.keys(STATUS_CONFIG) as StatusKey[];

const statusItems = [
  ...statusKeys.map((status) => ({
    type: "item" as const,
    id: status,
    label: <SalaryStatusBadge status={status} classes="!w-[90px]" />,
  })),
] as Common.DropdownItem[];

const EMP_TYPES: Salary.EmpType[] = ["정규직", "계약직", "프리랜서"];

export default function SalaryDrawer({
  open,
  month,
  mode,
  salary,
  members,
  onClose,
  onConfirm,
  onEdit,
  onDelete,
}: SalaryDrawerProps) {
  const [form, setForm] = useState({
    member: "",
    pay_month: new Date(),
    status: "pending" as Salary.SalaryStatus,
    emp_type: "정규직" as Salary.EmpType,
    work_days: "",
    base_work_days: "",
    absent_days: "",
    base_salary: "",
    non_taxable: "",
    bonus: "",
    allowance: "",
    income_tax: "",
    local_tax: "",
    pension_fee: "",
    health_fee: "",
    employment_fee: "",
    longterm_care_fee: "",
    deduction_other: "",
    note: "",
  });

  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  useEffect(() => {
    if (salary) {
      setForm({
        member: salary.user_id || "",
        pay_month: dayjs(salary.pay_month).toDate(),
        status: salary.status || "pending",
        emp_type: salary.emp_type || "정규직",
        work_days: salary.work_days?.toString() || "",
        base_work_days: salary.base_work_days?.toString() || "",
        absent_days: salary.absent_days?.toString() || "",
        base_salary: salary.base_salary?.toString() || "",
        non_taxable: salary.non_taxable?.toString() || "",
        bonus: salary.bonus?.toString() || "",
        allowance: salary.allowance?.toString() || "",
        income_tax: salary.income_tax?.toString() || "",
        local_tax: salary.local_tax?.toString() || "",
        pension_fee: salary.pension_fee?.toString() || "",
        health_fee: salary.health_fee?.toString() || "",
        employment_fee: salary.employment_fee?.toString() || "",
        longterm_care_fee: salary.longterm_care_fee?.toString() || "",
        deduction_other: salary.deduction_other?.toString() || "",
        note: salary.note || "",
      });
    } else {
      setForm({
        member: "",
        pay_month: new Date(),
        status: "pending",
        emp_type: "정규직",
        work_days: "",
        base_work_days: "",
        absent_days: "",
        base_salary: "",
        non_taxable: "",
        bonus: "",
        allowance: "",
        income_tax: "",
        local_tax: "",
        pension_fee: "",
        health_fee: "",
        employment_fee: "",
        longterm_care_fee: "",
        deduction_other: "",
        note: "",
      });
    }
  }, [salary]);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ 실시간 계산값 (DB에서는 generated column으로 처리되지만, 화면 표시용)
  const recognized_amount =
    (Number(form.base_salary) + Number(form.non_taxable)) *
    (Number(form.base_work_days) > 0
      ? (Number(form.work_days) - Number(form.absent_days || 0)) /
        Number(form.base_work_days)
      : 0);

  const total_amount =
    recognized_amount + Number(form.bonus) + Number(form.allowance);

  const tax_total = Number(form.income_tax) + Number(form.local_tax);

  const insurance_total =
    Number(form.pension_fee) +
    Number(form.health_fee) +
    Number(form.employment_fee) +
    Number(form.longterm_care_fee);

  const net_amount =
    total_amount - tax_total - insurance_total - Number(form.deduction_other);

  const handleSubmit = async () => {
    if (!form.member) {
      setErrors({ member: "직원을 선택해주세요." });
      return;
    }

    if (mode === "create") {
      await onConfirm({
        user_id: form.member,
        pay_month: dayjs(form.pay_month).format("YYYY-MM"),
        status: form.status,
        emp_type: form.emp_type,
        work_days: Number(form.work_days) || 0,
        base_work_days: Number(form.base_work_days) || 0,
        base_salary: Number(form.base_salary) || 0,
        non_taxable: Number(form.non_taxable) || 0,
        bonus: Number(form.bonus) || 0,
        allowance: Number(form.allowance) || 0,
        income_tax: Number(form.income_tax) || 0,
        local_tax: Number(form.local_tax) || 0,
        pension_fee: Number(form.pension_fee) || 0,
        health_fee: Number(form.health_fee) || 0,
        employment_fee: Number(form.employment_fee) || 0,
        longterm_care_fee: Number(form.longterm_care_fee) || 0,
        deduction_other: Number(form.deduction_other) || 0,
        note: form.note,
      });
    } else {
      await onEdit({
        id: salary.id,
        user_id: form.member,
        pay_month: dayjs(form.pay_month).format("YYYY-MM"),
        status: form.status,
        emp_type: form.emp_type,
        work_days: Number(form.work_days) || 0,
        base_work_days: Number(form.base_work_days) || 0,
        base_salary: Number(form.base_salary) || 0,
        non_taxable: Number(form.non_taxable) || 0,
        bonus: Number(form.bonus) || 0,
        allowance: Number(form.allowance) || 0,
        income_tax: Number(form.income_tax) || 0,
        local_tax: Number(form.local_tax) || 0,
        pension_fee: Number(form.pension_fee) || 0,
        health_fee: Number(form.health_fee) || 0,
        employment_fee: Number(form.employment_fee) || 0,
        longterm_care_fee: Number(form.longterm_care_fee) || 0,
        deduction_other: Number(form.deduction_other) || 0,
        note: form.note,
      });
    }
  };

  return (
    <Drawer
      open={open}
      title={
        <FlexWrapper items="center" gap={2}>
          <Dropdown
            hideDownIcon
            buttonVariant="clear"
            items={statusItems}
            onChange={(val) => handleChange("status", val)}
            dialogWidth={100}
            itemClasses="!px-1"
            buttonItem={<SalaryStatusBadge status={form.status} />}
            buttonClasses="!font-normal text-primary-900 !h-fit !border-primary-300 hover:!bg-primary-50 !p-0"
          />
          <Typography variant="H4">{dayjs(month).format("YYYY.MM")}</Typography>
          <Typography variant="H4">
            {mode === "create" ? "급여내역 추가하기" : "급여내역 수정하기"}
          </Typography>
        </FlexWrapper>
      }
      showFooter
      confirmText={mode === "create" ? "추가하기" : "수정하기"}
      deleteText="삭제"
      cancelText="취소"
      onCancel={onClose}
      onClose={onClose}
      onConfirm={handleSubmit}
      disableConfirm={!!Object.keys(errors).length}
      onDelete={mode === "create" ? undefined : onDelete}
    >
      <FlexWrapper direction="col" gap={4} classes="pt-4 pb-6 px-4">
        <FlexWrapper
          items="start"
          direction="col"
          gap={0}
          classes="border rounded-lg"
        >
          <FlexWrapper
            items="center"
            justify="between"
            gap={2}
            classes="py-2 px-4 bg-gray-50 w-full border-b rounded-t-lg"
          >
            <Typography variant="H4">기본정보</Typography>
          </FlexWrapper>
          <div className="grid grid-cols-12 p-2 gap-4 pb-4 w-full">
            <FlexWrapper items="center" gap={2} classes="col-span-6">
              <div className="shrink-0 !w-[80px]">
                <Label text="대상자" required />
              </div>
              <Dropdown
                hideDownIcon
                buttonSize="sm"
                buttonVariant="outline"
                items={members.map((m) => ({
                  type: "item",
                  id: m.user_id,
                  label: m.nickname,
                }))}
                dialogWidth={160}
                onChange={(val) => handleChange("member", val)}
                buttonItem={
                  form.member
                    ? members.find((m) => m.user_id === form.member)?.nickname
                    : "선택"
                }
                buttonClasses="!font-normal text-primary-900 !w-[160px] !h-fit !border-primary-300 hover:!bg-primary-50 !text-sm !py-1"
              />
            </FlexWrapper>
            {/* 고용형태 */}
            <FlexWrapper items="center" gap={2} classes="col-span-6">
              <div className="shrink-0 !w-[80px]">
                <Label text="고용형태" />
              </div>
              <Dropdown
                hideDownIcon
                buttonVariant="outline"
                items={EMP_TYPES.map((type) => ({
                  type: "item",
                  id: type,
                  label: type,
                }))}
                dialogWidth={160}
                onChange={(val) => handleChange("emp_type", val)}
                buttonItem={form.emp_type}
                buttonClasses="!font-normal text-primary-900 !w-[160px] !h-fit !border-primary-300 hover:!bg-primary-50 !text-sm !py-1"
              />
            </FlexWrapper>
          </div>
        </FlexWrapper>

        {/* 근무일 */}
        <FlexWrapper
          items="start"
          direction="col"
          gap={0}
          classes="border rounded-lg"
        >
          <FlexWrapper
            items="center"
            justify="between"
            gap={2}
            classes="py-2 px-4 bg-gray-50 w-full border-b rounded-t-lg"
          >
            <Typography variant="H4">근무일</Typography>
            <Typography variant="B2">
              근무인정일 <strong>{form.work_days}</strong> 일
            </Typography>
          </FlexWrapper>
          <div className="grid grid-cols-12 p-2 gap-4 pb-4 w-full">
            <FlexWrapper items="center" gap={2} classes="col-span-6">
              <div className="shrink-0 !w-[80px]">
                <Label text="소정근로일수" />
              </div>
              <TextInput
                classes="!text-sm !h-[42px] max-h-[42px]"
                inputProps={{
                  type: "number",
                  value: form.base_work_days,
                  placeholder: "0",
                }}
                suffix="일"
                onChange={(e) => handleChange("base_work_days", e.target.value)}
              />
            </FlexWrapper>

            <FlexWrapper items="center" gap={2} classes="col-span-6">
              <div className="shrink-0 !w-[80px]">
                <Label text="미달근무일" />
              </div>
              <TextInput
                classes="!text-sm !h-[42px] max-h-[42px]"
                inputProps={{
                  type: "number",
                  value: form.absent_days,
                  placeholder: "0",
                }}
                suffix="일"
                onChange={(e) => handleChange("absent_days", e.target.value)}
              />
            </FlexWrapper>
          </div>
        </FlexWrapper>

        <FlexWrapper
          items="start"
          direction="col"
          gap={0}
          classes="border rounded-lg "
        >
          <FlexWrapper
            items="center"
            justify="between"
            gap={2}
            classes="py-2 px-4 bg-gray-50 w-full border-b rounded-t-lg"
          >
            <Typography variant="H4">급여</Typography>
          </FlexWrapper>

          <div className="grid grid-cols-12 p-2 gap-4 pb-4 w-full">
            <FlexWrapper items="center" gap={2} classes="col-span-6">
              <div className="shrink-0 !w-[80px]">
                <Label text="기본급" />
              </div>
              <TextInput
                classes="!text-sm !h-[42px] max-h-[42px]"
                inputProps={{
                  type: "number",
                  value: form.base_salary,
                  placeholder: "0",
                }}
                suffix="원"
                onChange={(e) => handleChange("base_salary", e.target.value)}
              />
            </FlexWrapper>

            <FlexWrapper items="center" gap={2} classes="col-span-6">
              <div className="shrink-0 !w-[80px]">
                <Label text="비과세급" />
              </div>
              <TextInput
                classes="!text-sm !h-[42px] max-h-[42px]"
                inputProps={{
                  type: "number",
                  value: form.non_taxable,
                  placeholder: "0",
                }}
                suffix="원"
                onChange={(e) => handleChange("non_taxable", e.target.value)}
              />
            </FlexWrapper>
            <FlexWrapper items="center" gap={2} classes="col-span-12">
              <div className="shrink-0 !w-[100px]">
                <Label text="실질인정금액" />
              </div>
              <Typography variant="B2" classes="text-gray-500 !font-bold">
                {recognized_amount.toLocaleString()} 원
              </Typography>
            </FlexWrapper>
            <FlexWrapper items="center" gap={2} classes="col-span-6">
              <div className="shrink-0 !w-[80px]">
                <Label text="상여금" />
              </div>
              <TextInput
                classes="!text-sm !h-[42px] max-h-[42px]"
                inputProps={{
                  type: "number",
                  value: form.bonus,
                  placeholder: "0",
                }}
                suffix="원"
                onChange={(e) => handleChange("bonus", e.target.value)}
              />
            </FlexWrapper>

            <FlexWrapper items="center" gap={2} classes="col-span-6">
              <div className="shrink-0 !w-[80px]">
                <Label text="수당" />
              </div>
              <TextInput
                classes="!text-sm !h-[42px] max-h-[42px]"
                inputProps={{
                  type: "number",
                  value: form.allowance,
                  placeholder: "0",
                }}
                suffix="원"
                onChange={(e) => handleChange("allowance", e.target.value)}
              />
            </FlexWrapper>
            <FlexWrapper items="center" gap={2} classes="col-span-12">
              <div className="shrink-0 !w-[100px]">
                <Label text="급여 총액" />
              </div>
              <Typography variant="B2" classes="text-gray-500 !font-bold">
                {total_amount} 원
              </Typography>
            </FlexWrapper>
          </div>
        </FlexWrapper>

        <FlexWrapper
          items="start"
          direction="col"
          gap={0}
          classes="border rounded-lg "
        >
          <FlexWrapper
            items="center"
            justify="between"
            gap={2}
            classes="py-2 px-4 bg-gray-50 w-full border-b rounded-t-lg"
          >
            <Typography variant="H4">세금</Typography>
          </FlexWrapper>

          <div className="grid grid-cols-12 p-2 gap-4 pb-4 w-full">
            <FlexWrapper items="center" gap={2} classes="col-span-6">
              <div className="shrink-0 !w-[80px]">
                <Label text="소득세" />
              </div>
              <TextInput
                classes="!text-sm !h-[42px] max-h-[42px]"
                inputProps={{
                  type: "number",
                  value: form.income_tax,
                  placeholder: "0",
                }}
                suffix="원"
                onChange={(e) => handleChange("income_tax", e.target.value)}
              />
            </FlexWrapper>

            <FlexWrapper items="center" gap={2} classes="col-span-6">
              <div className="shrink-0 !w-[80px]">
                <Label text="지방소득세" />
              </div>
              <TextInput
                classes="!text-sm !h-[42px] max-h-[42px]"
                inputProps={{
                  type: "number",
                  value: form.local_tax,
                  placeholder: "0",
                }}
                suffix="원"
                onChange={(e) => handleChange("local_tax", e.target.value)}
              />
            </FlexWrapper>
            <FlexWrapper items="center" gap={2} classes="col-span-12">
              <div className="shrink-0 !w-[100px]">
                <Label text="세금 총액" />
              </div>
              <Typography variant="B2" classes="text-gray-500 !font-bold">
                {tax_total} 원
              </Typography>
            </FlexWrapper>
          </div>
        </FlexWrapper>

        {(form.emp_type === "계약직" || form.emp_type === "정규직") && (
          <FlexWrapper
            items="start"
            direction="col"
            gap={0}
            classes="border rounded-lg "
          >
            <FlexWrapper
              items="center"
              justify="between"
              gap={2}
              classes="py-2 px-4 bg-gray-50 w-full border-b rounded-t-lg"
            >
              <Typography variant="H4">보험</Typography>
            </FlexWrapper>

            <div className="grid grid-cols-12 p-2 gap-4 pb-4 w-full">
              <FlexWrapper items="center" gap={2} classes="col-span-6">
                <div className="shrink-0 !w-[80px]">
                  <Label text="국민연금" />
                </div>
                <TextInput
                  classes="!text-sm !h-[42px] max-h-[42px]"
                  inputProps={{
                    type: "number",
                    value: form.pension_fee,
                    placeholder: "0",
                  }}
                  suffix="원"
                  onChange={(e) => handleChange("pension_fee", e.target.value)}
                />
              </FlexWrapper>

              <FlexWrapper items="center" gap={2} classes="col-span-6">
                <div className="shrink-0 !w-[80px]">
                  <Label text="건강보험" />
                </div>
                <TextInput
                  classes="!text-sm !h-[42px] max-h-[42px]"
                  inputProps={{
                    type: "number",
                    value: form.health_fee,
                    placeholder: "0",
                  }}
                  suffix="원"
                  onChange={(e) => handleChange("health_fee", e.target.value)}
                />
              </FlexWrapper>

              <FlexWrapper items="center" gap={2} classes="col-span-6">
                <div className="shrink-0 !w-[80px]">
                  <Label text="고용보험" />
                </div>
                <TextInput
                  classes="!text-sm !h-[42px] max-h-[42px]"
                  inputProps={{
                    type: "number",
                    value: form.employment_fee,
                    placeholder: "0",
                  }}
                  suffix="원"
                  onChange={(e) =>
                    handleChange("employment_fee", e.target.value)
                  }
                />
              </FlexWrapper>

              <FlexWrapper items="center" gap={2} classes="col-span-6">
                <div className="shrink-0 !w-[80px]">
                  <Label text="장기요양보험" />
                </div>
                <TextInput
                  classes="!text-sm !h-[42px] max-h-[42px]"
                  inputProps={{
                    type: "number",
                    value: form.longterm_care_fee,
                    placeholder: "0",
                  }}
                  suffix="원"
                  onChange={(e) =>
                    handleChange("longterm_care_fee", e.target.value)
                  }
                />
              </FlexWrapper>
              <FlexWrapper items="center" gap={2} classes="col-span-12">
                <div className="shrink-0 !w-[100px]">
                  <Label text="4대보험료 총액" />
                </div>
                <Typography variant="B2" classes="text-gray-500 !font-bold">
                  {insurance_total} 원
                </Typography>
              </FlexWrapper>
            </div>
          </FlexWrapper>
        )}

        <FlexWrapper
          items="start"
          direction="col"
          gap={0}
          classes="border rounded-lg "
        >
          <FlexWrapper
            items="center"
            justify="between"
            gap={2}
            classes="py-2 px-4 bg-gray-50 w-full border-b rounded-t-lg"
          >
            <Typography variant="H4">기타</Typography>
          </FlexWrapper>

          <div className="grid grid-cols-12 p-2 gap-4 pb-4 w-full">
            <FlexWrapper items="center" gap={2} classes="col-span-6">
              <div className="shrink-0 !w-[80px]">
                <Label text="기타공제" />
              </div>
              <TextInput
                classes="!text-sm !h-[42px] max-h-[42px]"
                inputProps={{
                  type: "number",
                  value: form.deduction_other,
                  placeholder: "0",
                }}
                suffix="원"
                onChange={(e) =>
                  handleChange("deduction_other", e.target.value)
                }
              />
            </FlexWrapper>
            <FlexWrapper items="center" gap={2} classes="col-span-6">
              <div className="shrink-0 !w-[60px]">
                <Label text="실지급액" />
              </div>
              <Typography variant="B2" classes="text-gray-500 !font-bold">
                {net_amount} 원
              </Typography>
            </FlexWrapper>
          </div>
        </FlexWrapper>

        {/* 메모 */}
        <FlexWrapper direction="col" gap={2}>
          <Label text="비고 / 메모" />
          <Textarea
            value={form.note}
            onChange={(e) => handleChange("note", e.target.value)}
            placeholder="급여에 대한 추가 메모를 입력하세요"
          />
        </FlexWrapper>
      </FlexWrapper>
    </Drawer>
  );
}
