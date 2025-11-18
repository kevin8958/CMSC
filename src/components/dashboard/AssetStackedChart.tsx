import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import dayjs from "dayjs";
import Typography from "@/foundation/Typography";

interface AssetStackedChartProps {
  selectedMonth: Date;
  data: {
    month: string; // yyyy-MM
    netAsset: number; // 순자산
    cash: number; // 잔액
    etc: number; // 기타자산
  }[];
}

export default function AssetStackedChart({
  selectedMonth,
  data,
}: AssetStackedChartProps) {
  // ❗ 왼쪽→오른쪽: 과거 → 현재 순으로 정렬
  const monthList = [];
  for (let i = data.length - 1; i >= 0; i--) {
    monthList.push(dayjs(selectedMonth).subtract(i, "month").format("YYYY-MM"));
  }

  const chartData = monthList.map((m) => {
    const row = data.find((d) => d.month === m);
    return {
      month: dayjs(m).format("MM월"),
      netAsset: row?.netAsset ?? 0,
      cash: row?.cash ?? 0,
      etc: row?.etc ?? 0,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />

        <Bar dataKey="netAsset" stackId="a" fill="#3BAC87" radius={0} />

        <Bar dataKey="cash" stackId="a" fill="#8FE2C6" radius={0} />

        <Bar dataKey="etc" stackId="a" fill="#D8F5EA" radius={0} />
      </BarChart>
    </ResponsiveContainer>
  );
}
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || payload.length === 0) return null;

  const formatName = (name: string) => {
    if (name === "netAsset") return "순자산";
    if (name === "cash") return "잔액";
    if (name === "etc") return "기타자산";
    return name;
  };

  // 원하는 순서대로 정렬
  const ORDER = ["etc", "cash", "netAsset"] as const;
  const sorted = [...payload].sort(
    (a, b) => ORDER.indexOf(a.dataKey as any) - ORDER.indexOf(b.dataKey as any)
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow p-2 text-sm">
      <Typography variant="B2" classes="font-semibold mb-2">
        {label}
      </Typography>
      {sorted.map((item) => (
        <div key={item.name} className="flex items-center gap-2 py-[2px]">
          {/* 색상 박스 */}
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: item.color }}
          />

          {/* 이름 */}
          <span className="text-gray-900">{formatName(item.dataKey)}</span>

          {/* 금액 */}
          <span className="ml-auto font-medium text-gray-900">
            {Number(item.value).toLocaleString()}원
          </span>
        </div>
      ))}
    </div>
  );
};
