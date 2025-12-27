import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Label from "@/components/Label";
import Button from "@/components/Button";
import { LuUpload, LuTrash2, LuDownload } from "react-icons/lu"; // LuDownload 추가
import { useAuthStore } from "@/stores/authStore";
import { useDialog } from "@/hooks/useDialog";
import { usePayrollStore } from "@/stores/usePayrollStore";
import { useAlert } from "@/components/AlertProvider";
import UploadPayrollDialogBody from "@/components/salary/UploadPayrollDialogBody";
import dayjs from "dayjs";
import * as XLSX from "xlsx-js-style";
import { useState } from "react";

// 엑셀 내보내기용 역매핑 (영문 -> 한글)
const EXPORT_HEADER_MAP: Record<string, string> = {
  user_name: "성명",
  dept_name: "부서명",
  position: "직급",
  base_salary: "급여",
  fixed_ot_pay: "고정연장",
  fixed_night_pay: "고정야간",
  annual_leave_pay: "연차수당",
  childcare_allowance: "육아수당",
  car_allowance: "차량보조",
  meal_allowance: "식대",
  ot_pay: "연장/추가연장",
  annual_leave_settle: "연차정산",
  night_work_pay: "나이트수당",
  unused_off_pay: "OFF미사용",
  position_allowance: "직책수당",
  duty_allowance: "당직수당",
  bonus: "상여금",
  incentive: "인센티브",
  adjustment_pay: "조정및소급",
  employment_insurance: "고용보험",
  health_insurance: "건강보험",
  longterm_care: "장기요양",
  national_pension: "국민연금",
  income_tax: "소득세",
  local_income_tax: "지방소득세",
  tax_settlement: "세액정산",
  total_amount: "지급총액",
  total_deduction: "공제총액",
  net_amount: "실지급액",
};

interface SalaryHeaderProps {
  selectedMonth: Date | null;
}

