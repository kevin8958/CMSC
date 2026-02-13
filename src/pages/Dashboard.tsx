import CheckList from "@/components/dashboard/CheckList";
import MonthSchedule from "@/components/dashboard/MonthSchedule";
import FlexWrapper from "@/layout/FlexWrapper";

function Dashboard() {
  // const { allList, fetchAll } = useWorkerStore();

  // useEffect(() => {
  //   if (currentCompanyId) {
  //     fetchAll(currentCompanyId); // 전체 리스트 (차트)
  //   }
  // }, [currentCompanyId]);

  return (
    <FlexWrapper
      items="start"
      gap={2}
      direction="col"
      classes="h-full pb-2 sm:flex-row"
    >
      {/* <div className="grid grid-cols-12 grid-rows-[0.6fr_0.4fr] gap-2 pb-2 h-full"> */}
      {/* 상단 Row: 높이 60% 차지 */}
      <div className="w-full sm:w-[320px] bg-white border rounded-xl h-full overflow-hidden">
        <MonthSchedule />
      </div>
      <div className="max-w-full flex-1 bg-white border rounded-xl h-full overflow-hidden">
        <CheckList />
      </div>
      {/* 하단 Row: 높이 40% 차지 */}
      {/* <div className="col-span-12 xl:col-span-4 border rounded-xl bg-white h-full overflow-hidden">
        <DepartmentDoughnutChart workers={allList} />
      </div>
      <div className="col-span-12 xl:col-span-8 bg-white border rounded-xl h-full overflow-hidden">
        <YearlyIncomeChart />
      </div> */}
    </FlexWrapper>
  );
}
export default Dashboard;
