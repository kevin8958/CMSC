import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Table from "@/components/Table";
import dayjs from "dayjs";
import type { ColumnDef } from "@tanstack/react-table";
import Badge from "@/components/Badge";

const propsColumn: ColumnDef<any>[] = [
  {
    accessorKey: "nickname",
    header: "닉네임",
  },
  {
    accessorKey: "email",
    header: "이메일",
  },
  {
    accessorKey: "invitedAt",
    header: "초대일",
  },
  {
    accessorKey: "type",
    header: "타입",
  },
  {
    accessorKey: "etc",
    header: " ",
  },
];

const propsData = Array.from({ length: 100 }, (_, i) => ({
  id: String(i + 1),
  nickname: `닉네임 ${i + 1}`,
  email: `user${i + 1}@test.com`,
  invitedAt: dayjs().format("YYYY-MM-DD"),
  type: i % 2 === 0 ? "관리자" : "일반",
  etc: "-",
}));

function Member() {
  return (
    <>
      <FlexWrapper justify="between" items="center">
        <FlexWrapper gap={1} items="end">
          <Typography variant="H3">멤버관리</Typography>
          <Badge color="primary" size="md">
            17
          </Badge>
        </FlexWrapper>
      </FlexWrapper>
      <FlexWrapper classes="h-[calc(100%-36px-16px)] mt-4">
        <Table data={propsData || []} columns={propsColumn} hideSize />
      </FlexWrapper>
    </>
  );
}
export default Member;
