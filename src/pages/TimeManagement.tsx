import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Table from "@/components/Table";
import Badge from "@/components/Badge";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  LuPlus,
  LuArrowUpDown,
  LuArrowUp,
  LuArrowDown,
  LuSearch,
  LuFilter,
  LuRotateCcw,
} from "react-icons/lu";
import TableSkeleton from "@/layout/TableSkeleton";
import Button from "@/components/Button";
import { useWorkerStore } from "@/stores/useWorkerStore";
import { useTimeStore } from "@/stores/useTimeStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import TimeDrawer from "@/components/time/TimeDrawer";
import { useAuthStore } from "@/stores/authStore";
import dayjs from "dayjs";
import classNames from "classnames";
import { useAlert } from "@/components/AlertProvider";

function TimeManagement() {
  const { currentCompanyId } = useCompanyStore();
  const { showAlert } = useAlert();
  const { role } = useAuthStore();

  const { allList, fetchAll } = useWorkerStore();
  const { logs, total, loading, fetch, create, update, remove } =
    useTimeStore();

  const [currentLog, setCurrentLog] = useState<any>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [searchInput, setSearchInput] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    order: "asc" | "desc";
  }>({
    key: "work_date",
    order: "desc",
  });

  const [filters, setFilters] = useState<{
    departments: string[];
    positions: string[];
    dateRange: { start: string; end: string };
  }>({
    departments: [],
    positions: [],
    dateRange: {
      start: dayjs().startOf("month").format("YYYY-MM-DD"),
      end: dayjs().endOf("month").format("YYYY-MM-DD"),
    },
  });

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

  const departmentOptions = useMemo(() => {
    const deps = allList
      .map((w) => w.department?.trim())
      .filter(Boolean) as string[];
    return ["미지정", ...Array.from(new Set(deps))];
  }, [allList]);

  const positionOptions = useMemo(() => {
    const poss = allList
      .map((w) => w.position?.trim())
      .filter(Boolean) as string[];
    return ["미지정", ...Array.from(new Set(poss))];
  }, [allList]);

  const handleFetch = (page: number = 1) => {
    if (currentCompanyId) {
      fetch(
        currentCompanyId,
        page,
        10,
        sortConfig.key,
        sortConfig.order,
        searchInput,
        filters
      );
    }
  };

  useEffect(() => {
    if (currentCompanyId) {
      fetchAll(currentCompanyId);
      handleFetch();
    }
  }, [currentCompanyId, sortConfig, filters]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleFetch();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  const SortableHeader = ({ title, sortKey }: any) => (
    <button
      type="button"
      className="flex items-center hover:bg-gray-50 py-1 px-2 rounded-md transition-colors -ml-2 w-full justify-between"
      onClick={() =>
        setSortConfig({
          key: sortKey,
          order: sortConfig.order === "asc" ? "desc" : "asc",
        })
      }
    >
      <Typography
        variant="B2"
        classes={classNames("whitespace-nowrap", {
          "!font-bold text-primary-600": sortConfig.key === sortKey,
        })}
      >
        {title}
      </Typography>
      {sortConfig.key === sortKey ? (
        sortConfig.order === "asc" ? (
          <LuArrowUp />
        ) : (
          <LuArrowDown />
        )
      ) : (
        <LuArrowUpDown className="text-gray-300" />
      )}
    </button>
  );

  // ✅ 대분류 헤더를 제거하고 단일 계층으로 평탄화
  const columns = useMemo(
    () => [
      {
        accessorKey: "work_date",
        header: () => <SortableHeader title="일자" sortKey="work_date" />,
        cell: ({ row }: any) => (
          <Typography variant="B2">
            {dayjs(row.original.work_date).format("YYYY.MM.DD")}
          </Typography>
        ),
      },
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
        accessorKey: "department",
        header: "부서",
        cell: ({ row }: any) => (
          <Typography variant="B2">{row.original.department || "-"}</Typography>
        ),
      },
      {
        accessorKey: "position",
        header: "직급",
        cell: ({ row }: any) => (
          <Typography variant="B2">{row.original.position || "-"}</Typography>
        ),
      },
      {
        accessorKey: "clock_in",
        header: "출근",
        cell: ({ row }: any) => (
          <Typography variant="B2">
            {row.original.clock_in
              ? dayjs(row.original.clock_in).format("HH:mm")
              : "-"}
          </Typography>
        ),
      },
      {
        accessorKey: "clock_out",
        header: "퇴근",
        cell: ({ row }: any) => (
          <Typography variant="B2">
            {row.original.clock_out
              ? dayjs(row.original.clock_out).format("HH:mm")
              : "-"}
          </Typography>
        ),
      },
      {
        id: "work_hours",
        header: "근무시간",
        cell: ({ row }: any) => {
          if (!row.original.clock_in || !row.original.clock_out) return "-";
          const diff = dayjs(row.original.clock_out).diff(
            dayjs(row.original.clock_in),
            "minute"
          );
          return (
            <Badge color="green">{`${Math.floor(diff / 60)}h ${
              diff % 60
            }m`}</Badge>
          );
        },
      },
      {
        accessorKey: "remarks",
        header: "적요",
        cell: ({ row }: any) => (
          <Typography variant="B2" classes="truncate max-w-[200px]">
            {row.original.remarks || "-"}
          </Typography>
        ),
      },
    ],
    [sortConfig]
  );

  const activeFilterCount =
    filters.departments.length + filters.positions.length;

  return (
    <>
      <FlexWrapper justify="between" items="center" classes="w-full mb-6">
        <FlexWrapper gap={2} items="end">
          <Typography variant="H3">근태 관리</Typography>
          <Badge color="green" size="md">
            {total}
          </Badge>
        </FlexWrapper>

        <FlexWrapper gap={2} items="center">
          <div className="relative w-[240px]">
            <LuSearch className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="이름 검색..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-white w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
            />
          </div>

          <div className="relative" ref={filterRef}>
            <Button
              variant="outline"
              color="white"
              classes="!px-3"
              onClick={() => setShowFilter(!showFilter)}
            >
              <LuFilter className="mr-1" /> 상세 필터{" "}
              {activeFilterCount > 0 && (
                <span className="ml-1 text-green-600 font-bold">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            {showFilter && (
              <div className="absolute right-0 top-12 z-[100] w-[320px] bg-white border border-gray-200 rounded-xl shadow-xl p-5">
                <FlexWrapper justify="between" items="center" classes="mb-4">
                  <Typography variant="B1" classes="font-bold">
                    상세 필터
                  </Typography>
                  <button
                    onClick={() =>
                      setFilters({
                        ...filters,
                        departments: [],
                        positions: [],
                      })
                    }
                    className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-xs transition-colors"
                  >
                    <LuRotateCcw size={12} /> 초기화
                  </button>
                </FlexWrapper>

                <div className="flex flex-col gap-6 max-h-[450px] overflow-y-auto pr-1 scroll-thin">
                  {/* 조회 기간 */}
                  <div>
                    <Typography
                      variant="B2"
                      classes="text-gray-500 mb-2 font-bold"
                    >
                      조회 기간
                    </Typography>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={filters.dateRange.start}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            dateRange: {
                              ...filters.dateRange,
                              start: e.target.value,
                            },
                          })
                        }
                        className="border border-gray-200 rounded px-2 py-1 text-xs flex-1 focus:outline-none focus:border-green-500"
                      />
                      <span className="text-gray-400">~</span>
                      <input
                        type="date"
                        value={filters.dateRange.end}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            dateRange: {
                              ...filters.dateRange,
                              end: e.target.value,
                            },
                          })
                        }
                        className="border border-gray-200 rounded px-2 py-1 text-xs flex-1 focus:outline-none focus:border-green-500"
                      />
                    </div>
                  </div>

                  {/* 부서 필터 */}
                  <div>
                    <Typography
                      variant="B2"
                      classes="text-gray-500 mb-2 font-bold"
                    >
                      부서
                    </Typography>
                    <div className="flex flex-wrap gap-2">
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

                  {/* 직급 필터 */}
                  <div>
                    <Typography
                      variant="B2"
                      classes="text-gray-500 mb-2 font-bold"
                    >
                      직급
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {positionOptions.map((pos) => (
                        <button
                          key={pos}
                          onClick={() => {
                            const next = filters.positions.includes(pos)
                              ? filters.positions.filter((p) => p !== pos)
                              : [...filters.positions, pos];
                            setFilters({ ...filters, positions: next });
                          }}
                          className={classNames(
                            "px-2.5 py-1 rounded-md text-xs border transition-all",
                            {
                              "bg-green-600 border-green-600 text-white":
                                filters.positions.includes(pos),
                              "bg-white border-gray-200 text-gray-600":
                                !filters.positions.includes(pos),
                            }
                          )}
                        >
                          {pos}
                        </button>
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
                setCurrentLog(null);
                setDrawerMode("create");
                setOpenDrawer(true);
              }}
            >
              <LuPlus className="text-lg" /> 기록 추가
            </Button>
          )}
        </FlexWrapper>
      </FlexWrapper>

      {loading ? (
        <TableSkeleton rows={10} columns={8} />
      ) : (
        <FlexWrapper classes="h-[calc(100dvh-152px)] rounded-xl border bg-white overflow-hidden shadow-sm">
          <Table
            data={logs}
            columns={columns}
            hideSize
            totalCount={total}
            onPageChange={(p) => handleFetch(p)}
            onRowClick={(row: any) => {
              setCurrentLog(row);
              setDrawerMode("edit");
              setOpenDrawer(true);
            }}
          />
        </FlexWrapper>
      )}

      <TimeDrawer
        open={openDrawer}
        mode={drawerMode}
        log={currentLog}
        workers={allList}
        onClose={() => setOpenDrawer(false)}
        onSubmit={async (data) => {
          if (!currentCompanyId) return;
          await create({ company_id: currentCompanyId, ...data });
          showAlert("저장되었습니다.", { type: "success" });
          handleFetch();
        }}
        onEdit={async (id, data) => {
          await update(id, data);
          showAlert("수정되었습니다.", { type: "success" });
          handleFetch();
        }}
        onDelete={async (id) => {
          await remove(id);
          showAlert("삭제되었습니다.", { type: "danger" });
          handleFetch();
        }}
      />
    </>
  );
}

export default TimeManagement;
