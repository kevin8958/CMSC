import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Table from "@/components/Table";
import Badge from "@/components/Badge";
import { useEffect, useState } from "react";
import { useAlert } from "@/components/AlertProvider";
import { LuPlus, LuArrowUpDown, LuArrowUp, LuArrowDown } from "react-icons/lu";
import dayjs from "dayjs";
import TableSkeleton from "@/layout/TableSkeleton";
import Button from "@/components/Button";
import { useWorkerStore } from "@/stores/useWorkerStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import WorkerDrawer from "@/components/worker/WorkerDrawer";
import { useAuthStore } from "@/stores/authStore";
import { BsCheck } from "react-icons/bs";
import classNames from "classnames";

function Worker() {
  const { currentCompanyId } = useCompanyStore();
  const { showAlert } = useAlert();
  const { workers, loading, total, setPage, fetch, create, update, remove } =
    useWorkerStore();
  const { role } = useAuthStore();

  const [currentWorker, setCurrentWorker] = useState<any>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    order: "asc" | "desc";
  }>({
    key: "created_at",
    order: "desc",
  });

  useEffect(() => {
    if (currentCompanyId) {
      fetch(currentCompanyId, 1, 10, sortConfig.key, sortConfig.order);
    }
  }, [currentCompanyId, sortConfig]);

  const fetchWorkers = (page: number, size: number) => {
    if (currentCompanyId) {
      setPage(page);
      fetch(currentCompanyId, page, size, sortConfig.key, sortConfig.order);
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const renderSortIcon = (key: string) => {
    if (sortConfig.key !== key)
      return <LuArrowUpDown className="text-gray-300 ml-1" />;
    return sortConfig.order === "asc" ? (
      <LuArrowUp className="text-primary-600 ml-1" />
    ) : (
      <LuArrowDown className="text-primary-600 ml-1" />
    );
  };

  const SortableHeader = ({
    title,
    sortKey,
  }: {
    title: string;
    sortKey: string;
  }) => (
    <button
      type="button"
      className="flex items-center hover:bg-gray-50 py-1 px-2 rounded-md transition-colors -ml-2"
      onClick={(e) => {
        e.stopPropagation();
        handleSort(sortKey);
      }}
    >
      <Typography
        variant="B2"
        classes={
          sortConfig.key === sortKey
            ? "!font-bold text-gray-700 whitespace-nowrap"
            : "text-gray-900 whitespace-nowrap"
        }
      >
        {title}
      </Typography>
      {renderSortIcon(sortKey)}
    </button>
  );

  // 공제 상태 뱃지 렌더러
  const StatusBadge = ({ active }: { active: boolean }) => {
    return (
      <span
        className={classNames(
          "p-1  flex items-center gap-1 rounded-md text-white text-xs font-semibold w-max",
          {
            "bg-green-600 ": active,
            "bg-gray-100": !active,
          }
        )}
      >
        <BsCheck
          className={classNames("text-base", {
            "text-white": active,
            "text-gray-300": !active,
          })}
        />
      </span>
    );
  };

  const columns = [
    {
      accessorKey: "name",
      header: () => <SortableHeader title="이름" sortKey="name" />,
      cell: ({ row }: any) => (
        <Typography variant="B2" classes="font-bold text-gray-900">
          {row.original.name}
        </Typography>
      ),
    },

    {
      accessorKey: "email",

      header: "이메일",

      cell: ({ row }: any) => (
        <Typography variant="B2" classes="text-gray-500">
          {row.original.email || "-"}
        </Typography>
      ),
    },
    {
      accessorKey: "birth_date",

      header: () => <SortableHeader title="생년월일" sortKey="birth_date" />,

      cell: ({ row }: any) => (
        <Typography variant="B2">
          {row.original.birth_date
            ? dayjs(row.original.birth_date).format("YYYY-MM-DD")
            : "-"}
        </Typography>
      ),
    },

    {
      accessorKey: "phone",

      header: "연락처", // 정렬이 필요 없는 항목은 텍스트로 유지

      cell: ({ row }: any) => (
        <Typography variant="B2">{row.original.phone || "-"}</Typography>
      ),
    },

    {
      accessorKey: "joined_at",

      header: () => <SortableHeader title="입사일" sortKey="joined_at" />,

      cell: ({ row }: any) => (
        <Typography variant="B2">
          {row.original.joined_at
            ? dayjs(row.original.joined_at).format("YYYY-MM-DD")
            : "-"}
        </Typography>
      ),
    },
    {
      accessorKey: "department",
      header: () => <SortableHeader title="부서" sortKey="department" />,
      cell: ({ row }: any) => (
        <Typography variant="B2">{row.original.department || "-"}</Typography>
      ),
    },
    {
      accessorKey: "position",
      header: () => <SortableHeader title="직급" sortKey="position" />,
      cell: ({ row }: any) => (
        <Typography variant="B2">{row.original.position || "-"}</Typography>
      ),
    },
    // --- 신규 추가: 공제 및 등록 상태 컬럼들 ---
    {
      accessorKey: "has_health_insurance_dependent",
      header: () => (
        <SortableHeader
          title="건보 피부양"
          sortKey="has_health_insurance_dependent"
        />
      ),
      cell: ({ row }: any) => (
        <StatusBadge active={row.original.has_health_insurance_dependent} />
      ),
    },
    {
      accessorKey: "has_dependent_deduction",
      header: () => (
        <SortableHeader title="부양 공제" sortKey="has_dependent_deduction" />
      ),
      cell: ({ row }: any) => (
        <StatusBadge active={row.original.has_dependent_deduction} />
      ),
    },
    {
      accessorKey: "has_additional_deduction",
      header: () => (
        <SortableHeader title="추가 공제" sortKey="has_additional_deduction" />
      ),
      cell: ({ row }: any) => (
        <StatusBadge active={row.original.has_additional_deduction} />
      ),
    },
    {
      accessorKey: "has_student_loan_deduction",
      header: () => (
        <SortableHeader title="학자금" sortKey="has_student_loan_deduction" />
      ),
      cell: ({ row }: any) => (
        <StatusBadge active={row.original.has_student_loan_deduction} />
      ),
    },
    {
      accessorKey: "has_youth_deduction",
      header: () => (
        <SortableHeader title="청년내일" sortKey="has_youth_deduction" />
      ),
      cell: ({ row }: any) => (
        <StatusBadge active={row.original.has_youth_deduction} />
      ),
    },
  ];

  return (
    <>
      <FlexWrapper justify="between" items="center" classes="w-full mb-6">
        <FlexWrapper gap={2} items="end">
          <Typography variant="H3">근로자 관리</Typography>
          <Badge color="green" size="md">
            {total}
          </Badge>
        </FlexWrapper>

        {role === "admin" && (
          <Button
            variant="contain"
            color="green"
            size="md"
            classes="gap-1 !px-4 shrink-0 shadow-sm"
            onClick={() => {
              setCurrentWorker(null);
              setDrawerMode("create");
              setOpenDrawer(true);
            }}
          >
            <LuPlus className="text-lg" />
            근로자 추가
          </Button>
        )}
      </FlexWrapper>

      {loading ? (
        <FlexWrapper
          classes="h-[calc(100vh-220px)] rounded-xl border overflow-hidden bg-white shadow-sm"
          justify="center"
          items="start"
        >
          <TableSkeleton rows={10} columns={columns.length} />
        </FlexWrapper>
      ) : (
        <FlexWrapper classes="h-[calc(100dvh-152px)] rounded-xl border overflow-hidden bg-white shadow-sm">
          <Table
            data={workers}
            columns={columns}
            hideSize
            totalCount={total}
            onPageChange={fetchWorkers}
            onRowClick={(row: any) => {
              setDrawerMode("edit");
              setCurrentWorker(row);
              setOpenDrawer(true);
            }}
          />
        </FlexWrapper>
      )}

      <WorkerDrawer
        open={openDrawer}
        disabled={role !== "admin"}
        mode={drawerMode}
        worker={currentWorker}
        onClose={() => setOpenDrawer(false)}
        onSubmit={async (data) => {
          if (!currentCompanyId) return;
          try {
            await create({ company_id: currentCompanyId, ...data });
            showAlert("근로자가 추가되었습니다.", { type: "success" });
            setOpenDrawer(false);
          } catch (err) {
            showAlert("오류가 발생했습니다.", { type: "danger" });
          }
        }}
        onEdit={async (data) => {
          if (!currentWorker) return;
          try {
            await update(currentWorker.id, data);
            showAlert("수정되었습니다.", { type: "success" });
            setOpenDrawer(false);
          } catch (err) {
            showAlert("오류가 발생했습니다.", { type: "danger" });
          }
        }}
        onDelete={async () => {
          if (!currentWorker) return;
          try {
            await remove(currentWorker.id);
            showAlert("삭제되었습니다.", { type: "danger" });
            setOpenDrawer(false);
          } catch (err) {
            showAlert("오류가 발생했습니다.", { type: "danger" });
          }
        }}
      />
    </>
  );
}

export default Worker;
