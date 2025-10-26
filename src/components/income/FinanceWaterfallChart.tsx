import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<number, string> & { payload?: any[] }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // 원본 데이터 접근
    const name = data.title ?? data.name ?? "";
    const value = payload[0].value?.toLocaleString() + "원";
    return (
      <div
        style={{
          background: "white",
          border: "1px solid #d1d5db",
          borderRadius: 8,
          padding: "6px 8px",
          fontSize: 12,
        }}
      >
        <div style={{ color: "#6b7280" /* gray-500 */ }}>{name}</div>
        <span style={{ fontWeight: "bold" }}>{value}</span>
      </div>
    );
  }
  return null;
};

const FinanceWaterfallChart = ({ data }: { data: any[] }) => {
  // value를 숫자로 변환
  const numericData = data.map((item) => ({
    ...item,
    value: Number(item.value) || 0,
  }));

  // 누적 값 계산
  let cumulative = 0;
  const formatted = numericData.map((item) => {
    const start = cumulative;
    cumulative += item.value;
    return { ...item, start, end: cumulative };
  });

  return (
    <div className="h-[calc(100dvh-76px-36px-16px-16px)] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={formatted}>
          {/* 격자선 유지 (가로만) */}
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="#e5e7eb"
          />

          {/* X축 */}
          <XAxis
            dataKey="title"
            tick={{ fontSize: 12, fill: "#4b5563" }}
            axisLine={false}
            tickLine={false}
          />

          {/* ✅ Y축 라인/텍스트 조정 */}
          <YAxis
            tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`}
            axisLine={false} // 축선 제거
            tickLine={false} // 눈금선 제거
            tick={{ fontSize: 12, fill: "#9ca3af" }} // 텍스트 크기/색상
            width={64} // 좌측 여백 조정
          />

          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} />

          {/* Bar (막대) */}
          <Bar
            dataKey="value"
            barSize={36}
            shape={(props: any) => {
              const { x, y, width, height, payload } = props;
              const isPositive = payload.value >= 0;
              const color = isPositive ? "#3b82f6" : "#ef4444";

              const radius = 8;

              if (isPositive) {
                // 상단만 둥글게
                return (
                  <path
                    d={`
            M${x},${y + height}
            L${x},${y + radius}
            Q${x},${y} ${x + radius},${y}
            L${x + width - radius},${y}
            Q${x + width},${y} ${x + width},${y + radius}
            L${x + width},${y + height}
            Z
          `}
                    fill={color}
                  />
                );
              } else {
                // 하단만 둥글게
                return (
                  <path
                    d={`
            M${x},${y}
            L${x},${y + height - radius}
            Q${x},${y + height} ${x + radius},${y + height}
            L${x + width - radius},${y + height}
            Q${x + width},${y + height} ${x + width},${y + height - radius}
            L${x + width},${y}
            Z
          `}
                    fill={color}
                  />
                );
              }
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceWaterfallChart;
