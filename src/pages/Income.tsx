import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import RevenueSection from "@/components/income/RevenueSection";
import OperatingProfitSection from "@/components/income/OperatingProfitSection";
import PreTaxProfitSection from "@/components/income/PreTaxProfitSection";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import CustomDatePicker from "@/components/DatePicker";
import { useIncomeStore } from "@/stores/useIncomeStore";
import { useCompanyStore } from "@/stores/useCompanyStore";

function Income() {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(
    dayjs().toDate()
  );
  const { currentCompanyId } = useCompanyStore();
  const { fetchStatement } = useIncomeStore();

  useEffect(() => {
    if (!currentCompanyId || !selectedMonth) return;
    const yearMonth = dayjs(selectedMonth).format("yyyy-MM");
    fetchStatement(currentCompanyId, yearMonth);
  }, [currentCompanyId, selectedMonth]);

  return (
    <>
      <FlexWrapper items="start" justify="between" classes="w-full flex-wrap">
        <FlexWrapper direction="col" items="start" gap={0}>
          <Typography variant="H3">손익계산서</Typography>
        </FlexWrapper>
        <FlexWrapper justify="center" gap={0} classes="w-fit">
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
      </FlexWrapper>
      <FlexWrapper
        direction="col"
        gap={2}
        classes="w-full sm:h-[100dvh] mt-2 mb-4 md:flex-row pb-10 sm:pb-0"
      >
        <RevenueSection />
        <OperatingProfitSection />
        <PreTaxProfitSection />
      </FlexWrapper>
    </>
  );
}
export default Income;
