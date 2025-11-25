import FlexWrapper from "@/layout/FlexWrapper";
import InlineDatePicker from "@/components/InlineDatePicker";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import Typography from "@/foundation/Typography";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

function MonthSchedule() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  const notices = [
    { id: 1, title: "공지사항 1", date: "2024-06-01" },
    { id: 2, title: "공지사항 2", date: "2024-06-05" },
  ]; // 예시 데이터

  return (
    <>
      <FlexWrapper
        gap={4}
        direction="col"
        classes="sm:flex-row !size-fit border border-primary-100 rounded-xl flex-1"
      >
        <div>
          <InlineDatePicker
            currentMonth={currentMonth}
            onMonthChange={(date) => setCurrentMonth(date)}
          />
        </div>
        <div className="flex-1">
          <FlexWrapper
            justify="between"
            items="center"
            direction="col"
            classes="sm:flex-row sm:items-end p-4 pb-0"
          >
            <FlexWrapper gap={2} items="center">
              <Typography variant="H4">공지사항</Typography>
              <Badge color="green" size="md">
                {notices?.length || 0}
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
              공지사항 추가
            </Button>
          </FlexWrapper>
          {notices.length === 0 ? (
            <div className="p-4">
              <Typography variant="B2" classes="!text-gray-400 mt-2">
                등록된 공지사항이 없습니다.
              </Typography>
            </div>
          ) : (
            <div className="flex flex-col gap-2 overflow-y-auto scroll-thin h-[240px] p-4">
              {notices.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-md p-3 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => setSelectedRecord(item)}
                >
                  <FlexWrapper justify="between" items="center">
                    aa
                  </FlexWrapper>
                </div>
              ))}
            </div>
          )}
        </div>
      </FlexWrapper>
    </>
  );
}
export default MonthSchedule;
