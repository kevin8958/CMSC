import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import ExpenseGaugeCard from "./ExpenseGaugeCard";

function Expense() {
  return (
    <>
      <FlexWrapper
        direction="col"
        items="start"
        gap={0}
        classes="border rounded-lg p-4 lg:flex-1 h-[360px]"
      >
        <Typography variant="H4">소비</Typography>
        <Typography variant="H3">300,000원</Typography>
        <ExpenseGaugeCard fixed={120000} variable={150000} other={30000} />
      </FlexWrapper>
    </>
  );
}
export default Expense;
