import { useState, useEffect } from "react";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Button from "@/components/Button";
import { useDialog } from "@/hooks/useDialog";
import { useAlert } from "@/components/AlertProvider";
import { useCompanyStore } from "@/stores/useCompanyStore";
import Checkbox from "../Checkbox";

// 메뉴 구성 데이터
const MENU_CONFIG = [
  {
    title: "기본항목",
    items: [
      { id: "dashboard", label: "대시보드" },
      { id: "communication", label: "업무소통" },
    ],
  },
  {
    title: "인사지원",
    items: [
      { id: "worker", label: "근로자관리" },
      { id: "salary", label: "급여대장" },
      { id: "bonus", label: "수당/상여대장" },
      { id: "attendance", label: "연차휴가대장" },
      { id: "education", label: "교육관리" },
      { id: "time-management", label: "근태관리" },
      { id: "welfare", label: "복리후생관리" },
      { id: "health-check", label: "건강검진관리" },
    ],
  },
  {
    title: "회계지원",
    items: [
      { id: "income", label: "손익계산서" },
      { id: "expense", label: "고정비변동비" },
      { id: "card-usage", label: "카드사용내역" },
      { id: "account-history", label: "계좌별거래내역" },
      { id: "vendor-ledger", label: "거래처별원장" },
      { id: "vehicle-log", label: "차량운행일지" },
      { id: "severance-pension", label: "퇴직연금운용" },
      { id: "loan-management", label: "대출/이자관리" },
    ],
  },
  {
    title: "계약구매지원",
    items: [
      { id: "vendor-management", label: "거래처관리" },
      { id: "contract-management", label: "계약관리" },
      { id: "equipment-purchase", label: "비품 구매내역" },
      { id: "material-purchase", label: "재료대 구매내역" },
      { id: "medicine-purchase", label: "의약품 구매내역" },
      { id: "special-medical-device", label: "특수의료장비 관리" },
      { id: "medical-waste", label: "의료폐기물 관리" },
    ],
  },
  {
    title: "채용관리",
    items: [
      { id: "job-posting", label: "채용공고현황" },
      { id: "applicant-management", label: "지원자관리" },
      { id: "new-hire-management", label: "입사자관리" },
      { id: "posting-design", label: "공고디자인" },
      { id: "market-analysis", label: "시장지표분석" },
    ],
  },
  {
    title: "자료관리",
    items: [{ id: "document", label: "자료관리" }],
  },
];

function MenuSettingDialogBody() {
  const { close } = useDialog();
  const { showAlert } = useAlert();
  const {
    currentCompanyId,
    currentCompanyDetail,
    fetchCurrentCompanyDetail,
    updateCompanyMenus,
  } = useCompanyStore();

  // 선택된 메뉴 ID들을 관리하는 State (Set 사용)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentCompanyId) {
      fetchCurrentCompanyDetail();
    }
  }, [currentCompanyId]);

  // 2. 데이터가 로드되면 로컬 State에 반영
  useEffect(() => {
    if (currentCompanyDetail?.enabled_menus) {
      setSelectedIds(new Set(currentCompanyDetail.enabled_menus));
    }
  }, [currentCompanyDetail]);

  // 개별 토글 함수
  const toggleItem = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // 그룹 전체 토글 함수
  const toggleGroup = (itemIds: string[]) => {
    const next = new Set(selectedIds);
    const allSelected = itemIds.every((id) => next.has(id));

    if (allSelected) {
      // 모두 선택되어 있다면 해제
      itemIds.forEach((id) => next.delete(id));
    } else {
      // 하나라도 해제되어 있다면 모두 선택
      itemIds.forEach((id) => next.add(id));
    }
    setSelectedIds(next);
  };

  // 저장하기
  const onSave = async () => {
    if (!currentCompanyId || submitting) return;

    try {
      setSubmitting(true);
      // 스토어 함수 호출
      await updateCompanyMenus(currentCompanyId, Array.from(selectedIds));

      showAlert("메뉴 설정이 저장되었습니다.", { type: "success" });
      close(true);
    } catch (err: any) {
      showAlert(err.message || "저장 중 오류 발생", { type: "danger" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FlexWrapper direction="col" gap={6} classes="w-full max-h-[70vh]">
      {/* 메뉴 리스트 영역 */}
      <FlexWrapper
        direction="col"
        gap={5}
        classes="flex-1 overflow-y-auto scroll-thin pr-2"
      >
        {MENU_CONFIG.map((group) => {
          const itemIds = group.items.map((i) => i.id);
          const isGroupAllSelected = itemIds.every((id) => selectedIds.has(id));

          return (
            <div key={group.title || "default"} className="flex flex-col gap-2">
              {/* 그룹 헤더 */}
              <FlexWrapper
                justify="between"
                items="center"
                classes="bg-gray-50 p-2 rounded"
              >
                <Typography variant="H4" classes="text-gray-700">
                  {group.title || "기본 메뉴"}
                </Typography>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleGroup(itemIds)}
                >
                  {isGroupAllSelected ? "전체 해제" : "전체 선택"}
                </Button>
              </FlexWrapper>

              {/* 그룹 내 아이템들 */}
              <div className="grid grid-cols-2 gap-2 p-1">
                {group.items.map((item) => {
                  return (
                    <Checkbox
                      key={item.id}
                      id={item.id}
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleItem(item.id)}
                      label={item.label}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </FlexWrapper>

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
          {submitting ? "저장 중..." : "설정 저장하기"}
        </Button>
      </FlexWrapper>
    </FlexWrapper>
  );
}

export default MenuSettingDialogBody;
