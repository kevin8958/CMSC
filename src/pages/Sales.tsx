import FlexWrapper from "@/layout/FlexWrapper";
import Button from "@/components/Button";
import Typography from "@/foundation/Typography";
import RevenueSection from "@/components/sales/RevenueSection";
import OperatingProfitSection from "@/components/sales/OperatingProfitSection";
import PreTaxProfitSection from "@/components/sales/PreTaxProfitSection";
import { LuSave } from "react-icons/lu";
import { useState, useMemo } from "react";
import dayjs from "dayjs";
import CustomDatePicker from "@/components/DatePicker";

function Sales() {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(
    dayjs().toDate()
  );
  const [editMode, setEditMode] = useState(false);

  const [revenue, setRevenue] = useState<string>("");
  const [cogs, setCogs] = useState<string>("");
  const [sga, setSga] = useState<string>("");
  const [nonOpIncome, setNonOpIncome] = useState<string>("");
  const [nonOpExpense, setNonOpExpense] = useState<string>("");

  const revenueNum = Number(revenue) || 0;
  const cogsNum = Number(cogs) || 0;
  const sgaNum = Number(sga) || 0;
  const nonOpIncomeNum = Number(nonOpIncome) || 0;
  const nonOpExpenseNum = Number(nonOpExpense) || 0;

  const grossProfit = useMemo(
    () => revenueNum - cogsNum,
    [revenueNum, cogsNum]
  );
  const grossMargin = useMemo(
    () => (revenueNum ? (grossProfit / revenueNum) * 100 : 0),
    [grossProfit, revenueNum]
  );

  const operatingProfit = useMemo(
    () => grossProfit - sgaNum,
    [grossProfit, sgaNum]
  );
  const operatingMargin = useMemo(
    () => (revenueNum ? (operatingProfit / revenueNum) * 100 : 0),
    [operatingProfit, revenueNum]
  );

  const preTaxProfit = useMemo(
    () => operatingProfit + nonOpIncomeNum - nonOpExpenseNum,
    [operatingProfit, nonOpIncomeNum, nonOpExpenseNum]
  );
  const preTaxMargin = useMemo(
    () => (revenueNum ? (preTaxProfit / revenueNum) * 100 : 0),
    [preTaxProfit, revenueNum]
  );

  return (
    <>
      <FlexWrapper items="start" justify="between" classes="w-full flex-wrap">
        <FlexWrapper direction="col" items="start" gap={0}>
          <Typography variant="H3">손익계산서</Typography>
        </FlexWrapper>
        <FlexWrapper justify="center" gap={0} classes="w-full md:w-fit">
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
      <FlexWrapper items="start" justify="end" classes="w-full pt-2">
        <div className="flex-shrink-0 flex items-start justify-end">
          {!editMode ? (
            <Button
              variant="contain"
              size="md"
              color="green"
              onClick={() => setEditMode(true)}
            >
              편집하기
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setEditMode(false)}
                size="md"
                color="primary"
                classes="flex items-center gap-2"
              >
                취소
              </Button>
              <Button
                variant="contain"
                onClick={() => setEditMode(false)}
                size="md"
                color="primary"
                classes="flex items-center gap-2"
              >
                <LuSave size={16} /> 저장
              </Button>
            </div>
          )}
        </div>
      </FlexWrapper>
      <FlexWrapper direction="col" gap={2} classes="w-[400px] h-[100dvh]">
        <RevenueSection
          editMode={editMode}
          revenue={revenue}
          cogs={cogs}
          grossProfit={grossProfit}
          grossMargin={grossMargin}
          onChangeRevenue={setRevenue}
          onChangeCogs={setCogs}
        />
        <OperatingProfitSection
          editMode={editMode}
          revenue={revenueNum}
          sga={sga}
          grossProfit={grossProfit}
          operatingProfit={operatingProfit}
          operatingMargin={operatingMargin}
          onChangeSga={setSga}
        />
        <PreTaxProfitSection
          editMode={editMode}
          revenue={revenueNum}
          nonOpIncome={nonOpIncome}
          nonOpExpense={nonOpExpense}
          operatingProfit={operatingProfit}
          preTaxProfit={preTaxProfit}
          preTaxMargin={preTaxMargin}
          onChangeNonOpIncome={setNonOpIncome}
          onChangeNonOpExpense={setNonOpExpense}
        />
      </FlexWrapper>
    </>
  );
}
export default Sales;
