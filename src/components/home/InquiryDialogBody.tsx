import { useState } from "react";
import classNames from "classnames";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Label from "@/components/Label";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import { useAlert } from "@/components/AlertProvider";
import Checkbox from "../Checkbox";
import { useDialog } from "@/hooks/useDialog";
import { LuChevronDown } from "react-icons/lu";

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
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  // ✅ 약관 동의 상태
  const [agreeRequired, setAgreeRequired] = useState(false);
  const [agreeOptional, setAgreeOptional] = useState(false);
  const [showDetail, setShowDetail] = useState<{ [key: string]: boolean }>({
    required: false,
    optional: false,
  });

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

  /** 그룹 전체 토글 */
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

  /** 약관 전체 동의 토글 */
  const handleAllAgree = () => {
    const nextState = !(agreeRequired && agreeOptional);
    setAgreeRequired(nextState);
    setAgreeOptional(nextState);
  };

  const buildTaskContentText = (
    selectedTasksSet: Set<string>,
    taskGroups: typeof TASK_GROUPS
  ) => {
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
      showAlert("업무를 하나 이상 선택해주세요.", { type: "danger" });
      return;
    }
    // ✅ 필수 약관 체크 확인
    if (!agreeRequired) {
      showAlert("개인정보 수집 및 이용에 동의해주세요.", { type: "danger" });
      return;
    }

    const taskText = buildTaskContentText(selectedTasks, TASK_GROUPS);

    onSubmit({
      phone,
      name,
      position,
      content: taskText.trim(),
      privacy_policy_agreed: agreeRequired, // 필수 데이터 전송
      marketing_agree: agreeOptional, // 선택 사항 데이터 전송
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

      {/* 업무 선택 영역 */}
      <FlexWrapper direction="col" gap={2}>
        <Label text="업무선택" required />
        <FlexWrapper
          direction="col"
          gap={5}
          classes="w-full h-[220px] overflow-y-auto scroll-thin p-2 border rounded-md"
        >
          {TASK_GROUPS.map((group) => {
            const isGroupAllSelected = group.items.every((i) =>
              selectedTasks.has(i)
            );

            return (
              <div key={group.label} className="flex flex-col gap-2">
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

      {/* ✅ 약관 동의 영역 */}
      <FlexWrapper direction="col" gap={2} classes="bg-white rounded-lg">
        {/* 전체 동의 */}
        <FlexWrapper
          items="center"
          justify="between"
          classes="pb-2 border-b border-gray-100"
        >
          <Checkbox
            id="agree-all"
            checked={agreeRequired && agreeOptional}
            onChange={handleAllAgree}
            label="전체 동의하기"
          />
        </FlexWrapper>

        {/* 필수 약관 */}
        <div className="flex flex-col">
          <FlexWrapper items="center" justify="between" classes="py-1">
            <Checkbox
              id="agree-required"
              checked={agreeRequired}
              onChange={() => setAgreeRequired(!agreeRequired)}
              label="[필수] 개인정보 수집 및 이용 동의"
            />
            <button
              type="button"
              onClick={() =>
                setShowDetail({ ...showDetail, required: !showDetail.required })
              }
              className="p-1 text-gray-400 hover:text-gray-600 transition-transform"
            >
              <LuChevronDown
                className={classNames(showDetail.required && "rotate-180")}
              />
            </button>
          </FlexWrapper>
          {showDetail.required && (
            <div className="p-3 bg-gray-50 rounded text-xs text-gray-500 leading-5 mt-1 whitespace-pre-wrap">
              <strong>개인정보 수집 및 이용에 동의합니다. (필수)</strong>
              {"\n\n"}• 수집 항목: 성함(담당자명), 병의원명, 연락처, 이메일
              주소, 문의 내용{"\n"}• 수집 및 이용 목적: 서비스 도입 상담, 견적
              안내, 본인 확인 및 문의 사항 응대{"\n"}• 보유 및 이용 기간: 상담
              완료 후 1년 (단, 관련 법령에 의거 보존 필요 시 해당 기간까지 보관)
              {"\n"}• 동의 거부 권리: 귀하는 개인정보 수집 및 이용에 거부할
              권리가 있습니다. 단, 거부 시 서비스 상담 및 문의 응대가 제한될 수
              있습니다.
            </div>
          )}
        </div>

        {/* 선택 약관 */}
        <div className="flex flex-col">
          <FlexWrapper items="center" justify="between" classes="py-1">
            <Checkbox
              id="agree-optional"
              checked={agreeOptional}
              onChange={() => setAgreeOptional(!agreeOptional)}
              label="[선택] 마케팅 목적 이용 동의"
            />
            <button
              type="button"
              onClick={() =>
                setShowDetail({ ...showDetail, optional: !showDetail.optional })
              }
              className="p-1 text-gray-400 hover:text-gray-600 transition-transform"
            >
              <LuChevronDown
                className={classNames(showDetail.optional && "rotate-180")}
              />
            </button>
          </FlexWrapper>
          {showDetail.optional && (
            <div className="p-3 bg-gray-50 rounded text-xs text-gray-500 leading-5 mt-1 whitespace-pre-wrap">
              <strong>
                이벤트, 혜택 등 마케팅 정보 수신에 동의합니다. (선택)
              </strong>
              {"\n\n"}• 수집 목적: 신규 서비스 안내(뉴스레터), 이벤트 및
              프로모션 정보 제공, 홍보 자료 발송{"\n"}• 수집 항목: 연락처,
              이메일 주소{"\n"}• 보유 및 이용 기간: 동의 철회 시 또는 서비스
              종료 시까지{"\n"}• 동의 거부 권리: 선택 사항이므로 동의하지 않아도
              서비스 상담 이용이 가능합니다.
            </div>
          )}
        </div>
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
