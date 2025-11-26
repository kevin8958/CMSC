import CheckList from "@/components/dashboard/CheckList";
import MonthSchedule from "@/components/dashboard/MonthSchedule";

function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <MonthSchedule />
        <div className="col-span-12 sm:col-span-3">
          <CheckList />
        </div>
        <span className="col-span-12 sm:col-span-3 border rounded-xl p-4">
          멤버구성도
        </span>
      </div>
    </>
  );
}
export default Dashboard;
