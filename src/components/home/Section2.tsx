import { LuArrowDownRight, LuArrowUpRight } from "react-icons/lu";
import CountUp from "@/interaction/CountUp";
import FlexWrapper from "@/layout/FlexWrapper";
import FadeInGsap from "@/layout/FadeInGsap";
import Typography from "@/foundation/Typography";

function Section2() {
  return (
    <div className="w-full flex flex-col items-center h-fit sm:h-[680px] gap-10 pb-20">
      <FadeInGsap>
        <span className="rounded-full bg-gray-100 py-4 font-bold text-sm xs:text-lg sm:text-xl px-8">
          👍 필요한 지원업무를 고를 수 있습니다!
        </span>
      </FadeInGsap>
      <FadeInGsap>
        <FlexWrapper gap={0} items="center" direction="col">
          <p className="text-xl xs:text-3xl sm:text-[40px] font-bold">
            효율성과 전문성은 높이고
          </p>
          <p className="text-xl xs:text-3xl sm:text-[40px] font-bold break-keep text-center">
            인간비와 채용 부담을 낮주세요!
          </p>
        </FlexWrapper>
      </FadeInGsap>
      <FlexWrapper
        justify="between"
        direction="col"
        classes="w-full sm:flex-row mt-6 sm:mt-10"
      >
        <div className="flex w-full sm:w-[300px] flex-col items-center gap-2 pb-4">
          <FlexWrapper gap={1} items="center">
            <CountUp
              from={0}
              to={300}
              separator=","
              direction="up"
              duration={0.5}
              className="count-up-text text-[48px] font-extrabold text-primary-900 tracking-tighter"
            />
            <p className="text-[42px] font-bold text-primary-900">만원</p>
            <LuArrowUpRight className="text-[48px] font-bold text-green-500" />
          </FlexWrapper>
          <Typography variant="H3" classes="!font-bold">
            직접 채용시 월 인건비
          </Typography>
          <Typography variant="B1" classes="break-keep !text-gray-400">
            연차,퇴직금, 제수당 포함
          </Typography>
        </div>
        <div className="flex w-full sm:w-[300px] flex-col items-center gap-2 pb-4">
          <FlexWrapper gap={1} items="center">
            <CountUp
              from={0}
              to={150}
              separator=","
              direction="up"
              duration={0.5}
              className="count-up-text text-[48px] font-extrabold text-primary-900 tracking-tighter"
            />
            <p className="text-[42px] font-bold text-primary-900">만원</p>
            <LuArrowDownRight className="text-[48px] font-bold text-danger" />
          </FlexWrapper>
          <Typography variant="H3" classes="!font-bold">
            에피스 평균 수임료
          </Typography>
          <Typography variant="B1" classes="break-keep !text-gray-400">
            부가세별도, 계산서발행
          </Typography>
        </div>
        <div className="flex w-full sm:w-[300px] flex-col items-center gap-2 pb-4">
          <FlexWrapper gap={1} items="center">
            <CountUp
              from={0}
              to={5}
              separator=","
              direction="up"
              duration={0.5}
              className="count-up-text text-[48px] font-extrabold text-primary-900 tracking-tighter"
            />
            <p className="text-[42px] font-bold text-primary-900">년</p>
            <LuArrowUpRight className="text-[48px] font-bold text-green-500" />
          </FlexWrapper>
          <Typography variant="H3" classes="!font-bold">
            담당자 실무 경력
          </Typography>
          <Typography variant="B1" classes="break-keep !text-gray-400">
            의뢰에 맞추어 이뤄지는 팀빌딩
          </Typography>
        </div>
      </FlexWrapper>
    </div>
  );
}

export default Section2;
