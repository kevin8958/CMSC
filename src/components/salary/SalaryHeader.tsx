import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Label from "@/components/Label";
import Button from "@/components/Button";
import { LuPlus } from "react-icons/lu";

interface SalaryHeaderProps {
  members: any[];
  onAddClick: () => void; // ✅ Drawer 여는 함수 추가
}

function SalaryHeader({ members, onAddClick }: SalaryHeaderProps) {
  return (
    <FlexWrapper justify="between" items="end" classes="mt-4">
      <FlexWrapper items="center" gap={10}>
        <FlexWrapper direction="col" items="start" gap={1}>
          <Label text="총 인원" />
          <Typography variant="H3">{members.length}명</Typography>
        </FlexWrapper>
        <FlexWrapper direction="col" items="start" gap={1}>
          <Label text="총 지급액" />
          <Typography variant="H3">100,000원</Typography>
        </FlexWrapper>
        <FlexWrapper direction="col" items="start" gap={1}>
          <Label text="실 지급액" />
          <Typography variant="H3">100,000원</Typography>
        </FlexWrapper>
      </FlexWrapper>

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
    </FlexWrapper>
  );
}

export default SalaryHeader;
