import { useState } from "react";
import * as XLSX from "xlsx";
import FlexWrapper from "@/layout/FlexWrapper";
import UploadDropzone from "@/components/UploadDropzone";
import Typography from "@/foundation/Typography";
import Button from "../Button";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useIncomeStore } from "@/stores/useIncomeStore"; // 손익 스토어
import { useAlert } from "@/components/AlertProvider";

/**
 * 손익 데이터 매핑 테이블
 */
const INCOME_HEADER_MAP: Record<string, string> = {
  구분: "category",
  항목명: "name",
  금액: "amount",
  비고: "description",
};

interface UploadIncomeDialogBodyProps {
  onClose: (uploaded: boolean) => void;
  selectedMonth: Date | null;
}

export default function UploadIncomeDialogBody({
  onClose,
  selectedMonth,
}: UploadIncomeDialogBodyProps) {
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { currentCompanyId } = useCompanyStore();
  const { uploadIncomeExcelData } = useIncomeStore(); // 스토어에 이 액션이 있다고 가정
  const { showAlert } = useAlert();
  const parseExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const rawData = XLSX.utils.sheet_to_json(worksheet, { range: 0 });

          const processedData = rawData
            .map((row: any) => {
              const newRow: any = {};
              Object.keys(row).forEach((korKey) => {
                const engKey = INCOME_HEADER_MAP[korKey.trim()];
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
            .filter((row) => {
              const category = String(row.category || "").trim();
              const name = String(row.name || "").trim();

              if (!name || !category) return false;
              if (category === "합계" || category === "지표") return false;

              // ✅ '이익' 필터는 제거하고, 엑셀 다운로드 시 생성된 합계 행만 정확히 골라냅니다.
              const isSummaryRow =
                name.endsWith(" 합계") ||
                ["매출총이익", "영업이익", "세전이익"].includes(name);

              return !isSummaryRow;
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
    if (!selectedFile.length || !selectedMonth || !currentCompanyId) return;

    try {
      setIsUploading(true);
      const parsedData = await parseExcelFile(selectedFile[0]);

      if (parsedData.length === 0) {
        throw new Error("업로드할 유효한 손익 데이터가 없습니다.");
      }

      // 스토어의 업로드 액션 호출
      // parsedData는 [{ category: '매출', name: '상품매출', amount: 10000 }, ...] 형태
      await uploadIncomeExcelData(parsedData, selectedMonth);

      showAlert("손익 데이터가 성공적으로 등록되었습니다.", {
        type: "success",
      });
      onClose(true);
    } catch (error: any) {
      console.error(error);
      showAlert(error.message || "오류가 발생했습니다.", { type: "danger" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FlexWrapper direction="col" gap={4} classes="p-1">
      <FlexWrapper direction="col" gap={1}>
        <Typography variant="H4">손익 데이터 일괄 업로드</Typography>
        <Typography variant="B2" classes="text-gray-500">
          엑셀 파일을 업로드하여 매출, 비용 데이터를 한 번에 등록하세요.
        </Typography>
      </FlexWrapper>

      <UploadDropzone
        maxSizeMB={10}
        accept=".xlsx, .xls"
        onSelect={setSelectedFile}
      />

      <div className="bg-blue-50 p-3 rounded-lg border border-dashed border-blue-200">
        <Typography variant="C1" classes="text-blue-700 block mb-1 font-bold">
          💡 엑셀 양식 가이드
        </Typography>
        <Typography variant="C1" classes="text-blue-600 block leading-relaxed">
          • 필수 헤더: <strong>구분, 항목명, 금액</strong>
          <br />
          • 구분 예시: 매출, 매출원가, 판매관리비, 영업외수익, 영업외비용
          <br />• 항목명 예시: 상품매출, 원재료비, 임차료, 이자수익 등
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
        {isUploading ? "데이터 처리 중..." : "손익 데이터 등록하기"}
      </Button>
    </FlexWrapper>
  );
}
