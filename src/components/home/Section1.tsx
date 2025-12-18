import FlexWrapper from "@/layout/FlexWrapper";
import RotatingText from "@/components/RotatingText";
import FadeInGsap from "@/layout/FadeInGsap";

function Section1() {
  return (
    <FlexWrapper
      direction="col"
      items="center"
      justify="start"
      gap={0}
      classes="sm:justify-center h-screen pb-10 pt-[200px] sm:pt-0"
    >
      <FlexWrapper gap={0} items="center">
        <RotatingText
          texts={["인사담당자", "회계담당자", "구매담당자", "사무직원"]}
          mainClassName="px-8 py-4 rounded-2xl text-black overflow-hidden justify-center"
          elementLevelClassName="text-3xl sm:text-[60px] font-extrabold"
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

      <FadeInGsap>
        <FlexWrapper gap={1} items="center" direction="col">
          <FlexWrapper
            gap={1}
            items="center"
            direction="col"
            classes="sm:flex-row"
          >
            <p className="text-3xl sm:text-[36px] font-bold text-center">
              병의원 총무/경영지원이 필요할 땐,
            </p>
            <p className="text-3xl sm:text-[36px] font-bold text-center">
              EFFICE
            </p>
          </FlexWrapper>
          <FlexWrapper gap={1} items="center" direction="col">
            <FlexWrapper
              gap={1}
              items="center"
              direction="col"
              classes="sm:flex-row"
            >
              <p className="text-lg sm:text-2xl font-semibold text-gray-400 text-center">
                백오피스 운영 어떻게 하고 계신가요?
              </p>
              <p className="text-lg sm:text-2xl font-semibold text-gray-400 text-center">
                아웃소싱을 통해 효율적으로.
              </p>
            </FlexWrapper>
            <p className="text-lg sm:text-2xl font-semibold text-gray-400 text-center">
              진료에 집중하시고, 번거로운 업무는 에피스에게 맡기세요.
            </p>
          </FlexWrapper>
        </FlexWrapper>
      </FadeInGsap>
    </FlexWrapper>
  );
}

export default Section1;
