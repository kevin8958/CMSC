import CheckList from "@/components/dashboard/CheckList";
import MonthSchedule from "@/components/dashboard/MonthSchedule";

function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-6 bg-white">
          <MonthSchedule />
        </div>
        <div className="col-span-12 sm:col-span-3 bg-white">
          <CheckList />
        </div>
        <span className="col-span-12 sm:col-span-3 border rounded-xl p-4 bg-white">
          멤버구성도
        </span>
      </div>
    </>
  );
}
export default Dashboard;
