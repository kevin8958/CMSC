import { useMemo, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Badge from "@/components/Badge";
import { LuChartPie } from "react-icons/lu";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PositionDoughnutChartProps {
  workers: Worker.Worker[];
  onClickPosition?: (position: string) => void;
}
const COLORS = [
  "#6EC8B2", // Soft Green
  "#8BBEE8", // Soft Blue
  "#BDA6E8", // Soft Purple
  "#F2C28C", // Soft Orange
  "#E8A6B8", // Soft Pink
  "#A7B4C2", // Soft Gray-Blue
  "#9ED1C7", // Soft Mint
];
const GRAY = "#E5E7EB";

export default function PositionDoughnutChart({
  workers,
  onClickPosition,
}: PositionDoughnutChartProps) {
  const chartRef = useRef<any>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // -------------------------------------------------------
  // 1) 직급 그룹 + 카운트
  // -------------------------------------------------------
  const positionData = useMemo(() => {
    const map: Record<string, number> = {};

    workers.forEach((w) => {
      const key = w.position?.trim() || "미지정";
      map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map).map(([position, count], index) => ({
      position,
      count,
      color: position === "미지정" ? GRAY : COLORS[index % COLORS.length],
    }));
  }, [workers]);

  // -------------------------------------------------------
  // 2) 도넛 차트 데이터
  // -------------------------------------------------------
  const chartData = {
    labels: positionData.map((p) => p.position),
    datasets: [
      {
        data: positionData.map((p) => p.count),
        backgroundColor: positionData.map((p) => p.color),
        hoverOffset: 16,
        borderWidth: 0,
      },
    ],
  };

  // -------------------------------------------------------
  // 3) 차트 옵션
  // -------------------------------------------------------
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
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
        callbacks: {
          title: (ctx: any) => ctx[0].label,
          label: (ctx: any) => `${ctx.raw}명`,
        },
      },
    },
    onHover: (_event: any, elements: any[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        setHovered(positionData[index].position);
      } else {
        setHovered(null);
      }
    },
    onClick: (_event: any, elements: any[]) => {
      if (elements.length === 0) return;
      const index = elements[0].index;
      const selected = positionData[index].position;
      onClickPosition?.(selected);
    },
  };

  return (
    <div className="h-[288px] flex flex-col w-full p-4">
      {/* Header */}
      <FlexWrapper gap={2} items="center">
        <Typography variant="H4">근로자</Typography>
        <Badge color="green" size="md">
          {workers.length}
        </Badge>
      </FlexWrapper>

      {workers.length > 0 ? (
        <>
          {/* Doughnut */}
          <div className="flex-1 mb-4 max-h-[180px]">
            <Doughnut ref={chartRef} data={chartData} options={options} />
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 shrink-0">
            {positionData.map((item) => (
              <div
                key={item.position}
                className="flex items-center gap-2 text-sm cursor-pointer transition"
                onMouseEnter={() => setHovered(item.position)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onClickPosition?.(item.position)}
              >
                {/* 색상 사각형 */}
                <span
                  className={`inline-block size-4 rounded-sm ${
                    hovered === item.position ? "scale-110" : "scale-100"
                  } transition`}
                  style={{ backgroundColor: item.color }}
                />

                {/* 직급명 */}
                <span
                  className={`text-gray-700 ${
                    hovered === item.position ? "font-semibold" : ""
                  }`}
                >
                  {item.position}
                </span>

                {/* 인원수 */}
                <span className="text-gray-500 ml-auto">{item.count}명</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="h-[240px] flex flex-col items-center justify-center gap-2 p-6">
          <LuChartPie className="text-4xl text-gray-300" />
          <p className="text-gray-400 text-sm">등록된 근로자가 없습니다</p>
        </div>
      )}
    </div>
  );
}
