import { useMemo, useState, useEffect } from "react";
import dayjs from "dayjs";
import { LuPlus, LuCalendarX } from "react-icons/lu";

import FlexWrapper from "@/layout/FlexWrapper";
import InlineDatePicker from "@/components/InlineDatePicker";
import NoticeDrawer from "@/components/dashboard/NoticeDrawer";
import Button from "@/components/Button";
import DashboardCard from "@/components/dashboard/DashboardCard";
import DashboardItemCard from "@/components/dashboard/DashboardItemCard";

import { useAlert } from "@/components/AlertProvider";
import { useNoticeStore } from "@/stores/useNoticeStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useAuthStore } from "@/stores/authStore";
import { useDialog } from "@/hooks/useDialog";

const PRIORITY_CONFIG = {
  high: { color: "bg-red-500", order: 1 },
  medium: { color: "bg-yellow-500", order: 2 },
  low: { color: "bg-green-500", order: 3 },
};

const ScheduleSkeleton = () => (
  <div className="border rounded-md p-3 animate-pulse bg-white">
    <FlexWrapper items="start" gap={2}>
      <div className="w-1.5 h-12 rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </FlexWrapper>
  </div>
);

function MonthSchedule() {
  const { currentCompanyId } = useCompanyStore();
  const { role } = useAuthStore();
  const { list, fetch, create, update, remove, loading } = useNoticeStore();
  const { showAlert } = useAlert();
  const { openDialog } = useDialog();

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [hoveredNotices, setHoveredNotices] = useState<string[] | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Dashboard.Notice | null>(null);
  const [sortMode, setSortMode] = useState<"date" | "priority">("date");

  useEffect(() => {
    if (currentCompanyId)
      fetch(currentCompanyId, dayjs(currentMonth).format("YYYY-MM"));
  }, [currentCompanyId, fetch, currentMonth]);

  const noticeByDate = useMemo(() => {
    const map: Record<string, Dashboard.Notice[]> = {};
    list.forEach((n) => {
      const start = dayjs(n.start_date);
      const end = dayjs(n.end_date || n.start_date);
      let cur = start;
      while (cur.isSame(end, "day") || cur.isBefore(end, "day")) {
        const key = cur.format("YYYY-MM-DD");
        if (!map[key]) map[key] = [];
        map[key].push(n);
        cur = cur.add(1, "day");
      }
    });
    return map;
  }, [list]);

  const sortedList = useMemo(() => {
    const notices = list as unknown as Dashboard.Notice[];
    return [...notices].sort((a, b) => {
      if (sortMode === "priority") {
        return (
          PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order
        );
      }
      return dayjs(a.start_date).valueOf() - dayjs(b.start_date).valueOf();
    });
  }, [list, sortMode]);

  const renderDateRange = (item: Dashboard.Notice) => {
    const start = dayjs(item.start_date).format("MM/DD");
    const isSameDate =
      !item.end_date ||
      dayjs(item.start_date).isSame(dayjs(item.end_date), "day");
    if (isSameDate) return start;
    return `${start} - ${dayjs(item.end_date).format("MM/DD")}`;
  };

  const handleOpenDrawer = (item: Dashboard.Notice | null = null) => {
    setEditTarget(item);
    setDrawerOpen(true);
  };

  const handleDrawerSubmit = async (params: any) => {
    try {
      if (editTarget) {
        await update(editTarget.id, params);
        showAlert("수정되었습니다.", { type: "success" });
      } else {
        await create({ company_id: currentCompanyId!, ...params });
        showAlert("추가되었습니다.", { type: "success" });
      }
      setDrawerOpen(false);
    } catch (error) {
      showAlert("오류가 발생했습니다.", { type: "danger" });
    }
  };

  // ✅ 공통 카드 헤더에 들어갈 버튼들 정의
  const HeaderActions = (
    <>
      <Button
        variant="outline"
        size="sm"
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
          classes="!px-2"
          onClick={() => handleOpenDrawer()}
        >
          <LuPlus className="text-base" />
        </Button>
      )}
    </>
  );

  return (
    <DashboardCard
      title="중요일정"
      badgeCount={loading ? "-" : list.length}
      headerActions={HeaderActions}
    >
      <FlexWrapper gap={0} direction="col" classes="h-full overflow-hidden">
        {/* 달력 영역 */}
        <aside className="shrink-0">
          <InlineDatePicker
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            noticeByDate={noticeByDate}
            hoveredDate={hoveredDate}
            hoveredNotices={hoveredNotices}
            setHoveredDate={setHoveredDate}
            setHoveredNotices={setHoveredNotices}
          />
        </aside>

        {/* 리스트 영역 */}
        <section className="flex-1 overflow-y-auto sm:max-h-full max-h-[300px] h-full scroll-thin px-4 py-4 space-y-1">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <ScheduleSkeleton key={i} />
            ))
          ) : sortedList.length > 0 ? (
            sortedList.map((item) => (
              <DashboardItemCard
                key={item.id}
                title={item.title}
                content={item.content}
                dateRange={renderDateRange(item)}
                priorityColor={PRIORITY_CONFIG[item.priority].color}
                isActive={hoveredNotices?.includes(item.id)}
                commentCount={0} // 실제 데이터가 있다면 연결 (예: item.comment_count)
                onMouseEnter={() => setHoveredNotices([item.id])}
                onMouseLeave={() => setHoveredNotices(null)}
                onClick={() => handleOpenDrawer(item)}
              />
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-2 py-12">
              <LuCalendarX className="text-4xl text-gray-200" />
              <p className="text-gray-400 text-sm">중요일정이 없습니다</p>
            </div>
          )}
        </section>
      </FlexWrapper>

      <NoticeDrawer
        open={drawerOpen}
        mode={editTarget ? "edit" : "create"}
        notice={editTarget}
        disabled={role !== "admin"}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleDrawerSubmit}
        onDelete={
          editTarget
            ? async () => {
                await openDialog({
                  title: "삭제하시겠습니까?",
                  message: `"${editTarget?.title}" 업무를 제거합니다.`,
                  confirmText: "삭제",
                  cancelText: "취소",
                  state: "danger",
                  onConfirm: async () => {
                    if (editTarget) {
                      await remove(editTarget.id);
                      showAlert("삭제되었습니다.", { type: "danger" });
                    }
                    setDrawerOpen(false);
                    return true;
                  },
                });
              }
            : undefined
        }
      />
    </DashboardCard>
  );
}

export default MonthSchedule;
