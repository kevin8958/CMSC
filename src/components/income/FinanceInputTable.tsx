import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuSave, LuChevronDown, LuChevronRight } from "react-icons/lu";
import classNames from "classnames";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import CustomDatePicker from "@/components/DatePicker";
import dayjs from "dayjs";

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
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(
    dayjs().toDate()
  );
  const [openRows, setOpenRows] = useState<Record<string, boolean>>(() => {
    const allIds: Record<string, boolean> = {};
    const traverse = (rows: Row[]) => {
      rows.forEach((r) => {
        if (r.children?.length) {
          allIds[r.id] = true; // 기본적으로 모두 열림
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

  const renderRows = (rows: Row[], level = 0): React.ReactNode => {
    return rows.map((row) => {
      const isOpen = openRows[row.id] ?? true;
      const hasChildren = !!row.children?.length;

      return (
        <div key={row.id} className="flex flex-col">
          {/* 🧩 단일 Row (layout="position"으로 전체 리렌더 방지) */}
          <motion.div
            layout="position"
            className="flex items-center border-b border-gray-200 text-sm justify-between"
          >
            {/* Title */}
            <div
              className={classNames("flex items-center gap-2 py-2 px-3 ", {
                "pl-8": level > 0,
                "pl-4": level === 0,
              })}
            >
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
            </div>

            {/* Value */}
            <div className="flex items-center justify-end pr-4 py-2 shrink-0 h-[48px]">
              {editMode ? (
                <TextInput
                  classes="!w-[140px] input-number-clean text-right"
                  value={row.value}
                  placeholder="0"
                  size="sm"
                  type="number"
                  onChange={(e) => handleValueChange(row.id, e.target.value)}
                />
              ) : (
                <span className="text-primary-700 !font-semibold text-base">
                  {row.value ? Number(row.value).toLocaleString() : "0"}
                </span>
              )}
              <span className="ml-1 text-gray-500">{row.unit}</span>
            </div>
          </motion.div>

          {/* 🧩 하위 행 애니메이션 */}
          <AnimatePresence initial={false}>
            {isOpen && row.children && (
              <motion.div
                key={`${row.id}-children`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                {renderRows(row.children, level + 1)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col border border-gray-300 rounded-xl bg-white shadow-custom-dark overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="font-semibold text-gray-800">
          <CustomDatePicker
            classes="w-[200px]"
            variant="outline"
            size="sm"
            type="month"
            isMonthPicker
            dateFormat="YYYY.MM.dd"
            value={selectedMonth}
            onChange={(date) => setSelectedMonth(date)}
          />
        </h2>
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
              취소
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
        <motion.div layout="position" className="divide-y divide-gray-100 pb-6">
          {renderRows(data)}
        </motion.div>
      </div>
    </div>
  );
}
