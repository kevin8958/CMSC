import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { useEffect, useState } from "react";
import FlexWrapper from "@/layout/FlexWrapper";
import Button from "@/components/Button";
import Typography from "@/foundation/Typography";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const getBarThickness = (width: number) => {
  if (width < 640) return 16; // sm
  if (width < 1024) return 24; // md
  return 36; // lg+
};

export default function YearlyIncomeChart() {
  const { year, data, fetchYear, prevYear, nextYear } = useDashboardStore();
  const [width, setWidth] = useState(window.innerWidth);

  const barThickness = getBarThickness(width);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    fetchYear(year);
  }, []);

  const labels = data.map(
    (d) => Number(d.year_month.split("-")[1]).toString() + "월"
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "매출",
        data: data.map((d) => d.revenue),
        backgroundColor: "#47D0A2",
        borderRadius: 99,
        borderSkipped: false,
        barThickness,
      },
      {
        label: "매입",
        data: data.map((d) => d.total_purchase),
        backgroundColor: "#E56F8C",
        borderRadius: 99,
        borderSkipped: false,
        barThickness,
      },
    ],
  };
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 100,

    animation: {
      duration: 600,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) =>
            `${ctx.dataset.label}: ${Number(ctx.raw).toLocaleString()}원`,
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false, // ✅ 세로 grid 제거
        },
        border: {
          display: false, // ✅ x축 baseline 제거
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          display: false, // ✅ 가로 grid 제거
        },
        border: {
          display: false, // ✅ y축 축선 제거
        },
        ticks: {
          color: "#6B7280",
          callback: (v: any) => `${Number(v).toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="w-full bg-white p-4 pb-2 h-full min-h-[300px] flex flex-col justify-between gap-2 mb-[60px] sm:mb-4 pr-6">
      {/* 연도 컨트롤 */}
      <FlexWrapper justify="between" items="center" classes="w-full">
        <Typography variant="H4">매출매입</Typography>
        <FlexWrapper justify="center" items="center" gap={2}>
          <Button size="sm" variant="clear" onClick={prevYear}>
            <LuChevronLeft className="text-lg" />
          </Button>

          <Typography variant="H3">{year}</Typography>

          <Button size="sm" variant="clear" onClick={nextYear}>
            <LuChevronRight className="text-lg" />
          </Button>
        </FlexWrapper>
      </FlexWrapper>

      {/* 차트 */}
      <div className="flex-1 max-h-[420px]">
        <Bar key={width} data={chartData} options={options} />
      </div>
    </div>
  );
}
