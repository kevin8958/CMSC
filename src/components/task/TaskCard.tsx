import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Badge from "@/components/Badge";
import {
  LuCalendar,
  LuSquareUserRound,
  LuMessageCircleMore,
} from "react-icons/lu";
import dayjs from "dayjs";
interface TaskCardProps {
  task: Task.Task;
  members: Array<{ user_id: string; nickname: string }>;
}

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

export default function TaskCard({ task, members }: TaskCardProps) {
  return (
    <FlexWrapper direction="col" gap={0}>
      <FlexWrapper direction="col" gap={1} classes="p-2">
        {/* 제목 */}
        <Typography variant="B2" classes="!font-bold">
          {task.title}
        </Typography>

        {/* 설명 */}
        <Typography variant="B2" classes="!text-gray-500">
          {task.description || "-"}
        </Typography>

        <FlexWrapper justify="between" classes="w-full">
          <FlexWrapper gap={1} items="center">
            <LuCalendar />
            <span className="text-sm">
              {dayjs(task.due_date).format("YYYY.MM.DD") || "-"}
            </span>
          </FlexWrapper>
          <Badge
            classes={
              PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG]
                .color + " py-1 !w-fit"
            }
            size="sm"
          >
            <span className="font-normal text-xs">
              {
                PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG]
                  .label
              }
            </span>
          </Badge>
        </FlexWrapper>
      </FlexWrapper>

      <span className="w-full h-[1px] bg-primary-100"></span>

      <FlexWrapper justify="between" classes="p-2 text-sm">
        <FlexWrapper gap={1} items="center">
          <LuSquareUserRound className="text-base" />
          <span className="text-sm">
            {members.find((m) => m.user_id === task.assignee)?.nickname || "-"}
          </span>
        </FlexWrapper>
        <FlexWrapper gap={1} items="center">
          <LuMessageCircleMore className="text-base" />
          <span className="text-sm">0</span>
        </FlexWrapper>
      </FlexWrapper>
    </FlexWrapper>
  );
}
