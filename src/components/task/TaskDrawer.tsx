import { useEffect, useState } from "react";
import Drawer from "@/components/Drawer";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Dropdown from "@/components/Dropdown";
import Label from "@/components/Label";
import TextInput from "@/components/TextInput";
import Textarea from "@/components/TextArea";
import CustomDatePicker from "@/components/DatePicker";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "@/constants/TaskConfigs_fixed";
import TaskStatusBadge from "@/components/task/TaskStatusBadge";
import TaskPriorityBadge from "@/components/task/TaskPriorityBadge";
import dayjs from "dayjs";
import TaskComments from "./TaskComments";

type StatusKey = keyof typeof STATUS_CONFIG;
type PriorityKey = keyof typeof PRIORITY_CONFIG;
const statusKeys = Object.keys(STATUS_CONFIG) as StatusKey[];

const statusItems = [
  ...statusKeys.map((status) => ({
    type: "item" as const,
    id: status,
    label: <TaskStatusBadge status={status} classes="!w-[80px]" />,
  })),
] as Common.DropdownItem[];

export default function TaskDrawer({
  open,
  disabled,
  mode,
  task,
  workers,
  onClose,
  onSubmit,
  onDelete,
}: Task.TaskDrawerProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<StatusKey>("todo");
  const [priority, setPriority] = useState<PriorityKey>("medium");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [errors, setErrors] = useState({ title: "" });

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setStatus(task.status as StatusKey);
      setPriority(task.priority as PriorityKey);
      setDescription(task.description || "");
      setAssignee(task.assignee || "");
      setDueDate(task.due_date ? dayjs(task.due_date).toDate() : new Date());
    } else {
      setTitle("");
      setStatus("todo");
      setPriority("medium");
      setDescription("");
      setAssignee("");
      setDueDate(new Date());
    }
  }, [task]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setErrors({ title: "제목은 필수 입력사항입니다." });
      return;
    }

    await onSubmit({
      title: title.trim(),
      status,
      priority,
      description,
      due_date: dueDate ? dayjs(dueDate).format("yyyy-MM-DD") : undefined,
      assignee: assignee || undefined,
    });
  };

  return (
    <Drawer
      open={open}
      title={
        <FlexWrapper items="center" gap={2}>
          <Dropdown
            hideDownIcon
            buttonVariant="clear"
            items={statusItems}
            onChange={async (val) => {
              setStatus(val as StatusKey);
            }}
            disabled={disabled}
            dialogWidth={90}
            itemClasses="!px-1"
            buttonItem={<TaskStatusBadge status={status} />}
            buttonClasses="!font-normal text-primary-900 !h-fit !border-primary-300 hover:!bg-primary-50 !p-0"
          />
          <Typography variant="H4">
            {mode === "create"
              ? "업무 추가"
              : disabled
                ? "업무 조회"
                : "업무 수정"}
          </Typography>
        </FlexWrapper>
      }
      showFooter={!disabled}
      confirmText={mode === "create" ? "추가하기" : "수정하기"}
      deleteText="삭제"
      onClose={onClose}
      onCancel={onClose}
      onDelete={onDelete}
      onConfirm={handleSubmit}
    >
      <FlexWrapper direction="col" gap={4} classes="pt-4 pb-6 px-4">
        {/* 제목 */}
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 !w-[60px]">
            <Label text="업무 제목" required />
          </div>
          <TextInput
            classes="!text-sm !h-[42px] max-h-[42px]"
            inputProps={{ value: title }}
            disabled={disabled}
            onChange={(e) => setTitle(e.target.value)}
            max={100}
            error={!!errors.title}
            errorMsg={errors.title}
            placeholder="업무 제목을 입력하세요"
          />
        </FlexWrapper>

        {/* 중요도 */}
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 !w-[60px]">
            <Label text="중요도" />
          </div>
          <Dropdown
            hideDownIcon
            itemClasses="!px-1"
            buttonVariant="clear"
            disabled={disabled}
            items={Object.keys(PRIORITY_CONFIG).map((priority) => ({
              type: "item" as const,
              id: priority,
              label: (
                <TaskPriorityBadge
                  priority={priority as PriorityKey}
                  classes="!w-[120px] justify-center"
                />
              ),
            }))}
            onChange={(val) => setPriority(val as PriorityKey)}
            buttonItem={
              <TaskPriorityBadge
                priority={priority}
                classes="px-4 py-1 w-[120px] justify-center"
              />
            }
            buttonClasses="!font-normal text-primary-900 !h-fit !border-primary-300 hover:!bg-primary-50 !p-0"
          />
        </FlexWrapper>

        {/* 담당자 */}
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 !w-[60px]">
            <Label text="담당자" />
          </div>
          <Dropdown
            hideDownIcon
            buttonSize="sm"
            buttonVariant="outline"
            disabled={disabled}
            items={workers.map((m) => ({
              type: "item",
              id: m.id,
              label: m.name,
            }))}
            dialogWidth={160}
            onChange={(val) => setAssignee(val as string)}
            buttonItem={
              assignee ? workers.find((m) => m.id === assignee)?.name : "선택"
            }
            buttonClasses="!font-normal text-primary-900 !w-[120px] !h-fit !border-primary-300 hover:!bg-primary-50 !text-sm !py-1"
          />
        </FlexWrapper>

        {/* 마감기한 */}
        <FlexWrapper items="center" gap={2}>
          <div className="shrink-0 !w-[60px]">
            <Label text="마감기한" />
          </div>
          <CustomDatePicker
            classes="w-[120px]"
            type="single"
            variant="outline"
            size="sm"
            disabled={disabled}
            dateFormat="YYYY.MM.dd"
            value={dueDate}
            onChange={(date) => setDueDate(date)}
          />
        </FlexWrapper>

        {/* 설명 */}
        <Textarea
          value={description}
          disabled={disabled}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="업무 설명을 입력하세요"
        />
      </FlexWrapper>
      {mode === "edit" && task?.id && <TaskComments taskId={task.id} />}
    </Drawer>
  );
}
