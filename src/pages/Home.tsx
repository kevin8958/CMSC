import IntroGnb from "@/layout/IntroGnb";
import RotatingText from "@/interaction/RotatingText";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Button from "@/components/Button";
import ProcessImage1 from "@/assets/image/intro_process_1.jpg";
import ProcessImage2 from "@/assets/image/intro_process_2.jpg";
import ProcessImage3 from "@/assets/image/intro_process_3.jpg";
import { LuArrowRight } from "react-icons/lu";

function Home() {
  return (
    <div className="w-full max-w-[1200px] py-[100px] flex flex-col gap-4 px-4 sm:px-8 items-center">
      <IntroGnb />
      <div className="w-full rounded-xl flex flex-col items-center justify-center h-[600px] gap-6">
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
      <div className="w-full flex flex-col items-center h-fit sm:h-[400px] gap-10">
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
          classes="w-full sm:flex-row"
        >
          <div className="flex w-full sm:w-[300px] flex-col items-start gap-4 pb-4">
            <div className="w-full bg-primary-100 pointer-events-none relative flex aspect-[3/2] items-center justify-center rounded-lg">
              <img
                src={ProcessImage1}
                alt="상담진행 이미지"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <Typography variant="H3" classes="!font-semibold">
              상담진행
            </Typography>
            <Typography variant="B1" classes="break-keep !font-thin">
              상담을 통해 병원에서 필요로 하는 서비스를 확인하고, 제공 가능한
              서비스의 범위와 업무수행에 필요한 정보를 안내드립니다.
            </Typography>
          </div>
          <div className="flex w-full sm:w-[300px] flex-col items-start gap-4 pb-4">
            <div className="w-full bg-primary-100 pointer-events-none relative flex aspect-[3/2] items-center justify-center rounded-lg">
              <img
                src={ProcessImage2}
                alt="비용산정 및 계약진행 이미지"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <Typography variant="H3" classes="!font-semibold">
              비용산정 및 계약진행
            </Typography>
            <Typography variant="B1" classes="break-keep !font-thin">
              상담을 통해 정리된 내용을 바탕으로, 서비스 비용을 산정하여
              안내드리고, 계약서 작성을 진행합니다.
            </Typography>
          </div>
          <div className="flex w-full sm:w-[300px] flex-col items-start gap-4 pb-4">
            <div className="w-full bg-primary-100 pointer-events-none relative flex aspect-[3/2] items-center justify-center rounded-lg">
              <img
                src={ProcessImage3}
                alt="팀 빌딩 및 서비스 제공 이미지"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <Typography variant="H3" classes="!font-semibold">
              팀 빌딩 및 서비스 제공
            </Typography>
            <Typography variant="B1" classes="break-keep !font-thin">
              계약 내용에 맞추어 알맞은 지원팀이 구성되고 채널과 업무보드를
              개설하며 업무가 시작됩니다.
            </Typography>
          </div>
        </FlexWrapper>
      </div>
    </div>
  );
}

export default Home;
