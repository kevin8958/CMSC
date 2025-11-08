import FlexWrapper from "@/layout/FlexWrapper";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import {
  TbCircleDashed,
  TbDotsCircleHorizontal,
  TbProgress,
  TbCircleDashedCheck,
  TbCircleCheck,
} from "react-icons/tb";
import { LuPlus } from "react-icons/lu";
import { useTaskStore } from "@/stores/taskStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import Typography from "@/foundation/Typography";
import type { Task } from "@/stores/taskStore";
import Drawer from "@/components/Drawer";
import TextInput from "@/components/TextInput";
import Dropdown from "@/components/Dropdown";
import Badge from "@/components/Badge";
import Label from "@/components/Label";
import { useAlert } from "@/components/AlertProvider";
import Textarea from "@/components/TextArea";
import { useDialog } from "@/hooks/useDialog";
import CustomDatePicker from "@/components/DatePicker";
import dayjs from "dayjs";
import TaskCard from "@/components/task/TaskCard";

const STATUS_CONFIG = {
  backlog: {
    label: "백로그",
    color: "bg-gray-200 text-gray-800",
    icon: <TbCircleDashed className="text-base text-gray-800" />,
  },
  todo: {
    label: "할 일",
    color: "bg-third-200 text-third-800",
    icon: <TbDotsCircleHorizontal className="text-base !text-third-800" />,
  },
  in_progress: {
    label: "진행중",
    color: "bg-yellow-200 text-yellow-800",
    icon: <TbProgress className="text-base text-yellow-800" />,
  },
  review: {
    label: "리뷰",
    color: "bg-purple-200 text-purple-800",
    icon: <TbCircleDashedCheck className="text-base text-purple-800" />,
  },
  done: {
    label: "완료",
    color: "bg-green-200 text-green-800",
    icon: <TbCircleCheck className="text-base text-green-800" />,
  },
} as const;

type Status = keyof typeof STATUS_CONFIG;

const statusKeys = Object.keys(STATUS_CONFIG) as Status[];

const statusItems = [
  ...statusKeys.map((status) => ({
    type: "item" as const,
    id: status,
    label: (
      <Badge
        classes={
          STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].color +
          " !w-[80px]"
        }
        size="sm"
      >
        {STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].icon}
        <span className="font-normal text-sm ml-2">
          {STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].label}
        </span>
      </Badge>
    ),
  })),
] as Common.DropdownItem[];

const PRIORITY_CONFIG = {
  low: {
    label: "낮음",
    color: "bg-green-200 text-green-800",
  },
  medium: {
    label: "보통",
    color: "bg-yellow-200 text-yellow-800",
  },
  high: {
    label: "높음",
    color: "bg-red-200 text-red-800",
  },
} as const;

type PRIORITY = keyof typeof PRIORITY_CONFIG;

const priorityKeys = Object.keys(PRIORITY_CONFIG) as PRIORITY[];
const priorityItems = [
  ...priorityKeys.map((priority) => ({
    type: "item" as const,
    id: priority,
    label: (
      <Badge
        classes={
          PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG].color +
          " !w-[120px] justify-center"
        }
        size="sm"
      >
        <span className="font-normal text-sm">
          {PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG].label}
        </span>
      </Badge>
    ),
  })),
] as Common.DropdownItem[];

const reorderWithDragResult = ({
  all,
  source,
  destination,
  draggableId,
}: {
  all: Task[];
  source: { droppableId: string; index: number };
  destination: { droppableId: string; index: number };
  draggableId: string;
}) => {
  // 1) 상태별 배열로 분해
  const byStatus: Record<Task["status"], Task[]> = {
    backlog: [],
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  };
  for (const t of all) byStatus[t.status].push({ ...t });

  // 2) 소스/데스트 리스트 선택
  const from = source.droppableId as Task["status"];
  const to = destination.droppableId as Task["status"];

  // 3) 소스 리스트에서 해당 아이템 제거
  const fromList = byStatus[from];
  const dragIdxInFrom = fromList.findIndex((t) => t.id === draggableId);
  const [moved] =
    dragIdxInFrom >= 0 ? fromList.splice(dragIdxInFrom, 1) : [undefined];
  if (!moved)
    return {
      nextAll: all,
      changed: [] as Array<Pick<Task, "id" | "status" | "sort_index">>,
    };

  // 4) 목적 리스트에 삽입 (새 status 반영)
  const toList = byStatus[to];
  moved.status = to;
  const insertIndex = Math.min(Math.max(destination.index, 0), toList.length);
  toList.splice(insertIndex, 0, moved);

  // 5) 영향을 받은 컬럼들만 sort_index 재부여
  const affected: Task["status"][] = from === to ? [to] : [from, to];
  const updates: Array<Pick<Task, "id" | "status" | "sort_index">> = [];

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

  // 6) 다시 하나의 배열로 합치고, UI용 정렬(옵션) 유지
  const nextAll = statusKeys.flatMap((s) =>
    byStatus[s].sort((a, b) => a.sort_index - b.sort_index)
  );

  return { nextAll, changed: dedupeById(updates) };
};

