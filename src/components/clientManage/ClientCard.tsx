import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import { LuCalendar, LuSquareUserRound, LuPhone } from "react-icons/lu";
import dayjs from "dayjs";

interface ClientCardProps {
  client: Client.Client;
  isTerminated?: boolean;
}

export default function ClientCard({ client, isTerminated }: ClientCardProps) {
  return (
    <div
      className={`
        rounded-lg border mb-3 cursor-pointer transition duration-300
        hover:shadow-custom-light shadow-custom-dark
        ${
          isTerminated
            ? "bg-gray-100/50 opacity-70 grayscale-[0.3]"
            : "bg-white"
        }
      `}
    >
      <FlexWrapper direction="col" gap={0}>
        {/* 상단 정보 영역 */}
        <FlexWrapper direction="col" gap={1} classes="p-2">
          {/* 거래처명 */}
          <Typography
            variant="B2"
            classes={`!font-bold truncate w-full ${isTerminated ? "text-gray-500" : "text-gray-900"}`}
          >
            {client.name}
          </Typography>

          {/* 담당자 연락처 (수기 입력된 manager_phone 사용) */}
          <FlexWrapper gap={1} items="center" classes="text-gray-500">
            <LuPhone className="text-base shrink-0" />
            <Typography variant="B2" classes="truncate w-full">
              {client.manager_phone || "-"}
            </Typography>
          </FlexWrapper>

          {/* 계약일 */}
          <FlexWrapper
            justify="between"
            items="center"
            classes="w-full text-gray-500"
          >
            <FlexWrapper gap={1} items="center">
              <LuCalendar className="text-base shrink-0" />
              <span className="text-sm">
                {client.contract_date
                  ? dayjs(client.contract_date).format("YYYY.MM.DD")
                  : "-"}
              </span>
            </FlexWrapper>
          </FlexWrapper>
        </FlexWrapper>

        {/* 구분선 (상태에 따라 색상 조정) */}
        <span
          className={`w-full h-[1px] ${isTerminated ? "bg-gray-200" : "bg-primary-100"}`}
        ></span>

        {/* 하단 담당자 영역 (수기 입력된 manager_name 사용) */}
        <FlexWrapper justify="between" classes="p-2 text-sm text-gray-600">
          <FlexWrapper gap={1} items="center">
            <LuSquareUserRound className="text-base shrink-0" />
            <span className="text-sm truncate">
              {client.manager_name || "담당자 미지정"}
            </span>
          </FlexWrapper>

          {/* 상세보기 힌트 (hover 시 강조용 빈 공간 유지) */}
          <div className="w-4 h-4" />
        </FlexWrapper>
      </FlexWrapper>
    </div>
  );
}
