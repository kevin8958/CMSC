import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Table from "@/components/Table";
import Badge from "@/components/Badge";
import { useEffect, useState } from "react";
import { useAlert } from "@/components/AlertProvider";
import { LuPlus } from "react-icons/lu";
import dayjs from "dayjs";
import TableSkeleton from "@/layout/TableSkeleton";
import Button from "@/components/Button";
import { useWorkerStore } from "@/stores/useWorkerStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import WorkerDrawer from "@/components/worker/WorkerDrawer";

function Worker() {
  const { currentCompanyId } = useCompanyStore();
  const { showAlert } = useAlert();
  const { workers, loading, total, setPage, fetch, create, update, remove } =
    useWorkerStore();

  const [currentWorker, setCurrentWorker] = useState<any>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");

  useEffect(() => {
    if (currentCompanyId) fetch(currentCompanyId);
  }, [currentCompanyId]);

  const fetchWorkers = (page: number, size: number) => {
    if (currentCompanyId) {
      setPage(page);
      fetch(currentCompanyId, page, size);
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "이름",
      cell: ({ row }: any) => (
        <Typography variant="B2">{row.original.name}</Typography>
      ),
    },
    {
      accessorKey: "email",
      header: "이메일",
      cell: ({ row }: any) => (
        <Typography variant="B2">{row.original.email}</Typography>
      ),
    },
    {
      accessorKey: "joined_at",
      header: "입사일",
      cell: ({ row }: any) => (
        <Typography variant="B2">
          {row.original.joined_at
            ? dayjs(row.original.joined_at).format("YYYY-MM-DD")
            : "-"}
        </Typography>
      ),
    },
    {
      accessorKey: "position",
      header: "직급",
      cell: ({ row }: any) => (
        <Typography variant="B2">{row.original.position}</Typography>
      ),
    },
    {
      accessorKey: "duty",
      header: "직책",
      cell: ({ row }: any) => (
        <Typography variant="B2">{row.original.duty}</Typography>
      ),
    },
  ];

  return (
    <>
      <FlexWrapper justify="between" items="center" classes="w-full">
        <FlexWrapper gap={2} items="end">
          <Typography variant="H3">멤버 관리</Typography>
          <Badge color="green" size="md">
            {total}
          </Badge>
        </FlexWrapper>
        <Button
          variant="contain"
          color="green"
          size="md"
          classes="gap-1 !px-3 shrink-0"
          onClick={() => {
            setCurrentWorker(null);
            setDrawerMode("create");
            setOpenDrawer(true);
          }}
        >
          <LuPlus className="text-lg" />
          추가하기
        </Button>
      </FlexWrapper>
      {loading ? (
        <FlexWrapper
          classes="h-screen mt-4 rounded-xl border overflow-hidden bg-white mb-4"
          justify="center"
          items="start"
        >
          <TableSkeleton rows={8} columns={5} />
        </FlexWrapper>
      ) : (
        <FlexWrapper classes="h-screen mt-4 rounded-xl border overflow-hidden bg-white mb-4">
          <Table
            data={workers}
            columns={columns}
            hideSize
            totalCount={total}
            onPageChange={fetchWorkers}
            onRowClick={(row: Salary.Row) => {
              setDrawerMode("edit");
              setCurrentWorker(row);
              setOpenDrawer(true);
            }}
          />
        </FlexWrapper>
      )}
      <WorkerDrawer
        open={openDrawer}
        mode={drawerMode}
        worker={currentWorker}
        onClose={() => setOpenDrawer(false)}
        onSubmit={async (data) => {
          if (!currentCompanyId) return;
          await create({
            company_id: currentCompanyId,
            name: data.name!,
            ...data,
          });
          showAlert("멤버가 추가되었습니다.", { type: "success" });
          setOpenDrawer(false);
        }}
        onEdit={async (data) => {
          if (!currentCompanyId) return;
          await update(currentWorker!.id, data);
          showAlert("멤버가 수정되었습니다.", { type: "success" });
          setOpenDrawer(false);
        }}
        onDelete={async () => {
          if (!currentWorker) return;
          await remove(currentWorker.id);
          showAlert("멤버가 삭제되었습니다.", { type: "danger" });
          setOpenDrawer(false);
        }}
      />
    </>
  );
}

export default Worker;
