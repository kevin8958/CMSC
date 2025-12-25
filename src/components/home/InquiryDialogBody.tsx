import { useState } from "react";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography"; // ✅ 추가
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

  // ✅ 효율적인 관리를 위해 Set 사용 (참고 컴포넌트 방식)
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  /** 연락처 포맷 */
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length < 4) return numbers;
    if (numbers.length < 8) return numbers.replace(/(\d{3})(\d+)/, "$1-$2");
    return numbers.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
  };

  /** 개별 업무 토글 */
  const toggleTask = (task: string) => {
    const next = new Set(selectedTasks);
    if (next.has(task)) {
      next.delete(task);
    } else {
      next.add(task);
    }
    setSelectedTasks(next);
  };

  /** 그룹 전체 토글 (버튼 클릭용) */
  const toggleGroup = (items: string[]) => {
    const next = new Set(selectedTasks);
    const allSelected = items.every((i) => next.has(i));

    if (allSelected) {
      items.forEach((i) => next.delete(i));
    } else {
      items.forEach((i) => next.add(i));
    }
    setSelectedTasks(next);
  };

  const buildTaskContentText = (
    selectedTasksSet: Set<string>,
    taskGroups: typeof TASK_GROUPS
  ) => {
    // const selectedArray = Array.from(selectedTasksSet);
    return taskGroups
      .map((group) => {
        const selectedInGroup = group.items.filter((item) =>
          selectedTasksSet.has(item)
        );

        if (selectedInGroup.length === 0) return null;

        if (selectedInGroup.length === group.items.length) {
          return `${group.label} 전체`;
        }

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
    if (selectedTasks.size === 0) {
      showAlert("업무를 하나 이상 선택해주세요.", {
        type: "danger",
      });
      return;
    }

    const taskText = buildTaskContentText(selectedTasks, TASK_GROUPS);

    onSubmit({
      phone,
      name,
      position,
      content: taskText.trim(),
    });
    close(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 정보 입력 영역 */}
      <FlexWrapper direction="col" gap={3}>
        <TextInput
          label="연락처"
          required
          inputProps={{ value: phone, maxLength: 13 }}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          placeholder="010-1234-5678"
        />

        <FlexWrapper gap={4} items="center">
          <TextInput
            label="담당자명"
            required
            classes="flex-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
          />
          <TextInput
            label="직책"
            classes="flex-1"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="인사총괄"
          />
        </FlexWrapper>
      </FlexWrapper>

      {/* 업무 선택 영역 (MenuSettingDialogBody 스타일 적용) */}
      <FlexWrapper direction="col" gap={2}>
        <Label text="업무선택" required />
        <FlexWrapper
          direction="col"
          gap={5}
          classes="w-full h-[320px] overflow-y-auto scroll-thin pr-2"
        >
          {TASK_GROUPS.map((group) => {
            const isGroupAllSelected = group.items.every((i) =>
              selectedTasks.has(i)
            );

            return (
              <div key={group.label} className="flex flex-col gap-2">
                {/* 그룹 헤더: 배경색 + 버튼 */}
                <FlexWrapper
                  justify="between"
                  items="center"
                  classes="bg-gray-50 px-3 py-2 rounded"
                >
                  <Typography variant="H4" classes="text-gray-700">
                    {group.label}
                  </Typography>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleGroup(group.items)}
                  >
                    {isGroupAllSelected ? "전체 해제" : "전체 선택"}
                  </Button>
                </FlexWrapper>

                {/* 그룹 내 아이템들: Grid 구성 */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-1">
                  {group.items.map((item) => (
                    <Checkbox
                      key={item}
                      id={item}
                      checked={selectedTasks.has(item)}
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

      {/* 제출 버튼 */}
      <Button
        variant="contain"
        color="green"
        size="lg"
        classes="w-full"
        onClick={handleSubmit}
      >
        문의 보내기
      </Button>
    </div>
  );
}
