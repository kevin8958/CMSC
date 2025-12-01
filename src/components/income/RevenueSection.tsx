import TextInput from "@/components/TextInput";
import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import Tooltip from "../Tooltip";
import {
  LuCircleMinus,
  LuCirclePlus,
  LuPencil,
  LuPlus,
  LuSave,
  LuTrash2,
} from "react-icons/lu";
import AddCogsDialogBody from "./AddCogsDialogBody";
import { useDialog } from "@/hooks/useDialog";
import { useIncomeStore } from "@/stores/useIncomeStore";
import { useAlert } from "../AlertProvider";
import { useAuthStore } from "@/stores/authStore";

export default function RevenueSection() {
  const [editMode, setEditMode] = useState(false);
  const [tempRevenue, setTempRevenue] = useState<string>("0");
  const { statement, cogs, setRevenue, deleteCogs } = useIncomeStore();
  useEffect(() => {
    if (statement) {
      setTempRevenue(statement.revenue?.toString() || "0");
    }
  }, [statement]);

  const { showAlert } = useAlert();
  const { openDialog } = useDialog();
  const { role } = useAuthStore();

  const totalCogsAmount = cogs.reduce((s, x) => s + x.amount, 0);
  const grossProfit = Number(tempRevenue) - totalCogsAmount;
  return (
    <>
      {/* 메인 카드 */}
      <FlexWrapper
        direction="col"
        justify="between"
        gap={0}
        classes="size-full border rounded-xl bg-white sm:min-w-[370px]"
      >
        <FlexWrapper direction="col" gap={2} classes="p-4 h-full">
          {/* 매출 */}
          <FlexWrapper
            justify="between"
            items="center"
            gap={2}
            classes="px-4 py-2 rounded-xl border !border-gray-400"
          >
            <FlexWrapper items="center" gap={2}>
              <LuCirclePlus />
              <Typography variant="H3" classes="font-semibold text-primary-700">
                매출
              </Typography>
            </FlexWrapper>

            <FlexWrapper items="center" gap={2}>
              {editMode ? (
                <TextInput
                  classes="flex-1 text-right !h-[36px]"
                  inputProps={{ value: tempRevenue }}
                  placeholder="0"
                  size="md"
                  type="number"
                  onChange={(e) => setTempRevenue(e.target.value)}
                />
              ) : (
                <Typography
                  variant="H3"
                  classes="flex-1 font-semibold text-primary-700 text-right"
                >
                  {tempRevenue ? Number(tempRevenue).toLocaleString() : "0"}
                </Typography>
              )}
              <Typography variant="H3" classes="font-semibold text-primary-700">
                원
              </Typography>
              {role === "admin" && (
                <Button
                  variant="contain"
                  size="md"
                  color="green"
                  onClick={async () => {
                    if (editMode) {
                      await setRevenue(Number(tempRevenue) || 0);
                      showAlert(`매출이 저장되었습니다.`, {
                        type: "success",
                        durationMs: 3000,
                      });
                    }
                    setEditMode(!editMode);
                  }}
                >
                  {editMode ? <LuSave /> : <LuPencil />}
                </Button>
              )}
            </FlexWrapper>
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
                  매출원가
                </Typography>
              </FlexWrapper>

              <FlexWrapper items="center" gap={2}>
                {/* 총합 */}
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

            {/* 세부내역 리스트 */}
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
                classes="flex-1 min-h-[200px] max-h-[calc(100dvh-76px-44px-24px-32px-42px-32px-44px-68px-36px)]  overflow-y-auto scroll-thin px-4"
              >
                {cogs.map((item) => (
                  <FlexWrapper
                    key={item.id}
                    justify="between"
                    items="center"
                    classes="py-1 bg-white w-full"
                  >
                    <Typography variant="B1">{item.name}</Typography>

                    <FlexWrapper items="center" gap={4}>
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
                                type: "danger",
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

        {/* 매출총이익 */}
        <FlexWrapper items="end" justify="between" classes="border-t p-4">
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
