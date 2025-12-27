import { useState } from "react";
import * as XLSX from "xlsx";
import FlexWrapper from "@/layout/FlexWrapper";
import UploadDropzone from "@/components/UploadDropzone";
import Typography from "@/foundation/Typography";
import Button from "../Button";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { usePayrollStore } from "@/stores/usePayrollStore";
import { useAlert } from "@/components/AlertProvider";

/**
 * 1. 엑셀 한글 헤더 -> DB 영문 컬럼명 매핑 테이블
 * 엑셀에 포함된 합계 항목들을 추가했습니다.
 */
const HEADER_MAP: Record<string, string> = {
  성명: "user_name",
  부서명: "dept_name",
  직급: "position",
  급여: "base_salary",
  고정연장: "fixed_ot_pay",
  고정야간: "fixed_night_pay",
  연차수당: "annual_leave_pay",
  육아수당: "childcare_allowance",
  차량보조: "car_allowance",
  식대: "meal_allowance",
  추가연장: "ot_pay",
  연장수당: "ot_pay",
  연차정산: "annual_leave_settle",
  나이트수당: "night_work_pay",
  OFF미사용: "unused_off_pay",
  직책수당: "position_allowance",
  당직수당: "duty_allowance",
  상여금: "bonus",
  인센티브: "incentive",
  조정및소급: "adjustment_pay",
  고용보험: "employment_insurance",
  건강보험: "health_insurance",
  장기요양: "longterm_care",
  국민연금: "national_pension",
  소득세: "income_tax",
  지방소득세: "local_income_tax",
  세액정산: "tax_settlement",
  // ✅ 엑셀에서 직접 들어오는 합계 항목 매핑
  지급총액: "total_amount",
  공제총액: "total_deduction",
  실지급액: "net_amount",
};

interface UploadPayrollDialogBodyProps {
  onClose: (uploaded: boolean) => void;
  selectedMonth: Date | null;
}

export default function UploadPayrollDialogBody({
  onClose,
  selectedMonth,
}: UploadPayrollDialogBodyProps) {
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { currentCompanyDetail } = useCompanyStore();
  const { uploadExcelData } = usePayrollStore();
  const { showAlert } = useAlert();

  const payrollType = (currentCompanyDetail?.payroll_type as "A" | "B") || "B";
  const parseExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];

          // 7행(index 6)부터 읽기
          const rawData = XLSX.utils.sheet_to_json(worksheet, { range: 6 });

          const processedData = rawData
            .map((row: any) => {
              const newRow: any = {};
              Object.keys(row).forEach((korKey) => {
                const engKey = HEADER_MAP[korKey.trim()];
                if (engKey) {
                  const val = row[korKey];
                  newRow[engKey] =
                    typeof val === "number"
                      ? val
                      : isNaN(Number(val))
                        ? val
                        : Number(val);
                }
              });
              return newRow;
            })
            // ✅ 필터링 로직 강화
            .filter((row) => {
              const name = String(row.user_name || "").trim();

              // 1. 이름이 비어있으면 제외
              if (!name) return false;

              // 2. '합계', '총계'가 포함된 행 제외
              if (name.includes("합계") || name.includes("총계")) return false;

              // 3. 날짜/시간 패턴 제외 (예: 2025-12-27, 2025.12.27, 14:30:00 등)
              const datePattern = /\d{4}[-./]\d{2}[-./]\d{2}/; // 날짜 패턴
              const timePattern = /\d{2}:\d{2}:\d{2}/; // 시간 패턴
              if (datePattern.test(name) || timePattern.test(name))
                return false;

              // 4. 수치 유효성 검사: 급여 데이터인데 지급총액이 0원이거나 없을 수 없음
              // (날짜가 적힌 푸터 라인은 보통 금액 컬럼이 비어있거나 0입니다)
              const hasAmount =
                Number(row.total_amount || 0) > 0 ||
                Number(row.base_salary || 0) > 0;
              if (!hasAmount) return false;

              return true;
            });

          resolve(processedData);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsBinaryString(file);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile.length || !selectedMonth) return;

    try {
      setIsUploading(true);
      const parsedData = await parseExcelFile(selectedFile[0]);

      if (parsedData.length === 0) {
        throw new Error(
          "업로드할 유효한 데이터가 없습니다. 엑셀 양식을 확인해주세요."
        );
      }

      await uploadExcelData(parsedData, selectedMonth, payrollType);

      showAlert("성공적으로 등록되었습니다.", { type: "success" });
      onClose(true);
    } catch (error: any) {
      showAlert(error.message || "오류가 발생했습니다.", { type: "danger" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FlexWrapper direction="col" gap={4} classes="p-1">
      <FlexWrapper direction="col" gap={1}>
        <Typography variant="H4">급여 데이터 업로드</Typography>
        <Typography variant="B2" classes="text-gray-500">
          <span className="text-green-600 font-bold">{payrollType}타입</span>{" "}
          양식 파일을 선택하세요.
        </Typography>
      </FlexWrapper>

      <UploadDropzone
        maxSizeMB={10}
        accept=".xlsx, .xls"
        onSelect={setSelectedFile}
      />

      <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">
        <Typography variant="C1" classes="text-gray-600 block mb-1 font-bold">
          ⚠️ 주의사항
        </Typography>
        <Typography variant="C1" classes="text-gray-500 block leading-relaxed">
          • 7행에 한글 항목명(성명, 지급총액 등)이 정확히 있어야 합니다.
          <br />• 8행부터 실제 데이터가 시작되어야 합니다.
        </Typography>
      </div>

      <Button
        variant="contain"
        color="green"
        size="lg"
        classes="w-full mt-2"
        onClick={handleUpload}
        disabled={selectedFile.length === 0 || isUploading}
      >
        {isUploading ? "데이터 등록 중..." : "급여대장 등록하기"}
      </Button>
    </FlexWrapper>
  );
}
