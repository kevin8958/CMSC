import { useMemo, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Table from "@/components/Table";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { usePayrollStore } from "@/stores/usePayrollStore";

// 금액 포맷터 헬퍼
const formatKRW = (value: any) => Number(value || 0).toLocaleString() + "원";

interface PayrollItem {
  accessorKey: string;
  header: string;
}

function SalaryTable(props: {
  month: Date | null;
  onRowClick?: (row: any) => void;
}) {
  const { month, onRowClick } = props;
  const { currentCompanyId, currentCompanyDetail } = useCompanyStore();
  const { list, total, fetchRecords, loading } = usePayrollStore();

  // 회사의 설정 타입 가져오기 (기본값 B)
  const payrollType = (currentCompanyDetail?.payroll_type as "A" | "B") || "B";

  useEffect(() => {
    if (currentCompanyId) {
      fetchRecords(1, 10, month);
    }
  }, [currentCompanyId, month, fetchRecords]);

  // 타입에 따른 컬럼 정의
  const columns = useMemo<ColumnDef<any>[]>(() => {
    // 1. 앞부분 고정 컬럼 (기본 정보)
    const baseColumns: ColumnDef<any>[] = [
      {
        accessorKey: "user_name",
        header: "성명",
        cell: ({ row }) => (
          <Typography variant="B2" classes="font-bold">
            {row.original.user_name}
          </Typography>
        ),
      },
      {
        accessorKey: "dept_name",
        header: "부서명",
        cell: ({ row }) => (
          <Typography variant="B2">{row.original.dept_name || "-"}</Typography>
        ),
      },
      {
        accessorKey: "position",
        header: "직급",
        cell: ({ row }) => (
          <Typography variant="B2">{row.original.position || "-"}</Typography>
        ),
      },
    ];

    // 2. 타입별 지급 항목 정의
    const typeAItems: PayrollItem[] = [
      { accessorKey: "base_salary", header: "급여" },
      { accessorKey: "fixed_ot_pay", header: "고정연장" },
      { accessorKey: "fixed_night_pay", header: "고정야간" },
      { accessorKey: "annual_leave_pay", header: "연차수당" },
      { accessorKey: "childcare_allowance", header: "육아수당" },
      { accessorKey: "car_allowance", header: "차량보조" },
      { accessorKey: "meal_allowance", header: "식대" },
      { accessorKey: "ot_pay", header: "추가연장" },
      { accessorKey: "annual_leave_settle", header: "연차정산" },
      { accessorKey: "night_work_pay", header: "나이트수당" },
      { accessorKey: "unused_off_pay", header: "OFF미사용" },
      { accessorKey: "position_allowance", header: "직책수당" },
      { accessorKey: "duty_allowance", header: "당직수당" },
      { accessorKey: "bonus", header: "상여금" },
      { accessorKey: "incentive", header: "인센티브" },
      { accessorKey: "adjustment_pay", header: "조정및소급" },
    ];

    const typeBItems: PayrollItem[] = [
      { accessorKey: "base_salary", header: "급여" },
      { accessorKey: "ot_pay", header: "연장수당" },
      { accessorKey: "annual_leave_pay", header: "연차수당" },
      { accessorKey: "childcare_allowance", header: "육아수당" },
      { accessorKey: "car_allowance", header: "차량보조" },
      { accessorKey: "meal_allowance", header: "식대" },
      { accessorKey: "position_allowance", header: "직책수당" },
      { accessorKey: "bonus", header: "상여금" },
      { accessorKey: "incentive", header: "인센티브" },
      { accessorKey: "adjustment_pay", header: "조정및소급" },
    ];

    // 3. 공통 공제 항목
    const deductionItems: PayrollItem[] = [
      { accessorKey: "employment_insurance", header: "고용보험" },
      { accessorKey: "health_insurance", header: "건강보험" },
      { accessorKey: "longterm_care", header: "장기요양" },
      { accessorKey: "national_pension", header: "국민연금" },
      { accessorKey: "income_tax", header: "소득세" },
      { accessorKey: "local_income_tax", header: "지방소득세" },
      { accessorKey: "tax_settlement", header: "세액정산" },
    ];

    const activeItems = payrollType === "A" ? typeAItems : typeBItems;

    // 중간 수당/공제 컬럼들 생성
    const dynamicColumns: ColumnDef<any>[] = [
      ...activeItems,
      ...deductionItems,
    ].map((item) => ({
      accessorKey: item.accessorKey,
      header: item.header,
      cell: ({ row }) => (
        <Typography variant="B2" classes="text-right">
          {formatKRW(row.original[item.accessorKey])}
        </Typography>
      ),
    }));

    // 4. 뒷부분 고정 컬럼 (지급총액, 공제총액, 실지급액)
    const endColumns: ColumnDef<any>[] = [
      {
        accessorKey: "total_amount",
        header: "지급총액",
        cell: ({ row }) => (
          <Typography
            variant="B2"
            classes="font-medium text-blue-600 text-right"
          >
            {formatKRW(row.original.total_amount)}
          </Typography>
        ),
      },
      {
        accessorKey: "total_deduction", // 스토어 인터페이스에 정의된 공제총액 필드
        header: "공제총액",
        cell: ({ row }) => (
          <Typography
            variant="B2"
            classes="font-medium text-red-500 text-right"
          >
            {formatKRW(row.original.total_deduction)}
          </Typography>
        ),
      },
      {
        accessorKey: "net_amount",
        header: "실지급액",
        cell: ({ row }) => (
          <Typography
            variant="B2"
            classes="font-bold text-green-600 text-right"
          >
            {formatKRW(row.original.net_amount)}
          </Typography>
        ),
      },
    ];

    return [...baseColumns, ...dynamicColumns, ...endColumns];
  }, [payrollType]);

  return (
    <FlexWrapper
      direction="col"
      classes="h-screen mt-4 rounded-xl border bg-white mb-4 overflow-hidden"
      gap={0}
    >
      {/* 상단 정보 영역 */}
      <FlexWrapper
        justify="between"
        items="center"
        classes="px-4 py-2 border-b bg-gray-50"
      >
        <Typography variant="C1" classes="text-gray-500">
          현재 적용 양식:{" "}
          <span className="font-bold text-gray-700">
            {payrollType === "A" ? "A타입 (상세형)" : "B타입 (표준형)"}
          </span>
        </Typography>
        {loading && (
          <Typography variant="C1" classes="text-green-500 animate-pulse">
            데이터 동기화 중...
          </Typography>
        )}
      </FlexWrapper>

      {/* 테이블 본체 */}
      <Table
        data={list || []}
        columns={columns}
        hideSize
        totalCount={total}
        onPageChange={(page, size) => fetchRecords(page, size, month)}
        onRowClick={(row) => onRowClick?.(row)}
      />
    </FlexWrapper>
  );
}

export default SalaryTable;
