import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import { LuCalendar, LuSquareUserRound, LuPhone } from "react-icons/lu";
import dayjs from "dayjs";

export default function ContractCard({
  contract,
  category,
  isTerminated,
}: any) {
  // 배경색은 투명도를 10%~15% 정도 섞어 부드럽게 표현
  const badgeStyle = category?.color
    ? {
        backgroundColor: `${category.color}15`, // 투명도 15% (Hex 뒤에 15 추가)
        color: category.color,
        borderColor: `${category.color}30`, // 테두리 투명도 30%
      }
    : { backgroundColor: "#f3f4f6", color: "#6b7280", borderColor: "#e5e7eb" };

  return (
    <div
      className={`rounded-lg border mb-3 cursor-pointer transition duration-300 hover:shadow-custom-light shadow-custom-dark 
      ${isTerminated ? "bg-gray-100/50 opacity-70 grayscale-[0.3]" : "bg-white"}`}
    >
      <FlexWrapper direction="col" gap={0}>
        <div className="p-2 space-y-1">
          {/* 컬러 값이 적용된 커스텀 배지 */}
          {category && (
            <div
              style={badgeStyle}
              className="px-1.5 py-0.5 rounded text-[10px] font-bold border w-fit mb-1"
            >
              {category.name}
            </div>
          )}

          <Typography
            variant="B2"
            classes={`!font-bold truncate w-full ${isTerminated ? "text-gray-500" : "text-gray-900"}`}
          >
            {contract.title}
          </Typography>

          <FlexWrapper gap={1} items="center" classes="text-gray-500">
            <LuPhone className="text-sm shrink-0" />
            <Typography variant="B2" classes="truncate w-full">
              {contract.manager_phone || "-"}
            </Typography>
          </FlexWrapper>

          <FlexWrapper gap={1} items="center" classes="text-gray-500">
            <LuCalendar className="text-sm shrink-0" />
            <span className="text-xs truncate">
              {contract.contract_date
                ? dayjs(contract.contract_date).format("YY.MM.DD")
                : "-"}
              {contract.end_date &&
                ` ~ ${dayjs(contract.end_date).format("YY.MM.DD")}`}
            </span>
          </FlexWrapper>
        </div>

        <span
          className={`w-full h-[1px] ${isTerminated ? "bg-gray-200" : "bg-primary-100"}`}
        ></span>

        <FlexWrapper justify="between" classes="p-2 text-sm text-gray-600">
          <FlexWrapper gap={1} items="center">
            <LuSquareUserRound className="text-base shrink-0" />
            <span className="text-sm truncate">
              {contract.manager_name || "담당자 미지정"}
            </span>
          </FlexWrapper>
          <div className="w-4 h-4" />
        </FlexWrapper>
      </FlexWrapper>
    </div>
  );
}
