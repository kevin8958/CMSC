import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

import Button from "@/components/Button";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Badge from "@/components/Badge";
import { LuPlus } from "react-icons/lu";
import dayjs from "dayjs";

import CheckListSkeleton from "./CheckListSkeleton";

import { useChecklistStore } from "@/stores/checklistStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useAlert } from "@/components/AlertProvider";
import ChecklistCard from "./CheckListCard";
import ChecklistDrawer from "./ChecklistDrawer";
import { useAuthStore } from "@/stores/authStore";

export default function CheckList() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [currentItem, setCurrentItem] = useState<any | null>(null);

  const { currentCompanyId } = useCompanyStore();
  const { list, loading, fetch, create, update, remove, reorder } =
    useChecklistStore();
  const { user } = useAuthStore();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (currentCompanyId) {
      fetch(currentCompanyId);
    }
  }, [currentCompanyId]);

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    // 새로운 순서 배열 만들기
    const newList = [...list];
    const oldIndex = newList.findIndex((i) => i.id === draggableId);
    const [moved] = newList.splice(oldIndex, 1);
    newList.splice(destination.index, 0, moved);

    // sort_index 업데이트 payload 구성
    const updates = newList.map((item, idx) => ({
      id: item.id,
      sort_index: idx,
    }));

    reorder(currentCompanyId!, updates);
  };

  return (
    <>
      {loading ? (
        <CheckListSkeleton />
      ) : (
        <div className="rounded-md h-[288px] flex flex-col w-full border rounded-xl">
          <FlexWrapper justify="between" items="center" classes="p-4">
            <FlexWrapper gap={2} items="center">
              <Typography variant="H4">확인해주세요</Typography>
              <Badge color="green" size="md">
                {list.length}
              </Badge>
            </FlexWrapper>

            <Button
              variant="contain"
              color="green"
              size="md"
              classes="gap-1 !px-2"
              onClick={() => {
                setDrawerMode("create");
                setCurrentItem({
                  id: "",
                  company_id: currentCompanyId,
                  title: "",
                  description: "",
                  sort_index: list.length,
                  due_date: dayjs().format("YYYY-MM-DD"),
                  created_at: "",
                  updated_at: "",
                });
                setDrawerOpen(true);
              }}
            >
              <LuPlus className="text-lg" />
            </Button>
          </FlexWrapper>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="w-full">
              <Droppable droppableId="checklist-droppable">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="rounded-md h-[200px] overflow-y-auto scroll-thin flex flex-col w-full px-4"
                  >
                    {/* Header */}

                    {/* Checklist List */}
                    {list.map((item, index) => (
                      <Draggable
                        draggableId={item.id}
                        index={index}
                        key={item.id}
                      >
                        {(p) => (
                          <div
                            ref={p.innerRef}
                            {...p.draggableProps}
                            {...p.dragHandleProps}
                            onClick={() => {
                              setDrawerMode("edit");
                              setCurrentItem(item);
                              setDrawerOpen(true);
                            }}
                            className="border bg-white rounded-lg shadow mb-3 cursor-pointer transition duration-300 shadow-custom-dark"
                          >
                            <ChecklistCard item={item} />
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        </div>
      )}

      {/* Drawer */}
      <ChecklistDrawer
        open={drawerOpen}
        mode={drawerMode}
        item={currentItem}
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
