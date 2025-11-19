import { useState, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import FlexWrapper from "@/layout/FlexWrapper";
import ExpenseGaugeItem from "./ExpenseGaugeItem";
import ExpenseGaugeTable, { type ExpenseItem } from "./ExpenseGaugeTable";
import { useExpenseStore } from "@/stores/useExpenseStore";
import { TbMoodEmpty } from "react-icons/tb";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseGaugeCardProps {
  fixed: number;
  variable: number;
  other: number;
  onTabChange?: (tab: "fixed" | "variable" | "other") => void;
  onRowClick?: (data: ExpenseItem) => void;
  onPageChange: (nextPage: number) => void;
}

export default function ExpenseGaugeCard({
  fixed,
  variable,
  other,
  onTabChange,
  onRowClick,
  onPageChange,
}: ExpenseGaugeCardProps) {
  const [currentTab, setCurrentTab] = useState<"fixed" | "variable" | "other">(
    "fixed"
  );
  const chartRef = useRef<any>(null);

  const [hoveredId, setHoveredId] = useState<
    "fixed" | "variable" | "other" | null
  >(null);

  const { list } = useExpenseStore();
  const data = [
    { id: "fixed", name: "고정비", value: fixed, color: "#2563EB" },
    { id: "variable", name: "변동비", value: variable, color: "#3BAC87" },
    { id: "other", name: "기타", value: other, color: "#CBD5E0" },
  ];

  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: data.map((d) => d.color),
        hoverOffset: 16,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%", // 도넛 두께
    layout: {
      padding: {
        top: 10,
        bottom: 10,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        displayColors: false, // ● 색상박스 제거
        callbacks: {
          // 타이틀(고정비)의 텍스트만 slice 색상으로 변경
          title: (context: any) => {
            const index = context[0].dataIndex;
            return data[index].name;
          },
          titleColor: (context: any) => {
            const dataset = context.chart.data.datasets[0];
            const index = context[0].dataIndex;
            return dataset.backgroundColor[index]; // ← 타이틀 컬러!
          },
          // 둘째 줄: 값만
          label: (context: any) => {
            return `${(context.raw || 0).toLocaleString()}원`;
          },
        },
        boxWidth: 0, // ● 박스 완전히 제거
        boxHeight: 0,
        padding: 10,
      },
    },
    onHover: (_event: any, elements: any[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        setHoveredId(data[index].id as any);
      } else {
        setHoveredId(null);
      }
    },
    onClick: (_event: any, elements: any[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const id = data[index].id as "fixed" | "variable" | "other";
        handleChangeTab(id);
      }
    },
  };

  const handleChangeTab = (tab: "fixed" | "variable" | "other") => {
    setCurrentTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };
  const handleItemHover = (id: "fixed" | "variable" | "other" | null) => {
    setHoveredId(id);

    const chart = chartRef.current;
    if (!chart) return;

    if (id === null) {
      chart.setActiveElements([]); // hover 초기화
      chart.tooltip.setActiveElements([], { x: 0, y: 0 });
      chart.update();
      return;
    }

    const index = data.findIndex((d) => d.id === id);
    if (index === -1) return;

    chart.setActiveElements([{ datasetIndex: 0, index }]);

    // tooltip을 차트 중앙 근처로 띄우기
    chart.tooltip.setActiveElements([{ datasetIndex: 0, index }], {
      x: chart.chartArea.width / 2,
      y: chart.chartArea.height / 2,
    });

    chart.update();
  };

  const tableData: ExpenseItem[] = list
    .filter((item) => item.category === currentTab)
    .map((item) => ({
      id: String(item.id),
      date: item.date,
      method: item.method,
      place: item.place,
      amount: item.amount,
    }));

  return (
    <FlexWrapper
      direction="col"
      items="center"
      classes="w-full relative"
      gap={2}
    >
      <div className="relative w-full h-[180px]">
        {fixed + variable + other > 0 ? (
          <Doughnut ref={chartRef} data={chartData} options={options} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-6">
            <TbMoodEmpty className="text-4xl text-gray-300" />
            <p className="text-gray-400">데이터가 없습니다</p>
          </div>
        )}
      </div>
      {/* 하단 항목 */}
      <FlexWrapper justify="between" items="center" classes="w-full" gap={0}>
        {data.map((item, idx) => (
          <ExpenseGaugeItem
            key={item.id}
            id={item.id as any}
            label={item.name}
            value={item.value}
            color={item.color}
            active={currentTab === item.id}
            hovered={hoveredId === item.id}
            onClick={(id) => handleChangeTab(id)}
            onHover={(id) => handleItemHover(id)}
            noBorder={idx === data.length - 1}
          />
        ))}
      </FlexWrapper>
      <ExpenseGaugeTable
        data={tableData}
        onRowClick={onRowClick}
        onPageChange={onPageChange}
      />
    </FlexWrapper>
  );
}
