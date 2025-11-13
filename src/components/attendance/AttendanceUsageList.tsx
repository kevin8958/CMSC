import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { motion } from "framer-motion";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { LuPlus } from "react-icons/lu";
import AttendanceAddDrawer from "./AttendanceAddDrawer";
import AttendanceDetailDrawer from "./AttendanceDetailDrawer";
import Avatar from "@/components/Avatar";

export default function AttendanceUsageList({
  selectedMonth,
}: {
  selectedMonth: Date | null;
}) {
  const { currentCompanyId } = useCompanyStore();
  const { monthlyRecords, monthlyLoading, fetchMonthlyRecords } =
    useAttendanceStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  useEffect(() => {
    if (currentCompanyId && selectedMonth) {
      const month = dayjs(selectedMonth).format("YYYY-MM");
      fetchMonthlyRecords(currentCompanyId, month);
    }
  }, [selectedMonth, currentCompanyId]);

  return (
    <div>
      <FlexWrapper
        justify="between"
        items="center"
        direction="col"
        classes="sm:flex-row sm:items-end px-4"
      >
        <FlexWrapper gap={2} items="center">
          <Typography variant="H4">연차 사용 내역</Typography>
          <Badge color="green" size="md">
            {monthlyRecords?.length || 0}
          </Badge>
        </FlexWrapper>
        <Button
          variant="contain"
          color="green"
          size="md"
          classes="gap-1 !px-3"
          onClick={() => setDrawerOpen(true)}
        >
          <LuPlus className="text-lg" />
          연차내역 추가
        </Button>
      </FlexWrapper>
      {monthlyLoading ? (
        <div className="flex flex-col gap-2 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="h-[60px] rounded-md bg-gray-100"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
            />
          ))}
        </div>
      ) : monthlyRecords.length === 0 ? (
        <div className="p-4">
          <Typography variant="B2" classes="!text-gray-400 mt-2">
            등록된 연차 내역이 없습니다.
          </Typography>
        </div>
      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto scroll-thin h-[calc(100vh-260px)] p-4">
          {monthlyRecords.map((item) => (
            <div
              key={item.id}
              className="border rounded-md p-3 hover:bg-gray-50 transition cursor-pointer"
              onClick={() => setSelectedRecord(item)}
            >
              <FlexWrapper justify="between" items="center">
                <FlexWrapper gap={1} items="center">
                  <Avatar size="sm" type="text" name={item.user_name} />
                  <FlexWrapper gap={0} items="start" direction="col">
                    <FlexWrapper gap={1} items="center">
                      <Typography variant="B2" classes="font-semibold">
                        {item.user_name}
                      </Typography>
                      <Typography variant="C1" classes="!text-gray-500">
                        사원
                      </Typography>
                    </FlexWrapper>
                    <Typography variant="B2" classes="!text-gray-500">
                      {item.reason}
                    </Typography>
                  </FlexWrapper>
                </FlexWrapper>
                <FlexWrapper direction="col" items="center" gap={0}>
                  <Badge
                    color="danger"
                    size="sm"
                    classes="!w-[80px] !justify-center"
                  >
                    사용 연차 {item.days}
                  </Badge>
                  <Typography variant="C1" classes="text-gray-600">
                    {dayjs(item.start_date).format("MM/DD")} -{" "}
                    {dayjs(item.end_date).format("MM/DD")}
                  </Typography>
                </FlexWrapper>
              </FlexWrapper>
            </div>
          ))}
        </div>
      )}
      <AttendanceAddDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <AttendanceDetailDrawer
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
}
