import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Button from "@/components/Button";
import { LuPlus } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import ExpenseDrawer from "../components/expense/ExpenseDrawer";
import { useExpenseStore } from "@/stores/useExpenseStore";
import { useAuthStore } from "@/stores/authStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useAlert } from "@/components/AlertProvider";
import { updateExpense } from "@/actions/expenseActions";
import dayjs from "dayjs";
import Label from "@/components/Label";
import CustomDatePicker from "@/components/DatePicker";
import ExpenseGaugeTable, {
  type ExpenseItem,
} from "@/components/expense/ExpenseGaugeTable";
import ExpenseGaugeItem from "@/components/expense/ExpenseGaugeItem";

function Expense() {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(
    dayjs().toDate()
  );
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [currentExpense, setCurrentExpense] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState<"fixed" | "variable" | "other">(
    "fixed"
  );
  const { summary, loadExpenses, addExpense, loadSummary, deleteExpense } =
    useExpenseStore();
  const { user } = useAuthStore();
  const { currentCompanyId } = useCompanyStore();
  const { showAlert } = useAlert();
  const chartRef = useRef<any>(null);
  const [hoveredId, setHoveredId] = useState<
    "fixed" | "variable" | "other" | null
  >(null);

  useEffect(() => {
    if (!user || !selectedMonth) return;
    if (currentCompanyId) {
      loadExpenses(currentCompanyId, currentTab, selectedMonth, 1);
      loadSummary(currentCompanyId, selectedMonth);
    }
  }, [currentCompanyId, currentTab, selectedMonth]);

  const { list } = useExpenseStore();
  const data = [
    { id: "fixed", name: "고정비", value: summary.fixed, color: "#2563EB" },
    {
      id: "variable",
      name: "변동비",
      value: summary.variable,
      color: "#3BAC87",
    },
    { id: "other", name: "기타", value: summary.other, color: "#CBD5E0" },
  ];

  const handleChangeTab = (tab: "fixed" | "variable" | "other") => {
    setCurrentTab(tab);
  };

  const handleItemHover = (id: "fixed" | "variable" | "other" | null) => {
    setHoveredId(id);

    const chart = chartRef.current;
    if (!chart) return;

    if (id === null) {
      chart.setActiveElements([]); // hover 초기화
      chart.tooltip.setActiveElements([], { x: 0, y: 0 });
      chart.update();
      return;
    }

    const index = data.findIndex((d) => d.id === id);
    if (index === -1) return;

    chart.setActiveElements([{ datasetIndex: 0, index }]);

    // tooltip을 차트 중앙 근처로 띄우기
    chart.tooltip.setActiveElements([{ datasetIndex: 0, index }], {
      x: chart.chartArea.width / 2,
      y: chart.chartArea.height / 2,
    });

    chart.update();
  };

  const tableData: ExpenseItem[] = list
    .filter((item) => item.category === currentTab)
    .map((item) => ({
      id: String(item.id),
      date: item.date,
      method: item.method,
      place: item.place,
      amount: item.amount,
    }));

  return (
    <>
      <FlexWrapper items="start" justify="between" classes="w-full flex-wrap">
        <FlexWrapper direction="col" items="start" gap={0}>
          <Typography variant="H3">고정비와 변동비</Typography>
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

      <FlexWrapper
        direction="col"
        items="start"
        classes="size-full relative"
        gap={4}
      >
        <FlexWrapper justify="between" items="end" classes="w-full" gap={0}>
          <FlexWrapper items="center" gap={2}>
            <FlexWrapper
              direction="col"
              items="start"
              gap={1}
              classes="min-w-[180px]"
            >
              <Label text="총합" />
              <Typography variant="H4" classes="md:text-[24px]">
                {(
                  (summary.fixed || 0) +
                  (summary.variable || 0) +
                  (summary.other || 0)
                ).toLocaleString()}
                원
              </Typography>
            </FlexWrapper>
            {data.map((item) => (
              <ExpenseGaugeItem
                key={item.id}
                id={item.id as any}
                label={item.name}
                value={item.value}
                color={item.color}
                active={currentTab === item.id}
                hovered={hoveredId === item.id}
                onClick={(id) => handleChangeTab(id)}
                onHover={(id) => handleItemHover(id)}
              />
            ))}
          </FlexWrapper>
          <Button
            variant="contain"
            color="green"
            size="md"
            classes="gap-1 !px-3 shrink-0"
            onClick={() => {
              setDrawerMode("create");
              setOpenDrawer(true);
            }}
          >
            <LuPlus className="text-lg" />
            소비내역 추가
          </Button>
        </FlexWrapper>
        <FlexWrapper
          direction="col"
          items="center"
          classes="relative w-full"
          gap={2}
        >
          <ExpenseGaugeTable
            data={tableData}
            onRowClick={(data: any) => {
              setCurrentExpense(data);
              setOpenDrawer(true);
              setDrawerMode("edit");
            }}
            onPageChange={async (nextPage: number) => {
              if (!selectedMonth || !currentCompanyId) return;
              await loadExpenses(
                currentCompanyId!,
                currentTab,
                selectedMonth,
                nextPage
              );
            }}
          />
        </FlexWrapper>
      </FlexWrapper>
      <ExpenseDrawer
        mode={drawerMode}
        data={drawerMode === "edit" ? currentExpense : null}
        open={openDrawer}
        category={currentTab}
        onClose={() => setOpenDrawer(false)}
        onSubmit={async (form) => {
          if (!selectedMonth) return;

          if (drawerMode === "create") {
            await addExpense({
              user_id: user!.id,
              company_id: currentCompanyId!,
              category: currentTab,
              date: new Date(form.date),
              method: form.method,
              place: form.place,
              amount: form.amount,
            });
            showAlert("소비내역이 추가되었습니다.", { type: "success" });
          } else {
            await updateExpense(currentExpense.id, form);
            showAlert("소비내역이 수정되었습니다.", { type: "success" });
          }

          // 수정 후 최신 데이터 다시 불러오기
          await loadExpenses(currentCompanyId!, currentTab, selectedMonth, 1);
          await loadSummary(currentCompanyId!, selectedMonth);

          setOpenDrawer(false);
        }}
        onDelete={async () => {
          if (!selectedMonth) return;
          await deleteExpense(currentExpense.id);

          await loadExpenses(currentCompanyId!, currentTab, selectedMonth, 1);
          await loadSummary(currentCompanyId!, selectedMonth);
          showAlert("소비내역이 삭제되었습니다.", { type: "success" });

          setOpenDrawer(false);
        }}
      />
    </>
  );
}
export default Expense;
