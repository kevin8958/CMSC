import Typography from "@/foundation/Typography";

export default function PrivacyPolicyBody() {
  return (
    <div className="flex flex-col gap-8 h-[550px] overflow-y-auto pr-3 scroll-thin text-gray-700 pb-10">
      {/* 서문 */}
      <section className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <Typography variant="B2" classes="leading-6 text-gray-600">
          에피스(이하 ‘회사’)는 「개인정보 보호법」 등 관련 법령을 준수하며,
          이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게
          처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.
        </Typography>
      </section>

      {/* 1. 수집 항목 및 방법 */}
      <section className="flex flex-col gap-3">
        <Typography variant="B1" classes="font-bold text-primary-900">
          1. 수집하는 개인정보 항목 및 수집방법
        </Typography>
        <Typography variant="B2" classes="text-gray-500 mb-1">
          회사는 서비스 상담, 계약 체결, 서비스 제공 등을 위해 아래와 같은
          개인정보를 수집하고 있습니다.
        </Typography>
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-3 py-2 font-bold w-1/3">수집 시점</th>
                <th className="px-3 py-2 font-bold">수집 항목 (필수)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-3 py-2 bg-gray-50 font-medium">
                  상담 신청 시
                </td>
                <td className="px-3 py-2">
                  이름(담당자명), 병원명(직함), 연락처, 이메일 주소
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 bg-gray-50 font-medium">
                  서비스 계약 및 이용
                </td>
                <td className="px-3 py-2">
                  사업자등록번호, 대표자 성명, 병원 주소, 결제 계좌 정보, 서비스
                  이용 기록
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 bg-gray-50 font-medium">
                  SaaS 플랫폼 이용
                </td>
                <td className="px-3 py-2">
                  아이디, 비밀번호, 접속 로그, 쿠키, IP 정보
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Typography variant="B2" classes="text-gray-400 mt-1">
          * 수집방법: 홈페이지(상담신청), 서면 양식, 전화/팩스, SaaS 플랫폼
          로그인
        </Typography>
      </section>

      {/* 2. 이용목적 */}
      <section className="flex flex-col gap-3">
        <Typography variant="B1" classes="font-bold text-primary-900">
          2. 개인정보의 수집 및 이용목적
        </Typography>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
          <li>
            <strong>계약 이행 및 정산:</strong> 인사/회계/구매 서비스 제공,
            콘텐츠 제공, 요금 결제 및 본인 인증
          </li>
          <li>
            <strong>고객 관리:</strong> 이용자 식별, 부정 이용 방지, 가입 의사
            확인, 고지사항 전달
          </li>
          <li>
            <strong>마케팅 및 광고 (동의 시):</strong> 신규 서비스 개발, 이벤트
            등 광고성 정보 전달
          </li>
        </ul>
      </section>

      {/* 3. 보유 및 이용기간 */}
      <section className="flex flex-col gap-3">
        <Typography variant="B1" classes="font-bold text-primary-900">
          3. 개인정보의 보유 및 이용기간
        </Typography>
        <Typography variant="B2" classes="text-gray-600">
          원칙적으로 목적 달성 후 지체 없이 파기하나, 관계법령에 따라 아래 기간
          동안 보관합니다.
        </Typography>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { label: "상담 및 문의 기록", value: "1년 (계약 미체결 시)" },
            { label: "계약 및 청약철회 기록", value: "5년" },
            { label: "대금결제 및 재화 공급", value: "5년" },
            { label: "표시/광고 관련 기록", value: "6개월" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col p-2 bg-gray-50 rounded border border-gray-100"
            >
              <span className="text-gray-400 mb-1">{item.label}</span>
              <span className="font-bold text-gray-700">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 파기절차 및 방법 */}
      <section className="flex flex-col gap-3">
        <Typography variant="B1" classes="font-bold text-primary-900">
          4. 개인정보의 파기절차 및 방법
        </Typography>
        <div className="text-sm leading-6 space-y-2">
          <p>
            <strong>• 파기절차:</strong> 목적 달성 후 별도 DB(또는 서류함)로
            옮겨져 관련 법령에 따라 일정 기간 저장된 후 파기됩니다.
          </p>
          <p>
            <strong>• 파기방법:</strong> 전자적 파일은 재생 불가능한 기술적
            방법으로 삭제하며, 종이 문서는 분쇄하거나 소각합니다.
          </p>
        </div>
      </section>

      {/* 5. 이용자 권리 */}
      <section className="flex flex-col gap-3">
        <Typography variant="B1" classes="font-bold text-primary-900">
          5. 이용자 및 법정대리인의 권리와 그 행사방법
        </Typography>
        <Typography variant="B2" classes="leading-6">
          이용자는 언제든지 자신의 개인정보를 조회, 수정하거나 가입해지를 요청할
          수 있습니다. 개인정보 보호책임자에게 서면, 전화 또는 이메일로
          연락하시면 지체 없이 조치하겠습니다.
        </Typography>
      </section>

      {/* 6. 안전성 확보 조치 */}
      <section className="flex flex-col gap-3">
        <Typography variant="B1" classes="font-bold text-primary-900">
          6. 개인정보의 안전성 확보 조치
        </Typography>
        <ul className="list-disc pl-5 text-sm leading-6 space-y-1">
          <li>
            <strong>비밀번호 암호화:</strong> SaaS 플랫폼 비밀번호는 암호화되어
            저장 및 관리됩니다.
          </li>
          <li>
            <strong>해킹 대비 대책:</strong> 백신프로그램, SSL 암호화 통신 등을
            통해 네트워크상에서 안전하게 전송합니다.
          </li>
        </ul>
      </section>

      {/* 7. 책임자 및 창구 */}
      <section className="flex flex-col gap-3 p-4 bg-primary-50 rounded-xl border border-primary-100">
        <Typography variant="B1" classes="font-bold text-primary-900">
          7. 개인정보 보호책임자 및 상담창구
        </Typography>
        <div className="text-sm space-y-1 text-gray-700">
          <p>
            <span className="text-gray-400 mr-2">책임자</span> 에피스 개인정보
            보호 담당자
          </p>
          <p>
            <span className="text-gray-400 mr-2">전화번호</span> 070-8144-2107
          </p>
          <p>
            <span className="text-gray-400 mr-2">이메일</span>{" "}
            hello@effice.co.kr
          </p>
        </div>
      </section>

      <Typography variant="B2" classes="text-center text-gray-300 pt-4">
        공고일자: 2026년 1월 1일 / 시행일자: 2026년 1월 8일
      </Typography>
    </div>
  );
}
