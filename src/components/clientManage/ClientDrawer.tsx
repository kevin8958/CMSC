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

// 거래처 상태 설정
const CLIENT_STATUS = {
  active: { label: "거래 중", color: "green" },
  terminated: { label: "거래 종료", color: "gray" },
} as const;

type ClientStatus = keyof typeof CLIENT_STATUS;

const ClientStatusBadge = ({ status }: { status: ClientStatus }) => {
  const config = CLIENT_STATUS[status];
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

interface ClientDrawerProps {
  open: boolean;
  disabled?: boolean;
  mode: "create" | "edit";
  client?: Client.Client | null; // 실제 Client 타입 적용 권장
  onClose: () => void;
  onSubmit: (data: Partial<Client.Client>) => Promise<void>;
  onDelete?: () => void;
}

export default function ClientDrawer({
  open,
  disabled,
  mode,
  client,
  onClose,
  onSubmit,
  onDelete,
}: ClientDrawerProps) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<ClientStatus>("active");

  // 담당자 정보 필드 세분화
  const [managerName, setManagerName] = useState("");
  const [managerPhone, setManagerPhone] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [fax, setFax] = useState("");

  const [contractDate, setContractDate] = useState<Date | null>(new Date());
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ name: "" });

  // 초기화 및 데이터 바인딩
  useEffect(() => {
    if (client && open) {
      setName(client.name || "");
      setStatus((client.status as ClientStatus) || "active");
      setManagerName(client.manager_name || "");
      setManagerPhone(client.manager_phone || "");
      setManagerEmail(client.manager_email || "");
      setFax(client.fax || "");
      setContractDate(
        client.contract_date ? dayjs(client.contract_date).toDate() : new Date()
      );
      setDescription(client.description || "");
      setErrors({ name: "" });
    } else if (open) {
      // 초기화
      setName("");
      setStatus("active");
      setManagerName("");
      setManagerPhone("");
      setManagerEmail("");
      setFax("");
      setContractDate(new Date());
      setDescription("");
      setErrors({ name: "" });
    }
  }, [client, open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrors({ name: "거래처명은 필수 입력사항입니다." });
      return;
    }

    await onSubmit({
      name: name.trim(),
      status,
      manager_name: managerName,
      manager_phone: managerPhone,
      manager_email: managerEmail,
      fax: fax,
      contract_date: contractDate
        ? dayjs(contractDate).format("YYYY-MM-DD")
        : undefined,
      description,
    });
  };

  const statusItems = (Object.keys(CLIENT_STATUS) as ClientStatus[]).map(
    (s) => ({
      type: "item" as const,
      id: s,
      label: <ClientStatusBadge status={s} />,
    })
  );

  return (
    <Drawer
      open={open}
      title={
        <FlexWrapper items="center" gap={2}>
          <Dropdown
            hideDownIcon
            buttonVariant="clear"
            items={statusItems}
            onChange={(val) => setStatus(val as ClientStatus)}
            disabled={disabled}
            dialogWidth={90}
            buttonItem={<ClientStatusBadge status={status} />}
            buttonClasses="!p-0 !h-fit hover:bg-transparent"
          />
          <Typography variant="H4">
            {mode === "create"
              ? "거래처 등록"
              : disabled
                ? "거래처 정보"
                : "거래처 수정"}
          </Typography>
        </FlexWrapper>
      }
      showFooter={!disabled}
      confirmText={mode === "create" ? "등록하기" : "수정하기"}
      deleteText="삭제"
      onClose={onClose}
      onCancel={onClose}
      onDelete={onDelete}
      onConfirm={handleSubmit}
    >
      <FlexWrapper direction="col" gap={5} classes="pt-4 pb-6 px-4">
        {/* --- 기본 정보 섹션 --- */}
        <section className="space-y-4">
          <Typography
            variant="B2"
            classes="font-bold text-gray-400 border-b pb-1"
          >
            기본 정보
          </Typography>

          <FlexWrapper items="center" gap={2}>
            <div className="shrink-0 w-[80px]">
              <Label text="거래처명" required />
            </div>
            <TextInput
              classes="!text-sm !h-[42px]"
              inputProps={{
                value: name,
              }}
              disabled={disabled}
              error={!!errors.name}
              errorMsg={errors.name}
              onChange={(e) => setName(e.target.value)}
              placeholder="거래처 이름을 입력하세요"
            />
          </FlexWrapper>

          <FlexWrapper items="center" gap={2}>
            <div className="shrink-0 w-[80px]">
              <Label text="계약일" />
            </div>
            <CustomDatePicker
              classes="w-[140px]"
              type="single"
              variant="outline"
              size="sm"
              disabled={disabled}
              dateFormat="yyyy.MM.dd"
              value={contractDate}
              onChange={(date) => setContractDate(date)}
            />
          </FlexWrapper>
        </section>

        {/* --- 담당자 정보 섹션 --- */}
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
              inputProps={{
                value: managerName,
              }}
              disabled={disabled}
              onChange={(e) => setManagerName(e.target.value)}
              placeholder="담당자 성함 입력"
            />
          </FlexWrapper>

          <FlexWrapper items="center" gap={2}>
            <div className="shrink-0 w-[80px]">
              <Label text="연락처" />
            </div>
            <TextInput
              classes="!text-sm !h-[42px]"
              inputProps={{
                value: managerPhone,
              }}
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
              inputProps={{
                value: managerEmail,
              }}
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
              inputProps={{
                value: fax,
              }}
              disabled={disabled}
              onChange={(e) => setFax(e.target.value)}
              placeholder="02-000-0000"
            />
          </FlexWrapper>
        </section>

        {/* --- 기타 메모 --- */}
        <section className="space-y-2">
          <Label text="상세 메모 (비고)" />
          <Textarea
            value={description}
            disabled={disabled}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="거래처 관련 특이사항을 입력하세요"
          />
        </section>
      </FlexWrapper>
    </Drawer>
  );
}
