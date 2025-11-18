import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import AssetStackedChart from "./AssetStackedChart";
import dayjs from "dayjs";

function Assets(props: { selectedMonth: Date | null }) {
  const { selectedMonth } = props;
  return (
    <>
      <FlexWrapper
        direction="col"
        items="start"
        gap={0}
        classes="border rounded-lg p-4 lg:flex-1 h-[360px]"
      >
        <Typography variant="H4">자산</Typography>
        <Typography variant="H3">300,000원</Typography>
        <AssetStackedChart
          selectedMonth={selectedMonth || dayjs().toDate()}
          data={[
            { month: "2025-06", netAsset: 500, cash: 200, etc: 50 },
            { month: "2025-07", netAsset: 550, cash: 190, etc: 70 },
            { month: "2025-08", netAsset: 600, cash: 180, etc: 60 },
            { month: "2025-09", netAsset: 650, cash: 170, etc: 80 },
            { month: "2025-10", netAsset: 700, cash: 160, etc: 90 },
            { month: "2025-11", netAsset: 720, cash: 150, etc: 100 },
          ]}
        />
      </FlexWrapper>
    </>
  );
}
export default Assets;
