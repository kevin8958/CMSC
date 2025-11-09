import FadeInGsap from "@/layout/FadeInGsap";
import FlexWrapper from "@/layout/FlexWrapper";
import {
  LuListChecks,
  LuArrowUpDown,
  LuShoppingCart,
  LuCalendarCheck2,
} from "react-icons/lu";

function Section4() {
  return (
    <div className="w-full flex flex-col items-center justify-start pt-[140px] h-fit sm:h-[800px] gap-10">
      <FadeInGsap>
        <span className="rounded-full bg-gray-100 py-4 font-bold text-lg sm:text-xl px-4 sm:px-8">
          💼 어떤 업무를 지원하는지 궁금하신가요?
        </span>
      </FadeInGsap>
      <FadeInGsap>
        <p className="text-3xl sm:text-[40px] font-bold">
          이런 업무들을 지원합니다!
        </p>
      </FadeInGsap>
      <FlexWrapper
        direction="col"
        items="center"
        justify="between"
        classes="md:flex-row w-full gap-6 mt-6"
      >
        <FlexWrapper
          direction="col"
          gap={2}
          items="center"
          classes="rounded-xl bg-gray-100 p-10 !flex-1 h-[370px]"
        >
          <p className="text-lg font-semibold text-gray-400">SUPPORT 1</p>
          <span className="rounded-full p-4 bg-black inline-block my-4">
            <LuListChecks className="text-[40px] text-white" />
          </span>
          <p className="text-[28px] font-bold">업무보드</p>
          <p className="text-gray-600 text-sm text-center break-keep">
            요청한 업무가 어떻게 접수되고, 실무 진행 상황이 어디까지 왔는지
            한눈에 볼 수 있는 업무 보드입니다.
          </p>
        </FlexWrapper>
        <FlexWrapper
          direction="col"
          gap={2}
          items="center"
          classes="rounded-xl bg-gray-100 p-10 !flex-1 h-[370px]"
        >
          <p className="text-lg font-semibold text-gray-400">SUPPORT 2</p>
          <span className="rounded-full p-4 bg-black inline-block my-4">
            <LuCalendarCheck2 className="text-[40px] text-white" />
          </span>
          <p className="text-[28px] font-bold">인사업무지원</p>
          <p className="text-gray-600 text-sm text-center break-keep">
            운영·행정 업무를 대신 처리해 인사 실무가 매끄럽게 돌아가도록 돕고,
            관련 법령 준수에 필요한 정보도 체계적으로 정리·보관합니다.
          </p>
        </FlexWrapper>
        <FlexWrapper
          direction="col"
          gap={2}
          items="center"
          classes="rounded-xl bg-gray-100 p-10 !flex-1 h-[370px]"
        >
          <p className="text-lg font-semibold text-gray-400">SUPPORT 3</p>
          <span className="rounded-full p-4 bg-black inline-block my-4">
            <LuArrowUpDown className="text-[40px] text-white" />
          </span>
          <p className="text-[28px] font-bold">회계업무지원</p>
          <p className="text-gray-600 text-sm text-center break-keep">
            수입·지출과 세금/공과금 관리, 월별 신고·납부 일정까지 회계 실무
            전반을 놓침 없이 챙겨드립니다.
          </p>
        </FlexWrapper>
        <FlexWrapper
          direction="col"
          gap={2}
          items="center"
          classes="rounded-xl bg-gray-100 p-10 !flex-1 h-[370px]"
        >
          <p className="text-lg font-semibold text-gray-400">SUPPORT 4</p>
          <span className="rounded-full p-4 bg-black inline-block my-4">
            <LuShoppingCart className="text-[40px] text-white" />
          </span>
          <p className="text-[28px] font-bold">구매업무지원</p>
          <p className="text-gray-600 text-sm text-center break-keep">
            요청한 업무가 어떻게 접수되고, 실무 진행 상황이 어디까지 왔는지
            한눈에 볼 수 있는 업무 보드입니다.
          </p>
        </FlexWrapper>
      </FlexWrapper>
    </div>
  );
}

export default Section4;
