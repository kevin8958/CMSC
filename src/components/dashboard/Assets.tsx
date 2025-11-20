import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";

function Assets(props: { month: Date | null }) {
  const { month } = props;
  console.log(month);
  return (
    <>
      <FlexWrapper
        direction="col"
        items="start"
        gap={0}
        classes="border rounded-xl p-4 lg:flex-1 h-[360px]"
      >
        <Typography variant="H3">자산</Typography>
        <Typography variant="H3">300,000원</Typography>
      </FlexWrapper>
    </>
  );
}
export default Assets;
