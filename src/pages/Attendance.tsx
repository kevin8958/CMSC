import { useState } from "react";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import CustomDatePicker from "@/components/DatePicker";
import AttendanceMemberList from "@/components/attendance/AttendanceMemberList";
import AttendanceUsageList from "@/components/attendance/AttendanceUsageList";
import AttendanceDrawer from "@/components/attendance/AttendanceDrawer";
import dayjs from "dayjs";

function Attendance() {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(
    dayjs().toDate()
  );
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
      <div className="w-full h-full">
        {/* Header */}
        <FlexWrapper justify="between" items="center" classes="mb-6">
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
        <FlexWrapper gap={0} classes="w-full">
          {/* Left: Member List */}
          <AttendanceMemberList
            onSelectMember={(member) => {
              setSelectedMember(member);
              setDrawerOpen(true);
            }}
          />

          {/* Right: Usage List */}
          <div className="flex-1 bg-white h-[calc(100vh-160px)] overflow-y-auto scroll-thin">
            <AttendanceUsageList selectedMonth={selectedMonth} />
          </div>
        </FlexWrapper>

        {/* Drawer */}
        <AttendanceDrawer
          open={drawerOpen}
          member={selectedMember}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
    </>
  );
}
export default Attendance;
