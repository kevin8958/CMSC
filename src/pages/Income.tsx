import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";

function Income() {
  return (
    <>
      <Typography variant="H3">손익계산서</Typography>
      <FlexWrapper gap={1} classes="flex-1 pb-4 pt-4">
        <div className="border border-gray-300 p-2 flex-1">입력영역</div>
        <div className="border border-gray-300 p-2 flex-2">그래프영역</div>
      </FlexWrapper>
    </>
  );
}
export default Income;
