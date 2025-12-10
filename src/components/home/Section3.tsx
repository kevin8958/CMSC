import FadeInGsap from "@/layout/FadeInGsap";

function Section3() {
  return (
    <div className="w-full h-[400px] rounded-2xl bg-gradient-to-r from-black to-gray-600 flex flex-col items-center justify-center px-4 gap-10">
      <FadeInGsap>
        <span className="rounded-full bg-gray-300/30 py-4 font-bold text-sm xs:text-lg sm:text-xl px-8 text-gray-100">
          😎 딱 맞는 직원 찾기 쉽지 않죠?
        </span>
      </FadeInGsap>
      <FadeInGsap>
        <p className="text-3xl sm:text-[40px] font-bold text-white break-keep">
          경력직 채용은 인건비가 부담스러우셨나요?
        </p>
      </FadeInGsap>
      <FadeInGsap>
        <p className="text-xl sm:text-2xl font-semibold text-gray-400 break-keep">
          필요한 업무량과 난도에 맞추어 비용을 산정하고 능숙하게 처리할 수 있는
          팀원이 합류합니다.
        </p>
      </FadeInGsap>
    </div>
  );
}

export default Section3;
