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
import { RiKakaoTalkFill } from "react-icons/ri"; // 카카오 아이콘 추가

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
    privacy_policy_agreed: boolean;
    marketing_agreed: boolean;
  }) => {
    try {
      await sendInquiry({ ...form });
      showAlert("문의가 접수되었습니다.", { type: "success" });
    } catch (e) {
      showAlert("문의 전송에 실패했습니다. 잠시 후 다시 시도해주세요.", {
        type: "danger",
      });
    }
  };

  // 카카오톡 설정
  const KAKAO_CHANNEL_ID = "_xexeegn"; // 💡 실제 채널 ID (앞에 _ 포함)를 입력하세요.
  const CHAT_URL = `https://pf.kakao.com/${KAKAO_CHANNEL_ID}/chat`;

  // 팝업창으로 열기 함수
  const handleKakaoPopup = () => {
    const width = 500;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      CHAT_URL,
      "KakaoTalkChatPopup",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
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
              variant="contain"
              onClick={() => {
                navigate("/login");
              }}
            >
              회원 로그인
            </Button>
          </FlexWrapper>

          <div className="flex flex-col gap-4 items-center">
            <Section1 />
            <Section2 />
            <Section3 />
            <Section4 />
            <Section5 />
          </div>

          {/* 기존 하단 중앙 문의하기 버튼 */}
          <div className="sticky bottom-[52px] mx-auto w-fit z-[999]">
            <Button
              variant="contain"
              size="lg"
              classes="!w-[200px] !text-xl !font-bold !rounded-lg !py-6 shadow-xl"
              onClick={() => {
                openDialog({
                  title: "문의하기",
                  hideBottom: true,
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

        {/* --- 카카오톡 플로팅 버튼 추가 --- */}
        <button
          onClick={handleKakaoPopup}
          className="fixed bottom-8 right-8 z-[1000] w-14 h-14 bg-[#FEE500] rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group"
          aria-label="카카오톡 상담하기"
        >
          <RiKakaoTalkFill className="text-[32px] text-[#191919]" />

          {/* 툴팁 (선택 사항) */}
          <span className="absolute right-16 bg-white text-gray-800 text-sm font-bold py-2 px-3 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            카톡 상담하기
          </span>
        </button>
      </div>
    </>
  );
}

export default Home;
