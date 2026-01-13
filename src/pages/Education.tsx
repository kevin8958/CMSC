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
import { useCompanyStore } from "@/stores/useCompanyStore";
import EducationDrawer from "@/components/education/EducationDrawer";
import { useAuthStore } from "@/stores/authStore";
import { BsCheck } from "react-icons/bs";
import Checkbox from "@/components/Checkbox";
import classNames from "classnames";
import { useAlert } from "@/components/AlertProvider";

function Education() {
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
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    order: "asc" | "desc";
  }>({
    key: "created_at",
    order: "asc",
  });

  const [filters, setFilters] = useState<{
    departments: string[];
    positions: string[];
    educations: string[];
  }>({
    departments: [],
    positions: [],
    educations: [],
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
        {
          departments: filters.departments,
          positions: filters.positions,
          deductions: filters.educations,
        }
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
        {
          departments: filters.departments,
          positions: filters.positions,
          deductions: filters.educations,
        }
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
      return <LuArrowUpDown className="text-gray-300 ml-1 shrink-0" />;
    return sortConfig.order === "asc" ? (
      <LuArrowUp className="text-primary-600 ml-1 shrink-0" />
    ) : (
      <LuArrowDown className="text-primary-600 ml-1 shrink-0" />
    );
  };

  const SortableHeader = ({
    title,
    sortKey,
    colorClass = "text-gray-900",
  }: {
    title: string;
    sortKey: string;
    colorClass?: string;
  }) => (
    <button
      type="button"
      className="flex items-center hover:bg-gray-50 py-1 px-2 rounded-md transition-colors -ml-2 w-full justify-between"
      onClick={(e) => {
        e.stopPropagation();
        handleSort(sortKey);
      }}
    >
      <Typography
        variant="B2"
        classes={classNames("whitespace-nowrap", {
          "!font-bold underline decoration-2 underline-offset-4":
            sortConfig.key === sortKey,
          [colorClass]: sortConfig.key !== sortKey,
          "text-primary-600": sortConfig.key === sortKey,
        })}
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

  const LicenseStatusBadge = ({
    active,
    isLicenseHolder,
  }: {
    active: boolean;
    isLicenseHolder: boolean;
  }) => {
    if (!isLicenseHolder)
      return (
        <Typography variant="C1" classes="text-gray-400">
          해당없음
        </Typography>
      );
    return <StatusBadge active={active} />;
  };

  const columns = useMemo(
    () => [
      {
        id: "basic_info",
        header: () => (
          <div className="w-full p-2 bg-gray-50 text-gray-700 font-bold text-xs rounded-t-md text-center">
            기본 정보
          </div>
        ),
        columns: [
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
            header: () => (
              <SortableHeader
                title="부서"
                sortKey="department"
                colorClass="text-gray-600"
              />
            ),
            cell: ({ row }: any) => (
              <Typography variant="B2">
                {row.original.department || "-"}
              </Typography>
            ),
          },
          {
            accessorKey: "position",
            header: () => (
              <SortableHeader
                title="직급"
                sortKey="position"
                colorClass="text-gray-600"
              />
            ),
            cell: ({ row }: any) => (
              <Typography variant="B2">
                {row.original.position || "-"}
              </Typography>
            ),
          },
          {
            accessorKey: "duty",
            header: () => (
              <SortableHeader
                title="직무"
                sortKey="duty"
                colorClass="text-gray-600"
              />
            ),
            cell: ({ row }: any) => (
              <Typography variant="B2">{row.original.duty || "-"}</Typography>
            ),
          },
        ],
      },
      {
        id: "mandatory_edu",
        header: () => (
          <div className="w-full p-2 bg-orange-50 text-orange-700 font-bold text-xs rounded-t-md text-center">
            5대 법정의무교육
          </div>
        ),
        columns: [
          {
            accessorKey: "edu_sex_harassment",
            header: () => (
              <SortableHeader
                title="성희롱"
                sortKey="edu_sex_harassment"
                colorClass="!text-orange-600"
              />
            ),
            cell: ({ row }: any) => (
              <StatusBadge active={row.original.edu_sex_harassment} />
            ),
          },
          {
            accessorKey: "edu_privacy",
            header: () => (
              <SortableHeader
                title="개인정보"
                sortKey="edu_privacy"
                colorClass="!text-orange-600"
              />
            ),
            cell: ({ row }: any) => (
              <StatusBadge active={row.original.edu_privacy} />
            ),
          },
          {
            accessorKey: "edu_disability",
            header: () => (
              <SortableHeader
                title="장애인"
                sortKey="edu_disability"
                colorClass="!text-orange-600"
              />
            ),
            cell: ({ row }: any) => (
              <StatusBadge active={row.original.edu_disability} />
            ),
          },
          {
            accessorKey: "edu_safety",
            header: () => (
              <SortableHeader
                title="산업안전"
                sortKey="edu_safety"
                colorClass="!text-orange-600"
              />
            ),
            cell: ({ row }: any) => (
              <StatusBadge active={row.original.edu_safety} />
            ),
          },
          {
            accessorKey: "edu_pension",
            header: () => (
              <SortableHeader
                title="퇴직연금"
                sortKey="edu_pension"
                colorClass="!text-orange-600"
              />
            ),
            cell: ({ row }: any) => (
              <StatusBadge active={row.original.edu_pension} />
            ),
          },
        ],
      },
      {
        id: "medical_edu",
        header: () => (
          <div className="w-full p-2 bg-blue-50 text-blue-700 font-bold text-xs rounded-t-md text-center">
            의료기관 특화 교육
          </div>
        ),
        columns: [
          {
            accessorKey: "edu_child_abuse",
            header: () => (
              <SortableHeader
                title="아동학대"
                sortKey="edu_child_abuse"
                colorClass="!text-blue-600"
              />
            ),
            cell: ({ row }: any) => (
              <StatusBadge active={row.original.edu_child_abuse} />
            ),
          },
          {
            accessorKey: "edu_elder_abuse",
            header: () => (
              <SortableHeader
                title="노인학대"
                sortKey="edu_elder_abuse"
                colorClass="!text-blue-600"
              />
            ),
            cell: ({ row }: any) => (
              <StatusBadge active={row.original.edu_elder_abuse} />
            ),
          },
          {
            accessorKey: "edu_emergency",
            header: () => (
              <SortableHeader
                title="긴급복지"
                sortKey="edu_emergency"
                colorClass="!text-blue-600"
              />
            ),
            cell: ({ row }: any) => (
              <StatusBadge active={row.original.edu_emergency} />
            ),
          },
          {
            accessorKey: "edu_disability_abuse",
            header: () => (
              <SortableHeader
                title="장애학대"
                sortKey="edu_disability_abuse"
                colorClass="!text-blue-600"
              />
            ),
            cell: ({ row }: any) => (
              <StatusBadge active={row.original.edu_disability_abuse} />
            ),
          },
          {
            accessorKey: "edu_infection",
            header: () => (
              <SortableHeader
                title="감염/안전"
                sortKey="edu_infection"
                colorClass="!text-blue-600"
              />
            ),
            cell: ({ row }: any) => (
              <StatusBadge active={row.original.edu_infection} />
            ),
          },
        ],
      },
      {
        id: "etc_edu",
        header: () => (
          <div className="w-full p-2 bg-purple-50 text-purple-700 font-bold text-xs rounded-t-md text-center">
            기타
          </div>
        ),
        columns: [
          {
            accessorKey: "edu_license_maintenance",
            header: () => (
              <SortableHeader
                title="보수교육"
                sortKey="edu_license_maintenance"
                colorClass="text-purple-600"
              />
            ),
            cell: ({ row }: any) => (
              <LicenseStatusBadge
                active={row.original.edu_license_maintenance}
                isLicenseHolder={row.original.is_license_holder}
              />
            ),
          },
        ],
      },
    ],
    [sortConfig]
  );

  const activeFilterCount =
    filters.departments.length +
    filters.positions.length +
    filters.educations.length;

  return (
    <>
      <FlexWrapper
        justify="between"
        items="center"
        classes="w-full mb-6 flex-wrap"
      >
        <FlexWrapper gap={2} items="end">
          <Typography variant="H3">교육 관리</Typography>
          <Badge color="green" size="md">
            {total}
          </Badge>
        </FlexWrapper>

        <FlexWrapper gap={2} items="center" classes="w-full sm:w-max">
          <div className="relative w-full sm:w-[240px]">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="이름, 직무 검색..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-white w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 transition-all"
            />
          </div>

          <div className="relative" ref={filterRef}>
            <Button
              variant="outline"
              color="white"
              classes="!px-3"
              onClick={() => setShowFilter(!showFilter)}
            >
              <FlexWrapper gap={1} items="center">
                <LuFilter />
                <p className="hidden sm:inline">상세 필터</p>
                {activeFilterCount > 0 && (
                  <span className="bg-green-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center ml-1">
                    {activeFilterCount}
                  </span>
                )}
              </FlexWrapper>
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
                        departments: [],
                        positions: [],
                        educations: [],
                      })
                    }
                    className="text-gray-400 hover:text-gray-600 text-xs flex items-center gap-1"
                  >
                    <LuRotateCcw size={12} /> 초기화
                  </button>
                </FlexWrapper>

                <div className="flex flex-col gap-6 max-h-[500px] overflow-y-auto pr-1 scroll-thin">
                  <div>
                    <Typography variant="B2" classes="mb-2 font-bold">
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

                  <div>
                    <Typography variant="B2" classes="mb-2 font-bold">
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

                  {/* ✅ 교육 이수 여부 필터 (대분류 적용) */}
                  <div className="flex flex-col gap-4">
                    <Typography variant="B2" classes="font-bold">
                      교육 이수 여부 (체크 시 이수자만 표시)
                    </Typography>

                    {/* 그룹 1: 5대 법정의무교육 */}
                    <div className="flex flex-col gap-2">
                      <Typography
                        variant="C1"
                        classes="!text-orange-600 font-bold"
                      >
                        5대 법정의무교육
                      </Typography>
                      <div className="flex flex-col gap-2 pl-1">
                        {[
                          {
                            id: "edu_sex_harassment",
                            label: "성희롱 예방교육",
                          },
                          { id: "edu_privacy", label: "개인정보 보호교육" },
                          { id: "edu_disability", label: "장애인 인식개선" },
                          { id: "edu_safety", label: "산업안전 보건교육" },
                          { id: "edu_pension", label: "퇴직연금 교육" },
                        ].map((edu) => (
                          <Checkbox
                            key={edu.id}
                            id={edu.id}
                            label={edu.label}
                            checked={filters.educations.includes(edu.id)}
                            onChange={() => {
                              const next = filters.educations.includes(edu.id)
                                ? filters.educations.filter((e) => e !== edu.id)
                                : [...filters.educations, edu.id];
                              setFilters({ ...filters, educations: next });
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* 그룹 2: 의료기관 특화 교육 */}
                    <div className="flex flex-col gap-2">
                      <Typography
                        variant="C1"
                        classes="!text-blue-600 font-bold"
                      >
                        의료기관 특화 교육
                      </Typography>
                      <div className="flex flex-col gap-2 pl-1">
                        {[
                          { id: "edu_child_abuse", label: "아동학대 신고의무" },
                          { id: "edu_elder_abuse", label: "노인학대 신고의무" },
                          { id: "edu_emergency", label: "긴급복지 신고의무" },
                          {
                            id: "edu_disability_abuse",
                            label: "장애인학대 신고의무",
                          },
                          {
                            id: "edu_infection",
                            label: "감염관리 및 환자안전",
                          },
                        ].map((edu) => (
                          <Checkbox
                            key={edu.id}
                            id={edu.id}
                            label={edu.label}
                            checked={filters.educations.includes(edu.id)}
                            onChange={() => {
                              const next = filters.educations.includes(edu.id)
                                ? filters.educations.filter((e) => e !== edu.id)
                                : [...filters.educations, edu.id];
                              setFilters({ ...filters, educations: next });
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* 그룹 3: 기타 */}
                    <div className="flex flex-col gap-2">
                      <Typography
                        variant="C1"
                        classes="!text-purple-600 font-bold"
                      >
                        기타
                      </Typography>
                      <div className="flex flex-col gap-2 pl-1">
                        <Checkbox
                          id="edu_license_maintenance"
                          label="면허 보수교육"
                          checked={filters.educations.includes(
                            "edu_license_maintenance"
                          )}
                          onChange={() => {
                            const next = filters.educations.includes(
                              "edu_license_maintenance"
                            )
                              ? filters.educations.filter(
                                  (e) => e !== "edu_license_maintenance"
                                )
                              : [
                                  ...filters.educations,
                                  "edu_license_maintenance",
                                ];
                            setFilters({ ...filters, educations: next });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="contain"
                  color="green"
                  classes="w-full mt-6"
                  onClick={() => setShowFilter(false)}
                >
                  적용
                </Button>
              </div>
            )}
          </div>

          {role === "admin" && (
            <Button
              variant="contain"
              color="green"
              size="md"
              classes="gap-1 !px-4 shadow-sm"
              onClick={() => {
                setCurrentWorker(null);
                setDrawerMode("create");
                setOpenDrawer(true);
              }}
            >
              <LuPlus className="text-lg" />
              <p className="hidden sm:inline">교육 등록</p>
            </Button>
          )}
        </FlexWrapper>
      </FlexWrapper>

      {loading ? (
        <FlexWrapper
          classes="h-[calc(100vh-220px)] rounded-xl border overflow-hidden bg-white shadow-sm"
          justify="center"
          items="start"
        >
          <TableSkeleton rows={10} columns={15} />
        </FlexWrapper>
      ) : (
        <FlexWrapper classes="h-[calc(100dvh-152px)] rounded-xl border overflow-hidden bg-white shadow-sm overflow-x-auto">
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

      <EducationDrawer
        open={openDrawer}
        disabled={role !== "admin"}
        mode={drawerMode}
        worker={currentWorker}
        onClose={() => setOpenDrawer(false)}
        onSubmit={async (data) => {
          if (!currentCompanyId) return;
          try {
            await create({ company_id: currentCompanyId, ...data });
            showAlert("교육 정보가 등록되었습니다.", { type: "success" });
            setOpenDrawer(false);
            fetchAll(currentCompanyId);
          } catch (err) {
            showAlert("등록 중 오류가 발생했습니다.", { type: "danger" });
          }
        }}
        onEdit={async (data) => {
          if (!currentWorker) return;
          try {
            await update(currentWorker.id, data);
            showAlert("교육 정보가 수정되었습니다.", { type: "success" });
            setOpenDrawer(false);
            fetchAll(currentCompanyId!);
          } catch (err) {
            showAlert("수정 중 오류가 발생했습니다.", { type: "danger" });
          }
        }}
        onDelete={async () => {
          if (!currentWorker) return;
          try {
            await remove(currentWorker.id);
            showAlert("데이터가 삭제되었습니다.", { type: "danger" });
            setOpenDrawer(false);
            fetchAll(currentCompanyId!);
          } catch (err) {
            showAlert("삭제 중 오류가 발생했습니다.", { type: "danger" });
          }
        }}
      />
    </>
  );
}

export default Education;
