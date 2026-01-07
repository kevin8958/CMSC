import FlexWrapper from "@/layout/FlexWrapper";
import { LuMail, LuDownload } from "react-icons/lu"; // LuDownload 추가

export default function Footer() {
  // Supabase에서 생성한 파일의 Public URL (실제 URL로 교체하세요)
  const PRIVACY_POLICY_URL =
    "https://yarxdwcbfginxemagfkc.supabase.co/storage/v1/object/public/public-assets/effice_privacy_policy.docx";
  return (
    <footer className="w-full border-t border-gray-200 pb-10 mt-10 pt-6 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
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
              <p>사업자명: 에피스</p>
              <p>사업자등록번호: 176-08-02714</p>
              <p>사업장소재지: 구로구 경인로43길 49 </p>
              <p>문의전화: 070-8144-2107</p>
            </FlexWrapper>

            {/* 이메일 및 정책 다운로드 영역 */}
            <FlexWrapper
              direction="col"
              items="start"
              gap={2}
              classes="mt-4 sm:mt-0"
            >
              <a
                href="mailto:hello@effice.co.kr"
                className="text-sm text-primary-500 font-semibold flex items-center gap-2 hover:underline"
              >
                <LuMail className="text-lg text-primary-500" />
                hello@effice.co.kr
              </a>

              <a
                href={PRIVACY_POLICY_URL}
                download="에피스_개인정보처리방침.pdf"
                className="text-sm text-gray-600 flex items-center gap-1.5 hover:text-primary-600 transition-colors"
              >
                <LuDownload className="text-lg text-primary-500" />
                개인정보처리방침
              </a>
            </FlexWrapper>
          </FlexWrapper>

          <p className="text-sm text-gray-400 mt-4">
            © EFFICE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
