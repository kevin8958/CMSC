import FlexWrapper from "@/layout/FlexWrapper";
import InlineDatePicker from "@/components/InlineDatePicker";
import NoticeDrawer from "@/components/dashboard/NoticeDrawer";
import { useMemo, useState, useEffect } from "react";
import { LuPlus, LuCalendar } from "react-icons/lu";
import Typography from "@/foundation/Typography";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import dayjs from "dayjs";
import { useAlert } from "@/components/AlertProvider";
import { useNoticeStore } from "@/stores/useNoticeStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { LuCalendarX } from "react-icons/lu";
import { useAuthStore } from "@/stores/authStore";

const priorityColor = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const priorityOrder = {
  high: 1,
  medium: 2,
  low: 3,
};

function MonthSchedule() {
  const { currentCompanyId } = useCompanyStore();
  const { role } = useAuthStore();
  const { list, fetch, create, update, remove } = useNoticeStore();

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [hoveredNotices, setHoveredNotices] = useState<string[] | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [sortMode, setSortMode] = useState<"date" | "priority">("date");
  const { showAlert } = useAlert();

  // fetch notices
  useEffect(() => {
    if (currentCompanyId) fetch(currentCompanyId);
  }, [currentCompanyId]);

  // notice group by date
  const noticeByDate = useMemo(() => {
    const map: Record<string, any[]> = {};
    list.forEach((n) => {
      const start = dayjs(n.start_date);
      const end = dayjs(n.end_date || n.start_date);

      let cur = start;
      while (cur.isSame(end) || cur.isBefore(end)) {
        const key = cur.format("YYYY-MM-DD");
        if (!map[key]) map[key] = [];
        map[key].push(n);
        cur = cur.add(1, "day");
      }
    });
    return map;
  }, [list]);

  const sortedList = list.slice().sort((a, b) => {
    // ✔ 중요도순 정렬
    if (sortMode === "priority") {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    // ✔ 날짜순 정렬
    if (sortMode === "date") {
      return dayjs(a.start_date).valueOf() - dayjs(b.start_date).valueOf();
    }

    return 0;
  });

  return (
    <>
      <FlexWrapper gap={0} direction="col" classes="sm:flex-row !h-fit">
        <div className="shrink-0">
          <InlineDatePicker
            currentMonth={currentMonth}
            onMonthChange={(date) => setCurrentMonth(date)}
            noticeByDate={noticeByDate}
            hoveredDate={hoveredDate}
            hoveredNotices={hoveredNotices}
            setHoveredDate={setHoveredDate}
            setHoveredNotices={setHoveredNotices}
          />
        </div>
        {/* Notices */}
        <div className="flex-1">
          <FlexWrapper justify="between" items="center" classes="p-4 pb-0">
            <FlexWrapper gap={2} items="center">
              <Typography variant="H4">중요일정</Typography>
              <Badge color="green" size="md">
                {list.length}
              </Badge>
            </FlexWrapper>

            <FlexWrapper gap={2} items="center">
              <Button
                variant="outline"
                size="sm"
                classes="!text-gray-500 !border-gray-400"
                onClick={() =>
                  setSortMode((prev) => (prev === "date" ? "priority" : "date"))
                }
              >
                {sortMode === "date" ? "날짜순" : "중요도순"}
              </Button>
              {role === "admin" && (
                <Button
                  variant="contain"
                  color="green"
                  size="sm"
                  classes="gap-1 !px-2"
                  onClick={() => {
                    setEditTarget(null);
                    setDrawerOpen(true);
                  }}
                >
                  <LuPlus className="text-base" />
                </Button>
              )}
            </FlexWrapper>
          </FlexWrapper>

          {list.length > 0 ? (
            <div className="flex flex-col gap-1 overflow-y-auto scroll-thin h-[212px] mt-2 px-4">
              {sortedList.map((item) => {
                const active = hoveredNotices?.includes(item.id) || false;

                return (
                  <div
                    key={item.id}
                    className={`
          border rounded-md p-2 cursor-pointer transition-all duration-300
          ${active ? "bg-gray-100" : "hover:bg-gray-50"}
        `}
                    onMouseEnter={() => setHoveredNotices([item.id])}
                    onMouseLeave={() => setHoveredNotices(null)}
                    onClick={() => {
                      setEditTarget(item);
                      setDrawerOpen(true);
                    }}
                  >
                    <FlexWrapper items="start" gap={2} classes="h-full">
                      <span
                        className={`w-1.5 h-full rounded-full ${priorityColor[item.priority]}`}
                      />
                      <FlexWrapper direction="col" gap={1}>
                        <FlexWrapper gap={1} items="center">
                          <Typography
                            variant="B2"
                            classes="font-semibold !max-w-[220px] truncate"
                          >
                            {item.title}
                          </Typography>
                        </FlexWrapper>
                        <Typography
                          variant="B2"
                          classes="!text-gray-500 !max-w-[220px] truncate"
                        >
                          {item.content}
                        </Typography>

                        <FlexWrapper gap={1} items="center">
                          <LuCalendar className="text-sm text-gray-500" />
                          <span className="text-xs text-gray-500">
                            {dayjs(item.start_date).format("MM/DD") || "-"}
                          </span>

                          {item.start_date !== item.end_date && (
                            <>
                              <p className="text-xs text-gray-500">-</p>
                              <span className="text-xs text-gray-500">
                                {dayjs(item.end_date).format("MM/DD") || "-"}
                              </span>
                            </>
                          )}
                        </FlexWrapper>
                      </FlexWrapper>
                    </FlexWrapper>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-[240px] flex flex-col items-center justify-center gap-2 p-6">
              <LuCalendarX className="text-4xl text-gray-300" />
              <p className="text-gray-400 text-sm">중요일정이 없습니다</p>
            </div>
          )}
        </div>
      </FlexWrapper>

      <NoticeDrawer
        open={drawerOpen}
        mode={editTarget ? "edit" : "create"}
        notice={editTarget}
        disabled={role !== "admin"}
        onClose={() => setDrawerOpen(false)}
        onSubmit={async (params) => {
          if (editTarget) {
            await update(editTarget.id, params);
            showAlert("수정되었습니다.", { type: "success" });
          } else {
            await create({
              company_id: currentCompanyId!,
              ...params,
            });
            showAlert("추가되었습니다.", { type: "success" });
          }
          setDrawerOpen(false);
        }}
        onDelete={
          editTarget
            ? async () => {
                await remove(editTarget.id);
                setDrawerOpen(false);
                showAlert("삭제되었습니다.", { type: "danger" });
              }
            : undefined
        }
      />
    </>
  );
}

export default MonthSchedule;
