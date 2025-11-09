import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Table from "@/components/Table";
import dayjs from "dayjs";
import type { ColumnDef } from "@tanstack/react-table";
import Badge from "@/components/Badge";
import Dropdown from "@/components/Dropdown";
import { useEffect, useState } from "react";
import { useDialog } from "@/hooks/useDialog";
import { useAlert } from "@/components/AlertProvider";
import { motion } from "motion/react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { LuTrash2 } from "react-icons/lu";

function Inquiry() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const { openDialog } = useDialog();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  const fetchInquiries = async (page = 1, size = 10) => {
    setLoading(true);

    const res = await fetch(`/api/inquiry/list?page=${page}&size=${size}`);
    const { data, count } = await res.json();

    if (data) {
      setItems(
        data.map((i: any) => ({
          id: i.id,
          created_at: i.created_at,
          name: i.name ?? "-",
          phone: i.phone ?? "-",
          content: i.content ?? "-",
          status: i.status,
        }))
      );
      setTotal(count || 0);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries(1, 10);
  }, []);

  const statusItems = [
    { type: "item", id: "pending", label: "대기중" },
    { type: "item", id: "done", label: "처리완료" },
  ] as Common.DropdownItem[];

  const etcDropdownItems = [
    {
      type: "item",
      id: "delete",
      icon: <LuTrash2 className="text-base text-danger" />,
      label: <p className="text-danger">삭제하기</p>,
    },
  ] as Common.DropdownItem[];

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "created_at",
      header: "작성일",
      cell: ({ row }) => (
        <Typography variant="B2">
          {dayjs(row.original.created_at).format("YYYY-MM-DD")}
        </Typography>
      ),
    },
    {
      accessorKey: "name",
      header: "담당자명",
      cell: ({ row }) => (
        <Typography variant="B2">{row.original.name}</Typography>
      ),
    },
    {
      accessorKey: "phone",
      header: "연락처",
      cell: ({ row }) => (
        <Typography variant="B2">{row.original.phone}</Typography>
      ),
    },
    {
      accessorKey: "content",
      header: "내용",
      cell: ({ row }) => (
        <Typography variant="B2" classes="max-w-[200px] truncate">
          {row.original.content}
        </Typography>
      ),
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => (
        <Dropdown
          hideDownIcon
          buttonVariant="clear"
          items={statusItems}
          onChange={async (next) => {
            await fetch(`/api/inquiry/update-status`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: row.original.id, status: next }),
            });
            showAlert("상태가 변경되었습니다.", { type: "success" });
            fetchInquiries();
          }}
          buttonItem={
            <Badge
              color={row.original.status === "done" ? "green" : "gray"}
              size="sm"
            >
              {row.original.status === "done" ? "처리완료" : "대기중"}
            </Badge>
          }
        />
      ),
    },
    {
      accessorKey: "etc",
      header: "",
      size: 24,
      minSize: 24,
      maxSize: 24,
      cell: ({ row }) => (
        <Dropdown
          buttonVariant="clear"
          dialogPosition="right"
          hideDownIcon
          items={etcDropdownItems}
          onChange={async (val) => {
            if (val === "delete") {
              await openDialog({
                title: "삭제하시겠습니까?",
                message: `이 문의를 삭제합니다.`,
                confirmText: "삭제",
                cancelText: "취소",
                state: "danger",
                onConfirm: async () => {
                  try {
                    await fetch(`/api/inquiry/delete`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: row.original.id }),
                    });
                    fetchInquiries();
                    showAlert("삭제되었습니다.", { type: "success" });
                    return true;
                  } catch (err: any) {
                    showAlert("삭제 중 오류가 발생했습니다.", {
                      type: "danger",
                    });
                    return false;
                  }
                },
              });
            }
          }}
          dialogWidth={140}
          buttonItem={
            <HiOutlineDotsVertical className="text-xl text-gray-900" />
          }
          buttonClasses="!font-normal text-primary-900 !h-8 !border-primary-100"
        />
      ),
    },
  ];

  return (
    <>
      <Typography variant="H3">문의 관리</Typography>

      {loading ? (
        <FlexWrapper
          classes="h-[calc(100%-36px-16px)]"
          justify="center"
          items="center"
        >
          <motion.div
            className="size-4 rounded-full border-[3px] border-primary-900 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
          />
        </FlexWrapper>
      ) : (
        <FlexWrapper classes="h-[calc(100%-36px-16px)] mt-4">
          <Table
            data={items || []}
            columns={columns}
            hideSize
            totalCount={total}
            onPageChange={fetchInquiries}
          />
        </FlexWrapper>
      )}
    </>
  );
}

export default Inquiry;
