import FlexWrapper from "@/layout/FlexWrapper";
import { LuMail } from "react-icons/lu";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 pb-10 mt-10 pt-6 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        {/* left */}
        <div className="flex flex-col gap-3">
          <FlexWrapper gap={0} items="start" direction="col">
            <div className="text-2xl font-extrabold">EFFICE</div>
            <p className="text-sm text-gray-500">
              중요한 경영지원업무, 아웃소싱으로 더 효율적으로
            </p>
          </FlexWrapper>
          <FlexWrapper
            gap={1}
            direction="col"
            items="start"
            justify="between"
            classes="sm:flex-row w-full"
          >
            <FlexWrapper
              gap={1}
              items="start"
              direction="col"
              classes="mt-4 text-xs"
            >
              <p>사업자명: 트립트먼트</p>
              <p>사업자등록번호: 176-08-02714</p>
              <p>사업장소재지: 구로구 경인로43길 49 </p>
              <p>문의전화: - </p>
            </FlexWrapper>
            <a
              href="mailto:hello@understand.partners"
              className="text-sm text-primary-500 font-semibold flex items-center gap-2"
            >
              <LuMail className="text-lg text-primary-500" />
              hello@effice.co.kr
            </a>
          </FlexWrapper>
          <p className="text-sm text-gray-400 mt-4">
            © EFFICE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
