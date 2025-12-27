import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import dayjs from "dayjs";
import CustomDatePicker from "@/components/DatePicker";
import { useEffect, useState } from "react";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { usePayrollStore } from "@/stores/usePayrollStore"; // ✅ 새 스토어 임포트
import SalaryHeader from "@/components/salary/SalaryHeader";
import SalaryTable from "@/components/salary/SalaryTable";
import Badge from "@/components/Badge";

function Salary() {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(
    dayjs().toDate()
  );

  const { currentCompanyId } = useCompanyStore();

  // ✅ usePayrollStore에서 필요한 상태와 액션만 추출
  const { total, fetchRecords, clear } = usePayrollStore();

  // ✅ 데이터 페칭 로직 통합
  // 회사 ID가 바뀌거나 선택된 달이 바뀔 때 데이터를 새로 불러옵니다.
  useEffect(() => {
    if (currentCompanyId && selectedMonth) {
      fetchRecords(1, 10, selectedMonth);
    }

    // 컴포넌트 언마운트 시 데이터 초기화 (선택 사항)
    return () => clear();
  }, [currentCompanyId, selectedMonth, fetchRecords, clear]);

  return (
    <>
      {/* 상단 타이틀 및 날짜 선택 영역 */}
      <FlexWrapper gap={4} items="start" justify="between" classes="w-full">
        <FlexWrapper gap={2} items="center">
          <Typography variant="H3" classes="shrink-0">
            급여대장
          </Typography>
          <Badge color="green" size="md">
            {total}
          </Badge>
        </FlexWrapper>

        <CustomDatePicker
          variant="outline"
          size="md"
          type="month"
          isMonthPicker
          dateFormat="YYYY.MM"
          value={selectedMonth}
          onChange={(date) => setSelectedMonth(date)}
        />
      </FlexWrapper>

      {/* ✅ Header: 엑셀 업로드 및 전체 삭제 버튼이 포함될 곳 */}
      {/* selectedMonth를 넘겨주어 해당 월에 대한 액션이 가능하도록 합니다. */}
      <SalaryHeader selectedMonth={selectedMonth} />

      {/* ✅ Table: 데이터 표시 전용 (개별 수정 삭제 기능 제거) */}
      <SalaryTable
        month={selectedMonth}
        // 개별 데이터 수정이 없으므로 onRowClick은 필요에 따라 제거하거나 뷰어로만 활용
        onRowClick={(row) => {
          console.log("선택된 데이터:", row);
        }}
      />
    </>
  );
}

export default Salary;
