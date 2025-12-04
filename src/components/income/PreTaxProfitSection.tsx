import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Button from "@/components/Button";
import { LuCircleMinus, LuCirclePlus, LuPlus, LuTrash2 } from "react-icons/lu";
import { useDialog } from "@/hooks/useDialog";
import { useIncomeStore } from "@/stores/useIncomeStore";
import { useAlert } from "@/components/AlertProvider";
import Tooltip from "../Tooltip";
import AddNonOpIncomeDialogBody from "./AddNonOpIncomeDialogBody";
import AddNonOpExpenseDialogBody from "./AddNonOpExpenseDialogBody";
import { useAuthStore } from "@/stores/authStore";
import { useMemo } from "react";

export default function PreTaxProfitSection() {
  const { nonOpIncome, nonOpExpense, deleteNonOp } = useIncomeStore();
  const { openDialog } = useDialog();
  const { showAlert } = useAlert();

  // 매출총이익 = RevenueSection에서 계산됨 → store.statement에 저장되어있음
  const { statement } = useIncomeStore();
  const { role } = useAuthStore();
  const grossProfit = useMemo(() => {
    return useIncomeStore.getState().statement?.gross_profit ?? 0;
  }, [statement]);
  const operatingProfit = useMemo(() => {
    return useIncomeStore.getState().statement?.operating_profit ?? 0;
  }, [statement]);
  const totalNonOpIncome = nonOpIncome.reduce((s, x) => s + x.amount, 0);
  const totalNonOpExpense = nonOpExpense.reduce((s, x) => s + x.amount, 0);

  const preTaxProfit = operatingProfit + totalNonOpIncome - totalNonOpExpense;

  return (
    <>
      {/* 메인 카드 */}
      <FlexWrapper
        direction="col"
        justify="between"
        gap={0}
        classes="size-full border rounded-xl bg-white"
      >
        <FlexWrapper direction="col" gap={2} classes="p-4 h-full">
          <FlexWrapper
            justify="between"
            items="center"
            gap={2}
            classes="px-4 py-2 rounded-xl border !border-gray-400"
          >
            <FlexWrapper items="center" gap={2}>
              <LuCirclePlus />
              <Typography variant="H4" classes="font-semibold text-primary-700">
                영업이익
              </Typography>
            </FlexWrapper>

            <FlexWrapper items="center" gap={2}>
              <Typography
                variant="H4"
                classes="!w-[180px] font-semibold text-primary-700 text-right"
              >
                {operatingProfit.toLocaleString()}
              </Typography>
              <Typography variant="H4" classes="font-semibold text-primary-700">
                원
              </Typography>
            </FlexWrapper>
          </FlexWrapper>

          <FlexWrapper
            items="center"
            justify="start"
            direction="col"
            gap={2}
            classes="h-[calc(100dvh-76px-44px-24px-32px-70px-36px-52px)] min-h-0"
          >
            <FlexWrapper
              direction="col"
              gap={1}
              classes="border rounded-xl flex-1 !border-gray-400 w-full flex-1  min-h-0"
            >
              {/* 상단: 타이틀 + 추가하기 */}
              <FlexWrapper
                justify="between"
                items="center"
                classes="w-full px-4 py-2 pb-0"
              >
                <FlexWrapper items="center" gap={2}>
                  <LuCirclePlus />
                  <Typography variant="H4" classes="font-semibold">
                    영업외수익
                  </Typography>
                </FlexWrapper>

                <FlexWrapper items="center" gap={2}>
                  {/* 총합 */}
                  <Typography variant="H4" classes="font-semibold text-right">
                    총 {totalNonOpIncome.toLocaleString()}원
                  </Typography>
                  {role === "admin" && (
                    <Button
                      variant="contain"
                      color="green"
                      size="sm"
                      classes="gap-1 !px-2"
                      onClick={async () => {
                        await openDialog({
                          title: "영업외수익 추가",
                          hideBottom: true,
                          body: <AddNonOpIncomeDialogBody />,
                        });
                      }}
                    >
                      <LuPlus className="text-base" />
                    </Button>
                  )}
                </FlexWrapper>
              </FlexWrapper>

              {/* 세부내역 리스트 */}
              {nonOpIncome.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6">
                  <p className="text-gray-400 text-sm"> 세부내역이 없습니다</p>
                </div>
              ) : (
                <FlexWrapper
                  items="center"
                  justify="start"
                  direction="col"
                  gap={2}
                  classes="flex-1 overflow-y-auto scroll-thin px-4  min-h-0"
                >
                  {nonOpIncome.map((item) => (
                    <FlexWrapper
                      key={item.id}
                      justify="between"
                      items="center"
                      classes="py-1 bg-white w-full"
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
                              deleteNonOp(item.id);
                              showAlert(
                                `영업외수익 항목(${item.name})이 삭제되었습니다.`,
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

            <FlexWrapper
              direction="col"
              gap={1}
              classes="border rounded-xl flex-1 !border-gray-400 w-full"
            >
              {/* 상단: 타이틀 + 추가하기 */}
              <FlexWrapper
                justify="between"
                items="center"
                classes="w-full px-4 py-2 pb-0"
              >
                <FlexWrapper items="center" gap={2}>
                  <LuCircleMinus className="text-danger" />
                  <Typography variant="H4" classes="font-semibold !text-danger">
                    영업외비용
                  </Typography>
                </FlexWrapper>

                <FlexWrapper items="center" gap={2}>
                  {/* 총합 */}
                  <Typography
                    variant="H4"
                    classes="font-semibold !text-danger text-right"
                  >
                    총 {totalNonOpExpense.toLocaleString()}원
                  </Typography>

                  {role === "admin" && (
                    <Button
                      variant="contain"
                      color="green"
                      size="sm"
                      classes="gap-1 !px-2"
                      onClick={async () => {
                        await openDialog({
                          title: "영업외비용 추가",
                          hideBottom: true,
                          body: <AddNonOpExpenseDialogBody />,
                        });
                      }}
                    >
                      <LuPlus className="text-base" />
                    </Button>
                  )}
                </FlexWrapper>
              </FlexWrapper>

              {/* 세부내역 리스트 */}
              {nonOpExpense.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6">
                  <p className="text-gray-400 text-sm"> 세부내역이 없습니다</p>
                </div>
              ) : (
                <FlexWrapper
                  items="center"
                  justify="start"
                  direction="col"
                  gap={0}
                  classes="flex-1 overflow-y-auto scroll-thin px-4"
                >
                  {nonOpExpense.map((item) => (
                    <FlexWrapper
                      key={item.id}
                      justify="between"
                      items="center"
                      classes="py-1 bg-white w-full"
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
                              deleteNonOp(item.id);
                              showAlert(
                                `영업외비용 항목(${item.name})이 삭제되었습니다.`,
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
        </FlexWrapper>

        {/* 영업이익 */}
        <FlexWrapper items="end" justify="between" classes="border-t p-4">
          <Typography variant="H3" classes="font-semibold text-primary-700">
            =
          </Typography>
          <FlexWrapper direction="col" items="end" gap={2}>
            <Typography variant="B1" classes="font-semibold text-primary-700">
              세전이익률{" "}
              {Number(grossProfit) !== 0
                ? ((preTaxProfit / Number(grossProfit)) * 100).toFixed(1)
                : "??"}
              %
            </Typography>

            <FlexWrapper items="center" gap={2}>
              <FlexWrapper items="center" gap={1}>
                <Tooltip size="md" text="영업이익+영업외수익-영업외비용" />
                <Typography
                  variant="H3"
                  classes="font-semibold text-primary-700"
                >
                  세전이익
                </Typography>
              </FlexWrapper>
              <Typography variant="H3" classes="font-semibold text-primary-700">
                {preTaxProfit.toLocaleString()}원
              </Typography>
            </FlexWrapper>
          </FlexWrapper>
        </FlexWrapper>
      </FlexWrapper>
    </>
  );
}
