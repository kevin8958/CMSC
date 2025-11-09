import FlexWrapper from "@/layout/FlexWrapper";
import Button from "@/components/Button";
import UspLogo from "@/assets/image/usp_logo.png";
import { useNavigate } from "react-router-dom";
import Section1 from "@/components/home/Section1";
import Section2 from "@/components/home/Section2";
import Section3 from "@/components/home/Section3";
import Section4 from "@/components/home/Section4";
import Section5 from "@/components/home/Section5";
import Footer from "@/components/home/Footer";

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full max-w-[1200px] pb-[100px] px-4 sm:px-8 relative min-h-screen">
        <FlexWrapper
          classes="w-full absolute top-4 left-1/2 translate-x-[-50%] px-10"
          justify="between"
          items="center"
        >
          <a href="/">
            <img src={UspLogo} alt="USP Logo" className="w-[60px]" />
          </a>

          <Button
            variant="outline"
            onClick={() => {
              navigate("/login");
            }}
          >
            회원 로그인
          </Button>
        </FlexWrapper>
        <div className="flex flex-col gap-4 items-center">
          {/* <IntroGnb /> */}
          <Section1 />
          <Section2 />
          <Section3 />
          <Section4 />
          <Section5 />
        </div>
        <div className="sticky bottom-[52px] mx-auto w-fit">
          <Button
            variant="contain"
            // color="green"
            size="lg"
            classes="!w-[200px] !text-xl !font-bold !rounded-lg !py-6"
          >
            문의하기
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
