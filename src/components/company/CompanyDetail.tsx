import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useCompanyStore } from "@/stores/useCompanyStore";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Button from "@/components/Button";
import { LuChevronLeft } from "react-icons/lu";
import CompanyMember from "@/components/company/CompanyMember";
import { motion } from "motion/react";

function CompanyDetail() {
  const { companyId } = useParams();
  const navigate = useNavigate();

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
    <FlexWrapper direction="col" gap={4}>
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
              ? new Date(company.created_at).toLocaleDateString()
              : "-"}
          </Typography>
        </FlexWrapper>
      </FlexWrapper>

      <FlexWrapper direction="col" gap={3}>
        <CompanyMember />
      </FlexWrapper>
    </FlexWrapper>
  );
}

export default CompanyDetail;
