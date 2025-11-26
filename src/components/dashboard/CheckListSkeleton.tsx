import FlexWrapper from "@/layout/FlexWrapper";

export default function CheckListSkeleton() {
  return (
    <div className="overflow-x-auto flex w-full gap-2 animate-pulse">
      <div className="bg-gray-50 rounded-md p-2  h-[288px] flex flex-col min-w-[248px]">
        {/* 컬럼 헤더 */}
        <FlexWrapper justify="between" items="center" classes="mb-2">
          <div className="h-5 w-24 bg-gray-200 rounded" />
          <div className="h-5 w-5 bg-gray-200 rounded" />
        </FlexWrapper>

        {/* 카드 3개 정도 */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow mb-3 p-3 space-y-2 border border-gray-100"
          >
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
            <div className="flex justify-between">
              <div className="h-3 w-10 bg-gray-100 rounded" />
              <div className="h-3 w-8 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
