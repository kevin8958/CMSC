import React from "react";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Badge from "@/components/Badge";
import classNames from "classnames";

interface DashboardCardProps {
  title: string;
  badgeCount?: number | string; // 타이틀 옆 숫자 (선택)
  headerActions?: React.ReactNode; // 우측 버튼들 (선택)
  children: React.ReactNode; // 하단 본문
  classes?: string; // 카드 전체 스타일 커스텀
}

const DashboardCard = ({
  title,
  badgeCount,
  headerActions,
  children,
  classes,
}: DashboardCardProps) => {
  return (
    <div
      className={classNames(
        "flex flex-col h-full overflow-hidden bg-white rounded-xl border border-gray-100 shadow-sm",
        classes
      )}
    >
      {/* 표준 헤더 영역 */}
      <header className="flex justify-between items-center p-4 shrink-0 pb-2">
        <FlexWrapper gap={2} items="center">
          <Typography variant="H4">{title}</Typography>
          {badgeCount !== undefined && (
            <Badge color="green" size="md">
              {badgeCount}
            </Badge>
          )}
        </FlexWrapper>

        {headerActions && (
          <FlexWrapper gap={2} items="center">
            {headerActions}
          </FlexWrapper>
        )}
      </header>

      {/* 가변 본문 영역 */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
};

export default DashboardCard;
