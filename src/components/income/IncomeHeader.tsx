import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Label from "@/components/Label";
import Button from "@/components/Button";
import { LuUpload, LuTrash2, LuDownload } from "react-icons/lu";
import { useAuthStore } from "@/stores/authStore";
import { useDialog } from "@/hooks/useDialog";
import { useIncomeStore } from "@/stores/useIncomeStore";
import { useAlert } from "@/components/AlertProvider";
import UploadIncomeDialogBody from "./UploadIncomeDialogBody";
import dayjs from "dayjs";
import * as XLSX from "xlsx-js-style";
import { useState, useMemo } from "react";

interface IncomeHeaderProps {
  selectedMonth: Date | null;
}

function IncomeHeader({ selectedMonth }: IncomeHeaderProps) {
  const {
    revenues,
    cogs,
    sga,
    nonOpIncome,
    nonOpExpense,
    deleteAllIncomeData,
    downloadAllIncomeRecords,
  } = useIncomeStore();

  const { role } = useAuthStore();
  const { openDialog, close } = useDialog();
  const { showAlert } = useAlert();
  const [isDownloading, setIsDownloading] = useState(false);
  const sums = useMemo(() => {
    // 공통 계산 로직을 함수로 분리하면 코드가 더 깔끔해집니다.
    const calculateTotal = (items: Income.Item[] | null | undefined) => {
      return (items || []).reduce((acc: number, cur: Income.Item) => {
        return acc + (Number(cur.amount) || 0);
      }, 0);
    };

    const revTotal = calculateTotal(revenues);
    const cogsTotal = calculateTotal(cogs);
    const sgaTotal = calculateTotal(sga);
    const nonIncTotal = calculateTotal(nonOpIncome);
    const nonExpTotal = calculateTotal(nonOpExpense);

    const grossProfit = revTotal - cogsTotal;
    const operatingProfit = grossProfit - sgaTotal;
    const preTaxProfit = operatingProfit + nonIncTotal - nonExpTotal;

    return {
      revTotal,
      cogsTotal,
      sgaTotal,
      nonIncTotal,
      nonExpTotal,
      grossProfit,
      operatingProfit,
      preTaxProfit,
    };
  }, [revenues, cogs, sga, nonOpIncome, nonOpExpense]);

  const handleDownloadExcel = async () => {
    if (!selectedMonth || isDownloading) return;

    try {
      setIsDownloading(true);
      const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

      const [allData] = await Promise.all([
        downloadAllIncomeRecords(selectedMonth),
        delay(1000),
      ]);

      // 1. 기본 데이터 행
      const excelRows = allData.map((row: any) => ({
        구분: row.category_name,
        항목명: row.name,
        금액: row.amount,
      }));

      // 2. 하단 합계 8개 행 생성
      const footerRows = [
        { 구분: "합계", 항목명: "매출 합계", 금액: sums.revTotal },
        { 구분: "합계", 항목명: "매출원가 합계", 금액: sums.cogsTotal },
        { 구분: "합계", 항목명: "판매관리비 합계", 금액: sums.sgaTotal },
        { 구분: "합계", 항목명: "영업외수익 합계", 금액: sums.nonIncTotal },
        { 구분: "합계", 항목명: "영업외비용 합계", 금액: sums.nonExpTotal },
        { 구분: "지표", 항목명: "매출총이익", 금액: sums.grossProfit },
        { 구분: "지표", 항목명: "영업이익", 금액: sums.operatingProfit },
        { 구분: "지표", 항목명: "세전이익", 금액: sums.preTaxProfit },
      ];

      const finalData = [...excelRows, ...footerRows];
      const worksheet = XLSX.utils.json_to_sheet(finalData);

      // 3. 스타일 적용
      const borderStyle = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };

      const range = XLSX.utils.decode_range(worksheet["!ref"]!);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!worksheet[cellAddress]) continue;

          const isHeader = R === 0;
          const isFooter = R > excelRows.length; // 데이터 행 이후는 모두 합계행

          worksheet[cellAddress].s = {
            border: borderStyle,
            font: { bold: isHeader || isFooter, size: isHeader ? 11 : 10 },
            fill: isHeader
              ? { fgColor: { rgb: "F3F4F6" } }
              : isFooter
                ? { fgColor: { rgb: "E5E7EB" } }
                : undefined,
            alignment: { horizontal: C === 2 ? "right" : "center" },
          };
        }
      }

      worksheet["!cols"] = [{ wch: 15 }, { wch: 25 }, { wch: 20 }];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "손익계산서");
      XLSX.writeFile(
        workbook,
        `손익현황_${dayjs(selectedMonth).format("YYYYMMDD")}.xlsx`
      );

      showAlert?.("다운로드가 완료되었습니다.", { type: "success" });
    } catch (err: any) {
      showAlert?.("다운로드 중 오류가 발생했습니다.", { type: "danger" });
    } finally {
      setTimeout(() => setIsDownloading(false), 500);
    }
  };

  const handleDeleteAll = async () => {
    if (!selectedMonth) return;
    const monthStr = dayjs(selectedMonth).format("YYYY년 MM월");

    await openDialog({
      title: "데이터 전체 삭제",
      message: `${monthStr}의 모든 데이터를 삭제하시겠습니까?`,
      confirmText: "전체 삭제",
      cancelText: "취소",
      state: "danger",
      onConfirm: async () => {
        try {
          await deleteAllIncomeData(selectedMonth);
          showAlert?.("삭제되었습니다.", { type: "success" });
          return true;
        } catch (err: any) {
          showAlert?.("삭제 오류가 발생했습니다.", { type: "danger" });
          return false;
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
      classes="mt-4 sm:flex-row sm:items-end flex-wrap pb-4"
    >
      <FlexWrapper items="center" gap={8} classes="flex-wrap">
        <FlexWrapper direction="col" items="start" gap={1}>
          <Label text="매출총이익" />
          <Typography variant="H4" classes="md:text-[24px] text-primary-700">
            {sums.grossProfit.toLocaleString()}원
          </Typography>
        </FlexWrapper>

        <FlexWrapper direction="col" items="start" gap={1}>
          <Label text="영업이익" />
          <Typography
            variant="H4"
            classes={`md:text-[24px] ${sums.operatingProfit >= 0 ? "text-blue-600" : "text-red-600"}`}
          >
            {sums.operatingProfit.toLocaleString()}원
          </Typography>
        </FlexWrapper>

        <FlexWrapper direction="col" items="start" gap={1}>
          <Label text="세전이익" />
          <Typography
            variant="H4"
            classes={`md:text-[24px] ${sums.preTaxProfit >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {sums.preTaxProfit.toLocaleString()}원
          </Typography>
        </FlexWrapper>
      </FlexWrapper>

      <FlexWrapper gap={2}>
        {role === "admin" &&
          (revenues.length > 0 || cogs.length > 0 || sga.length > 0) && (
            <Button
              variant="outline"
              color="danger"
              size="md"
              classes="gap-1 !px-3"
              onClick={handleDeleteAll}
              disabled={isDownloading}
            >
              <LuTrash2 className="text-lg" /> 전체 삭제
            </Button>
          )}

        {(revenues.length > 0 || cogs.length > 0 || sga.length > 0) && (
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
        )}

        {role === "admin" && (
          <Button
            variant="contain"
            color="green"
            size="md"
            classes="gap-1 !px-3"
            disabled={isDownloading}
            onClick={async () => {
              await openDialog({
                title: "손익 데이터 업로드",
                hideBottom: true,
                body: (
                  <UploadIncomeDialogBody
                    onClose={close}
                    selectedMonth={selectedMonth}
                  />
                ),
              });
            }}
          >
            <LuUpload className="text-lg" /> 엑셀 업로드
          </Button>
        )}
      </FlexWrapper>
    </FlexWrapper>
  );
}

export default IncomeHeader;
