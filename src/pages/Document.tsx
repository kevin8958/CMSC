import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Badge from "@/components/Badge";
import DocumentTable from "@/components/document/DocumentTable";
import Button from "@/components/Button";
import { LuPlus } from "react-icons/lu";
import { useDialog } from "@/hooks/useDialog";
import AddDocumentDialogBody from "@/components/document/AddDocumentDialogBody";
import { useCompanyFilesStore } from "@/stores/useCompanyFilesStore";
import { useAuthStore } from "@/stores/authStore";

function Document() {
  const { openDialog, close } = useDialog();
  const { files } = useCompanyFilesStore();
  const { role } = useAuthStore();

  return (
    <>
      <FlexWrapper justify="between" items="center" classes="w-full">
        <FlexWrapper gap={2} items="end">
          <Typography variant="H3">자료 관리</Typography>
          <Badge color="green" size="md">
            {files.length}
          </Badge>
        </FlexWrapper>
        {role === "admin" && (
          <Button
            variant="contain"
            color="green"
            size="md"
            classes="gap-1 !px-3 shrink-0"
            onClick={async () => {
              await openDialog({
                title: "자료 업로드",
                hideBottom: true,
                body: <AddDocumentDialogBody onClose={close} />,
              });
            }}
          >
            <LuPlus className="text-lg" />
            추가하기
          </Button>
        )}
      </FlexWrapper>
      <DocumentTable />
    </>
  );
}
export default Document;
