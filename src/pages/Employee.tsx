import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";

function Employee() {
  return (
    <>
      <Typography variant="H3">인사정보</Typography>
      <FlexWrapper direction="col" gap={1}>
        <div className="border border-gray-300 p-2 flex-1">입력영역</div>
      </FlexWrapper>
    </>
  );
}
export default Employee;
