import FlexWrapper from "@/layout/FlexWrapper";
import { STATUS_CONFIG } from "@/constants/TaskConfigs_fixed";

const statusKeys = Object.keys(STATUS_CONFIG) as (keyof typeof STATUS_CONFIG)[];

export default function TaskBoardSkeleton() {
  return (
    <div className="overflow-x-auto flex w-full gap-2 animate-pulse">
      {statusKeys.map((status) => (
        <div
          key={status}
          className="bg-white border rounded-md p-2 min-h-[calc(100dvh-36px-76px-24px-16px)] flex flex-col w-full min-w-[248px]"
        >
          {/* 컬럼 헤더: TaskStatusBadge와 LuPlus 버튼 위치 재현 */}
          <FlexWrapper justify="between" items="center" classes="mb-2 px-1">
            {/* 배지 형태의 스켈레톤 */}
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
            {/* 플러스 버튼 형태 */}
            <div className="h-5 w-5 bg-gray-100 rounded" />
          </FlexWrapper>

          {/* 카드 리스트 스켈레톤 */}
          <div className="flex flex-col">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border mb-3 p-4 shadow-sm space-y-3"
              >
                {/* 상단: 업무 제목 (TaskCard의 타이틀 부분) */}
                <div className="space-y-2">
                  <div className="h-4 w-5/6 bg-gray-200 rounded" />
                  <div className="h-3 w-2/3 bg-gray-100 rounded" />
                </div>

                {/* 하단: 날짜 및 담당자 아바타 레이아웃 */}
                <div className="flex justify-between items-center pt-2">
                  {/* 기한 표시 부분 */}
                  <div className="h-3 w-16 bg-gray-100 rounded" />

                  {/* 담당자 아바타(원형) 부분 */}
                  <div className="h-6 w-6 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
