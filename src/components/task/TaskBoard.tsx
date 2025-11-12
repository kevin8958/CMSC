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
import { LuPlus } from "react-icons/lu";
import { useTaskStore } from "@/stores/taskStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useAlert } from "@/components/AlertProvider";
import { useDialog } from "@/hooks/useDialog";
import TaskCard from "@/components/task/TaskCard";
import TaskDrawer from "./TaskDrawer";
import { STATUS_CONFIG } from "@/constants/TaskConfigs_fixed";
import TaskStatusBadge from "@/components/task/TaskStatusBadge";
import dayjs from "dayjs";

const statusKeys = Object.keys(STATUS_CONFIG) as (keyof typeof STATUS_CONFIG)[];

function reorderWithDragResult({
  all,
  source,
  destination,
  draggableId,
}: {
  all: Task.Task[];
  source: { droppableId: string; index: number };
  destination: { droppableId: string; index: number };
  draggableId: string;
}) {
  const byStatus: Record<Task.Task["status"], Task.Task[]> = {
    backlog: [],
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  };
  for (const t of all) byStatus[t.status].push({ ...t });

  const from = source.droppableId as Task.Task["status"];
  const to = destination.droppableId as Task.Task["status"];

  const fromList = byStatus[from];
  const dragIdxInFrom = fromList.findIndex((t) => t.id === draggableId);
  const [moved] =
    dragIdxInFrom >= 0 ? fromList.splice(dragIdxInFrom, 1) : [undefined];
  if (!moved)
    return {
      nextAll: all,
      changed: [] as Array<Pick<Task.Task, "id" | "status" | "sort_index">>,
    };

  const toList = byStatus[to];
  moved.status = to;
  const insertIndex = Math.min(Math.max(destination.index, 0), toList.length);
  toList.splice(insertIndex, 0, moved);

  const affected: Task.Task["status"][] = from === to ? [to] : [from, to];
  const updates: Array<Pick<Task.Task, "id" | "status" | "sort_index">> = [];

  for (const s of affected) {
    byStatus[s].forEach((item, idx) => {
      if (item.sort_index !== idx || item.status !== s) {
        item.sort_index = idx;
      }
    });
    updates.push(
      ...byStatus[s].map((it) => ({
        id: it.id,
        status: it.status,
        sort_index: it.sort_index,
      }))
    );
  }

  const nextAll = statusKeys.flatMap((s) =>
    byStatus[s].sort((a, b) => (a.sort_index ?? 0) - (b.sort_index ?? 0))
  );

  return { nextAll, changed: updates };
}

export default function TaskBoard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [currentTask, setCurrentTask] = useState<Task.Task | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const {
    tasks,
    setTasks,
    fetchTasks,
    createTask,
    updateTask,
    updateOrder,
    deleteTask,
    fetchAllMembers,
  } = useTaskStore();
  const { currentCompanyId } = useCompanyStore();
  const { showAlert } = useAlert();
  const { openDialog } = useDialog();

  useEffect(() => {
    if (currentCompanyId) {
      fetchTasks(currentCompanyId);
      (async () => {
        const list = await fetchAllMembers(currentCompanyId);
        setMembers(list);
      })();
    }
  }, [currentCompanyId]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    const { nextAll, changed } = reorderWithDragResult({
      all: tasks,
      source,
      destination,
      draggableId,
    });
    setTasks(nextAll);
    if (currentCompanyId && changed.length > 0) {
      updateOrder(currentCompanyId, changed);
    }
  };

  return (
    <div>
      <FlexWrapper classes="mb-6" items="center" justify="between">
        <Typography variant="H3">업무소통</Typography>
        <Button
          variant="contain"
          color="green"
          size="md"
          classes="gap-1 !px-3"
          onClick={() => {
            setDrawerMode("create");
            setCurrentTask(null);
            setDrawerOpen(true);
          }}
        >
          <LuPlus className="text-lg" />
          추가하기
        </Button>
      </FlexWrapper>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-5 gap-2">
          {statusKeys.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-50 rounded-md p-2 min-h-[400px] flex flex-col"
                >
                  <FlexWrapper justify="between" items="center" classes="mb-2">
                    <TaskStatusBadge status={status} />
                    <Button
                      variant="clear"
                      size="sm"
                      classes="!text-gray-500"
                      onClick={() => {
                        setDrawerMode("create");
                        setCurrentTask({
                          id: "",
                          company_id: currentCompanyId || "",
                          title: "",
                          status,
                          priority: "medium",
                          description: "",
                          assignee: "",
                          sort_index: 0,
                          due_date: dayjs().format("YYYY-MM-DD"),
                          task_comments: [],
                          created_at: dayjs().toString(),
                          updated_at: dayjs().toString(),
                        });
                        setDrawerOpen(true);
                      }}
                    >
                      <LuPlus className="text-lg" />
                    </Button>
                  </FlexWrapper>

                  {tasks
                    .filter((t) => t.status === status)
                    .map((task, index) => (
                      <Draggable
                        draggableId={task.id}
                        index={index}
                        key={task.id}
                      >
                        {(p) => (
                          <div
                            ref={p.innerRef}
                            {...p.draggableProps}
                            {...p.dragHandleProps}
                            onClick={() => {
                              setDrawerMode("edit");
                              setCurrentTask(task);
                              setDrawerOpen(true);
                            }}
                            className="bg-white rounded-lg shadow mb-3 cursor-pointer hover:shadow-custom-light transition duration-300 shadow-custom-dark"
                          >
                            <TaskCard task={task} members={members} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <TaskDrawer
        open={drawerOpen}
        mode={drawerMode}
        task={currentTask}
        members={members}
        onClose={() => setDrawerOpen(false)}
        onSubmit={async (data) => {
          if (!currentCompanyId) return;
          if (drawerMode === "create") {
            await createTask(
              currentCompanyId,
              data.status!,
              data.title!,
              data.description!,
              data.priority!,
              data.due_date,
              data.assignee
            );
            showAlert("업무가 추가되었습니다.", { type: "success" });
          } else if (drawerMode === "edit" && currentTask) {
            await updateTask(currentTask.id, data);
            showAlert("업무가 수정되었습니다.", { type: "success" });
          }
          setDrawerOpen(false);
        }}
        onDelete={
          drawerMode === "edit"
            ? async () => {
                await openDialog({
                  title: "삭제하시겠습니까?",
                  message: `"${currentTask?.title}" 업무를 제거합니다.`,
                  confirmText: "삭제",
                  cancelText: "취소",
                  state: "danger",
                  onConfirm: async () => {
                    if (currentTask) {
                      await deleteTask(currentTask.id);
                      showAlert("삭제되었습니다.", { type: "success" });
                    }
                    setDrawerOpen(false);
                    return true;
                  },
                });
              }
            : undefined
        }
      />
    </div>
  );
}
