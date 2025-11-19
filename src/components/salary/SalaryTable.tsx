import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Table from "@/components/Table";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect } from "react";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useSalaryStore } from "@/stores/useSalaryStore";
import SalaryStatusBadge from "./SalaryStatusBadge";

function SalaryTable(props: {
  month: Date | null;
  onRowClick?: (row: Salary.Row) => void;
}) {
  const { month, onRowClick } = props;
  const { currentCompanyId } = useCompanyStore();
  const { list, total, fetchSalaries } = useSalaryStore();

  useEffect(() => {
    fetchSalaries(1, 10, month);
  }, [currentCompanyId, month]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "user_name",
      header: "이름",
      cell: ({ row }) => (
        <Typography variant="B2">{row.original.user_name}</Typography>
      ),
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        return <SalaryStatusBadge status={row.original.status} />;
      },
    },
    // {
    //   accessorKey: "send_date",
    //   header: "명세서 발송",
    //   cell: ({ row }) => (
    //     <Typography variant="B2">
    //       {row.original.send_date
    //         ? dayjs(row.original.send_date).format("YYYY-MM-DD")
    //         : "-"}
    //     </Typography>
    //   ),
    // },
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
        <Typography variant="B2">
          {Number(row.original.base_work_days) -
            Number(row.original.absent_days)}
          일
        </Typography>
      ),
    },
    {
      accessorKey: "total_amount",
      header: "급여총액",
      cell: ({ row }) => {
        const recognized_amount = Math.floor(
          (Number(row.original.base_salary) +
            Number(row.original.non_taxable)) *
            (Number(row.original.base_work_days) > 0
              ? (Number(row.original.base_work_days) -
                  Number(row.original.absent_days || 0)) /
                Number(row.original.base_work_days)
              : 0)
        );

        const total_amount =
          recognized_amount +
          Number(row.original.bonus) +
          Number(row.original.allowance);
        return (
          <Typography variant="B2">
            {total_amount.toLocaleString()}원
          </Typography>
        );
      },
    },
    {
      accessorKey: "net_amount",
      header: "실지급액",
      cell: ({ row }) => {
        const recognized_amount = Math.floor(
          (Number(row.original.base_salary) +
            Number(row.original.non_taxable)) *
            (Number(row.original.base_work_days) > 0
              ? (Number(row.original.base_work_days) -
                  Number(row.original.absent_days || 0)) /
                Number(row.original.base_work_days)
              : 0)
        );

        const total_amount =
          recognized_amount +
          Number(row.original.bonus) +
          Number(row.original.allowance);

        const tax_total =
          Number(row.original.income_tax) + Number(row.original.local_tax);

        const insurance_total =
          Number(row.original.pension_fee) +
          Number(row.original.health_fee) +
          Number(row.original.employment_fee) +
          Number(row.original.longterm_care_fee);

        const net_amount =
          total_amount -
          tax_total -
          insurance_total -
          Number(row.original.deduction_other);
        return (
          <Typography variant="B2">{net_amount.toLocaleString()}원</Typography>
        );
      },
    },
  ];

  return (
    <>
      <FlexWrapper classes="h-[100dvh] mt-4">
        <Table
          data={list || []}
          columns={columns}
          hideSize
          totalCount={total}
          onPageChange={(page, size) => fetchSalaries(page, size, month)}
          onRowClick={(row) => {
            onRowClick?.(row);
          }}
        />
      </FlexWrapper>
    </>
  );
}

export default SalaryTable;
