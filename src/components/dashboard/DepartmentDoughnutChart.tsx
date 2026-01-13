import { useMemo, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Badge from "@/components/Badge";
import { LuChartPie } from "react-icons/lu";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DepartmentDoughnutChartProps {
  workers: Worker.Worker[];
  onClickDepartment?: (department: string) => void;
}

const COLORS = [
  "#47D0A2",
  "#E56F8C",
  "#5A8DEE",
  "#FEB139",
  "#9A7AF3",
  "#4DB6AC",
  "#FF8A65",
  "#64B5F6",
  "#BA68C8",
  "#81C784",
  "#FFD54F",
  "#4FC3F7",
  "#FFB74D",
  "#D4E157",
  "#7986CB",
  "#F06292",
  "#4DD0E1",
  "#AED581",
  "#9575CD",
  "#A1887F",
];
const GRAY = "#E5E7EB";

export default function DepartmentDoughnutChart({
  workers,
  onClickDepartment,
}: DepartmentDoughnutChartProps) {
  const chartRef = useRef<any>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // ✅ 부서(department) 데이터 추출 로직으로 변경
  const departmentData = useMemo(() => {
    const map: Record<string, number> = {};
    workers.forEach((w) => {
      // position -> department로 변경
      const key = w.department?.trim() || "미지정";
      map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map)
      .map(([department, count], index) => ({
        department,
        count,
        color: department === "미지정" ? GRAY : COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.count - a.count);
  }, [workers]);

  const chartData = {
    labels: departmentData.map((d) => d.department),
    datasets: [
      {
        data: departmentData.map((d) => d.count),
        backgroundColor: departmentData.map((d) => d.color),
        hoverOffset: 10,
        borderWidth: 0,
        borderRadius: 20,
        spacing: 3,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "40%",
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (ctx: any) => `${ctx.label}: ${ctx.raw}명`,
        },
      },
    },
    onHover: (_event: any, elements: any[]) => {
      if (elements.length > 0) {
        setHovered(departmentData[elements[0].index].department);
      } else {
        setHovered(null);
      }
    },
    layout: {
      padding: 10,
    },
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-hidden bg-white rounded-xl border">
      {/* Header: 부서 구성으로 타이틀 변경 가능 */}
      <FlexWrapper gap={2} items="center" classes="mb-4 shrink-0">
        <Typography variant="H4">부서 구성</Typography>
        <Badge color="green" size="md">
          {workers.length}
        </Badge>
      </FlexWrapper>

      {workers.length > 0 ? (
        <div className="flex flex-row gap-6 flex-1 min-h-0">
          {/* Left: Chart Area */}
          <div className="w-[40%] h-full flex items-center justify-center shrink-0">
            <div className="w-full aspect-square max-h-[180px]">
              <Doughnut ref={chartRef} data={chartData} options={options} />
            </div>
          </div>

          {/* Right: Scrollable List Area */}
          <div className="flex-1 h-full overflow-y-auto pr-2 scroll-thin">
            <div className="flex flex-col gap-0 pb-2">
              {departmentData.map((item) => (
                <div
                  key={item.department}
                  className={`
                    flex items-center gap-2.5 p-2 rounded-lg transition-all cursor-pointer
                    ${
                      hovered === item.department
                        ? "bg-gray-50 translate-x-1"
                        : "hover:bg-gray-50"
                    }
                  `}
                  onMouseEnter={() => setHovered(item.department)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onClickDepartment?.(item.department)}
                >
                  <span
                    className="shrink-0 size-3 rounded-md"
                    style={{ backgroundColor: item.color }}
                  />
                  <Typography
                    variant="B2"
                    classes={`truncate flex-1 ${
                      hovered === item.department
                        ? "font-bold text-primary-900"
                        : "text-gray-600"
                    }`}
                  >
                    {item.department}
                  </Typography>
                  <Typography
                    variant="C1"
                    classes="text-gray-400 font-medium shrink-0"
                  >
                    {item.count}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <LuChartPie className="text-4xl text-gray-200" />
          <p className="text-gray-400 text-sm">데이터가 없습니다</p>
        </div>
      )}
    </div>
  );
}
