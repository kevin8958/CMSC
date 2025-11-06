import IntroGnb from "@/layout/IntroGnb";
import RotatingText from "@/interaction/RotatingText";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Button from "@/components/Button";
import { LuArrowRight, LuArrowUpRight, LuArrowDownRight } from "react-icons/lu";
import {
  LuListChecks,
  LuArrowUpDown,
  LuShoppingCart,
  LuCalendarCheck2,
} from "react-icons/lu";
import CountUp from "@/interaction/CountUp";

function Home() {
  return (
    <div className="w-full max-w-[1200px] py-[100px] flex flex-col gap-4 px-4 sm:px-8 items-center">
      <IntroGnb />
      <div className="w-full rounded-xl flex flex-col items-center justify-start h-[600px] gap-6 pt-[100px]">
        <FlexWrapper gap={0} items="center">
          <RotatingText
            texts={["인사담당자", "회계담당자", "구매담당자", "사무직원"]}
            mainClassName="px-8 py-4 rounded-2xl text-black overflow-hidden justify-center bg-green-300/50"
            elementLevelClassName="text-[48px] font-bold"
            staggerFrom={"first"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.02}
            splitLevelClassName="overflow-hidden"
            transition={{ type: "spring", damping: 150, stiffness: 1000 }}
            rotationInterval={3000}
          />
        </FlexWrapper>
        <FlexWrapper gap={0} items="center" direction="col">
          <p className="text-[36px] font-bold">
            경영지원이 필요할 땐, UNDER STAND
          </p>
          <p className="text-2xl font-semibold text-gray-400">
            중요하지만 번거로운 경영지원업무, 아웃소싱을 통해 간편하게
          </p>
        </FlexWrapper>
        <Button
          variant="contain"
          color="primary"
          size="lg"
          classes="mt-6 !w-[248px] !text-[26px] !font-bold !rounded-2xl !py-10"
        >
          문의하기
          <LuArrowRight className="ml-4" />
        </Button>
      </div>
      <div className="w-full flex flex-col items-center h-fit sm:h-[700px] gap-10">
        <span className="rounded-full bg-gray-100 py-4 font-bold text-xl px-8">
          👍 필요한 지원업무를 고를 수 있습니다!
        </span>
        <FlexWrapper gap={0} items="center" direction="col">
          <p className="text-[40px] font-bold">효율성과 전문성은 높이고</p>
          <p className="text-[40px] font-bold">
            인간비와 채용 부담을 낮주세요!
          </p>
        </FlexWrapper>
        <FlexWrapper
          justify="between"
          direction="col"
          classes="w-full sm:flex-row  mt-10"
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
              USP평균 수임료
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
      <div className="w-full h-[400px] rounded-2xl bg-gradient-to-r from-black to-gray-600 flex flex-col items-center justify-center px-4 gap-10">
        <span className="rounded-full bg-gray-300/30 py-4 font-bold text-xl px-8 text-gray-100">
          😎 딱 맞는 직원 찾기 쉽지 않죠?
        </span>
        <p className="text-[40px] font-bold text-white">
          경력직 채용은 인건비가 부담스러우셨나요?
        </p>
        <p className="text-2xl font-semibold text-gray-400">
          필요한 업무량과 난도에 맞추어 비용을 산정하고 능숙하게 처리할 수 있는
          팀원이 합류합니다.
        </p>
      </div>

      <div className="w-full flex flex-col items-center justify-start pt-[140px] h-fit sm:h-[800px] gap-10">
        <span className="rounded-full bg-gray-100 py-4 font-bold text-xl px-8">
          💼 USP에서는 어떤 업무를 지원하는지 궁금하신가요?
        </span>
        <p className="text-[40px] font-bold">이런 업무들을 지원합니다!</p>
        <FlexWrapper
          items="center"
          justify="between"
          classes="w-full gap-6 mt-6"
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
    </div>
  );
}

export default Home;
