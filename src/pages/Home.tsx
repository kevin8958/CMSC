import FlexWrapper from "@/layout/FlexWrapper";
import Button from "@/components/Button";
import Logo from "@/assets/image/effice_logo_t.png";
import { useNavigate } from "react-router-dom";
import Section1 from "@/components/home/Section1";
import Section2 from "@/components/home/Section2";
import Section3 from "@/components/home/Section3";
import Section4 from "@/components/home/Section4";
import Section5 from "@/components/home/Section5";
import Footer from "@/components/home/Footer";
import { useDialog } from "@/hooks/useDialog";
import InquiryDialogBody from "@/components/home/InquiryDialogBody";
import { useAlert } from "@/components/AlertProvider";
import { useInquiryStore } from "@/stores/useInquiryStore";

function Home() {
  const navigate = useNavigate();
  const { openDialog } = useDialog();
  const { showAlert } = useAlert();
  const { sendInquiry } = useInquiryStore();

  const handleSubmit = async (form: {
    phone: string;
    name: string;
    position?: string;
    content: string;
  }) => {
    try {
      await sendInquiry({
        ...form,
      });

      showAlert("문의가 접수되었습니다.", {
        type: "success",
      });
    } catch (e) {
      showAlert("문의 전송에 실패했습니다. 잠시 후 다시 시도해주세요.", {
        type: "danger",
      });
    }
  };
  return (
    <>
      <div className="flex flex-col items-center w-full bg-gradient-to-b from-[rgba(71,208,162,0.3)] to-[rgba(71,208,162,0)] from-0% via-10% via-[rgba(71,208,162,0)] to-100% min-h-screen">
        <div className="w-full max-w-[1200px] pb-[100px] px-4 sm:px-8 relative min-h-screen">
          <FlexWrapper
            classes="w-full absolute top-4 left-1/2 translate-x-[-50%] px-10"
            justify="between"
            items="center"
          >
            <a href="/">
              <img src={Logo} alt="USP Logo" className="w-[80px]" />
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
          <div className="sticky bottom-[52px] mx-auto w-fit z-[999]">
            <Button
              variant="contain"
              // color="green"
              size="lg"
              classes="!w-[200px] !text-xl !font-bold !rounded-lg !py-6"
              onClick={() => {
                openDialog({
                  title: "문의하기",
                  hideBottom: true, // 아래 confirm/cancel 안 쓰고 body에서 버튼 있음
                  body: (
                    <InquiryDialogBody
                      onSubmit={async (data) => {
                        handleSubmit(data);
                      }}
                    />
                  ),
                });
              }}
            >
              문의하기
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Home;
