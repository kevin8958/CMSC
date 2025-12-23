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

export default function PositionDoughnutChart({
  workers,
  onClickPosition,
}: PositionDoughnutChartProps) {
  const chartRef = useRef<any>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const positionData = useMemo(() => {
    const map: Record<string, number> = {};
    workers.forEach((w) => {
      const key = w.position?.trim() || "미지정";
      map[key] = (map[key] || 0) + 1;
    });

    // 오름차순 정렬 유지
    return Object.entries(map)
      .map(([position, count], index) => ({
        position,
        count,
        color: position === "미지정" ? GRAY : COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.count - a.count);
  }, [workers]);

  // ✅ 1. 차트 데이터 모양 설정 변경
  const chartData = {
    labels: positionData.map((p) => p.position),
    datasets: [
      {
        data: positionData.map((p) => p.count),
        backgroundColor: positionData.map((p) => p.color),
        hoverOffset: 10, // 호버 시 튀어나오는 정도도 약간 늘림
        borderWidth: 0,
        borderRadius: 20, // ✨ 각 값의 모서리를 둥글게 설정 (값을 높이면 더 둥글어짐)
        spacing: 3, // ✨ 둥근 모서리가 돋보이도록 각 영역 사이에 간격 추가
      },
    ],
  };

  // ✅ 2. 차트 옵션 변경 (두께 조절)
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "40%", // ✨ 기존 70%에서 40%로 변경하여 도넛을 훨씬 두껍게 만듦
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
        setHovered(positionData[elements[0].index].position);
      } else {
        setHovered(null);
      }
    },
    layout: {
      padding: 10, // spacing과 hoverOffset 때문에 잘리지 않도록 약간의 패딩 추가
    },
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-hidden bg-white rounded-xl border">
      {/* Header */}
      <FlexWrapper gap={2} items="center" classes="mb-4 shrink-0">
        <Typography variant="H4">멤버 구성</Typography>
        <Badge color="green" size="md">
          {workers.length}
        </Badge>
      </FlexWrapper>

      {workers.length > 0 ? (
        <div className="flex flex-row gap-6 flex-1 min-h-0">
          {/* Left: Chart Area (차트 컨테이너 크기 약간 조정) */}
          <div className="w-[40%] h-full flex items-center justify-center shrink-0">
            {/* max-h를 조금 늘려 두꺼운 차트가 잘 보이게 함 */}
            <div className="w-full aspect-square max-h-[180px]">
              <Doughnut ref={chartRef} data={chartData} options={options} />
            </div>
          </div>

          {/* Right: Scrollable List Area */}
          <div className="flex-1 h-full overflow-y-auto pr-6 scroll-thin">
            <div className="flex flex-col gap-0 pb-2">
              {positionData.map((item) => (
                <div
                  key={item.position}
                  className={`
                    flex items-center gap-2.5 p-2 rounded-lg transition-all cursor-pointer
                    ${
                      hovered === item.position
                        ? "bg-gray-50 translate-x-1"
                        : "hover:bg-gray-50"
                    }
                  `}
                  onMouseEnter={() => setHovered(item.position)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onClickPosition?.(item.position)}
                >
                  {/* 리스트 아이콘도 차트 모양에 맞춰 둥근 사각형으로 변경 */}
                  <span
                    className="shrink-0 size-3 rounded-md"
                    style={{ backgroundColor: item.color }}
                  />
                  <Typography
                    variant="B2"
                    classes={`truncate flex-1 ${
                      hovered === item.position
                        ? "font-bold text-primary-900"
                        : "text-gray-600"
                    }`}
                  >
                    {item.position}
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
          <p className="text-gray-400 text-sm">등록된 멤버가 없습니다</p>
        </div>
      )}
    </div>
  );
}
