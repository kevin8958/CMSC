import Typography from "@/foundation/Typography";
import Table from "@/components/Table";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import TableSkeleton from "@/layout/TableSkeleton";
import { useExpenseStore } from "@/stores/useExpenseStore";

dayjs.locale("ko");

export interface ExpenseItem {
  id: string;
  date: string; // ISO date
  method: string; // 거래수단
  place: string; // 사용처
  amount: number; // 금액
}

interface Props {
  data: ExpenseItem[];
  onRowClick?: (data: ExpenseItem) => void;
  onPageChange: (nextPage: number) => void;
}

export default function ExpenseGaugeTable({
  data,
  onRowClick,
  onPageChange,
}: Props) {
  const { loading } = useExpenseStore();
  const columns: ColumnDef<ExpenseItem>[] = [
    {
      accessorKey: "date",
      header: "일시",
      cell: ({ row }) => {
        const d = dayjs(row.original.date);
        return <Typography variant="B2">{d.format("M월 D일 (dd)")}</Typography>;
      },
    },
    {
      accessorKey: "method",
      header: "거래수단",
      cell: ({ row }) => (
        <Typography variant="B2">{row.original.method}</Typography>
      ),
    },
    {
      accessorKey: "place",
      header: "사용처",
      cell: ({ row }) => (
        <Typography variant="B2">{row.original.place}</Typography>
      ),
    },
    {
      accessorKey: "amount",
      header: "금액",
      cell: ({ row }) => (
        <Typography variant="B2">
          {(row.original.amount || 0).toLocaleString()}원
        </Typography>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <TableSkeleton rows={4} columns={4} />
      ) : (
        <Table
          data={data}
          columns={columns}
          hideSize
          onRowClick={(row) => {
            onRowClick?.(row);
          }}
          onPageChange={(nextPage) => {
            onPageChange(nextPage);
          }}
        />
      )}
    </>
  );
}
