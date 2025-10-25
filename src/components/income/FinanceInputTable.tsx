import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuPlus,
  LuX,
  LuSave,
  LuChevronDown,
  LuChevronRight,
} from "react-icons/lu";
import classNames from "classnames";
import Button from "../Button";

interface Row {
  id: string;
  title: string;
  unit: "원" | "%";
  value: string;
  children?: Row[];
}

const initialData: Row[] = [
  {
    id: "sales",
    title: "매출",
    unit: "원",
    value: "",
    children: [{ id: "cogs", title: "매출원가", unit: "원", value: "" }],
  },
  {
    id: "grossProfit",
    title: "매출총이익",
    unit: "원",
    value: "",
    children: [
      { id: "grossMargin", title: "매출총이익률", unit: "%", value: "" },
    ],
  },
  {
    id: "sga",
    title: "판매관리비",
    unit: "원",
    value: "",
    children: [{ id: "fees", title: "기타지급수수료", unit: "원", value: "" }],
  },
  {
    id: "operatingProfit",
    title: "영업이익",
    unit: "원",
    value: "",
    children: [
      { id: "operatingMargin", title: "영업이익률", unit: "%", value: "" },
    ],
  },
  { id: "nonOperating", title: "영업외비용", unit: "원", value: "" },
  {
    id: "preTaxProfit",
    title: "세전이익",
    unit: "원",
    value: "",
    children: [
      { id: "preTaxMargin", title: "세전이익률", unit: "%", value: "" },
    ],
  },
];

export default function FinanceInputTable() {
  const [data, setData] = useState<Row[]>(initialData);
  const [editMode, setEditMode] = useState(false);
  const [openRows, setOpenRows] = useState<Record<string, boolean>>(() => {
    // 기본적으로 모든 상위 메뉴는 열려 있음
    const allIds: Record<string, boolean> = {};
    const traverse = (rows: Row[]) => {
      rows.forEach((r) => {
        if (r.children?.length) {
          allIds[r.id] = true;
          traverse(r.children);
        }
      });
    };
    traverse(initialData);
    return allIds;
  });

  const toggleRow = (id: string) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleValueChange = (id: string, newValue: string) => {
    const update = (rows: Row[]): Row[] =>
      rows.map((row) =>
        row.id === id
          ? { ...row, value: newValue }
          : { ...row, children: row.children ? update(row.children) : [] }
      );
    setData(update(data));
  };

  const handleAddChild = (parentId: string) => {
    const update = (rows: Row[]): Row[] =>
      rows.map((row) =>
        row.id === parentId
          ? {
              ...row,
              children: [
                ...(row.children || []),
                {
                  id: `${parentId}-${Date.now()}`,
                  title: "새 항목",
                  unit: "원",
                  value: "",
                },
              ],
            }
          : { ...row, children: row.children ? update(row.children) : [] }
      );
    setData(update(data));
    setOpenRows((prev) => ({ ...prev, [parentId]: true })); // 새로 추가하면 자동으로 펼치기
  };

  const handleRemoveRow = (id: string) => {
    const remove = (rows: Row[]): Row[] =>
      rows.filter((row) => {
        if (row.id === id) return false;
        if (row.children) row.children = remove(row.children);
        return true;
      });
    setData(remove(data));
  };

  const renderRows = (rows: Row[], level = 0): React.ReactNode[] => {
    return rows.reduce<React.ReactNode[]>((acc, row) => {
      const isOpen = openRows[row.id] ?? true;
      const hasChildren = !!row.children?.length;

      acc.push(
        <div
          key={row.id}
          className="flex items-center border-b border-gray-200 text-sm"
        >
          {/* Title Column */}
          <div
            className={classNames(
              "flex items-center gap-2 py-2 px-3 flex-[1.5]",
              { "pl-8": level > 0, "pl-4": level === 0 }
            )}
          >
            {/* ✅ 펼치기 / 닫기 아이콘 */}
            {hasChildren && (
              <button
                onClick={() => toggleRow(row.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                {isOpen ? (
                  <LuChevronDown size={14} />
                ) : (
                  <LuChevronRight size={14} />
                )}
              </button>
            )}

            <span className="font-medium">{row.title}</span>

            {editMode && (
              <>
                <button
                  className="text-gray-400 hover:text-primary-600"
                  onClick={() => handleAddChild(row.id)}
                  title="하위 항목 추가"
                >
                  <LuPlus size={14} />
                </button>
                {level > 0 && (
                  <button
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => handleRemoveRow(row.id)}
                    title="삭제"
                  >
                    <LuX size={14} />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Value Column */}
          <div className="flex items-center justify-end flex-1 pr-4">
            {editMode ? (
              <input
                type="number"
                value={row.value}
                onChange={(e) => handleValueChange(row.id, e.target.value)}
                className="w-24 text-right border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="0"
              />
            ) : (
              <span className="text-gray-700">
                {row.value ? Number(row.value).toLocaleString() : "-"}
              </span>
            )}
            <span className="ml-1 text-gray-500">{row.unit}</span>
          </div>
        </div>
      );

      // ✅ 닫혀 있으면 children 렌더링하지 않음
      if (row.children && isOpen) {
        acc.push(...renderRows(row.children, level + 1));
      }

      return acc;
    }, []);
  };

  return (
    <div className="flex flex-col border border-gray-300 rounded-xl bg-white shadow-custom-dark overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="font-semibold text-gray-800">손익계산서 입력폼</h2>
        {!editMode ? (
          <Button
            variant="contain"
            size="sm"
            color="primary"
            onClick={() => setEditMode(true)}
          >
            편집하기
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setEditMode(false)}
              size="sm"
              color="primary"
              classes="flex items-center gap-2"
            >
              <LuX size={16} /> 취소
            </Button>
            <Button
              variant="contain"
              onClick={() => setEditMode(false)}
              size="sm"
              color="primary"
              classes="flex items-center gap-2"
            >
              <LuSave size={16} /> 저장
            </Button>
          </div>
        )}
      </div>

      {/* Rows */}
      <div className="scrollbar-thin scrollbar-thumb-primary-100 scrollbar-track-transparent h-[calc(100dvh-76px-36px-16px-55px-16px)] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          <motion.div layout className="divide-y divide-gray-100">
            {renderRows(data)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
