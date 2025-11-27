import { useEffect, useState } from "react";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import CustomDatePicker from "@/components/DatePicker";
import AttendanceWorkerList from "@/components/attendance/AttendanceWorkerList";
import AttendanceUsageList from "@/components/attendance/AttendanceUsageList";
import AttendanceDrawer from "@/components/attendance/AttendanceDrawer";
import dayjs from "dayjs";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useWorkerStore } from "@/stores/useWorkerStore";

function Attendance() {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(
    dayjs().toDate()
  );
  const [selectedWorker, setSelectedWorker] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { currentCompanyId } = useCompanyStore();

  const { allList, fetchAll } = useWorkerStore();

  useEffect(() => {
    if (currentCompanyId) fetchAll(currentCompanyId);
  }, [currentCompanyId]);

  return (
    <>
      <div className="w-full h-full">
        {/* Header */}
        <FlexWrapper justify="between" items="center" classes="mb-4">
          <Typography variant="H3">연차 관리</Typography>
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

        {/* Body */}
        <FlexWrapper gap={2} classes="w-full">
          {/* Left: Worker List */}
          <AttendanceWorkerList
            workers={allList}
            onSelectWorker={(worker) => {
              setSelectedWorker(worker);
              setDrawerOpen(true);
            }}
          />

          {/* Right: Usage List */}
          <div className="flex-1 bg-white h-[calc(100vh-160px)] border rounded-xl">
            <AttendanceUsageList
              workers={allList}
              selectedMonth={selectedMonth}
            />
          </div>
        </FlexWrapper>

        {/* Drawer */}
        <AttendanceDrawer
          open={drawerOpen}
          worker={selectedWorker}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
    </>
  );
}
export default Attendance;