function dedupeById<T extends { id: string }>(arr: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of arr) map.set(item.id, item);
  return Array.from(map.values());
}

export default function Communication() {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState<Task["status"]>("todo");
  const [newPriority, setNewPriority] = useState<Task["priority"]>("medium");
  const [newDescription, setNewDescription] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [newAssignee, setNewAssignee] = useState<string>("");
  const [errors, setErrors] = useState({ title: "", description: "" });
  const [newDueDate, setNewDueDate] = useState<Date | null>(new Date());
  const {
    tasks,
    setTasks,
    fetchTasks,
    createTask,
    deleteTask,
    updateOrder,
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

    // 1) 로컬 재배열 + sort_index 재부여
    const { nextAll, changed } = reorderWithDragResult({
      all: tasks,
      source,
      destination,
      draggableId,
    });

    // 2) Optimistic 반영
    setTasks(nextAll);

    // 3) 서버 동기화
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
            setNewStatus("todo");
            setNewTitle("");
            setNewDescription("");
            setNewDueDate(new Date());
            setNewAssignee("");
            setDrawerOpen(true);
          }}
        >
          <LuPlus className="text-lg" />
          추가하기
        </Button>
      </FlexWrapper>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-5 gap-2">
          {Object.keys(STATUS_CONFIG).map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-50 rounded-md p-2 min-h-[400px] flex flex-col"
                >
                  <FlexWrapper
                    justify="between"
                    items="center"
                    gap={2}
                    classes="mb-2 w-full"
                  >
                    <FlexWrapper items="center" gap={2}>
                      <Badge
                        classes={
                          STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
                            .color
                        }
                        size="sm"
                      >
                        {
                          STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
                            .icon
                        }
                        <span className="font-normal text-sm ml-2">
                          {
                            STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
                              .label
                          }
                        </span>
                      </Badge>
                    </FlexWrapper>
                    {/* <FlexWrapper items="center" gap={2}>
                        {
                          STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
                            .label
                        }
                      </span>
                    </FlexWrapper> */}
                    <FlexWrapper items="center" gap={2}>
                      <Button
                        variant="clear"
                        size="sm"
                        classes="!text-gray-500"
                        onClick={() => {
                          setNewStatus(status); // ← 이 컬럼의 status 고정
                          setNewTitle("");
                          setDrawerMode("create");
                          setNewDescription("");
                          setNewDueDate(new Date());
                          setNewAssignee("");
                          setDrawerOpen(true);
                        }}
                      >
                        <LuPlus className="text-lg" />
                      </Button>
                    </FlexWrapper>
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
                              setNewStatus(task.status);
                              setNewTitle(task.title);
                              setNewPriority(task.priority);
                              setNewDueDate(
                                dayjs(task.due_date).toDate() || new Date()
                              );
                              setNewAssignee(task.assignee || "");
                              setNewDescription(task.description || "");
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
      <Drawer
        open={drawerOpen}
        confirmText={drawerMode === "create" ? "추가하기" : "수정하기"}
        deleteText="삭제"
        title={
          <FlexWrapper items="center" gap={2}>
            <Dropdown
              hideDownIcon
              buttonVariant="clear"
              items={statusItems}
              onChange={async (val) => {
                setNewStatus(val as Task["status"]);
              }}
              dialogWidth={90}
              itemClasses="!px-1"
              buttonItem={
                <Badge
                  classes={
                    STATUS_CONFIG[newStatus as keyof typeof STATUS_CONFIG].color
                  }
                  size="sm"
                >
                  {STATUS_CONFIG[newStatus as keyof typeof STATUS_CONFIG].icon}
                  <span className="font-normal text-sm ml-2">
                    {
                      STATUS_CONFIG[newStatus as keyof typeof STATUS_CONFIG]
                        .label
                    }
                  </span>
                </Badge>
              }
              buttonClasses="!font-normal text-primary-900 !h-fit !border-primary-300 hover:!bg-primary-50 !p-0"
            />
            <Typography variant="H4">
              {drawerMode === "create" ? "업무 추가하기" : "업무 수정하기"}
            </Typography>
          </FlexWrapper>
        }
        showFooter
        onClose={() => setDrawerOpen(false)}
        onCancel={
          drawerMode === "create" ? () => setDrawerOpen(false) : undefined
        }
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
                    try {
                      const taskId = currentTask?.id;
                      if (taskId) {
                        deleteTask(taskId);
                      }
                      showAlert("삭제되었습니다.", {
                        type: "success",
                        durationMs: 3000,
                      });
                      setDrawerOpen(false);
                      return true;
                    } catch (err: any) {
                      showAlert(
                        err?.message || "삭제 중 오류가 발생했습니다.",
                        {
                          type: "danger",
                          durationMs: 3000,
                        }
                      );
                      return false;
                    }
                  },
                });
              }
            : undefined
        }
        onConfirm={async () => {
          try {
            if (!currentCompanyId) return;
            if (!newTitle.trim()) {
              setErrors({
                ...errors,
                title: "제목은 필수 입력사항입니다.",
              });
              return;
            }
            createTask(
              currentCompanyId,
              newStatus,
              newTitle.trim(),
              newDescription,
              newPriority,
              newDueDate ? dayjs(newDueDate).format("YYYY-MM-DD") : undefined,
              newAssignee || undefined
            );
            showAlert("업무가 추가되었습니다.", {
              type: "success",
              durationMs: 3000,
            });
            setDrawerOpen(false);
          } catch (error) {
            showAlert(`${error}`, {
              type: "danger",
              durationMs: 3000,
            });
          }
        }}
      >
        <FlexWrapper direction="col" gap={4} classes="w-full">
          <FlexWrapper gap={2} items="center">
            <div className="shrink-0 !w-[60px]">
              <Label text="업무 제목" required />
            </div>
            <TextInput
              classes="!text-sm !h-[42px] max-h-[42px]"
              onChange={(e) => {
                setNewTitle(e.target.value);
              }}
              inputProps={{
                value: newTitle,
              }}
              placeholder="업무 제목을 입력하세요"
              max={100}
              error={!!errors.title}
              errorMsg={errors.title}
            />
          </FlexWrapper>
          <FlexWrapper gap={2} items="center">
            <div className="shrink-0 !w-[60px]">
              <Label text="중요도" />
            </div>
            <Dropdown
              hideDownIcon
              buttonVariant="clear"
              items={priorityItems}
              onChange={async (val) => {
                setNewPriority(val as Task["priority"]);
              }}
              itemClasses="!px-1"
              buttonItem={
                <Badge
                  classes={
                    PRIORITY_CONFIG[newPriority as keyof typeof PRIORITY_CONFIG]
                      .color + " px-4 py-1 w-[120px]"
                  }
                  size="sm"
                >
                  <span className="font-normal text-sm w-full">
                    {
                      PRIORITY_CONFIG[
                        newPriority as keyof typeof PRIORITY_CONFIG
                      ].label
                    }
                  </span>
                </Badge>
              }
              buttonClasses="!font-normal text-primary-900 !h-fit !border-primary-300 hover:!bg-primary-50 !p-0"
            />
          </FlexWrapper>
          <FlexWrapper gap={2} items="center">
            <div className="shrink-0 !w-[60px]">
              <Label text="마감기한" />
            </div>
            <CustomDatePicker
              classes="w-[120px]"
              type="single"
              variant="outline"
              size="sm"
              dateFormat="YYYY.MM.dd"
              value={newDueDate}
              onChange={(date) => setNewDueDate(date)}
            />
          </FlexWrapper>
          <FlexWrapper gap={2} items="center">
            <div className="shrink-0 !w-[60px]">
              <Label text="담당자" />
            </div>
            <Dropdown
              hideDownIcon
              buttonSize="sm"
              buttonVariant="outline"
              items={members.map((m) => ({
                type: "item",
                id: m.user_id,
                label: m.nickname,
              }))}
              dialogWidth={160}
              onChange={(val) => setNewAssignee(val as string)}
              buttonItem={
                newAssignee ? (
                  members.find((m) => m.user_id === newAssignee)?.nickname
                ) : (
                  <span className="text-gray-400 text-sm">선택</span>
                )
              }
              buttonClasses="!font-normal text-primary-900 !w-[120px] !h-fit !border-primary-300 hover:!bg-primary-50 !text-sm !py-1"
            />
          </FlexWrapper>
          <Textarea
            value={newDescription}
            onChange={(e) => {
              setNewDescription(e.target.value);
            }}
            textareaProps={{
              maxLength: 500,
            }}
            placeholder="업무 설명을 입력하세요"
            error={!!errors.description}
            errorMsg={errors.description}
          />
          <div className="rounded-md bg-gray-100 p-4 h-[240px] text-sm">
            Comments 영역
          </div>
        </FlexWrapper>
      </Drawer>
    </div>
  );
}
