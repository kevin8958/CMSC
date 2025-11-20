import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import ExpenseGaugeCard from "./ExpenseGaugeCard";
import Button from "@/components/Button";
import { LuPlus } from "react-icons/lu";
import { useEffect, useState } from "react";
import ExpenseDrawer from "./ExpenseDrawer";
import { useExpenseStore } from "@/stores/useExpenseStore";
import { useAuthStore } from "@/stores/authStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useAlert } from "@/components/AlertProvider";
import { updateExpense } from "@/actions/expenseActions";

function Expense(props: { month: Date | null }) {
  const { month } = props;
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

  useEffect(() => {
    if (!user || !month) return;
    if (currentCompanyId) {
      loadExpenses(currentCompanyId, currentTab, month, 1);
      loadSummary(currentCompanyId, month);
    }
  }, [currentCompanyId, currentTab, month]);

  return (
    <>
      <FlexWrapper
        direction="col"
        items="start"
        gap={0}
        classes="border rounded-xl p-4 lg:flex-1 lg:max-w-[520px]"
      >
        <FlexWrapper items="start" justify="between" classes="w-full flex-wrap">
          <FlexWrapper direction="col" items="start" gap={0}>
            <Typography variant="H3">소비</Typography>
            <Typography variant="H3">
              {(
                (summary.fixed || 0) +
                (summary.variable || 0) +
                (summary.other || 0)
              ).toLocaleString()}
              원
            </Typography>
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
        <ExpenseGaugeCard
          fixed={summary.fixed || 0}
          variable={summary.variable || 0}
          other={summary.other || 0}
          onTabChange={(tab) => setCurrentTab(tab)}
          onRowClick={(data: any) => {
            setCurrentExpense(data);
            setOpenDrawer(true);
            setDrawerMode("edit");
          }}
          onPageChange={async (nextPage: number) => {
            if (!month || !currentCompanyId) return;
            await loadExpenses(currentCompanyId!, currentTab, month, nextPage);
          }}
        />
        <ExpenseDrawer
          mode={drawerMode}
          data={drawerMode === "edit" ? currentExpense : null}
          open={openDrawer}
          category={currentTab}
          onClose={() => setOpenDrawer(false)}
          onSubmit={async (form) => {
            if (!month) return;

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
            await loadExpenses(currentCompanyId!, currentTab, month, 1);
            await loadSummary(currentCompanyId!, month);

            setOpenDrawer(false);
          }}
          onDelete={async () => {
            if (!month) return;
            await deleteExpense(currentExpense.id);

            await loadExpenses(currentCompanyId!, currentTab, month, 1);
            await loadSummary(currentCompanyId!, month);
            showAlert("소비내역이 삭제되었습니다.", { type: "success" });

            setOpenDrawer(false);
          }}
        />
      </FlexWrapper>
    </>
  );
}
export default Expense;
