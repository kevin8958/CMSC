import FlexWrapper from "@/layout/FlexWrapper";

export default function CheckListSkeleton() {
  return (
    <div className="h-[288px] flex flex-col w-full animate-pulse">
      {/* 헤더 영역 패딩 매칭 (p-4 pb-0) */}
      <FlexWrapper justify="between" items="center" classes="p-4 pb-0">
        <FlexWrapper gap={2} items="center">
          {/* "확인해주세요" 타이틀 스켈레톤 */}
          <div className="h-7 w-28 bg-gray-200 rounded-md" />
          {/* Badge 스켈레톤 */}
          <div className="h-6 w-8 bg-gray-200 rounded-full" />
        </FlexWrapper>
        {/* + 추가 버튼 위치 스켈레톤 */}
        <div className="h-8 w-8 bg-gray-200 rounded-md" />
      </FlexWrapper>

      {/* 리스트 영역 패딩 매칭 (px-4 pt-2) */}
      <div className="flex flex-col w-full px-4 pt-4">
        {/* 실제 카드와 동일한 그림자와 테두리 적용 */}
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="border bg-white rounded-lg shadow-custom-dark mb-3 p-4 space-y-3"
          >
            {/* ChecklistCard의 타이틀 및 내용 영역 */}
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-3 w-1/2 bg-gray-100 rounded" />
            </div>

            {/* 하단 메타 정보 영역 (날짜 등) */}
            <div className="flex justify-between items-center pt-1">
              <div className="h-3 w-20 bg-gray-50 rounded" />
              <div className="h-5 w-12 bg-gray-100 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
