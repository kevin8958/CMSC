import FadeInGsap from "@/layout/FadeInGsap";
import FlexWrapper from "@/layout/FlexWrapper";
import {
  LuListChecks,
  LuArrowUpDown,
  LuShoppingCart,
  LuCalendarCheck2,
  LuBriefcaseBusiness,
} from "react-icons/lu";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Autoplay } from "swiper/modules";

const cards = [
  {
    label: "SUPPORT 1",
    title: "업무보드",
    icon: <LuListChecks className="text-[40px] text-white" />,
    desc: "요청한 업무의 접수부터 진행 상황까지 한눈에 확인할 수 있는 업무 보드입니다.",
  },
  {
    label: "SUPPORT 2",
    title: "현장업무지원",
    icon: <LuBriefcaseBusiness className="text-[40px] text-white" />, // 임시 아이콘
    desc: "기기설비관리, 우편 수발신, 관공서 업무 등 현장 방문이 필요한 업무를 지원합니다.",
  },
  {
    label: "SUPPORT 3",
    title: "인사업무지원",
    icon: <LuCalendarCheck2 className="text-[40px] text-white" />,
    desc: "인사·행정 업무를 대신 처리하고 법령 준수에 필요한 정보도 관리합니다.",
  },
  {
    label: "SUPPORT 4",
    title: "회계업무지원",
    icon: <LuArrowUpDown className="text-[40px] text-white" />,
    desc: "수입·지출, 세금 신고까지 회계 실무 전반을 지원합니다.",
  },
  {
    label: "SUPPORT 5",
    title: "계약/구매업무지원",
    icon: <LuShoppingCart className="text-[40px] text-white" />,
    desc: "거래처, 계약, 발주 및 유지보수까지 체계적으로 관리합니다.",
  },
];

function Section4() {
  return (
    <div className="w-full flex flex-col items-center pt-[140px] gap-10">
      <FadeInGsap>
        <span className="rounded-full bg-gray-100 py-4 font-bold text-sm sm:text-xl px-6">
          💼 어떤 업무를 지원하는지 궁금하신가요?
        </span>
      </FadeInGsap>

      <FadeInGsap>
        <p className="text-3xl sm:text-[40px] font-bold">
          이런 업무들을 지원합니다!
        </p>
      </FadeInGsap>

      {/* Slider */}
      <div className="w-full max-w-[1200px] mt-10 px-4">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          spaceBetween={16}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {cards.map((card, idx) => (
            <SwiperSlide key={idx}>
              <FlexWrapper
                direction="col"
                gap={2}
                items="center"
                classes="rounded-xl bg-gray-100 py-10 px-6 h-[370px]"
              >
                <p className="text-lg font-semibold text-gray-400">
                  {card.label}
                </p>
                <span className="rounded-full p-4 bg-black inline-block my-4">
                  {card.icon}
                </span>
                <p className="text-[28px] font-bold">{card.title}</p>
                <p className="text-gray-600 text-sm text-center break-keep">
                  {card.desc}
                </p>
              </FlexWrapper>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default Section4;
