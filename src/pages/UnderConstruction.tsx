import { LuConstruction } from "react-icons/lu";

function UnderConstruction() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-max bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
        {/* 아이콘 영역 */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-amber-100 rounded-full">
            <LuConstruction className="w-12 h-12 text-amber-600" />
          </div>
        </div>

        {/* 타이틀 및 설명 */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          페이지 준비 중입니다
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed word-keep-all">
          더 나은 서비스를 제공하기 위해 현재 페이지를 준비하고 있습니다.
          <br className="hidden md:block" /> 빠른 시일 내에 찾아뵙겠습니다.
          이용에 불편을 드려 죄송합니다.
        </p>
      </div>
    </div>
  );
}

export default UnderConstruction;
