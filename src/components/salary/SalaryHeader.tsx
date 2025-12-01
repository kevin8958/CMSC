import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Label from "@/components/Label";
import Button from "@/components/Button";
import { LuPlus } from "react-icons/lu";
import { useSalaryStore } from "@/stores/useSalaryStore";
import { useAuthStore } from "@/stores/authStore";

interface SalaryHeaderProps {
  onAddClick: () => void; // ✅ Drawer 여는 함수 추가
}

function SalaryHeader({ onAddClick }: SalaryHeaderProps) {
  const { total, totalAmountSum = 0, netAmountSum = 0 } = useSalaryStore();
  const { role } = useAuthStore();

  return (
    <FlexWrapper
      justify="between"
      items="start"
      direction="col"
      classes="mt-4 sm:flex-row sm:items-end"
    >
      <FlexWrapper items="center" gap={10}>
        <FlexWrapper direction="col" items="start" gap={1}>
          <Label text="총 인원" />
          <Typography variant="H4" classes="md:text-[24px]">
            {total.toLocaleString()}명
          </Typography>
        </FlexWrapper>
        <FlexWrapper direction="col" items="start" gap={1}>
          <Label text="총 지급액" />
          <Typography variant="H4" classes="md:text-[24px]">
            {totalAmountSum.toLocaleString()}원
          </Typography>
        </FlexWrapper>
        <FlexWrapper direction="col" items="start" gap={1}>
          <Label text="실 지급액" />
          <Typography variant="H4" classes="md:text-[24px]">
            {netAmountSum.toLocaleString()}원
          </Typography>
        </FlexWrapper>
      </FlexWrapper>

      {role === "admin" && (
        <Button
          variant="contain"
          color="green"
          size="md"
          classes="gap-1 !px-3"
          onClick={onAddClick}
        >
          <LuPlus className="text-lg" />
          급여 추가
        </Button>
      )}
    </FlexWrapper>
  );
}

export default SalaryHeader;
