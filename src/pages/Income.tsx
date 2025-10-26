import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import FinanceInputTable from "@/components/income/FinanceInputTable";
import FinanceWaterfallChart from "@/components/income/FinanceWaterfallChart";

function Income() {
  const sampleData = [
    {
      id: "sales",
      title: "매출",
      value: "120000000", // 1억 2천만
    },
    {
      id: "cogs",
      title: "매출원가",
      value: "70000000", // 7천만
    },
    {
      id: "grossProfit",
      title: "매출총이익",
      value: "50000000", // 5천만
    },
    {
      id: "sga",
      title: "판매관리비",
      value: "20000000",
      children: [
        {
          id: "fees",
          title: "기타지급수수료",
          value: "5000000",
        },
      ],
    },
    {
      id: "operatingProfit",
      title: "영업이익",
      value: "30000000",
    },
    {
      id: "nonOperatingIncome",
      title: "영업외수익",
      value: "4000000",
    },
    {
      id: "nonOperatingExpense",
      title: "영업외비용",
      value: "2000000",
    },
    {
      id: "preTaxProfit",
      title: "세전이익",
      value: "32000000",
    },
  ];

  return (
    <>
      <Typography variant="H3">손익계산서</Typography>
      <FlexWrapper gap={1} classes="flex-1 pb-4 pt-4">
        <div className="flex-1">
          <FinanceInputTable />
        </div>
        <div className="flex-2">
          <FinanceWaterfallChart data={sampleData} />
        </div>
      </FlexWrapper>
    </>
  );
}
export default Income;
