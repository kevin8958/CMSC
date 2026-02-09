import CheckList from "@/components/dashboard/CheckList";
import MonthSchedule from "@/components/dashboard/MonthSchedule";
import DepartmentDoughnutChart from "@/components/dashboard/DepartmentDoughnutChart";
import YearlyIncomeChart from "@/components/dashboard/YearlyIncomeChart";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useWorkerStore } from "@/stores/useWorkerStore";
import { useEffect } from "react";

function Dashboard() {
  const { allList, fetchAll } = useWorkerStore();
  const { currentCompanyId } = useCompanyStore();

  useEffect(() => {
    if (currentCompanyId) {
      fetchAll(currentCompanyId); // 전체 리스트 (차트)
    }
  }, [currentCompanyId]);

  return (
    <div className="grid grid-cols-12 gap-2 pb-2 h-full">
      {/* grid-rows-[0.6fr_0.4fr] */}
      {/* 상단 Row: 높이 60% 차지 */}
      <div className="col-span-12 xl:col-span-6 bg-white border rounded-xl h-full overflow-hidden">
        <MonthSchedule />
      </div>
      <div className="col-span-12 xl:col-span-6 bg-white border rounded-xl h-full overflow-hidden">
        <CheckList />
      </div>
      {/* 하단 Row: 높이 40% 차지 */}
      {/* <div className="col-span-12 xl:col-span-4 border rounded-xl bg-white h-full overflow-hidden">
        <DepartmentDoughnutChart workers={allList} />
      </div>
      <div className="col-span-12 xl:col-span-8 bg-white border rounded-xl h-full overflow-hidden">
        <YearlyIncomeChart />
      </div> */}
    </div>
  );
}
export default Dashboard;
