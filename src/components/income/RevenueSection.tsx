import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import Tooltip from "../Tooltip";
import { LuCircleMinus, LuCirclePlus, LuPlus, LuTrash2 } from "react-icons/lu";
import AddCogsDialogBody from "./AddCogsDialogBody";
import { useDialog } from "@/hooks/useDialog";
import { useIncomeStore } from "@/stores/useIncomeStore";
import { useAlert } from "../AlertProvider";
import { useAuthStore } from "@/stores/authStore";
import AddRevenueDialogBody from "./AddRevenueDialogBody";

export default function RevenueSection() {
  const [tempRevenue, setTempRevenue] = useState<string>("0");
  const { statement, cogs, revenues, deleteRevenue, deleteCogs } =
    useIncomeStore();

  useEffect(() => {
    if (statement) {
      setTempRevenue(statement.revenue?.toString() || "0");
    }
  }, [statement]);

  const { showAlert } = useAlert();
  const { openDialog } = useDialog();
  const { role } = useAuthStore();

  const totalRevenue = revenues.reduce((s, x) => s + x.amount, 0);
  const totalCogsAmount = cogs.reduce((s, x) => s + x.amount, 0);
  const grossProfit = Number(tempRevenue) - totalCogsAmount;

  return (
    <>
      {/* 메인 카드 컨테이너: overflow-hidden으로 자식이 삐져나오지 않게 가둠 */}
      <FlexWrapper
        direction="col"
        justify="between"
        gap={0}
        classes="size-full border rounded-xl bg-white sm:min-w-[370px] overflow-hidden"
      >
        {/* 상단 본문 영역: flex-1과 min-h-0를 주어 남은 높이를 차지하게 함 */}
        <FlexWrapper direction="col" gap={2} classes="p-4 flex-1 min-h-0">
          {/* 1. 매출 섹션 박스 */}
          <FlexWrapper
            direction="col"
            gap={1}
            // flex-1 min-h-0: 매출원가 섹션과 높이를 정확히 반반(또는 유동적으로) 나눠 가짐
            classes="border rounded-xl flex-1 min-h-0 !border-gray-400 w-full overflow-hidden"
          >
            {/* 상단 헤더: shrink-0로 높이 고정 */}
            <FlexWrapper
              justify="between"
              items="center"
              classes="w-full px-4 py-2 pb-0 shrink-0"
            >
              <FlexWrapper items="center" gap={1}>
                <LuCirclePlus />
                <Typography
                  variant="H4"
                  classes="font-semibold text-primary-700"
                >
                  매출
                </Typography>
              </FlexWrapper>

              <FlexWrapper items="center" gap={2}>
                <Typography variant="H4" classes="font-semibold text-right">
                  총 {totalRevenue.toLocaleString()}원
                </Typography>
                {role === "admin" && (
                  <Button
                    variant="contain"
                    color="green"
                    size="sm"
                    classes="gap-1 !px-2"
                    onClick={async () => {
                      await openDialog({
                        title: "매출항목 추가",
                        hideBottom: true,
                        body: <AddRevenueDialogBody />,
                      });
                    }}
                  >
                    <LuPlus className="text-base" />
                  </Button>
                )}
              </FlexWrapper>
            </FlexWrapper>

            {/* 매출 세부내역 리스트: overflow-y-auto로 내부 스크롤 발생 */}
            {revenues.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6">
                <p className="text-gray-400 text-sm"> 세부내역이 없습니다</p>
              </div>
            ) : (
              <FlexWrapper
                items="center"
                justify="start"
                direction="col"
                gap={0}
                classes="flex-1 overflow-y-auto scroll-thin px-4 min-h-0"
              >
                {revenues.map((item) => (
                  <FlexWrapper
                    key={item.id}
                    justify="between"
                    items="center"
                    classes="py-1 bg-white w-full shrink-0" // shrink-0로 리스트 아이템 높이 유지
                  >
                    <Typography variant="B1">{item.name}</Typography>

                    <FlexWrapper items="center" gap={2}>
                      <Typography variant="B1" classes="font-semibold">
                        {item.amount.toLocaleString()}원
                      </Typography>
                      {role === "admin" && (
                        <Button
                          variant="outline"
                          size="sm"
                          color="danger"
                          onClick={() => {
                            deleteRevenue(item.id);
                            showAlert(
                              `매출 항목(${item.name})이 삭제되었습니다.`,
                              {
                                type: "success",
                                durationMs: 3000,
                              }
                            );
                          }}
                        >
                          <LuTrash2 className="text-sm" />
                        </Button>
                      )}
                    </FlexWrapper>
                  </FlexWrapper>
                ))}
              </FlexWrapper>
            )}
          </FlexWrapper>

          {/* 2. 매출원가 섹션 박스 */}
          <FlexWrapper
            direction="col"
            gap={1}
            // 매출 섹션과 동일하게 flex-1 min-h-0 적용
            classes="border rounded-xl flex-1 min-h-0 !border-gray-400 w-full overflow-hidden"
          >
            <FlexWrapper
              justify="between"
              items="center"
              classes="w-full px-4 py-2 pb-0 shrink-0"
            >
              <FlexWrapper items="center" gap={2}>
                <LuCircleMinus className="text-danger" />
                <Typography variant="H4" classes="font-semibold !text-danger">
                  매출원가
                </Typography>
              </FlexWrapper>

              <FlexWrapper items="center" gap={2}>
                <Typography
                  variant="H4"
                  classes="font-semibold !text-danger text-right"
                >
                  총 {totalCogsAmount.toLocaleString()}원
                </Typography>
                {role === "admin" && (
                  <Button
                    variant="contain"
                    color="green"
                    size="sm"
                    classes="gap-1 !px-2"
                    onClick={async () => {
                      await openDialog({
                        title: "매출원가 추가",
                        hideBottom: true,
                        body: <AddCogsDialogBody />,
                      });
                    }}
                  >
                    <LuPlus className="text-base" />
                  </Button>
                )}
              </FlexWrapper>
            </FlexWrapper>

            {/* 매출원가 세부내역 리스트 */}
            {cogs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6">
                <p className="text-gray-400 text-sm"> 세부내역이 없습니다</p>
              </div>
            ) : (
              <FlexWrapper
                items="center"
                justify="start"
                direction="col"
                gap={0}
                classes="flex-1 overflow-y-auto scroll-thin px-4 min-h-0"
              >
                {cogs.map((item) => (
                  <FlexWrapper
                    key={item.id}
                    justify="between"
                    items="center"
                    classes="py-1 bg-white w-full shrink-0"
                  >
                    <Typography variant="B1">{item.name}</Typography>

                    <FlexWrapper items="center" gap={2}>
                      <Typography variant="B1" classes="font-semibold">
                        {item.amount.toLocaleString()}원
                      </Typography>
                      {role === "admin" && (
                        <Button
                          variant="outline"
                          size="sm"
                          color="danger"
                          onClick={() => {
                            deleteCogs(item.id);
                            showAlert(
                              `매출원가 항목(${item.name})이 삭제되었습니다.`,
                              {
                                type: "success",
                                durationMs: 3000,
                              }
                            );
                          }}
                        >
                          <LuTrash2 className="text-sm" />
                        </Button>
                      )}
                    </FlexWrapper>
                  </FlexWrapper>
                ))}
              </FlexWrapper>
            )}
          </FlexWrapper>
        </FlexWrapper>

        {/* 하단 요약(Footer): shrink-0로 높이 고정 (절대 줄어들지 않음) */}
        <FlexWrapper
          items="end"
          justify="between"
          classes="border-t p-4 shrink-0 bg-gray-50"
        >
          <Typography variant="H3" classes="font-semibold text-primary-700">
            =
          </Typography>
          <FlexWrapper direction="col" items="end" gap={2}>
            <Typography variant="B1" classes="font-semibold text-primary-700">
              매출총이익률{" "}
              {Number(tempRevenue) !== 0
                ? ((grossProfit / Number(tempRevenue)) * 100).toFixed(1)
                : "??"}
              %
            </Typography>

            <FlexWrapper items="center" gap={2}>
              <FlexWrapper items="center" gap={1}>
                <Tooltip size="md" text="매출 - 매출원가" />
                <Typography
                  variant="H3"
                  classes="font-semibold text-primary-700"
                >
                  매출총이익
                </Typography>
              </FlexWrapper>
              <Typography variant="H3" classes="font-semibold text-primary-700">
                {grossProfit.toLocaleString()}원
              </Typography>
            </FlexWrapper>
          </FlexWrapper>
        </FlexWrapper>
      </FlexWrapper>
    </>
  );
}
