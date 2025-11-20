import TextInput from "@/components/TextInput";
import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";

export default function OperatingProfitSection(props: {
  editMode: boolean;
  revenue: number;
  sga: string;
  grossProfit: number;
  operatingProfit: number;
  operatingMargin: number;
  onChangeSga: (value: string) => void;
}) {
  const {
    editMode,
    sga,
    grossProfit,
    operatingProfit,
    operatingMargin,
    onChangeSga,
  } = props;

  return (
    <div className="w-full flex flex-col gap-2 p-4 border rounded-lg">
      <FlexWrapper items="center" justify="between" classes="h-[36px]">
        <Typography variant="B1" classes="font-semibold text-primary-700">
          매출총이익
        </Typography>
        <FlexWrapper items="center" gap={1}>
          <Typography variant="B1" classes="font-semibold text-primary-700">
            {grossProfit.toLocaleString()}
          </Typography>
          <span className="text-gray-500">원</span>
        </FlexWrapper>
      </FlexWrapper>
      {/* 판매관리비 */}
      <FlexWrapper items="center" justify="between" classes="h-[36px]">
        <Typography variant="B1" classes="font-semibold !text-danger">
          판매관리비
        </Typography>

        <FlexWrapper items="center" gap={1}>
          {editMode ? (
            <TextInput
              classes="!w-[140px] text-right !text-danger"
              inputProps={{ value: sga }}
              placeholder="0"
              size="sm"
              type="number"
              onChange={(e) => onChangeSga(e.target.value)}
            />
          ) : (
            <Typography variant="B1" classes="!text-danger font-semibold">
              {Number(sga || 0).toLocaleString()}
            </Typography>
          )}

          <span className="text-gray-500">원</span>
        </FlexWrapper>
      </FlexWrapper>

      {/* 영업이익 */}
      <FlexWrapper items="center" justify="between" classes="h-[36px]">
        <FlexWrapper direction="col" classes="md:flex-row md:gap-1">
          <Typography variant="B1" classes="font-semibold text-primary-700">
            = 영업이익
          </Typography>
          <Typography variant="B1" classes="font-semibold text-primary-700">
            (영업이익률 {operatingMargin.toFixed(1)}%)
          </Typography>
        </FlexWrapper>

        <FlexWrapper items="center" gap={1}>
          <Typography variant="B1" classes="font-semibold text-primary-700">
            {operatingProfit.toLocaleString()}
          </Typography>
          <span className="text-gray-500">원</span>
        </FlexWrapper>
      </FlexWrapper>
    </div>
  );
}
