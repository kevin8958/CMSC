import Typography from "@/foundation/Typography";
import FlexWrapper from "@/layout/FlexWrapper";
import Table from "@/components/Table";
import type { ColumnDef } from "@tanstack/react-table";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { useState, useEffect } from "react";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useDialog } from "@/hooks/useDialog";
import { useAlert } from "@/components/AlertProvider";
import TextInput from "@/components/TextInput";
import { motion } from "motion/react";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

function Company() {
  const { openDialog } = useDialog();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { total, loading, companies, fetchCompanies, createCompany } =
    useCompanyStore();

  useEffect(() => {
    fetchCompanies(1, 10);
  }, []);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "회사명",
      cell: ({ row }) => (
        <Typography variant="B2">{row.original.name || "-"}</Typography>
      ),
    },
    {
      accessorKey: "member_count",
      header: "멤버 수",
      cell: ({ row }) => (
        <Typography variant="B2">{row.original.member_count ?? 0}명</Typography>
      ),
    },
    {
      accessorKey: "created_at",
      header: "생성일",
      cell: ({ row }) => (
        <Typography variant="B2">
          {row.original.created_at
            ? new Date(row.original.created_at).toLocaleDateString()
            : "-"}
        </Typography>
      ),
    },
  ];

  function AddDialogBody() {
    const { close } = useDialog();
    const [companyName, setCompanyName] = useState("");

    const onSubmit = async (companyName: string) => {
      try {
        const company = await createCompany(companyName);
        if (company) {
          showAlert(`회사 "${company.name}"가 생성되었습니다.`, {
            type: "success",
            durationMs: 3000,
          });
        }
        fetchCompanies();
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
          label="회사 이름"
          id="companyName"
          classes="w-full"
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <Button
          size="lg"
          variant="contain"
          classes="w-full"
          disabled={companyName.trim() === ""}
          onClick={() => {
            onSubmit(companyName);
          }}
        >
          추가하기
        </Button>
      </FlexWrapper>
    );
  }

  return (
    <>
      <FlexWrapper justify="between" items="center">
        <FlexWrapper gap={2} items="end">
          <Typography variant="H3">회사관리</Typography>
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
              title: "회사 추가",
              hideBottom: true,
              body: <AddDialogBody />,
            });
          }}
        >
          <LuPlus className="text-lg" />
          추가하기
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
            data={companies || []}
            columns={columns}
            hideSize
            totalCount={total}
            onPageChange={fetchCompanies}
            onRowClick={(row) => {
              navigate(`/company/${row.id}`); // ✅ 회사 상세 페이지로 이동
            }}
          />
        </FlexWrapper>
      )}
    </>
  );
}

export default Company;
