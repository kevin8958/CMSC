import CheckList from "@/components/dashboard/CheckList";
import MonthSchedule from "@/components/dashboard/MonthSchedule";
import PositionDoughnutChart from "@/components/dashboard/PositionDoughnutChart";
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
    <>
      <div className="grid grid-cols-12 gap-2 pb-2">
        <div className="col-span-12 xl:col-span-6 bg-white border rounded-xl">
          <MonthSchedule />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3 bg-white border rounded-xl">
          <CheckList />
        </div>
        <div className="col-span-12  sm:col-span-6 xl:col-span-3 border rounded-xl bg-white">
          <PositionDoughnutChart workers={allList} />
        </div>
      </div>
      <YearlyIncomeChart />
    </>
  );
}
export default Dashboard;
