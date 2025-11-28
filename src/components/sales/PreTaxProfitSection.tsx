import TextInput from "@/components/TextInput";
import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";

export default function PreTaxProfitSection(props: {
  editMode: boolean;
  revenue: number;
  nonOpIncome: string;
  nonOpExpense: string;
  operatingProfit: number;
  preTaxProfit: number;
  preTaxMargin: number;
  onChangeNonOpIncome: (v: string) => void;
  onChangeNonOpExpense: (v: string) => void;
}) {
  const {
    editMode,
    nonOpIncome,
    nonOpExpense,
    operatingProfit,
    preTaxProfit,
    preTaxMargin,
    onChangeNonOpIncome,
    onChangeNonOpExpense,
  } = props;

  return (
    <div className="w-full flex flex-col gap-2 p-4 border rounded-xl bg-white">
      <FlexWrapper items="center" justify="between" classes="h-[36px]">
        <Typography variant="B1" classes="font-semibold text-primary-700">
          영업이익
        </Typography>
        <FlexWrapper items="center" gap={1}>
          <Typography variant="B1" classes="font-semibold text-primary-700">
            {operatingProfit.toLocaleString()}
          </Typography>
          <span className="text-gray-500">원</span>
        </FlexWrapper>
      </FlexWrapper>
      {/* 영업외수익 */}
      <FlexWrapper items="center" justify="between" classes="h-[36px]">
        <Typography variant="B1" classes="font-semibold text-primary-700">
          영업외수익
        </Typography>
        <FlexWrapper items="center" gap={1}>
          {editMode ? (
            <TextInput
              classes="!w-[140px] text-right"
              inputProps={{ value: nonOpIncome }}
              placeholder="0"
              size="sm"
              type="number"
              onChange={(e) => onChangeNonOpIncome(e.target.value)}
            />
          ) : (
            <Typography variant="B1" classes="font-semibold text-primary-700">
              {Number(nonOpIncome || 0).toLocaleString()}
            </Typography>
          )}
          <span className="text-gray-500">원</span>
        </FlexWrapper>
      </FlexWrapper>

      {/* 영업외비용 */}
      <FlexWrapper items="center" justify="between" classes="h-[36px]">
        <Typography variant="B1" classes="font-semibold !text-danger">
          영업외비용
        </Typography>

        <FlexWrapper items="center" gap={1}>
          {editMode ? (
            <TextInput
              classes="!w-[140px] text-right !text-danger"
              inputProps={{ value: nonOpExpense }}
              placeholder="0"
              size="sm"
              type="number"
              onChange={(e) => onChangeNonOpExpense(e.target.value)}
            />
          ) : (
            <Typography variant="B1" classes="font-semibold !text-danger">
              {Number(nonOpExpense || 0).toLocaleString()}
            </Typography>
          )}
          <span className="text-gray-500">원</span>
        </FlexWrapper>
      </FlexWrapper>

      {/* 세전이익 */}
      <FlexWrapper items="center" justify="between" classes="h-[36px]">
        <FlexWrapper direction="col" classes="md:flex-row md:gap-1">
          <Typography variant="B1" classes="font-semibold text-primary-700">
            = 세전이익
          </Typography>
          <Typography variant="B1" classes="font-semibold text-primary-700">
            (세전이익률 {preTaxMargin.toFixed(1)}%)
          </Typography>
        </FlexWrapper>

        <FlexWrapper items="center" gap={1}>
          <Typography variant="B1" classes="font-semibold text-primary-700">
            {preTaxProfit.toLocaleString()}
          </Typography>
          <span className="text-gray-500">원</span>
        </FlexWrapper>
      </FlexWrapper>
    </div>
  );
}
