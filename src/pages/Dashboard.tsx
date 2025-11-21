import FlexWrapper from "@/layout/FlexWrapper";

function Dashboard() {
  return (
    <>
      <FlexWrapper gap={4} direction="col" classes="w-full flex-1">
        <FlexWrapper
          gap={4}
          direction="col"
          classes="lg:flex-row w-full flex-1 pb-4"
        >
          {/* <Sales month={selectedMonth} /> */}
          {/* <Assets month={selectedMonth} /> */}
        </FlexWrapper>
      </FlexWrapper>
    </>
  );
}
export default Dashboard;
