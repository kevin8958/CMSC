import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import dayjs from "dayjs";
import CustomDatePicker from "@/components/DatePicker";
import { useEffect, useState } from "react";
import { useCompanyStore } from "@/stores/useCompanyStore";
import SalaryHeader from "@/components/salary/SalaryHeader";
import SalaryTable from "@/components/salary/SalaryTable";
import Badge from "@/components/Badge";
import { useSalaryStore } from "@/stores/useSalaryStore";
import SalaryDrawer from "@/components/salary/SalaryDrawer";
import { useWorkerStore } from "@/stores/useWorkerStore";
import { useAlert } from "@/components/AlertProvider";
import { useAuthStore } from "@/stores/authStore";

function Salary() {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(
    dayjs().toDate()
  );
  const { currentCompanyId } = useCompanyStore();
  const { total, fetchSalaries, addSalary, updateSalary, deleteSalary } =
    useSalaryStore();
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchSalaries(1, 10, selectedMonth);
  }, [currentCompanyId]);

  // Drawer 상태
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [currentSalary, setCurrentSalary] = useState<any>(null);

  const { allList, fetchAll } = useWorkerStore();
  const { role } = useAuthStore();

  useEffect(() => {
    if (currentCompanyId) {
      fetchAll(currentCompanyId);
      (async () => {
        await fetchSalaries(1, 10, selectedMonth);
      })();
    }
  }, [currentCompanyId]);

  return (
    <>
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

      {/* ✅ Header에서 Drawer 여는 핸들러 전달 */}
      <SalaryHeader
        onAddClick={() => {
          setDrawerMode("create");
          setCurrentSalary(null);
          setDrawerOpen(true);
        }}
      />

      <SalaryTable
        month={selectedMonth}
        onRowClick={(row: Salary.Row) => {
          setDrawerMode("edit");
          setCurrentSalary(row);
          setDrawerOpen(true);
        }}
      />

      {/* ✅ Drawer 연결 */}
      <SalaryDrawer
        open={drawerOpen}
        disable={role !== "admin"}
        month={selectedMonth}
        mode={drawerMode}
        salary={currentSalary}
        workers={allList}
        onClose={() => setDrawerOpen(false)}
        onConfirm={async (data) => {
          if (!currentCompanyId) return;
          await addSalary({ company_id: currentCompanyId, ...data });
          showAlert("급여내역이 추가되었습니다.", { type: "success" });
          setDrawerOpen(false);
        }}
        onEdit={async (data) => {
          if (!currentCompanyId) return;
          await updateSalary(currentSalary!.id, data);
          showAlert("급여내역이 수정되었습니다.", { type: "success" });
          setDrawerOpen(false);
        }}
        onDelete={async () => {
          if (!currentSalary) return;
          await deleteSalary(currentSalary.id);
          showAlert("급여내역이 삭제되었습니다.", { type: "danger" });
          setDrawerOpen(false);
        }}
      />
    </>
  );
}

export default Salary;
