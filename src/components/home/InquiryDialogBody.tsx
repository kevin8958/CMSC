import { useState } from "react";
import FlexWrapper from "@/layout/FlexWrapper";
import Label from "@/components/Label";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import { useAlert } from "@/components/AlertProvider";
import Checkbox from "../Checkbox";
import { useDialog } from "@/hooks/useDialog";

/** 업무 선택 데이터 */
const TASK_GROUPS = [
  {
    label: "기본업무",
    items: ["사무업무지원", "이미지제작", "기본회계/인사관리"],
  },
  {
    label: "현장업무",
    items: ["기기·설비관리", "대리인업무", "우편·서류 수발신"],
  },
  {
    label: "인사업무",
    items: [
      "입퇴사자관리",
      "근태/급여관리",
      "인사기록/문서관리",
      "복리후생 관리",
      "교육관리",
    ],
  },
  {
    label: "회계업무",
    items: ["매입매출정리", "증빙관리", "세무신고관리"],
  },
  {
    label: "채용업무",
    items: ["채용공고제작", "공고등록관리", "지원자관리"],
  },
  {
    label: "계약/구매관리",
    items: ["거래처관리", "비품/물품발주", "재료대신고", "렌탈/리스관리"],
  },
];

export default function InquiryDialogBody({
  onSubmit,
}: {
  onSubmit: (data: any) => void;
}) {
  const { showAlert } = useAlert();
  const { close } = useDialog();

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  /** 연락처 포맷 */
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length < 4) return numbers;
    if (numbers.length < 8) return numbers.replace(/(\d{3})(\d+)/, "$1-$2");
    return numbers.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
  };

  /** 개별 업무 토글 */
  const toggleTask = (task: string) => {
    setSelectedTasks((prev) =>
      prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task]
    );
  };

  /** 그룹 전체 토글 */
  const toggleGroup = (items: string[]) => {
    const allSelected = items.every((i) => selectedTasks.includes(i));

    setSelectedTasks((prev) =>
      allSelected
        ? prev.filter((t) => !items.includes(t))
        : Array.from(new Set([...prev, ...items]))
    );
  };

  const buildTaskContentText = (
    selectedTasks: string[],
    taskGroups: typeof TASK_GROUPS
  ) => {
    return taskGroups
      .map((group) => {
        const selectedInGroup = group.items.filter((item) =>
          selectedTasks.includes(item)
        );

        if (selectedInGroup.length === 0) return null;

        // ✅ 그룹 전체 선택
        if (selectedInGroup.length === group.items.length) {
          return `${group.label} 전체`;
        }

        // ✅ 일부 선택
        return `${group.label} - ${selectedInGroup.join(", ")}`;
      })
      .filter(Boolean)
      .join("\n");
  };

  /** 제출 */
  const handleSubmit = () => {
    if (!phone.trim()) {
      showAlert("연락처를 입력해주세요.", { type: "danger" });
      return;
    }
    if (!name.trim()) {
      showAlert("담당자명을 입력해주세요.", { type: "danger" });
      return;
    }
    if (selectedTasks.length === 0) {
      showAlert("업무를 하나 이상 선택해주세요.", {
        type: "danger",
      });
      return;
    }
    const taskText = buildTaskContentText(selectedTasks, TASK_GROUPS);

    const mergedContent = `
${taskText}
`.trim();

    onSubmit({
      phone,
      name,
      position,
      content: mergedContent,
    });
    close(true);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* 연락처 */}
      <TextInput
        label="연락처"
        required
        inputProps={{ value: phone, maxLength: 13 }}
        onChange={(e) => setPhone(formatPhone(e.target.value))}
        placeholder="010-1234-5678"
      />

      {/* 담당자명 */}
      <FlexWrapper gap={4} items="center">
        <TextInput
          label="담당자명"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동"
        />

        {/* 직책 */}
        <TextInput
          label="직책"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="인사총괄"
        />
      </FlexWrapper>

      {/* 업무 선택 */}
      <FlexWrapper gap={2} direction="col" items="start">
        <Label text="업무선택" required />

        <FlexWrapper
          gap={2}
          items="start"
          direction="col"
          classes="w-full h-[300px] overflow-y-auto"
        >
          {TASK_GROUPS.map((group) => {
            const allChecked = group.items.every((i) =>
              selectedTasks.includes(i)
            );

            return (
              <div
                key={group.label}
                className="border rounded-lg p-3 bg-gray-50 w-full"
              >
                <Checkbox
                  id={group.label}
                  checked={allChecked}
                  onChange={() => toggleGroup(group.items)}
                  label={`${group.label} 전체`}
                />
                <div className="grid grid-cols-2 gap-2 mt-2 pl-6">
                  {group.items.map((item) => (
                    <Checkbox
                      id={item}
                      checked={selectedTasks.includes(item)}
                      onChange={() => toggleTask(item)}
                      label={item}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </FlexWrapper>
      </FlexWrapper>
      {/* 제출 */}
      <Button
        variant="contain"
        color="green"
        size="lg"
        classes="w-full mt-2"
        onClick={handleSubmit}
      >
        문의 보내기
      </Button>
    </div>
  );
}
