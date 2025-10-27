import IntroGnb from "@/layout/IntroGnb";
import RotatingText from "@/interaction/RotatingText";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Button from "@/components/Button";

function Home() {
  return (
    <div className="w-full max-w-[1200px] py-[100px] flex flex-col gap-4 px-4 sm:px-8 items-center">
      <IntroGnb />
      <div className="w-full rounded-xl flex flex-col items-center justify-center h-[480px] gap-0">
        <FlexWrapper gap={0} items="center">
          <p className="text-2xl font-thin">더 효율적인</p>
          <RotatingText
            texts={["인사업무", "회계업무", "구매업무", "행정업무"]}
            mainClassName="px-2 sm:px-2 md:px-3 rounded-lg text-black overflow-hidden justify-center"
            elementLevelClassName="text-2xl font-bold"
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
          <p className="text-[52px] font-bold tracking-wide">CM.SC와 함께</p>
          <p className="text-[52px] font-bold mt-[-12px]">간편한 경영지원</p>
        </FlexWrapper>
        <Button
          variant="contain"
          color="primary"
          size="lg"
          classes="mt-6 !w-[320px]"
        >
          문의하기
        </Button>
      </div>
      <div className="w-full rounded-xl flex flex-col items-start h-[400px]">
        <FlexWrapper justify="between" classes="w-full">
          <div className="flex w-[300px] flex-col items-start gap-4 pb-4">
            <div className="w-full bg-primary-100 pointer-events-none relative flex aspect-[3/2] items-center justify-center rounded-lg">
              image1
            </div>
            <Typography variant="H3" classes="!font-semibold">
              상담진행
            </Typography>
            <Typography variant="B1" classes="break-keep !font-thin">
              상담을 통해 병원에서 필요로 하는 서비스를 확인하고, 제공 가능한
              서비스의 범위와 업무수행에 필요한 정보를 안내드립니다.
            </Typography>
          </div>
          <div className="flex w-[300px] flex-col items-start gap-4 pb-4">
            <div className="w-full bg-primary-100 pointer-events-none relative flex aspect-[3/2] items-center justify-center rounded-lg">
              image2
            </div>
            <Typography variant="H3" classes="!font-semibold">
              비용산정 및 계약진행
            </Typography>
            <Typography variant="B1" classes="break-keep !font-thin">
              상담을 통해 정리된 내용을 바탕으로, 서비스 비용을 산정하여
              안내드리고, 계약서 작성을 진행합니다.
            </Typography>
          </div>
          <div className="flex w-[300px] flex-col items-start gap-4 pb-4">
            <div className="w-full bg-primary-100 pointer-events-none relative flex aspect-[3/2] items-center justify-center rounded-lg">
              image3
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
      <div className="w-full rounded-xl bg-primary-100 flex items-center justify-center h-[400px]">
        section3
      </div>
    </div>
  );
}

export default Home;
