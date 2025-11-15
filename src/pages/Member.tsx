import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Table from "@/components/Table";
import dayjs from "dayjs";
import type { ColumnDef } from "@tanstack/react-table";
import Badge from "@/components/Badge";
import Dropdown from "@/components/Dropdown";
import { useEffect, useState } from "react";
import { useDialog } from "@/hooks/useDialog";
import {
  deleteMemberCompletely,
  updateMemberRole,
} from "@/actions/memberActions";
import { useAlert } from "@/components/AlertProvider";
import { motion } from "motion/react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { LuTrash2 } from "react-icons/lu";
import { useCompanyStore } from "@/stores/useCompanyStore";
import TableSkeleton from "@/layout/TableSkeleton";

const parseRole = (role: string) => {
  switch (role) {
    case "super_admin":
      return "최고 관리자";
    case "admin":
      return "관리자";
    case "user_a":
      return "유저A";
    case "user_b":
      return "유저B";
    default:
      return "알 수 없음";
  }
};

function Member() {
  const [members, setMembers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const { openDialog } = useDialog();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  const fetchMembers = async (page = 1, size = 10) => {
    setLoading(true);

    const res = await fetch(`/api/member-list?page=${page}&size=${size}`);
    const { data, count } = await res.json();

    if (data) {
      setMembers(
        data.map((m: any) => ({
          user_id: m.id,
          nickname: m.nickname ?? "-",
          email: m.email ?? "-",
          role: m.company_members?.[0]?.role ?? "-",
          joined_at: m.company_members?.[0]?.joined_at ?? null,
          etc: "-",
        }))
      );
      setTotal(count || 0);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(1, 10);
  }, []);

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
      accessorKey: "nickname",
      header: "닉네임",
      cell: ({ row }) => (
        <Typography
          variant="B2"
          classes={row.original.joined_at ? "" : "!text-gray-400"}
        >
          {row.original.nickname || "-"}
        </Typography>
      ),
    },
    {
      accessorKey: "email",
      header: "이메일",
      cell: ({ row }) => (
        <Typography
          variant="B2"
          classes={row.original.joined_at ? "" : "!text-gray-400"}
        >
          {row.original.email || "-"}
        </Typography>
      ),
    },
    {
      accessorKey: "role",
      header: "권한",
      cell: ({ row }) => (
        <Dropdown
          hideDownIcon
          buttonVariant="clear"
          items={[
            { type: "item", id: "admin", label: "관리자" },
            { type: "item", id: "user_a", label: "유저A" },
            { type: "item", id: "user_b", label: "유저B" },
          ]}
          onChange={async (nextRole) => {
            await updateMemberRole(
              useCompanyStore.getState().currentCompanyId!,
              row.original.user_id,
              nextRole
            );
            showAlert("권한이 변경되었습니다.", {
              type: "success",
              durationMs: 3000,
            });
            fetchMembers();
          }}
          buttonItem={
            <Badge
              color={row.original.role === "admin" ? "green" : "gray"}
              size="sm"
            >
              {parseRole(row.original.role)}
            </Badge>
          }
        />
      ),
    },
    {
      accessorKey: "joined_at",
      header: "가입일",
      cell: ({ row }) => (
        <FlexWrapper gap={2} items="center">
          <Typography
            variant="B2"
            classes={row.original.joined_at ? "" : "!text-gray-400"}
          >
            {row.original.joined_at
              ? dayjs(row.original.joined_at).format("YYYY-MM-DD")
              : "초대중"}
          </Typography>
        </FlexWrapper>
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
                message: `${row.original.email} 멤버를 이 회사에서 제거합니다.`,
                confirmText: "삭제",
                cancelText: "취소",
                state: "danger",
                onConfirm: async () => {
                  try {
                    await deleteMemberCompletely(row.original.user_id);
                    fetchMembers();
                    showAlert("삭제되었습니다.", {
                      type: "success",
                      durationMs: 3000,
                    });
                    return true;
                  } catch (err: any) {
                    showAlert(err?.message || "삭제 중 오류가 발생했습니다.", {
                      type: "danger",
                      durationMs: 3000,
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
      <FlexWrapper justify="between" items="center">
        <FlexWrapper gap={2} items="end">
          <Typography variant="H3">멤버관리</Typography>
          <Badge color="green" size="md">
            {total}
          </Badge>
        </FlexWrapper>
      </FlexWrapper>

      {loading ? (
        <FlexWrapper
          classes="h-[calc(100%-36px-16px)] mt-4"
          justify="center"
          items="start"
        >
          <TableSkeleton rows={8} columns={6} />
        </FlexWrapper>
      ) : (
        <FlexWrapper classes="h-[calc(100%-36px-16px)] mt-4">
          <Table
            data={members || []}
            columns={columns}
            hideSize
            totalCount={total}
            onPageChange={fetchMembers}
          />
        </FlexWrapper>
      )}
    </>
  );
}

export default Member;
