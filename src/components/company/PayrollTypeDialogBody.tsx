import { useState, useEffect } from "react";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Button from "@/components/Button";
import { useDialog } from "@/hooks/useDialog";
import { useAlert } from "@/components/AlertProvider";
import { useCompanyStore } from "@/stores/useCompanyStore";

// 타입별 항목 정의
const PAYROLL_TYPES = {
  A: {
    title: "A타입 (상세형)",
    description: "야간/나이트/당직 등 세부 수당 관리가 필요한 경우",
    items: [
      "성명",
      "부서명",
      "직급",
      "급여",
      "고정연장",
      "고정야간",
      "연차수당",
      "육아수당",
      "차량보조",
      "식대",
      "추가연장",
      "연차정산",
      "나이트수당",
      "OFF미사용",
      "직책수당",
      "당직수당",
      "상여금",
      "인센티브",
      "조정및소급",
      "고용보험",
      "건강보험",
      "장기요양",
      "국민연금",
      "소득세",
      "지방소득세",
      "세액정산",
    ],
  },
  B: {
    title: "B타입 (표준형)",
    description: "일반적인 수당 체계로 간결하게 관리하는 경우",
    items: [
      "성명",
      "부서명",
      "직급",
      "급여",
      "연장수당",
      "연차수당",
      "육아수당",
      "차량보조",
      "식대",
      "직책수당",
      "상여금",
      "인센티브",
      "조정및소급",
      "고용보험",
      "건강보험",
      "장기요양",
      "국민연금",
      "소득세",
      "지방소득세",
      "세액정산",
    ],
  },
};

function PayrollTypeDialogBody() {
  const { close } = useDialog();
  const { showAlert } = useAlert();
  const {
    currentCompanyId,
    currentCompanyDetail,
    fetchCurrentCompanyDetail,
    updateCompanyPayrollType,
  } = useCompanyStore();

  const [selectedType, setSelectedType] = useState<"A" | "B">("A");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentCompanyId) {
      fetchCurrentCompanyDetail();
    }
  }, [currentCompanyId]);

  // 초기 로드 시 기존 설정값 반영 (예시 logic)
  useEffect(() => {
    if (currentCompanyDetail?.payroll_type) {
      setSelectedType(currentCompanyDetail.payroll_type as "A" | "B");
    }
  }, [currentCompanyDetail]);
  const onSave = async () => {
    if (!currentCompanyId || submitting) return;

    try {
      setSubmitting(true);

      // 1. 스토어의 업데이트 함수 호출
      // 서버의 필드명에 따라 객체 형태로 보낼 수도 있으니 스토어 구현에 맞춰 조정하세요.
      await updateCompanyPayrollType(currentCompanyId, selectedType);

      showAlert(`${selectedType}타입 양식이 성공적으로 설정되었습니다.`, {
        type: "success",
      });

      // 2. 성공 시 다이얼로그 닫기 (true를 넘겨 부모에서 갱신 트리거 가능)
      close(true);
    } catch (err: any) {
      console.error(err);
      showAlert(err.message || "양식 설정 중 오류가 발생했습니다.", {
        type: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FlexWrapper direction="col" gap={6} classes="w-full max-w-4xl">
      <FlexWrapper direction="col" gap={1}>
        <Typography variant="H3">급여대장 양식 설정</Typography>
        <Typography variant="B2" classes="text-gray-500">
          회사의 수당 체계에 맞는 급여대장 양식을 선택해주세요.
        </Typography>
      </FlexWrapper>

      {/* 타입 선택 영역 */}
      <div className="grid grid-cols-2 gap-4">
        {(["A", "B"] as const).map((type) => {
          const isSelected = selectedType === type;
          const config = PAYROLL_TYPES[type];

          return (
            <div
              key={type}
              onClick={() => setSelectedType(type)}
              className={`
                cursor-pointer p-5 rounded-xl border-2 transition-all
                ${
                  isSelected
                    ? "border-green-500 bg-green-50/30 ring-1 ring-green-500"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }
              `}
            >
              <FlexWrapper justify="between" items="center" classes="mb-3">
                <Typography
                  variant="H4"
                  classes={isSelected ? "text-green-700" : "text-gray-700"}
                >
                  {config.title}
                </Typography>
                <div
                  className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${isSelected ? "border-green-500 bg-green-500" : "border-gray-300"}
                `}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </FlexWrapper>

              <Typography variant="B2" classes="text-gray-500 mb-4">
                {config.description}
              </Typography>

              {/* 항목 리스트 칩 형태 */}
              <div className="flex flex-wrap gap-1.5 max-h-[250px] overflow-y-auto pr-1">
                {config.items.map((item) => (
                  <span
                    key={item}
                    className={`
                      px-2 py-1 text-[11px] rounded border
                      ${
                        isSelected
                          ? "bg-white border-green-200 text-green-700"
                          : "bg-gray-50 border-gray-200 text-gray-600"
                      }
                    `}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 하단 버튼 */}
      <FlexWrapper gap={2} classes="pt-4 border-t border-gray-100">
        <Button
          size="lg"
          variant="outline"
          classes="flex-1"
          onClick={() => close()}
        >
          취소
        </Button>
        <Button
          size="lg"
          color="green"
          variant="contain"
          classes="flex-1"
          disabled={submitting}
          onClick={onSave}
        >
          {submitting ? "저장 중..." : "이 양식으로 설정하기"}
        </Button>
      </FlexWrapper>
    </FlexWrapper>
  );
}

export default PayrollTypeDialogBody;
