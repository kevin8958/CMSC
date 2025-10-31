/* eslint-disable @next/next/no-img-element */
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import classNames from "classnames";
import type { RefObject } from "react";
import { useEffect, useRef } from "react";
import {
  LuChevronFirst,
  LuChevronLast,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import { TbMoodEmpty } from "react-icons/tb";
import Dropdown from "@/components/Dropdown";

const TableComponent = (props: Common.TableProps) => {
  const scrollRef: RefObject<HTMLDivElement | null> = useRef(null);

  const {
    classes,
    data = [],
    columns,
    centerAlignHeaders,
    emphasisColumns,
    showPagination = true,
    noLine = false,
    hideHeader = false,
    stickyHeader = true,
    columnVisibility,
    hideSize = false,
    isDisableRow,
  } = props;

  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
        pageIndex: 0,
      },
    },
  });

  const dropdownOptions: Common.DropdownItem[] = [
    { type: "item", id: "10", label: "10개 보기" },
    { type: "item", id: "20", label: "20개 보기" },
    { type: "item", id: "30", label: "30개 보기" },
    { type: "item", id: "50", label: "50개 보기" },
    { type: "item", id: "100", label: "100개 보기" },
  ];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [table.getState().pagination.pageIndex]);

  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const visiblePages = 5; // 한 번에 보여줄 페이지 수
  const startPage =
    Math.floor((currentPage - 1) / visiblePages) * visiblePages + 1;
  const endPage = Math.min(startPage + visiblePages - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div
      className={classNames(
        "relative flex size-full flex-col items-start justify-between gap-2 pb-4",
        classes
      )}
    >
      <div
        ref={scrollRef}
        className="table-wrapper size-full overflow-scroll rounded-md border"
      >
        <table className="h-max w-full whitespace-nowrap rounded-md bg-white">
          {!hideHeader && (
            <thead
              className={classNames("bg-primary-50 z-10", {
                "sticky top-0 ": stickyHeader,
              })}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={classNames(
                        "px-4 py-3 text-primary-900 text-left font-semibold text-sm",
                        {
                          "!text-center": centerAlignHeaders?.includes(
                            header.id
                          ),
                        }
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
          )}
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={classNames({
                    "border-b border-[#E5E7EB]": !noLine,
                    "opacity-50 pointer-events-none":
                      isDisableRow && isDisableRow(row),
                  })}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={classNames("py-3 px-4 text-left text-sm", {
                        "bg-gray-50": emphasisColumns?.includes(cell.column.id),
                        "rounded-t-[16px]":
                          emphasisColumns?.includes(cell.column.id) &&
                          index === 0,
                        "rounded-b-[16px]":
                          emphasisColumns?.includes(cell.column.id) &&
                          index === table.getRowModel().rows.length - 1,
                      })}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="!border-none" colSpan={columns.length}>
                  <div className="flex flex-col items-center justify-center gap-4 p-6">
                    <TbMoodEmpty className="text-4xl text-gray-300" />
                    <p className="text-gray-400">데이터가 없습니다</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!hideSize && (
        <div className="absolute bottom-[30px] left-2 z-50">
          <Dropdown
            items={dropdownOptions}
            buttonItem={`${table.getState().pagination.pageSize}개 보기`}
            onChange={(val) => {
              table.setPageSize(Number(val));
            }}
          />
        </div>
      )}
      {/* ✅ 페이지 버튼형 pagination */}
      {showPagination && totalPages > 0 && (
        <div className="flex w-full items-center justify-center gap-2">
          {/* 처음 / 이전 */}
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <LuChevronFirst />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <LuChevronLeft />
          </button>

          {/* 페이지 번호 버튼들 */}
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => table.setPageIndex(page - 1)}
              className={classNames(
                "w-8 h-8 rounded-md text-sm font-medium transition-colors font-bold",
                {
                  "bg-primary-900 text-primary-100": currentPage === page,
                  "hover:bg-gray-100 text-primary-800": currentPage !== page,
                }
              )}
            >
              {page}
            </button>
          ))}

          {/* 다음 / 마지막 */}
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <LuChevronRight />
          </button>
          <button
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <LuChevronLast />
          </button>
        </div>
      )}
    </div>
  );
};

export default TableComponent;
