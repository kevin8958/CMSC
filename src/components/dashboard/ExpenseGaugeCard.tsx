import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import { useState } from "react";

interface ExpenseGaugeCardProps {
  fixed: number;
  variable: number;
  other: number;
}

export default function ExpenseGaugeCard({
  fixed,
  variable,
  other,
}: ExpenseGaugeCardProps) {
  const [currentTab, setCurrentTab] = useState<"fixed" | "variable" | "other">(
    "fixed"
  );

  const data = [
    { id: "fixed", name: "고정비", value: fixed },
    { id: "variable", name: "변동비", value: variable },
    { id: "other", name: "기타", value: other },
  ];

  const COLORS = ["#5A4FF4", "#4ACCCA", "#E5E7EB"];

  return (
    <FlexWrapper
      direction="col"
      items="center"
      classes="w-full p-4 h-[360px]"
      gap={6}
    >
      {/* 반원 게이지 */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            startAngle={360}
            endAngle={0}
            innerRadius="60%"
            outerRadius="100%"
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index]}
                stroke="none"
                onClick={() => {
                  setCurrentTab(entry.id as "fixed" | "variable" | "other");
                }}
                style={{ cursor: "pointer" }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <FlexWrapper justify="between" items="center" classes="w-full" gap={0}>
        <FlexWrapper
          direction="col"
          gap={0}
          classes={
            currentTab === "fixed"
              ? "border-r flex-1 bg-gray-100 p-2"
              : "border-r flex-1 p-2"
          }
        >
          <div className="flex items-center gap-1">
            <span className="h-3 w-1.5 rounded bg-[#5A4FF4]" />
            <Typography variant="B2">고정비</Typography>
          </div>
          <Typography variant="H4">{fixed.toLocaleString()}원</Typography>
        </FlexWrapper>
        <FlexWrapper
          direction="col"
          gap={0}
          classes={
            currentTab === "variable"
              ? "border-r flex-1 bg-gray-100 p-2"
              : "border-r flex-1 p-2"
          }
        >
          <div className="flex items-center gap-1">
            <span className="h-3 w-1.5 rounded bg-[#4ACCCA]" />
            <Typography variant="B2">변동비</Typography>
          </div>
          <Typography variant="H4">{variable.toLocaleString()}원</Typography>
        </FlexWrapper>
        <FlexWrapper
          direction="col"
          gap={0}
          classes={
            currentTab === "other" ? "flex-1 bg-gray-100 p-2" : "flex-1  p-2"
          }
        >
          <div className="flex items-center gap-1">
            <span className="h-3 w-1.5 rounded bg-gray-300" />
            <Typography variant="B2">기타</Typography>
          </div>
          <Typography variant="H4">{other.toLocaleString()}원</Typography>
        </FlexWrapper>
      </FlexWrapper>
    </FlexWrapper>
  );
}
