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
import SalaryDrawer from "@/components/salary/SalaryDrawer"; // ✅ 추가
import { useTaskStore } from "@/stores/taskStore";

function Salary() {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(
    dayjs().toDate()
  );
  const [members, setMembers] = useState<any[]>([]);
  const { currentCompanyId } = useCompanyStore();
  const { list, total, fetchSalaries, addSalary, updateSalary, deleteSalary } =
    useSalaryStore();

  useEffect(() => {
    fetchSalaries();
  }, [currentCompanyId]);
  const { fetchAllMembers } = useTaskStore();

  // Drawer 상태
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [currentSalary, setCurrentSalary] = useState<any>(null);

  useEffect(() => {
    if (currentCompanyId) {
      (async () => {
        const memberList = await fetchAllMembers(currentCompanyId);
        setMembers(memberList);
        await fetchSalaries();
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
        members={list}
        onAddClick={() => {
          setDrawerMode("create");
          setCurrentSalary(null);
          setDrawerOpen(true);
        }}
      />

      <SalaryTable />

      {/* ✅ Drawer 연결 */}
      <SalaryDrawer
        open={drawerOpen}
        month={selectedMonth}
        mode={drawerMode}
        salary={currentSalary}
        members={members}
        onClose={() => setDrawerOpen(false)}
        onConfirm={async (data) => {
          if (!currentCompanyId) return;
          await addSalary({ company_id: currentCompanyId, ...data });
          setDrawerOpen(false);
        }}
        onEdit={async (data) => {
          if (!currentCompanyId) return;
          await updateSalary(currentSalary!.id, data);
          setDrawerOpen(false);
        }}
        onDelete={async () => {
          if (!currentSalary) return;
          await deleteSalary(currentSalary.id);
          setDrawerOpen(false);
        }}
      />
    </>
  );
}

export default Salary;
