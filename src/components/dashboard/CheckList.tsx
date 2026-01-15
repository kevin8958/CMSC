import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import dayjs from "dayjs";
import { LuLayoutList, LuPlus } from "react-icons/lu";

import Button from "@/components/Button";
import DashboardCard from "@/components/dashboard/DashboardCard";
import DashboardItemCard from "@/components/dashboard/DashboardItemCard";
import CheckListSkeleton from "./CheckListSkeleton";
import ChecklistDrawer from "./ChecklistDrawer";

import { useChecklistStore } from "@/stores/checklistStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useAlert } from "@/components/AlertProvider";
import { useAuthStore } from "@/stores/authStore";

export default function CheckList() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [currentItem, setCurrentItem] = useState<any | null>(null);

  const { currentCompanyId } = useCompanyStore();
  const { role, user } = useAuthStore();
  const { list, loading, fetch, create, update, remove, reorder } =
    useChecklistStore();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (currentCompanyId) {
      fetch(currentCompanyId);
    }
  }, [currentCompanyId]);

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const newList = [...list];
    const oldIndex = newList.findIndex((i) => i.id === draggableId);
    const [moved] = newList.splice(oldIndex, 1);
    newList.splice(destination.index, 0, moved);

    const updates = newList.map((item, idx) => ({
      id: item.id,
      sort_index: idx,
    }));

    reorder(currentCompanyId!, updates);
  };

  const handleOpenCreateDrawer = () => {
    setDrawerMode("create");
    setCurrentItem({
      id: "",
      company_id: currentCompanyId,
      title: "",
      description: "",
      sort_index: list.length,
      due_date: dayjs().format("YYYY-MM-DD"),
    });
    setDrawerOpen(true);
  };

  const handleOpenEditDrawer = (item: any) => {
    setDrawerMode("edit");
    setCurrentItem(item);
    setDrawerOpen(true);
  };

  const HeaderActions = role === "admin" && (
    <Button
      variant="contain"
      color="green"
      size="sm"
      classes="gap-1 !px-2"
      onClick={handleOpenCreateDrawer}
    >
      <LuPlus className="text-base" />
    </Button>
  );

  return (
    <>
      <DashboardCard
        title="확인해주세요"
        badgeCount={loading ? "-" : list.length}
        headerActions={HeaderActions}
      >
        {loading ? (
          <CheckListSkeleton />
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            {list.length > 0 ? (
              <Droppable droppableId="checklist-droppable">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="h-full overflow-y-auto scroll-thin flex flex-col w-full px-4 py-4 space-y-1"
                  >
                    {list.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                        isDragDisabled={role !== "admin"}
                      >
                        {(p) => (
                          <div
                            ref={p.innerRef}
                            {...p.draggableProps}
                            {...p.dragHandleProps}
                          >
                            <DashboardItemCard
                              title={item.title}
                              content={item.description}
                              // ✅ 날짜 형식 통일 (MM/DD)
                              dateRange={
                                item.due_date
                                  ? dayjs(item.due_date).format("MM/DD")
                                  : undefined
                              }
                              // ✅ 댓글 개수 연결 (데이터 필드명에 맞춰 수정 가능)
                              commentCount={item.comments?.[0]?.count || 0}
                              onClick={() => handleOpenEditDrawer(item)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2 py-12">
                <LuLayoutList className="text-4xl text-gray-200" />
                <p className="text-gray-400 text-sm font-medium">
                  체크리스트가 없습니다
                </p>
              </div>
            )}
          </DragDropContext>
        )}
      </DashboardCard>

      <ChecklistDrawer
        open={drawerOpen}
        mode={drawerMode}
        item={currentItem}
        disabled={role !== "admin"}
        onClose={() => setDrawerOpen(false)}
        onSubmit={async (data) => {
          if (!currentCompanyId) return;
          if (drawerMode === "create") {
            await create({
              company_id: currentCompanyId,
              created_by: user?.id || "",
              ...data,
            });
            showAlert("추가되었습니다.", { type: "success" });
          } else {
            await update(currentItem!.id, data);
            showAlert("수정되었습니다.", { type: "success" });
          }
          setDrawerOpen(false);
        }}
        onDelete={
          drawerMode === "edit"
            ? async () => {
                await remove(currentItem!.id);
                showAlert("삭제되었습니다.", { type: "danger" });
                setDrawerOpen(false);
              }
            : undefined
        }
      />
    </>
  );
}
