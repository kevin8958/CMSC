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
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Dropdown from "@/components/Dropdown";
import { deleteCompany } from "@/actions/companyActions";
import TableSkeleton from "@/layout/TableSkeleton";

function Company() {
  const { openDialog } = useDialog();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { total, loading, companies, fetchCompanies, createCompany } =
    useCompanyStore();

  useEffect(() => {
    fetchCompanies(1, 10);
  }, []);

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
    {
      accessorKey: "etc",
      header: "",
      size: 24,
      minSize: 24,
      maxSize: 24,
      cell: ({ row }) => (
        <div
          onClick={(e) => {
            e.stopPropagation(); // ✅ 여기 추가
          }}
        >
          <Dropdown
            buttonVariant="clear"
            dialogPosition="right"
            hideDownIcon
            items={etcDropdownItems}
            onChange={async (val) => {
              if (val === "delete") {
                await openDialog({
                  title: "삭제하시겠습니까?",
                  message: `${row.original.name} 회사를 삭제합니다.`,
                  confirmText: "삭제",
                  cancelText: "취소",
                  state: "danger",
                  onConfirm: async () => {
                    try {
                      await deleteCompany(row.original.id);
                      fetchCompanies();
                      showAlert("삭제되었습니다.", {
                        type: "success",
                        durationMs: 3000,
                      });
                      return true;
                    } catch (err: any) {
                      showAlert(
                        err?.message || "삭제 중 오류가 발생했습니다.",
                        {
                          type: "danger",
                          durationMs: 3000,
                        }
                      );
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
        </div>
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
          classes="h-[calc(100%-36px-16px)] mt-4"
          justify="center"
          items="start"
        >
          <TableSkeleton rows={8} columns={6} />
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
