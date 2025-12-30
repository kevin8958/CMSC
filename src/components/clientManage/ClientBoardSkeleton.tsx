import FlexWrapper from "@/layout/FlexWrapper";

export default function ClientBoardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* 1. 상단 헤더 스켈레톤 */}
      <FlexWrapper classes="mb-6" items="center" justify="between">
        <div className="h-8 w-32 bg-gray-200 rounded-md" />
        <div className="h-10 w-28 bg-gray-200 rounded-md" />
      </FlexWrapper>

      <div className="flex w-full gap-6 h-[calc(100dvh-200px)]">
        {/* 2. 왼쪽: 거래 중 (그리드 레이아웃 모사) */}
        <div className="flex-1 flex flex-col min-w-0">
          <FlexWrapper items="center" gap={2} classes="mb-4 px-1">
            <div className="w-2 h-2 rounded-full bg-gray-200" />
            <div className="h-5 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-6 bg-gray-100 rounded" />
          </FlexWrapper>

          <div className="bg-gray-50/50 border border-dashed rounded-xl p-4 flex flex-wrap content-start gap-4 w-full h-full">
            {/* 그리드 카드 6개 (2줄 분량) */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-[calc(33.333%-11px)] min-w-[300px] h-[160px] bg-white rounded-xl border p-4 space-y-4"
              >
                {/* 거래처명 */}
                <div className="h-5 w-1/2 bg-gray-200 rounded" />

                {/* 상세 정보 2줄 */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="h-4 w-4 bg-gray-100 rounded" />
                    <div className="h-4 w-3/4 bg-gray-100 rounded" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-4 w-4 bg-gray-100 rounded" />
                    <div className="h-4 w-1/2 bg-gray-100 rounded" />
                  </div>
                </div>

                {/* 하단 구분선 및 날짜 */}
                <div className="pt-3 border-t border-gray-50 flex justify-between">
                  <div className="h-3 w-20 bg-gray-100 rounded" />
                  <div className="h-3 w-10 bg-gray-50 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 오른쪽: 거래 종료 (세로 리스트 레이아웃 모사) */}
        <div className="w-[340px] flex flex-col flex-shrink-0">
          <FlexWrapper items="center" gap={2} classes="mb-4 px-1">
            <div className="w-2 h-2 rounded-full bg-gray-200" />
            <div className="h-5 w-20 bg-gray-200 rounded" />
          </FlexWrapper>

          <div className="bg-gray-100/50 border rounded-xl p-3 flex flex-col gap-3 h-full">
            {/* 세로 리스트 카드 3개 */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/60 rounded-xl border p-4 space-y-3"
              >
                <div className="h-4 w-2/3 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-100 rounded" />
                <div className="pt-2 border-t border-gray-50 flex justify-between">
                  <div className="h-3 w-16 bg-gray-50 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
