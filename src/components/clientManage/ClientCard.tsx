import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import { LuCalendar, LuSquareUserRound, LuPhone } from "react-icons/lu";
import dayjs from "dayjs";

interface ClientCardProps {
  client: Client.Client;
  workers: Worker.Worker[];
  isTerminated?: boolean;
}

export default function ClientCard({
  client,
  workers,
  isTerminated,
}: ClientCardProps) {
  return (
    <div
      className={`
        bg-white rounded-lg border mb-3 cursor-pointer transition duration-300
        hover:shadow-custom-light shadow-custom-dark
        ${isTerminated ? "opacity-70 grayscale-[0.3]" : ""}
      `}
    >
      <FlexWrapper direction="col" gap={0}>
        <FlexWrapper direction="col" gap={1} classes="p-2">
          {/* 거래처명 (Task 제목과 동일 컬러) */}
          <Typography
            variant="B2"
            classes="!font-bold truncate w-full text-gray-900"
          >
            {client.name}
          </Typography>

          {/* 연락처 (Task 설명과 동일 컬러: !text-gray-500) */}
          <FlexWrapper gap={1} items="center">
            <LuPhone className="text-base" />
            <Typography variant="B2" classes="!text-gray-500 truncate w-full">
              {client.contact || "-"}
            </Typography>
          </FlexWrapper>

          {/* 날짜 및 배지 영역 */}
          <FlexWrapper justify="between" items="center" classes="w-full">
            <FlexWrapper gap={1} items="center">
              <LuCalendar className="text-base" />
              <span className="text-sm">
                {client.contract_date
                  ? dayjs(client.contract_date).format("YYYY.MM.DD")
                  : "-"}
              </span>
            </FlexWrapper>
          </FlexWrapper>
        </FlexWrapper>

        {/* 구분선 (TaskCard와 동일) */}
        <span className="w-full h-[1px] bg-primary-100"></span>

        {/* 하단 담당자 영역 (TaskCard 하단과 동일 컬러/사이즈) */}
        <FlexWrapper justify="between" classes="p-2 text-sm">
          <FlexWrapper gap={1} items="center">
            <LuSquareUserRound className="text-base" />
            <span className="text-sm">
              {workers.find((w) => w.id === client.manager_id)?.name || "-"}
            </span>
          </FlexWrapper>

          {/* 댓글 위치 비움 */}
          <div className="w-4 h-4" />
        </FlexWrapper>
      </FlexWrapper>
    </div>
  );
}
