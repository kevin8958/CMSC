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
import { HiOutlineDotsVertical } from "react-icons/hi";
import { LuTrash2 } from "react-icons/lu";
import TableSkeleton from "@/layout/TableSkeleton";
import { supabase } from "@/lib/supabase"; // API 대신 supabase 클라이언트 직접 사용 예시

function CompanyIntroManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const { openDialog } = useDialog();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  // 데이터 불러오기 로직 (Supabase 직접 호출 방식)
  const fetchRequests = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const from = (page - 1) * size;
      const to = from + size - 1;

      const { data, count, error } = await supabase
        .from("company_intro_requests")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (data) {
        setItems(data);
        setTotal(count || 0);
      }
    } catch (err) {
      showAlert("데이터를 불러오는데 실패했습니다.", { type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(1, 10);
  }, []);

  // 상태 변경 옵션
  const statusItems = [
    { type: "item", id: "pending", label: "대기중" },
    { type: "item", id: "done", label: "발송완료" },
  ] as Common.DropdownItem[];

  // 기타 액션 (삭제)
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
      header: "요청일",
      cell: ({ row }) => (
        <Typography variant="B2">
          {dayjs(row.original.created_at).format("YYYY-MM-DD HH:mm")}
        </Typography>
      ),
    },
    {
      accessorKey: "clinic_name",
      header: "의료기관명",
      cell: ({ row }) => (
        <Typography variant="B2" classes="font-bold">
          {row.original.clinic_name}
        </Typography>
      ),
    },
    {
      accessorKey: "name",
      header: "담당자(직책)",
      cell: ({ row }) => (
        <Typography variant="B2">
          {row.original.name} ({row.original.position})
        </Typography>
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
      accessorKey: "email",
      header: "이메일",
      cell: ({ row }) => (
        <Typography variant="B2" classes="text-primary-600">
          {row.original.email}
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
            const { error } = await supabase
              .from("company_intro_requests")
              .update({ status: next })
              .eq("id", row.original.id);

            if (!error) {
              showAlert("상태가 변경되었습니다.", { type: "success" });
              fetchRequests();
            }
          }}
          buttonItem={
            <Badge
              color={row.original.status === "done" ? "green" : "gray"}
              size="sm"
            >
              {row.original.status === "done" ? "발송완료" : "대기중"}
            </Badge>
          }
        />
      ),
    },
    {
      accessorKey: "etc",
      header: "",
      size: 40,
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
                message: `"${row.original.clinic_name}"의 요청 내역을 삭제합니다.`,
                confirmText: "삭제",
                cancelText: "취소",
                state: "danger",
                onConfirm: async () => {
                  const { error } = await supabase
                    .from("company_intro_requests")
                    .delete()
                    .eq("id", row.original.id);

                  if (!error) {
                    fetchRequests();
                    showAlert("삭제되었습니다.", { type: "success" });
                    return true;
                  }
                  return false;
                },
              });
            }
          }}
          dialogWidth={140}
          buttonItem={
            <HiOutlineDotsVertical className="text-xl text-gray-400" />
          }
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <FlexWrapper justify="between" items="center" classes="mb-4">
        <Typography variant="H3">회사소개서 요청 관리</Typography>
        <Typography variant="B2" classes="text-gray-400">
          총 {total}건의 요청이 있습니다.
        </Typography>
      </FlexWrapper>

      {loading ? (
        <FlexWrapper classes="flex-1" justify="center" items="start">
          <TableSkeleton rows={10} columns={7} />
        </FlexWrapper>
      ) : (
        <FlexWrapper classes="flex-1 overflow-hidden">
          <Table
            data={items || []}
            columns={columns}
            hideSize
            totalCount={total}
            onPageChange={(page) => fetchRequests(page, 10)}
          />
        </FlexWrapper>
      )}
    </div>
  );
}

export default CompanyIntroManagement;
