import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import CustomDatePicker from "@/components/DatePicker";
import { useIncomeStore } from "@/stores/useIncomeStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import IncomeHeader from "@/components/income/IncomeHeader";
import Table from "@/components/Table";
import classNames from "classnames";
import Badge from "@/components/Badge";

type TabType = "매출" | "매출원가" | "판매관리비" | "영업외수익" | "영업외비용";

function Income() {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(
    dayjs().toDate()
  );
  const [activeTab, setActiveTab] = useState<TabType>("매출");

  const { currentCompanyId } = useCompanyStore();
  const { fetchStatement, revenues, cogs, sga, nonOpIncome, nonOpExpense } =
    useIncomeStore();

  useEffect(() => {
    if (!currentCompanyId || !selectedMonth) return;
    const yearMonth = dayjs(selectedMonth).format("YYYY-MM");
    fetchStatement(currentCompanyId, yearMonth);
  }, [currentCompanyId, selectedMonth, fetchStatement]);

  const columns = useMemo(
    () => [
      {
        header: "항목명",
        accessorKey: "name",
        // header 부분도 중앙 정렬하고 싶다면 아래와 같이 작성 (테이블 컴포넌트가 지원하는 경우)
        cell: (info: any) => (
          <div className="text-center w-full">{info.getValue() || "-"}</div>
        ),
      },
      {
        header: "금액",
        accessorKey: "amount",
        cell: (info: any) => (
          <div className="text-center w-full font-semibold">
            {Number(info.getValue()).toLocaleString()}원
          </div>
        ),
      },
    ],
    []
  );

  const tableData = useMemo(() => {
    switch (activeTab) {
      case "매출":
        return revenues;
      case "매출원가":
        return cogs;
      case "판매관리비":
        return sga;
      case "영업외수익":
        return nonOpIncome;
      case "영업외비용":
        return nonOpExpense;
      default:
        return [];
    }
  }, [activeTab, revenues, cogs, sga, nonOpIncome, nonOpExpense]);

  const getCount = (tab: TabType) => {
    switch (tab) {
      case "매출":
        return revenues.length;
      case "매출원가":
        return cogs.length;
      case "판매관리비":
        return sga.length;
      case "영업외수익":
        return nonOpIncome.length;
      case "영업외비용":
        return nonOpExpense.length;
      default:
        return 0;
    }
  };

  const tabs: TabType[] = [
    "매출",
    "매출원가",
    "판매관리비",
    "영업외수익",
    "영업외비용",
  ];

  return (
    /* 1. h-[calc(100dvh-64px)]: GNB 높이(약 64px)를 제외한 나머지 화면을 꽉 채움 
       2. overflow-hidden: 자식이 화면 밖으로 나가는 것을 방지
    */
    <FlexWrapper
      direction="col"
      gap={4}
      classes="w-full h-[calc(100dvh-100px)] overflow-hidden"
    >
      {/* 상단 타이틀 영역 (높이 고정) */}
      <FlexWrapper
        items="start"
        justify="between"
        classes="w-full flex-wrap shrink-0"
      >
        <Typography variant="H3">손익계산서</Typography>
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

      {/* 요약 헤더 (높이 고정) */}
      <div className="shrink-0">
        <IncomeHeader selectedMonth={selectedMonth} />
      </div>

      {/* 메인 콘텐츠 영역 (남은 높이 전체 차지) */}
      <FlexWrapper direction="col" gap={0} classes="w-full flex-1 min-h-0">
        {/* 탭 메뉴 (높이 고정) */}
        <FlexWrapper
          gap={0}
          classes="w-full border-b overflow-x-auto scroll-thin shrink-0 bg-white"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={classNames(
                "px-4 py-3 text-md font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap",
                {
                  "border-primary-600 text-primary-600": activeTab === tab,
                  "border-transparent text-gray-400 hover:text-gray-600":
                    activeTab !== tab,
                }
              )}
            >
              {tab}
              <Badge color={activeTab === tab ? "green" : "gray"} size="md">
                {getCount(tab)}
              </Badge>
            </button>
          ))}
        </FlexWrapper>

        {/* 데이터 테이블 영역 (스크롤 발생 지점) 
            flex-1 min-h-0를 주어 부모의 남은 공간 안에서만 크기를 가지게 함
        */}
        <div className="flex-1 w-full bg-white rounded-b-xl shadow-sm overflow-hidden min-h-0 border">
          <Table
            data={tableData}
            columns={columns}
            totalCount={tableData.length}
            hideSize
            showPagination={false}
            // ✅ [&_th]:w-1/2 -> 모든 헤더 너비 50%
            // ✅ [&_td]:w-1/2 -> 모든 셀 너비 50%
            // ✅ [&_th]:text-center -> 헤더 텍스트 중앙 정렬
            classes="h-full overflow-y-auto scroll-thin [&_th]:w-1/2 [&_td]:w-1/2 [&_th]:text-center"
          />
        </div>
      </FlexWrapper>
    </FlexWrapper>
  );
}

export default Income;
