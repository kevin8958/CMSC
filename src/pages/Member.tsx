import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Table from "@/components/Table";
import dayjs from "dayjs";
import type { ColumnDef } from "@tanstack/react-table";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useDialog } from "@/hooks/useDialog";
import { inviteMember } from "@/actions/inviteMember";
import { useAlert } from "@/components/AlertProvider";
import TextInput from "@/components/TextInput";
import { LuMail } from "react-icons/lu";

const parseRole = (role: string) => {
  switch (role) {
    case "super_admin":
      return "슈퍼 관리자";
    case "admin":
      return "관리자";
    case "user_a":
      return "일반회원A";
    case "user_b":
      return "회원B";
    default:
      return "알 수 없음";
  }
};

function Member() {
  const [members, setMembers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const { currentCompanyId } = useCompanyStore();
  const { openDialog } = useDialog();
  const { showAlert } = useAlert();

  const fetchMembers = async (page = 1, size = 10) => {
    if (!currentCompanyId) return;

    const from = (page - 1) * size;
    const to = from + size - 1;

    const { data, count, error } = await supabase
      .from("company_members")
      .select(
        `
      role,
      joined_at,
      created_at,
      profiles(nickname, email)
    `,
        { count: "exact" }
      )
      .eq("company_id", currentCompanyId)
      .range(from, to);

    if (error) {
      console.error("멤버 조회 오류:", error);
      return;
    }

    if (data) {
      setMembers(
        data.map((m: any) => ({
          nickname: m.profiles?.nickname ?? "-",
          email: m.profiles?.email ?? "-",
          joined_at: m.joined_at,
          created_at: m.created_at,
          role: m.role ?? "-",
          etc: "-",
        }))
      );
      setTotal(count || 0);
    }
  };

  useEffect(() => {
    fetchMembers(1, 10);
  }, [currentCompanyId]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "nickname",
      header: "닉네임",
      cell: ({ row }) => (
        <Typography
          variant="B2"
          classes={row.original.joined_at ? "" : "!text-primary-600"}
        >
          {row.original.nickname || "-"}
        </Typography>
      ),
    },
    {
      accessorKey: "email",
      header: "이메일",
      cell: ({ row }) => (
        <Typography
          variant="B2"
          classes={row.original.joined_at ? "" : "!text-primary-600"}
        >
          {row.original.email || "-"}
        </Typography>
      ),
    },
    {
      accessorKey: "joined_at",
      header: "가입일",
      cell: ({ row }) => (
        <FlexWrapper gap={2} items="center">
          <Typography
            variant="B2"
            classes={row.original.joined_at ? "" : "!text-primary-600"}
          >
            {row.original.joined_at
              ? dayjs(row.original.joined_at).format("YYYY-MM-DD")
              : "초대중"}
          </Typography>
          {!row.original.joined_at && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  console.log(
                    row.original.created_at,
                    "@@@?",
                    dayjs().diff(dayjs(row.original.created_at), "day")
                  );
                  if (
                    row.original.created_at &&
                    dayjs().diff(dayjs(row.original.created_at), "day") < 1
                  ) {
                    showAlert(`초대 메일은 24시간 내에 재전송할 수 없습니다.`, {
                      type: "warning",
                      durationMs: 3000,
                    });
                    return;
                  }
                  await inviteMember(
                    useCompanyStore.getState().currentCompanyId!,
                    row.original.email
                  );

                  showAlert(`초대 메일이 재전송되었습니다.`, {
                    type: "success",
                    durationMs: 3000,
                  });
                } catch (err: any) {
                  showAlert(
                    err?.message || "초대 메일 재전송 중 오류가 발생했습니다.",
                    {
                      type: "danger",
                      durationMs: 3000,
                    }
                  );
                }
              }}
            >
              <LuMail className="text-primary-600" />
            </Button>
          )}
        </FlexWrapper>
      ),
    },
    {
      accessorKey: "role",
      header: "권한",
      cell: ({ row }) => (
        <Typography
          variant="B2"
          classes={row.original.joined_at ? "" : "!text-primary-600"}
        >
          {parseRole(row.original.role) || "-"}
        </Typography>
      ),
    },
  ];

  function InviteDialogBody() {
    const { close } = useDialog();
    const [email, setEmail] = useState("");

    const onSubmit = async (email: string) => {
      try {
        if (!currentCompanyId) throw new Error("회사를 찾을 수 없습니다.");
        const member = await inviteMember(currentCompanyId, email);
        if (member) {
          showAlert(`${email}로 초대 전송이 완료되었습니다.`, {
            type: "success",
            durationMs: 3000,
          });
        }
        fetchMembers();
        close(true);
      } catch (err: any) {
        showAlert(err?.message || "회사 생성 중 오류가 발생했습니다.", {
          type: "danger",
          durationMs: 3000,
        });
      }
    };
    return (
      <FlexWrapper direction="col" gap={4} classes="w-full">
        <TextInput
          label="이메일"
          id="email"
          classes="w-full"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          size="lg"
          variant="contain"
          classes="w-full"
          disabled={email.trim() === ""}
          onClick={() => {
            onSubmit(email);
          }}
        >
          초대하기
        </Button>
      </FlexWrapper>
    );
  }

  return (
    <>
      <FlexWrapper justify="between" items="center">
        <FlexWrapper gap={1} items="end">
          <Typography variant="H3">멤버관리</Typography>
          <Badge color="primary" size="md">
            {total}
          </Badge>
        </FlexWrapper>
        <Button
          variant="contain"
          size="md"
          classes="gap-1 !px-3"
          onClick={async () => {
            await openDialog({
              title: "멤버 초대",
              hideBottom: true,
              body: <InviteDialogBody />,
            });
          }}
        >
          <AiOutlineUserAdd className="text-lg" />
          초대하기
        </Button>
      </FlexWrapper>

      <FlexWrapper classes="h-[calc(100%-36px-16px)] mt-4">
        <Table
          data={members || []}
          columns={columns}
          hideSize
          totalCount={total}
          onPageChange={fetchMembers}
        />
      </FlexWrapper>
    </>
  );
}

export default Member;
