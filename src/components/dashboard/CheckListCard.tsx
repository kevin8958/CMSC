import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import { LuCalendar, LuMessageCircleMore } from "react-icons/lu";
import dayjs from "dayjs";

interface ChecklistCardProps {
  item: {
    id: string;
    title: string;
    description: string | null;
    due_date: string | null;
    comment_count?: number;
  };
}

export default function ChecklistCard({ item }: ChecklistCardProps) {
  return (
    <FlexWrapper direction="col" gap={0}>
      <FlexWrapper direction="col" gap={1} classes="p-2">
        {/* 제목 */}
        <Typography variant="B2" classes="!font-bold truncate w-full">
          {item.title}
        </Typography>

        {/* 설명 */}
        <Typography variant="B2" classes="!text-gray-500 truncate w-full">
          {item.description || "-"}
        </Typography>
      </FlexWrapper>

      <span className="w-full h-[1px] bg-primary-100"></span>

      <FlexWrapper justify="between" classes="p-2 text-sm">
        <FlexWrapper gap={1} items="center">
          <LuCalendar />
          <span className="text-sm">
            {dayjs(item.due_date).format("YYYY.MM.DD") || "-"}
          </span>
        </FlexWrapper>
        <FlexWrapper gap={1} items="center">
          <LuMessageCircleMore className="text-base" />
          <span className="text-sm">{item.comment_count ?? 0}</span>
        </FlexWrapper>
      </FlexWrapper>
    </FlexWrapper>
  );
}
