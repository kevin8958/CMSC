import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useCompanyStore } from "@/stores/useCompanyStore";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Button from "@/components/Button";
import { LuChevronLeft, LuSettings } from "react-icons/lu";
import CompanyMember from "@/components/company/CompanyMember";
import { motion } from "motion/react";
import { useMemberStore } from "@/stores/useMemberStore";
import dayjs from "dayjs";
import { useDialog } from "@/hooks/useDialog";
import MenuSettingDialogBody from "./MenuSettingDialogBody";

function CompanyDetail() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { openDialog } = useDialog();

  // stores
  const { companies, fetchCompanies, currentCompanyId, selectCompany } =
    useCompanyStore();

  const company = companies.find((c) => c.id === companyId);

  useEffect(() => {
    // 새로고침 진입 같은 경우를 대비
    if (!company) {
      fetchCompanies();
    }
  }, [company]);

  useEffect(() => {
    useMemberStore.setState({
      members: [],
      total: 0,
      loading: true,
    });
    if (companyId && currentCompanyId !== companyId) {
      selectCompany(companyId);
    }
  }, [companyId, currentCompanyId]);

  if (!company) {
    return (
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
    );
  }

  return (
    <FlexWrapper direction="col" gap={4} classes="h-full">
      <FlexWrapper direction="col" items="start" gap={4}>
        <Button
          variant="outline"
          size="md"
          classes="!text-primary-600 !border-primary-200"
          onClick={() => navigate("/company")}
        >
          <FlexWrapper gap={1} items="center">
            <LuChevronLeft className="text-lg" />
            회사목록
          </FlexWrapper>
        </Button>
        <FlexWrapper gap={3} items="end">
          <Typography variant="H3">{company.name}</Typography>

          <Button
            variant="contain"
            size="md"
            onClick={async () => {
              await openDialog({
                title: "메뉴 설정",
                hideBottom: true,
                body: <MenuSettingDialogBody />,
              });
            }}
          >
            <LuSettings className="text-lg" />
          </Button>
        </FlexWrapper>
      </FlexWrapper>
      <FlexWrapper direction="col">
        <FlexWrapper gap={3} items="center">
          <Typography variant="H4" classes="w-[52px]">
            ID
          </Typography>
          <span className="w-[1px] h-4 bg-primary-100 mr-2"></span>
          <Typography variant="B2">{company.id}</Typography>
        </FlexWrapper>
        <FlexWrapper gap={3} items="center">
          <Typography variant="H4" classes="w-[52px]">
            생성일
          </Typography>
          <span className="w-[1px] h-4 bg-primary-100 mr-2"></span>
          <Typography variant="B2">
            {company.created_at
              ? dayjs(company.created_at).format("YYYY-MM-DD HH:mm:ss")
              : "-"}
          </Typography>
        </FlexWrapper>
      </FlexWrapper>

      <FlexWrapper direction="col" gap={3} classes="flex-1">
        <CompanyMember companyId={company.id} />
      </FlexWrapper>
    </FlexWrapper>
  );
}

export default CompanyDetail;
