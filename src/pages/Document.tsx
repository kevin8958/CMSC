import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Badge from "@/components/Badge";
import DocumentTable from "@/components/document/DocumentTable";

function Document() {
  return (
    <>
      <FlexWrapper gap={4} items="start" justify="between" classes="w-full">
        <FlexWrapper gap={2} items="center">
          <Typography variant="H3" classes="shrink-0">
            자료관리
          </Typography>
          <Badge color="green" size="md">
            {1}
          </Badge>
        </FlexWrapper>
      </FlexWrapper>
      <DocumentTable />
    </>
  );
}
export default Document;
