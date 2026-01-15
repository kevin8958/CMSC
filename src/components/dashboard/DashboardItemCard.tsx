import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import { LuCalendar, LuMessageCircle } from "react-icons/lu";
import classNames from "classnames";

interface DashboardItemCardProps {
  title?: string;
  content?: string | null;
  dateRange?: string;
  commentCount?: number; // ✅ 추가된 댓글 개수
  priorityColor?: string; // 좌측 바 색상 (e.g., "bg-red-500")
  isActive?: boolean; // 호버나 선택 상태 동기화용
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  classes?: string;
}

const DashboardItemCard = ({
  title,
  content,
  dateRange,
  commentCount,
  priorityColor,
  isActive,
  onClick,
  onMouseEnter,
  onMouseLeave,
  classes,
}: DashboardItemCardProps) => {
  return (
    <article
      className={classNames(
        "border rounded-xl p-2 cursor-pointer transition-colors w-full",
        {
          "bg-gray-50 border-gray-300": isActive,
          "bg-white border-gray-300 hover:bg-gray-50": !isActive,
        },
        classes
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <FlexWrapper items="start" gap={1} classes="h-full">
        {/* 우선순위 표시 바 (데이터가 있을 때만) */}
        <span
          className={classNames(
            "self-stretch rounded-full shrink-0",
            priorityColor,
            {
              "w-1.5 mr-1": priorityColor,
              "w-0 bg-transparent": !priorityColor,
            }
          )}
        />

        <div className="flex-1 min-w-0">
          {/* 타이틀 */}
          {title && (
            <Typography
              variant="B2"
              classes="font-semibold truncate block mb-1"
            >
              {title}
            </Typography>
          )}

          {/* 본문 내용 */}
          {content && (
            <Typography
              variant="B2"
              classes="!text-gray-500 truncate block mb-2"
            >
              {content}
            </Typography>
          )}

          {/* 하단 정보 영역 (날짜 + 댓글) */}
          <FlexWrapper gap={1} items="center">
            {dateRange && (
              <FlexWrapper
                gap={1}
                items="center"
                classes="bg-gray-100 w-max py-1 px-2 rounded-md !text-gray-500"
              >
                <LuCalendar size={14} />
                <span className="text-xs font-bold">{dateRange}</span>
              </FlexWrapper>
            )}

            {/* 댓글 개수 (0보다 클 때만) */}
            {commentCount !== undefined && commentCount > 0 && (
              <FlexWrapper
                gap={1}
                items="center"
                classes="bg-gray-100 w-max py-1 px-2 rounded-md !text-gray-500"
              >
                <LuMessageCircle size={14} />
                <span className="text-xs font-bold">{commentCount}</span>
              </FlexWrapper>
            )}
          </FlexWrapper>
        </div>
      </FlexWrapper>
    </article>
  );
};

export default DashboardItemCard;
