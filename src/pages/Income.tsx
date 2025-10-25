import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import FinanceInputTable from "@/components/income/FinanceInputTable";

function Income() {
  return (
    <>
      <Typography variant="H3">손익계산서</Typography>
      <FlexWrapper gap={1} classes="flex-1 pb-4 pt-4">
        <div className="flex-1">
          <FinanceInputTable />
        </div>
        <div className="border border-gray-300 p-2 flex-2">그래프영역</div>
      </FlexWrapper>
    </>
  );
}
export default Income;
