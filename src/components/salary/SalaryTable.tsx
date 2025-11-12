import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Table from "@/components/Table";
import dayjs from "dayjs";
import type { ColumnDef } from "@tanstack/react-table";
import Badge from "@/components/Badge";
import Dropdown from "@/components/Dropdown";
import { useEffect } from "react";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useDialog } from "@/hooks/useDialog";
import { useAlert } from "@/components/AlertProvider";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { LuTrash2 } from "react-icons/lu";
import { useSalaryStore } from "@/stores/useSalaryStore";

function SalaryTable() {
  const { currentCompanyId } = useCompanyStore();
  const { openDialog } = useDialog();
  const { showAlert } = useAlert();
  const { list, total, page, pageSize, fetchSalaries, deleteSalary } =
    useSalaryStore();

  useEffect(() => {
    fetchSalaries(1, 10);
  }, [currentCompanyId]);

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
      accessorKey: "name",
      header: "이름",
      cell: ({ row }) => (
        <Typography variant="B2">{row.original.name}</Typography>
      ),
    },
    {
      accessorKey: "pay_month",
      header: "급여귀속일",
      cell: ({ row }) => (
        <Typography variant="B2">
          {dayjs(row.original.pay_month).format("YYYY-MM")}
        </Typography>
      ),
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        const map = {
          pending: {
            label: "지급대기",
            color: "bg-yellow-200 text-yellow-800",
          },
          reviewed: {
            label: "검토완료",
            color: "bg-purple-200 text-purple-800",
          },
          paid: { label: "지급완료", color: "bg-green-200 text-green-800" },
        } as const;
        const st = map[row.original.status as keyof typeof map];

        return (
          <Badge classes={st?.color || "gray"} size="sm">
            {st?.label || "-"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "send_date",
      header: "명세서 발송",
      cell: ({ row }) => (
        <Typography variant="B2">
          {row.original.send_date
            ? dayjs(row.original.send_date).format("YYYY-MM-DD")
            : "-"}
        </Typography>
      ),
    },
    {
      accessorKey: "emp_type",
      header: "고용형태",
      cell: ({ row }) => (
        <Typography variant="B2">{row.original.emp_type}</Typography>
      ),
    },
    {
      accessorKey: "work_days",
      header: "근무인정일",
      cell: ({ row }) => (
        <Typography variant="B2">{row.original.work_days}일</Typography>
      ),
    },
    {
      accessorKey: "total_amount",
      header: "급여총액",
      cell: ({ row }) => (
        <Typography variant="B2">
          {row.original.total_amount?.toLocaleString()}원
        </Typography>
      ),
    },
    {
      accessorKey: "net_amount",
      header: "실지급액",
      cell: ({ row }) => (
        <Typography variant="B2">
          {row.original.net_amount?.toLocaleString()}원
        </Typography>
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
                    await deleteSalary(row.original.id);
                    fetchSalaries(page, pageSize);
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
      <FlexWrapper classes="h-[480px] mt-4">
        <Table
          data={list || []}
          columns={columns}
          hideSize
          totalCount={total}
          onPageChange={fetchSalaries}
        />
      </FlexWrapper>
    </>
  );
}

export default SalaryTable;
