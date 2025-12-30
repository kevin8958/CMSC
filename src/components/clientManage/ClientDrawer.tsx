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
// 임의의 상태 설정 (프로젝트의 실제 경로에 맞춰 수정 필요)
const CLIENT_STATUS = {
  active: { label: "거래 중", color: "green" },
  terminated: { label: "거래 종료", color: "gray" },
} as const;

type ClientStatus = keyof typeof CLIENT_STATUS;

// 거래처 상태 배지 (TaskStatusBadge 대신 간단히 구현하거나 기존 것을 활용)
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
  client?: any; // 실제 Client 타입으로 교체 필요
  workers: any[]; // 담당자(직원) 목록
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  onDelete?: () => void;
}

export default function ClientDrawer({
  open,
  disabled,
  mode,
  client,
  workers,
  onClose,
  onSubmit,
  onDelete,
}: ClientDrawerProps) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<ClientStatus>("active");
  const [contact, setContact] = useState(""); // 연락처 추가
  const [managerId, setManagerId] = useState(""); // 담당자
  const [contractDate, setContractDate] = useState<Date | null>(new Date());
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ name: "" });

  useEffect(() => {
    if (client) {
      setName(client.name || "");
      setStatus((client.status as ClientStatus) || "active");
      setContact(client.contact || "");
      setManagerId(client.manager_id || "");
      setContractDate(
        client.contract_date ? dayjs(client.contract_date).toDate() : new Date()
      );
      setDescription(client.description || "");
    } else {
      setName("");
      setStatus("active");
      setContact("");
      setManagerId("");
      setContractDate(new Date());
      setDescription("");
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
      contact,
      manager_id: managerId || undefined,
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
      <FlexWrapper direction="col" gap={4} classes="pt-4 pb-6 px-4">
        {/* 거래처명 */}
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 w-[80px]">
            <Label text="거래처명" required />
          </div>
          <TextInput
            classes="!text-sm !h-[42px]"
            inputProps={{ value: name }}
            disabled={disabled}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            errorMsg={errors.name}
            placeholder="거래처 이름을 입력하세요"
          />
        </FlexWrapper>

        {/* 연락처 */}
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 w-[80px]">
            <Label text="연락처" />
          </div>
          <TextInput
            classes="!text-sm !h-[42px]"
            inputProps={{ value: contact }}
            disabled={disabled}
            onChange={(e) => setContact(e.target.value)}
            placeholder="010-0000-0000"
          />
        </FlexWrapper>

        {/* 담당자 (내부 직원) */}
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 w-[80px]">
            <Label text="담당 직원" />
          </div>
          <Dropdown
            hideDownIcon
            buttonSize="sm"
            buttonVariant="outline"
            disabled={disabled}
            items={workers.map((w) => ({
              type: "item",
              id: w.id,
              label: w.name,
            }))}
            dialogWidth={160}
            onChange={(val) => setManagerId(val as string)}
            buttonItem={
              managerId
                ? workers.find((w) => w.id === managerId)?.name
                : "직원 선택"
            }
            buttonClasses="!font-normal !w-[140px] !h-[36px] !border-gray-300 hover:!bg-gray-50 !text-sm"
          />
        </FlexWrapper>

        {/* 계약일 / 거래 시작일 */}
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
            dateFormat="YYYY.MM.DD"
            value={contractDate}
            onChange={(date) => setContractDate(date)}
          />
        </FlexWrapper>

        {/* 설명 / 비고 */}
        <div className="space-y-2">
          <Label text="상세 메모" />
          <Textarea
            value={description}
            disabled={disabled}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="거래처 관련 특이사항을 입력하세요"
          />
        </div>
      </FlexWrapper>
    </Drawer>
  );
}
