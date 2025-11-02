import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Table from "@/components/Table";
import dayjs from "dayjs";
import type { ColumnDef } from "@tanstack/react-table";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useDialog } from "@/hooks/useDialog";
import { inviteMember, deleteMember } from "@/actions/memberActions";
import { useAlert } from "@/components/AlertProvider";
import TextInput from "@/components/TextInput";
import { motion } from "motion/react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { LuTrash2 } from "react-icons/lu";

const parseRole = (role: string) => {
  switch (role) {
    case "super_admin":
      return "최고 관리자";
    case "admin":
      return "관리자";
    case "user_a":
      return "유저A";
    case "user_b":
      return "유저B";
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
  const [loading, setLoading] = useState(false);

  const fetchMembers = async (page = 1, size = 10) => {
    if (!currentCompanyId) return;
    setLoading(true);

    const from = (page - 1) * size;
    const to = from + size - 1;

    const { data, count, error } = await supabase
      .from("company_members")
      .select(
        `
      user_id,
      role,
      joined_at,
      created_at,
      profiles(nickname, email)
    `,
        { count: "exact" }
      )
      .eq("company_id", currentCompanyId)
      .eq("deleted", false)
      .range(from, to);

    if (error) {
      console.error("멤버 조회 오류:", error);
      return;
    }

    if (data) {
      setMembers(
        data.map((m: any) => ({
          user_id: m.user_id,
          nickname: m.profiles?.nickname ?? "-",
          email: m.profiles?.email ?? "-",
          joined_at: m.joined_at,
          created_at: m.created_at,
          role: m.role ?? "-",
          etc: "-",
        }))
      );
      setTotal(count || 0);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(1, 10);
  }, [currentCompanyId]);

  const etcDropdownItems = [
    {
      type: "item",
      id: "delete",
      icon: <LuTrash2 className="text-base text-danger" />,
      label: <p className="text-danger">삭제하기</p>,
    },
  ] as Common.DropdownItem[];

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "nickname",
      header: "닉네임",
      cell: ({ row }) => (
        <Typography
          variant="B2"
          classes={row.original.joined_at ? "" : "!text-gray-400"}
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
          classes={row.original.joined_at ? "" : "!text-gray-400"}
        >
          {row.original.email || "-"}
        </Typography>
      ),
    },
    {
      accessorKey: "role",
      header: "권한",
      cell: ({ row }) => (
        <Typography
          variant="B2"
          classes={row.original.joined_at ? "" : "!text-gray-400"}
        >
          {parseRole(row.original.role) || "-"}
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
            classes={row.original.joined_at ? "" : "!text-gray-400"}
          >
            {row.original.joined_at
              ? dayjs(row.original.joined_at).format("YYYY-MM-DD")
              : "초대중"}
          </Typography>
        </FlexWrapper>
      ),
    },
    {
      accessorKey: "etc",
      header: "",
      size: 24,
      minSize: 24,
      maxSize: 24,
      cell: ({ row }) => (
        <Dropdown
          buttonVariant="clear"
          dialogPosition="right"
          hideDownIcon
          items={etcDropdownItems}
          onChange={async (val) => {
            if (val === "delete") {
              await openDialog({
                title: "삭제하시겠습니까?",
                message: `${row.original.email} 멤버를 이 회사에서 제거합니다.`,
                confirmText: "삭제",
                cancelText: "취소",
                state: "danger",
                onConfirm: async () => {
                  try {
                    await deleteMember(
                      useCompanyStore.getState().currentCompanyId!,
                      row.original.user_id
                    );
                    fetchMembers();
                    showAlert("삭제되었습니다.", {
                      type: "success",
                      durationMs: 3000,
                    });
                    return true;
                  } catch (err: any) {
                    showAlert(err?.message || "삭제 중 오류가 발생했습니다.", {
                      type: "danger",
                      durationMs: 3000,
                    });
                    return false;
                  }
                },
              });
            }
          }}
          dialogWidth={140}
          buttonItem={
            <HiOutlineDotsVertical className="text-xl text-gray-900" />
          }
          buttonClasses="!font-normal text-primary-900 !h-8 !border-primary-100"
        />
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
        <FlexWrapper gap={2} items="end">
          <Typography variant="H3">멤버관리</Typography>
          <Badge color="green" size="md">
            {total}
          </Badge>
        </FlexWrapper>
        <Button
          variant="contain"
          color="green"
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

      {loading ? (
        <FlexWrapper
          classes="h-[calc(100%-36px-16px)]"
          justify="center"
          items="center"
        >
          <motion.div
            className="size-4 rounded-full border-[3px] border-primary-900 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 1,
            }}
          />
        </FlexWrapper>
      ) : (
        <FlexWrapper classes="h-[calc(100%-36px-16px)] mt-4">
          <Table
            data={members || []}
            columns={columns}
            hideSize
            totalCount={total}
            onPageChange={fetchMembers}
          />
        </FlexWrapper>
      )}
    </>
  );
}

export default Member;
