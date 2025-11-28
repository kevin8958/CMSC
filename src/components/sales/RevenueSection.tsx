import TextInput from "@/components/TextInput";
import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";

export default function RevenueSection(props: {
  editMode: boolean;
  revenue: string;
  cogs: string;
  grossProfit: number;
  grossMargin: number;
  onChangeRevenue: (v: string) => void;
  onChangeCogs: (v: string) => void;
}) {
  const {
    editMode,
    revenue,
    cogs,
    grossProfit,
    grossMargin,
    onChangeRevenue,
    onChangeCogs,
  } = props;

  return (
    <div className="w-full flex flex-col gap-2 p-4 border rounded-xl bg-white">
      {/* 매출 */}
      <FlexWrapper items="center" justify="between" classes="h-[36px]">
        <Typography variant="B1" classes="font-semibold">
          매출
        </Typography>
        <div className="flex items-center gap-1">
          <FlexWrapper items="center" gap={1}>
            {editMode ? (
              <TextInput
                classes="!w-[140px] text-right"
                inputProps={{ value: revenue }}
                placeholder="0"
                size="sm"
                type="number"
                onChange={(e) => onChangeRevenue(e.target.value)}
              />
            ) : (
              <span className="text-primary-700 !font-semibold text-base">
                {revenue ? Number(revenue).toLocaleString() : "0"}
              </span>
            )}
            <span className="text-gray-500">원</span>
          </FlexWrapper>
        </div>
      </FlexWrapper>

      {/* 매출원가 */}
      <FlexWrapper items="center" justify="between" classes="h-[36px]">
        <Typography variant="B1" classes="font-semibold !text-danger">
          매출원가
        </Typography>

        <FlexWrapper items="center" gap={1}>
          {editMode ? (
            <TextInput
              classes="!w-[140px] text-right !text-danger"
              inputProps={{ value: cogs }}
              placeholder="0"
              size="sm"
              type="number"
              onChange={(e) => onChangeCogs(e.target.value)}
            />
          ) : (
            <Typography variant="B1" classes="font-semibold !text-danger">
              {Number(cogs || 0).toLocaleString()}
            </Typography>
          )}
          <span className="text-gray-500">원</span>
        </FlexWrapper>
      </FlexWrapper>

      {/* 매출총이익 */}
      <FlexWrapper items="center" justify="between" classes="h-[36px]">
        <FlexWrapper direction="col" classes="md:flex-row md:gap-1">
          <Typography variant="B1" classes="font-semibold text-primary-700">
            = 매출총이익
          </Typography>
          <Typography variant="B1" classes="font-semibold text-primary-700">
            (매출총이익률 {grossMargin.toFixed(1)}%)
          </Typography>
        </FlexWrapper>
        <FlexWrapper items="center" gap={1}>
          <Typography variant="B1" classes="font-semibold text-primary-700">
            {grossProfit.toLocaleString()}
          </Typography>
          <span className="text-gray-500">원</span>
        </FlexWrapper>
      </FlexWrapper>
    </div>
  );
}
