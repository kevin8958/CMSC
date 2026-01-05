import { useEffect, useState } from "react";
import Drawer from "@/components/Drawer";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Dropdown from "@/components/Dropdown";
import Label from "@/components/Label";
import TextInput from "@/components/TextInput";
import Textarea from "@/components/TextArea";
import CustomDatePicker from "@/components/DatePicker";
import dayjs from "dayjs";

const CONTRACT_STATUS = {
  active: { label: "계약 중", color: "green" },
  terminated: { label: "계약 종료", color: "gray" },
} as const;

type ContractStatus = keyof typeof CONTRACT_STATUS;

const ContractStatusBadge = ({ status }: { status: ContractStatus }) => {
  const config = CONTRACT_STATUS[status];
  const colorClass =
    status === "active"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <div
      className={`px-2 py-0.5 rounded text-xs font-medium border ${colorClass} w-[70px] text-center`}
    >
      {config.label}
    </div>
  );
};

interface ContractDrawerProps {
  open: boolean;
  disabled?: boolean;
  mode: "create" | "edit";
  contract?: Contract.Contract | null;
  categories: Contract.Category[];
  onClose: () => void;
  onSubmit: (data: Partial<Contract.Contract>) => Promise<void>;
  onDelete?: () => void;
}

export default function ContractDrawer({
  open,
  disabled,
  mode,
  contract,
  categories,
  onClose,
  onSubmit,
  onDelete,
}: ContractDrawerProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<ContractStatus>("active");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  // 담당자 상세 정보 State
  const [managerName, setManagerName] = useState("");
  const [managerPhone, setManagerPhone] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [fax, setFax] = useState("");

  const [contractDate, setContractDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ title: "" });

  useEffect(() => {
    if (contract && open) {
      setTitle(contract.title || "");
      setStatus((contract.status as ContractStatus) || "active");
      setCategoryId(contract.category_id || null);
      setManagerName(contract.manager_name || "");
      setManagerPhone(contract.manager_phone || "");
      setManagerEmail(contract.manager_email || "");
      setFax(contract.fax || "");
      setContractDate(
        contract.contract_date
          ? dayjs(contract.contract_date).toDate()
          : new Date()
      );
      setEndDate(contract.end_date ? dayjs(contract.end_date).toDate() : null);
      setDescription(contract.description || "");
      setErrors({ title: "" });
    } else if (open) {
      setTitle("");
      setStatus("active");
      setCategoryId(null);
      setManagerName("");
      setManagerPhone("");
      setManagerEmail("");
      setFax("");
      setContractDate(new Date());
      setEndDate(null);
      setDescription("");
      setErrors({ title: "" });
    }
  }, [contract, open]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setErrors({ title: "계약명은 필수 입력사항입니다." });
      return;
    }
    await onSubmit({
      title: title.trim(),
      status,
      category_id: categoryId,
      manager_name: managerName,
      manager_phone: managerPhone,
      manager_email: managerEmail,
      fax: fax,
      contract_date: contractDate
        ? dayjs(contractDate).format("YYYY-MM-DD")
        : undefined,
      end_date: endDate ? dayjs(endDate).format("YYYY-MM-DD") : undefined,
      description,
    });
  };

  const categoryItems = [
    { type: "item" as const, id: "none", label: "분류 없음" },
    ...categories.map((cat) => ({
      type: "item" as const,
      id: cat.id,
      label: cat.name,
    })),
  ];

  return (
    <Drawer
      open={open}
      title={
        <FlexWrapper items="center" gap={2}>
          <Dropdown
            hideDownIcon
            buttonVariant="clear"
            items={(Object.keys(CONTRACT_STATUS) as ContractStatus[]).map(
              (s) => ({
                type: "item",
                id: s,
                label: <ContractStatusBadge status={s} />,
              })
            )}
            onChange={(val) => setStatus(val as ContractStatus)}
            disabled={disabled}
            dialogWidth={90}
            buttonItem={<ContractStatusBadge status={status} />}
            buttonClasses="!p-0 !h-fit hover:bg-transparent"
          />
          <Typography variant="H4">
            {mode === "create" ? "계약 등록" : "계약 정보"}
          </Typography>
        </FlexWrapper>
      }
      showFooter={!disabled}
      confirmText={mode === "create" ? "등록하기" : "수정하기"}
      onClose={onClose}
      onCancel={onClose}
      onDelete={onDelete}
      onConfirm={handleSubmit}
    >
      <FlexWrapper direction="col" gap={5} classes="pt-4 pb-6 px-4">
        {/* --- 기본 정보 --- */}
        <section className="space-y-4">
          <Typography
            variant="B2"
            classes="font-bold text-gray-400 border-b pb-1"
          >
            계약 기본 정보
          </Typography>
          <FlexWrapper items="center" gap={2}>
            <div className="shrink-0 w-[80px]">
              <Label text="계약명" required />
            </div>
            <TextInput
              classes="!text-sm !h-[42px]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={disabled}
              error={!!errors.title}
              errorMsg={errors.title}
              placeholder="계약 이름을 입력하세요"
            />
          </FlexWrapper>
          <FlexWrapper items="center" gap={2}>
            <div className="shrink-0 w-[80px]">
              <Label text="계약분류" />
            </div>
            <Dropdown
              buttonVariant="outline"
              disabled={disabled}
              items={categoryItems}
              onChange={(val) =>
                setCategoryId(val === "none" ? null : (val as string))
              }
              dialogWidth={200}
              buttonItem={
                categoryId
                  ? categories.find((c) => c.id === categoryId)?.name
                  : "분류 선택"
              }
              buttonClasses="!font-normal !w-[160px] !h-[38px] !border-gray-300 hover:!bg-gray-50 !text-sm"
            />
          </FlexWrapper>
        </section>

        {/* --- 담당자 정보 --- */}
        <section className="space-y-4">
          <Typography
            variant="B2"
            classes="font-bold text-gray-400 border-b pb-1"
          >
            담당자 정보
          </Typography>
          <FlexWrapper items="center" gap={2}>
            <div className="shrink-0 w-[80px]">
              <Label text="담당자명" />
            </div>
            <TextInput
              classes="!text-sm !h-[42px]"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              disabled={disabled}
              placeholder="담당자 성함 입력"
            />
          </FlexWrapper>
          <FlexWrapper items="center" gap={2}>
            <div className="shrink-0 w-[80px]">
              <Label text="연락처" />
            </div>
            <TextInput
              classes="!text-sm !h-[42px]"
              value={managerPhone}
              onChange={(e) => setManagerPhone(e.target.value)}
              disabled={disabled}
              placeholder="010-0000-0000"
            />
          </FlexWrapper>
          <FlexWrapper items="center" gap={2}>
            <div className="shrink-0 w-[80px]">
              <Label text="이메일" />
            </div>
            <TextInput
              classes="!text-sm !h-[42px]"
              value={managerEmail}
              onChange={(e) => setManagerEmail(e.target.value)}
              disabled={disabled}
              placeholder="example@email.com"
            />
          </FlexWrapper>
          <FlexWrapper items="center" gap={2}>
            <div className="shrink-0 w-[80px]">
              <Label text="팩스번호" />
            </div>
            <TextInput
              classes="!text-sm !h-[42px]"
              value={fax}
              onChange={(e) => setFax(e.target.value)}
              disabled={disabled}
              placeholder="02-000-0000"
            />
          </FlexWrapper>
        </section>

        {/* --- 계약 기간 --- */}
        <section className="space-y-4">
          <Typography
            variant="B2"
            classes="font-bold text-gray-400 border-b pb-1"
          >
            계약 기간
          </Typography>
          <FlexWrapper items="center" gap={2}>
            <div className="shrink-0 w-[80px]">
              <Label text="시작일" />
            </div>
            <CustomDatePicker
              classes="w-[140px]"
              type="single"
              variant="outline"
              size="sm"
              disabled={disabled}
              dateFormat="YYYY.MM.DD"
              value={contractDate}
              onChange={(date) => setContractDate(date)}
            />
          </FlexWrapper>
          <FlexWrapper items="center" gap={2}>
            <div className="shrink-0 w-[80px]">
              <Label text="종료일" />
            </div>
            <CustomDatePicker
              classes="w-[140px]"
              type="single"
              variant="outline"
              size="sm"
              disabled={disabled}
              dateFormat="YYYY.MM.DD"
              value={endDate}
              onChange={(date) => setEndDate(date)}
            />
          </FlexWrapper>
        </section>

        <section className="space-y-2">
          <Label text="계약 상세 메모" />
          <Textarea
            value={description}
            disabled={disabled}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="계약 조건 등을 입력하세요"
          />
        </section>
      </FlexWrapper>
    </Drawer>
  );
}
