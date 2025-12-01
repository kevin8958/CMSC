import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Table from "@/components/Table";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect } from "react";
import { useCompanyStore } from "@/stores/useCompanyStore";
import Button from "@/components/Button";
import { LuDownload, LuTrash2 } from "react-icons/lu";

import { useCompanyFilesStore } from "@/stores/useCompanyFilesStore";
import { downloadCompanyFile } from "@/actions/companyFileActions";
import { useAuthStore } from "@/stores/authStore";

export default function DocumentTable() {
  const { currentCompanyId } = useCompanyStore();

  const { files, fetch, delete: deleteFile } = useCompanyFilesStore();
  const { role } = useAuthStore();

  /* 최초 로드 */
  useEffect(() => {
    if (!currentCompanyId) return;
    fetch(currentCompanyId);
  }, [currentCompanyId]);

  // 다운로드 처리
  const handleDownload = async (item: CompanyFile.DocumentRow) => {
    try {
      const url = await downloadCompanyFile(item.file_path);

      // ✅ 반드시 window.fetch 사용
      const res = await window.fetch(url);
      const blob = await res.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = item.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("다운로드 실패", err);
      alert("파일 다운로드에 실패했습니다.");
    }
  };

  // 삭제 처리
  const handleDelete = async (item: CompanyFile.DocumentRow) => {
    if (!confirm("정말 삭제할까요?")) return;
    await deleteFile(item);
  };

  /* 테이블 컬럼 */
  const columns: ColumnDef<CompanyFile.DocumentRow>[] = [
    {
      accessorKey: "file_name",
      header: "파일명",
      cell: ({ row }) => (
        <Typography variant="B2" classes="font-medium">
          {row.original.file_name}
        </Typography>
      ),
    },
    {
      accessorKey: "file_size",
      header: "크기",
      cell: ({ row }) => (
        <Typography variant="B2">
          {(row.original.file_size / 1024).toFixed(1)} KB
        </Typography>
      ),
    },
    {
      accessorKey: "created_at",
      header: "추가된 날짜",
      cell: ({ row }) => (
        <Typography variant="B2">
          {new Date(row.original.created_at).toLocaleString("ko-KR")}
        </Typography>
      ),
    },
    {
      accessorKey: "download_btn",
      header: "다운로드",
      cell: ({ row }) => (
        <Button
          variant="clear"
          size="sm"
          classes="!px-2 !py-1 !text-gray-900"
          onClick={(e) => {
            e.stopPropagation();
            handleDownload(row.original);
          }}
        >
          <LuDownload className="text-lg" />
        </Button>
      ),
    },
    {
      accessorKey: "delete_btn",
      header: "삭제",
      cell: ({ row }) => (
        <Button
          variant="clear"
          size="sm"
          classes="!px-2 !py-1 !text-gray-900"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(row.original);
          }}
        >
          <LuTrash2 className="text-lg text-danger" />
        </Button>
      ),
    },
  ];

  const filteredColumns =
    role === "admin"
      ? columns
      : columns.filter(
          (col: any) => col.accessorKey !== "delete_btn" // 일반 사용자는 삭제 버튼 숨김
        );

  return (
    <FlexWrapper classes="h-screen mt-4 rounded-xl border overflow-hidden bg-white mb-4">
      <Table
        data={files || []}
        columns={filteredColumns}
        hideSize
        totalCount={files.length}
        showPagination={false}
      />
    </FlexWrapper>
  );
}
