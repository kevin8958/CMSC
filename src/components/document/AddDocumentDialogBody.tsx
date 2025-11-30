import { useState } from "react";
import FlexWrapper from "@/layout/FlexWrapper";
import UploadDropzone from "@/components/UploadDropzone";
import { useCompanyFilesStore } from "@/stores/useCompanyFilesStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import Typography from "@/foundation/Typography";
import Button from "../Button";

export default function AddSgaDialogBody(props: {
  onClose: (uploaded: boolean) => void;
}) {
  const { onClose } = props;
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const { currentCompanyId } = useCompanyStore();
  const { upload } = useCompanyFilesStore();

  const handleUpload = async () => {
    if (!selectedFile || !currentCompanyId) return;

    await upload({
      companyId: currentCompanyId,
      files: selectedFile,
    });

    setSelectedFile([]);
    onClose(true);
  };
  return (
    <FlexWrapper direction="col" gap={2}>
      <UploadDropzone maxSizeMB={10} accept="*" onSelect={setSelectedFile} />

      <Typography variant="C1" classes="!text-gray-500">
        회사당 최대 10개 / 총 업로드 100MB 제한
      </Typography>

      <Button
        variant="contain"
        color="green"
        size="lg"
        classes="w-full mt-2"
        onClick={handleUpload}
      >
        업로드
      </Button>
    </FlexWrapper>
  );
}