function SalaryHeader({ selectedMonth }: SalaryHeaderProps) {
  // ✅ downloadAllRecords 액션 추가 추출
  const {
    total,
    totalAmountSum,
    netAmountSum,
    deleteAllRecords,
    downloadAllRecords,
  } = usePayrollStore();
  const { role } = useAuthStore();
  const { openDialog, close } = useDialog();
  const { showAlert } = useAlert();
  const [isDownloading, setIsDownloading] = useState(false);
  // ✅ 엑셀 다운로드 핸들러
  const handleDownloadExcel = async () => {
    if (!selectedMonth || total === 0) return;
    try {
      setIsDownloading(true); // 다운로드 시작
      const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
      // 1. 전체 데이터 가져오기
      const [allData] = await Promise.all([
        downloadAllRecords(selectedMonth),
        delay(1000),
      ]);

      // 2. 데이터 변환 (한글 헤더 매핑)
      const excelRows = allData.map((row: any) => {
        const mappedRow: any = {};
        Object.entries(EXPORT_HEADER_MAP).forEach(([engKey, korKey]) => {
          mappedRow[korKey] = row[engKey] ?? 0;
        });
        return mappedRow;
      });

      // 3. 하단 합계 행 데이터 생성
      const totalRow: any = {};
      const headerKeys = Object.values(EXPORT_HEADER_MAP);

      headerKeys.forEach((key) => {
        totalRow[key] = ""; // 기본값 빈 문자열
      });

      totalRow["성명"] = "합계";
      totalRow["지급총액"] = totalAmountSum;
      totalRow["공제총액"] = allData.reduce(
        (sum: number, r: any) => sum + (Number(r.total_deduction) || 0),
        0
      );
      totalRow["실지급액"] = netAmountSum;

      // 데이터 배열 합치기 (헤더용 키 배열 + 데이터 + 합계행)
      const finalData = [...excelRows, totalRow];

      // 4. 워크시트 생성
      const worksheet = XLSX.utils.json_to_sheet(finalData);

      // 5. 스타일 정의
      const borderStyle = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };

      const headerStyle = {
        font: { bold: true, size: 12 },
        fill: { fgColor: { rgb: "F3F4F6" } }, // 연한 회색 배경
        alignment: { horizontal: "center" },
        border: borderStyle,
      };

      const bodyStyle = {
        border: borderStyle,
        alignment: { horizontal: "right" }, // 숫자는 우측 정렬
      };

      const footerStyle = {
        font: { bold: true },
        fill: { fgColor: { rgb: "E5E7EB" } },
        border: borderStyle,
        alignment: { horizontal: "right" },
      };

      // 6. 모든 셀에 스타일 적용
      const range = XLSX.utils.decode_range(worksheet["!ref"]!);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!worksheet[cellAddress]) continue;

          // 헤더 행 (첫 번째 행)
          if (R === 0) {
            worksheet[cellAddress].s = headerStyle;
          }
          // 합계 행 (마지막 행)
          else if (R === range.e.r) {
            worksheet[cellAddress].s = footerStyle;
          }
          // 일반 데이터 행
          else {
            worksheet[cellAddress].s = bodyStyle;
            // 이름, 부서, 직급은 왼쪽 정렬로 예외 처리
            if (C < 3)
              worksheet[cellAddress].s = {
                ...bodyStyle,
                alignment: { horizontal: "left" },
              };
          }
        }
      }

      // 컬럼 너비 자동 조절 (기본값)
      worksheet["!cols"] = headerKeys.map(() => ({ wch: 15 }));

      // 7. 파일 저장
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "급여대장");

      const fileName = `급여대장_${dayjs(selectedMonth).format("YYYYMM")}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      showAlert?.("다운로드가 완료되었습니다.", { type: "success" });
    } catch (err: any) {
      console.error(err);
      showAlert?.("다운로드 중 오류가 발생했습니다.", { type: "danger" });
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
      }, 500);
    }
  };
  const handleDeleteAll = async () => {
    if (!selectedMonth) return;

    const monthStr = dayjs(selectedMonth).format("YYYY년 MM월");

    await openDialog({
      title: "데이터 전체 삭제",
      message: `${monthStr}의 모든 급여 데이터를 삭제하시겠습니까?\n 삭제된 데이터는 복구할 수 없습니다.`,
      confirmText: "전체 삭제",
      cancelText: "취소",
      state: "danger", // 버튼 색상 및 아이콘이 위험 상태로 표시됨
      onConfirm: async () => {
        try {
          // 스토어의 전체 삭제 액션 호출
          await deleteAllRecords(selectedMonth);

          showAlert?.("성공적으로 삭제되었습니다.", {
            type: "success",
            durationMs: 3000,
          });

          return true; // 성공 시 다이얼로그 닫기
        } catch (err: any) {
          showAlert?.(err.message || "삭제 중 오류가 발생했습니다.", {
            type: "danger",
            durationMs: 3000,
          });

          return false; // 실패 시 다이얼로그 유지
        }
      },
    });
  };

  return (
    <FlexWrapper
      justify="between"
      items="start"
      direction="col"
      gap={4}
      classes="mt-4 sm:flex-row sm:items-end flex-wrap"
    >
      {/* 통계 정보 영역 */}
      <FlexWrapper items="center" classes="flex-wrap">
        <FlexWrapper
          direction="col"
          items="start"
          gap={1}
          classes="col-span-6 md:col-span-3"
        >
          <Label text="총 지급액" />
          <Typography variant="H4" classes="md:text-[24px] text-blue-600">
            {totalAmountSum?.toLocaleString()}원
          </Typography>
        </FlexWrapper>
        <FlexWrapper
          direction="col"
          items="start"
          gap={1}
          classes="col-span-6 md:col-span-3"
        >
          <Label text="총 공제액" />
          <Typography variant="H4" classes="md:text-[24px] text-red-600">
            {(totalAmountSum! - (netAmountSum ?? 0)).toLocaleString()}원
          </Typography>
        </FlexWrapper>
        <FlexWrapper
          direction="col"
          items="start"
          gap={1}
          classes="col-span-6 md:col-span-3"
        >
          <Label text="실 지급액" />
          <Typography variant="H4" classes="md:text-[24px] text-green-600">
            {netAmountSum?.toLocaleString()}원
          </Typography>
        </FlexWrapper>
      </FlexWrapper>

      {/* 액션 버튼 영역 */}
      {role === "admin" && (
        <FlexWrapper gap={2}>
          {total !== 0 && (
            <>
              <Button
                variant="outline"
                color="danger"
                size="md"
                classes="gap-1 !px-3"
                onClick={handleDeleteAll}
              >
                <LuTrash2 className="text-lg" />
                전체 삭제
              </Button>

              {/* ✅ 엑셀 다운로드 버튼 추가 */}
              <Button
                variant="outline"
                size="md"
                classes="gap-1 !px-3 !w-[124px]"
                onClick={handleDownloadExcel}
                disabled={isDownloading}
              >
                <LuDownload
                  className={`text-lg ${isDownloading ? "animate-bounce" : ""}`}
                />
                {isDownloading ? "생성 중..." : "엑셀 다운로드"}
              </Button>
            </>
          )}

          <Button
            variant="contain"
            color="green"
            size="md"
            classes="gap-1 !px-3"
            onClick={async () => {
              await openDialog({
                title: "엑셀 업로드",
                hideBottom: true,
                body: (
                  <UploadPayrollDialogBody
                    onClose={close}
                    selectedMonth={selectedMonth}
                  />
                ),
              });
            }}
          >
            <LuUpload className="text-lg" />
            엑셀 업로드
          </Button>
        </FlexWrapper>
      )}
    </FlexWrapper>
  );
}

export default SalaryHeader;
