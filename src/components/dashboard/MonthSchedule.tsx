import FlexWrapper from "@/layout/FlexWrapper";
import InlineDatePicker from "@/components/InlineDatePicker";
import NoticeDrawer from "@/components/dashboard/NoticeDrawer";
import { useMemo, useState, useEffect } from "react";
import { LuPlus, LuCalendar, LuCalendarX } from "react-icons/lu"; // 중복 아이콘 정리
import Typography from "@/foundation/Typography";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import dayjs from "dayjs";
import { useAlert } from "@/components/AlertProvider";
import { useNoticeStore } from "@/stores/useNoticeStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
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

// ─── 스켈레톤 아이템 컴포넌트 ───
const ScheduleSkeleton = () => (
  <div className="border rounded-md p-2 animate-pulse bg-white">
    <FlexWrapper items="start" gap={2} classes="h-full">
      <div className="w-1.5 h-12 rounded-full bg-gray-200" />
      <FlexWrapper direction="col" gap={2} classes="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-1/4" />
      </FlexWrapper>
    </FlexWrapper>
  </div>
);

function MonthSchedule() {
  const { currentCompanyId } = useCompanyStore();
  const { role } = useAuthStore();
  const { list, fetch, create, update, remove, loading } = useNoticeStore();

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [hoveredNotices, setHoveredNotices] = useState<string[] | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [sortMode, setSortMode] = useState<"date" | "priority">("date");
  const { showAlert } = useAlert();

  useEffect(() => {
    if (currentCompanyId) fetch(currentCompanyId);
  }, [currentCompanyId]);

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
    if (sortMode === "priority")
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    if (sortMode === "date")
      return dayjs(a.start_date).valueOf() - dayjs(b.start_date).valueOf();
    return 0;
  });

  return (
    <>
      <FlexWrapper gap={0} direction="col" classes="sm:flex-row h-full">
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

        <div className="flex-1 h-[calc(100%-10px)]">
          <FlexWrapper justify="between" items="center" classes="p-4 pb-0">
            <FlexWrapper gap={2} items="center">
              <Typography variant="H4">중요일정</Typography>
              <Badge color="green" size="md">
                {loading ? "-" : list.length}
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

          <div className="flex flex-col gap-1 overflow-y-auto scroll-thin h-[calc(100%-56px)] mt-2 px-4 pb-8">
            {/* ─── 로딩 중일 때 스켈레톤 노출 ─── */}
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <ScheduleSkeleton key={i} />
              ))
            ) : list.length > 0 ? (
              sortedList.map((item) => {
                const active = hoveredNotices?.includes(item.id) || false;
                return (
                  <div
                    key={item.id}
                    className={`border rounded-md p-2 cursor-pointer transition-all duration-300 ${active ? "bg-gray-100" : "hover:bg-gray-50"}`}
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
                        <Typography
                          variant="B2"
                          classes="font-semibold !max-w-[220px] truncate"
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="B2"
                          classes="!text-gray-500 !max-w-[220px] truncate"
                        >
                          {item.content}
                        </Typography>
                        <FlexWrapper gap={1} items="center">
                          <LuCalendar className="text-sm text-gray-500" />
                          <span className="text-xs text-gray-500">
                            {dayjs(item.start_date).format("MM/DD")}
                          </span>
                          {item.start_date !== item.end_date && (
                            <>
                              <p className="text-xs text-gray-500">-</p>
                              <span className="text-xs text-gray-500">
                                {dayjs(item.end_date).format("MM/DD")}
                              </span>
                            </>
                          )}
                        </FlexWrapper>
                      </FlexWrapper>
                    </FlexWrapper>
                  </div>
                );
              })
            ) : (
              /* ─── 데이터가 없을 때 ─── */
              <div className="h-full flex flex-col items-center justify-center gap-2 p-6">
                <LuCalendarX className="text-4xl text-gray-300" />
                <p className="text-gray-400 text-sm">중요일정이 없습니다</p>
              </div>
            )}
          </div>
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
            await create({ company_id: currentCompanyId!, ...params });
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
