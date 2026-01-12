import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Table from "@/components/Table";
import Badge from "@/components/Badge";
import { useEffect, useState, useMemo, useRef } from "react"; // ✅ useRef 추가
import { useAlert } from "@/components/AlertProvider";
import {
  LuPlus,
  LuArrowUpDown,
  LuArrowUp,
  LuArrowDown,
  LuSearch,
  LuFilter,
  LuRotateCcw,
} from "react-icons/lu";
import dayjs from "dayjs";
import TableSkeleton from "@/layout/TableSkeleton";
import Button from "@/components/Button";
import { useWorkerStore } from "@/stores/useWorkerStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import WorkerDrawer from "@/components/worker/WorkerDrawer";
import { useAuthStore } from "@/stores/authStore";
import { BsCheck } from "react-icons/bs";
import Checkbox from "@/components/Checkbox";
import classNames from "classnames";

function Worker() {
  const { currentCompanyId } = useCompanyStore();
  const { showAlert } = useAlert();
  const {
    workers,
    allList,
    loading,
    total,
    setPage,
    fetch,
    create,
    update,
    remove,
    searchTerm,
    setSearchTerm,
    fetchAll,
  } = useWorkerStore();
  const { role } = useAuthStore();

  const [currentWorker, setCurrentWorker] = useState<any>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [searchInput, setSearchInput] = useState("");

  // --- 필터 및 정렬 상태 ---
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null); // ✅ 필터 영역 감지를 위한 Ref

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    order: "asc" | "desc";
  }>({
    key: "created_at",
    order: "desc",
  });

  const [filters, setFilters] = useState<{
    departments: string[];
    deductions: string[];
  }>({
    departments: [],
    deductions: [],
  });

  // ✅ 외부 클릭 시 필터 닫기 로직
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterRef]);

  // 부서 목록 추출
  const departmentOptions = useMemo(() => {
    const deps = allList.map((w) => w.department).filter(Boolean);
    return Array.from(new Set(deps)) as string[];
  }, [allList]);

  useEffect(() => {
    if (currentCompanyId) fetchAll(currentCompanyId);
  }, [currentCompanyId]);

  useEffect(() => {
    if (currentCompanyId) {
      fetch(
        currentCompanyId,
        1,
        10,
        sortConfig.key,
        sortConfig.order,
        searchTerm,
        filters
      );
    }
  }, [currentCompanyId, sortConfig, filters, searchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (currentCompanyId) setSearchTerm(searchInput);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  const fetchWorkers = (page: number, size: number) => {
    if (currentCompanyId) {
      setPage(page);
      fetch(
        currentCompanyId,
        page,
        size,
        sortConfig.key,
        sortConfig.order,
        searchTerm,
        filters
      );
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

  const StatusBadge = ({ active }: { active: boolean }) => (
    <span
      className={classNames(
        "p-1 flex items-center gap-1 rounded-md text-white text-xs font-semibold w-max",
        { "bg-green-600": active, "bg-gray-100": !active }
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
      header: "연락처",
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

  const activeFilterCount =
    filters.departments.length + filters.deductions.length;

  return (
    <>
      <FlexWrapper justify="between" items="center" classes="w-full mb-6">
        <FlexWrapper gap={2} items="end">
          <Typography variant="H3">근로자 관리</Typography>
          <Badge color="green" size="md">
            {total}
          </Badge>
        </FlexWrapper>

        <FlexWrapper gap={2} items="center">
          <div className="relative w-[240px]">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="검색어 입력..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-white w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 transition-all"
            />
          </div>

          <div className="relative" ref={filterRef}>
            {/* ✅ Ref 연결 */}
            <Button
              variant="outline"
              color="white"
              classes="!px-3"
              onClick={() => setShowFilter(!showFilter)}
            >
              <FlexWrapper gap={1} items="center">
                <LuFilter />
                상세 필터
                {activeFilterCount > 0 && (
                  <span className="bg-green-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </FlexWrapper>
            </Button>
            {showFilter && (
              <div className="absolute right-0 top-12 z-[100] w-[280px] bg-white border border-gray-200 rounded-xl shadow-xl p-5">
                <FlexWrapper justify="between" items="center" classes="mb-4">
                  <Typography variant="B1" classes="font-bold">
                    상세 필터
                  </Typography>
                  <button
                    onClick={() =>
                      setFilters({ departments: [], deductions: [] })
                    }
                    className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-xs transition-colors"
                  >
                    <LuRotateCcw size={12} /> 초기화
                  </button>
                </FlexWrapper>

                <div className="flex flex-col gap-6">
                  <div>
                    <Typography
                      variant="B2"
                      classes="text-gray-500 mb-2 font-bold"
                    >
                      부서
                    </Typography>
                    <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-1">
                      {departmentOptions.map((dep) => (
                        <button
                          key={dep}
                          onClick={() => {
                            const next = filters.departments.includes(dep)
                              ? filters.departments.filter((d) => d !== dep)
                              : [...filters.departments, dep];
                            setFilters({ ...filters, departments: next });
                          }}
                          className={classNames(
                            "px-2.5 py-1 rounded-md text-xs border transition-all",
                            {
                              "bg-green-600 border-green-600 text-white":
                                filters.departments.includes(dep),
                              "bg-white border-gray-200 text-gray-600":
                                !filters.departments.includes(dep),
                            }
                          )}
                        >
                          {dep}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Typography
                      variant="B2"
                      classes="text-gray-500 mb-2 font-bold"
                    >
                      공제 상태
                    </Typography>
                    <div className="flex flex-col gap-2.5">
                      {/* ✅ 5가지 항목으로 확장 */}
                      {[
                        {
                          id: "has_health_insurance_dependent",
                          label: "건보 피부양자 등록됨",
                        },
                        {
                          id: "has_dependent_deduction",
                          label: "부양 가족 공제 대상",
                        },
                        {
                          id: "has_additional_deduction",
                          label: "추가 공제 대상",
                        },
                        {
                          id: "has_student_loan_deduction",
                          label: "학자금 상환 대상",
                        },
                        {
                          id: "has_youth_deduction",
                          label: "청년내일채움 가입자",
                        },
                      ].map((item) => (
                        <Checkbox
                          key={item.id}
                          id={item.id}
                          label={item.label}
                          checked={filters.deductions.includes(item.id)}
                          onChange={() => {
                            const next = filters.deductions.includes(item.id)
                              ? filters.deductions.filter((d) => d !== item.id)
                              : [...filters.deductions, item.id];
                            setFilters({ ...filters, deductions: next });
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  variant="contain"
                  color="green"
                  classes="w-full mt-6 !py-2.5"
                  onClick={() => setShowFilter(false)}
                >
                  필터 적용
                </Button>
              </div>
            )}
          </div>

          {role === "admin" && (
            <Button
              variant="contain"
              color="green"
              size="md"
              classes="gap-1 !px-4"
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
      </FlexWrapper>

      {/* 테이블 및 드로어 부분 (변경 없음) */}
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
          await create({ company_id: currentCompanyId, ...data });
          showAlert("근로자가 추가되었습니다.", { type: "success" });
          setOpenDrawer(false);
          fetchAll(currentCompanyId);
        }}
        onEdit={async (data) => {
          if (!currentWorker) return;
          await update(currentWorker.id, data);
          showAlert("수정되었습니다.", { type: "success" });
          setOpenDrawer(false);
          fetchAll(currentCompanyId!);
        }}
        onDelete={async () => {
          if (!currentWorker) return;
          await remove(currentWorker.id);
          showAlert("삭제되었습니다.", { type: "danger" });
          setOpenDrawer(false);
          fetchAll(currentCompanyId!);
        }}
      />
    </>
  );
}

export default Worker;
