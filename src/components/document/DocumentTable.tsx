import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Table from "@/components/Table";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect } from "react";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useDocumentStore } from "@/stores/useDocumentStore";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { LuDownload, LuTrash2 } from "react-icons/lu";

export default function DocumentTable() {
  const { currentCompanyId } = useCompanyStore();
  const { documents, total, fetchDocuments, deleteDocument, downloadDocument } =
    useDocumentStore();

  useEffect(() => {
    fetchDocuments(1, 20);
  }, [currentCompanyId]);

  // ==========================
  // 📌 이벤트 핸들러
  // ==========================

  const handleDownload = (doc: any) => {
    console.log("⬇ Download:", doc);
    downloadDocument(doc.id);
  };

  const handleDelete = (doc: any) => {
    console.log("🗑 Delete:", doc);
    deleteDocument(doc.id);
  };

  // ==========================
  // 📌 컬럼 정의
  // ==========================

  const columns: ColumnDef<any>[] = [
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
      accessorKey: "owner_name",
      header: "소유자",
      cell: ({ row }) => (
        <Typography variant="B2">{row.original.owner_name}</Typography>
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
          variant="outline"
          size="sm"
          classes="!px-2 !py-1"
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
      accessorKey: "etc",
      header: "",
      size: 24,
      minSize: 24,
      maxSize: 24,
      cell: ({ row }) => {
        const dropdownItems = [
          {
            type: "item",
            id: "download",
            icon: <LuDownload className="text-base text-primary" />,
            label: <p className="text-primary">다운로드</p>,
          },
          {
            type: "item",
            id: "delete",
            icon: <LuTrash2 className="text-base text-danger" />,
            label: <p className="text-danger">삭제</p>,
          },
        ] as Common.DropdownItem[];

        return (
          <Dropdown
            buttonVariant="clear"
            dialogPosition="right"
            hideDownIcon
            items={dropdownItems}
            onChange={(val) => {
              if (val === "download") handleDownload(row.original);
              if (val === "delete") handleDelete(row.original);
            }}
            dialogWidth={160}
            buttonItem={
              <HiOutlineDotsVertical className="text-xl text-gray-900" />
            }
            buttonClasses="!font-normal text-primary-900 !h-8 !border-primary-100"
          />
        );
      },
    },
  ];

  return (
    <FlexWrapper classes="h-screen mt-4 rounded-xl border overflow-hidden bg-white mb-4">
      <Table
        data={documents || []}
        columns={columns}
        hideSize
        totalCount={total}
        onPageChange={(page, size) => fetchDocuments(page, size)}
      />
    </FlexWrapper>
  );
}
