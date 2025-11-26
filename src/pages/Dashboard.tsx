import MonthSchedule from "@/components/dashboard/MonthSchedule";

function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <MonthSchedule />
        <span className="col-span-12 sm:col-span-3 border rounded-xl p-4">
          확인해주세요
        </span>
        <span className="col-span-12 sm:col-span-3 border rounded-xl p-4">
          멤버구성도
        </span>
      </div>
    </>
  );
}
export default Dashboard;
