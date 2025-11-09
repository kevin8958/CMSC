import FadeInGsap from "@/layout/FadeInGsap";
import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

function Section5() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const list = [
    {
      q: "소규모 사업자인데 알맞을까요?",
      a: "1인기업부터, 5인미만 사업자에게 알맞은 플랜부터, 50인 이상의 사업자를 위한 플랜까지 준비되어 있습니다.",
    },
    {
      q: "원격으로 어떻게 업무를 처리하나요?",
      a: "경영지원의 업무 대부분은 원격으로 가능합니다. 메신저, 클라우드, SAAS, ATS/회계 시스템 등을 활용하여 업무가 수행되며, 상시 업무 수행 피드백 및 매월 보고서가 제공됩니다.",
    },
    {
      q: "계약 형태와 기간은?",
      a: "월단위 계약으로, 최대 1년 단위로 계약이 가능합니다. 해지는 언제든 가능하며, 해지 시 모든 정보는 반환 및 파기됩니다.",
    },
    {
      q: "요금은 어떻게 책정되나요?",
      a: "온보딩 시 논의하는 필요 서비스 범위 · 직원 수 · 매출액을 기준으로 요금이 산정됩니다. 계약 시 한번 산정된 금액은 계약기간동안 변동이 없으며, 이후 재계약 시 같은 기준으로 산정됩니다.",
    },
    {
      q: "SLA(응답시간·처리기한)는 어떻게 되나요?",
      a: "간단업무는 즉시 처리되며, 협업이 필요한 업무의 경우 1영업일 이내 처리를 완료하고 있습니다.",
    },
    {
      q: "담당자·역할은 누구인가요?",
      a: "전담 팀장이 배정되어, 주 업무소통을 담당하며, 오프라인으로도 정기 방문하여 업무를 수행합니다. 원격지원팀은 계약된 서비스 내용에 맞는 분야별 1인 이상이 배정됩니다.",
    },
    {
      q: "고객 지원 채널과 운영시간은?",
      a: "원격 지원팀 메신저와, 담당 팀장 연락처가 공유됩니다. 원격지원팀은 평일 오전 10시부터 오후 5시까지 운영됩니다.",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-start pt-[100px] h-fit sm:h-[800px] gap-10 pb-10">
      <FadeInGsap>
        <p className="text-[40px] font-bold">FAQ</p>
      </FadeInGsap>
      <div className="w-full flex flex-col gap-4">
        {list.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              {/* header */}
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex justify-between items-center p-4"
              >
                <span className="text-base font-semibold">{item.q}</span>
                <LuChevronDown
                  className={`transition-transform duration-500 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* animated body */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  {item.a}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Section5;
