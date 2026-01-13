import { useEffect, useState } from "react";
import Drawer from "@/components/Drawer";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Label from "@/components/Label";
import TextInput from "@/components/TextInput";
import Checkbox from "@/components/Checkbox";
import Button from "../Button";

interface EducationDrawerProps {
  open: boolean;
  disabled?: boolean;
  mode: "create" | "edit";
  worker: any | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  onEdit: (data: any) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function EducationDrawer({
  open,
  disabled,
  mode,
  worker,
  onClose,
  onSubmit,
  onEdit,
  onDelete,
}: EducationDrawerProps) {
  // --- 상태 관리 ---
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [duty, setDuty] = useState("");

  // 5대 법정의무교육
  const [eduSexHarassment, setEduSexHarassment] = useState(false);
  const [eduPrivacy, setEduPrivacy] = useState(false);
  const [eduDisability, setEduDisability] = useState(false);
  const [eduSafety, setEduSafety] = useState(false);
  const [eduPension, setEduPension] = useState(false);

  // 의료기관 특화 교육
  const [eduChildAbuse, setEduChildAbuse] = useState(false);
  const [eduElderAbuse, setEduElderAbuse] = useState(false);
  const [eduEmergency, setEduEmergency] = useState(false);
  const [eduDisabilityAbuse, setEduDisabilityAbuse] = useState(false);
  const [eduInfection, setEduInfection] = useState(false);

  // 기타 및 면허 보수교육
  const [isLicenseHolder, setIsLicenseHolder] = useState(false);
  const [eduLicenseMaintenance, setEduLicenseMaintenance] = useState(false);

  const [errors, setErrors] = useState({ name: "" });

  useEffect(() => {
    if (worker) {
      setName(worker.name || "");
      setDepartment(worker.department || "");
      setPosition(worker.position || "");
      setDuty(worker.duty || "");
      setEduSexHarassment(!!worker.edu_sex_harassment);
      setEduPrivacy(!!worker.edu_privacy);
      setEduDisability(!!worker.edu_disability);
      setEduSafety(!!worker.edu_safety);
      setEduPension(!!worker.edu_pension);
      setEduChildAbuse(!!worker.edu_child_abuse);
      setEduElderAbuse(!!worker.edu_elder_abuse);
      setEduEmergency(!!worker.edu_emergency);
      setEduDisabilityAbuse(!!worker.edu_disability_abuse);
      setEduInfection(!!worker.edu_infection);
      setIsLicenseHolder(!!worker.is_license_holder);
      setEduLicenseMaintenance(!!worker.edu_license_maintenance);
    } else {
      setName("");
      setDepartment("");
      setPosition("");
      setDuty("");
      setEduSexHarassment(false);
      setEduPrivacy(false);
      setEduDisability(false);
      setEduSafety(false);
      setEduPension(false);
      setEduChildAbuse(false);
      setEduElderAbuse(false);
      setEduEmergency(false);
      setEduDisabilityAbuse(false);
      setEduInfection(false);
      setIsLicenseHolder(false);
      setEduLicenseMaintenance(false);
    }
    setErrors({ name: "" });
  }, [worker, open]);

  // --- 전체 선택 핸들러 ---
  const handleSelectAllMandatory = () => {
    const isAllChecked =
      eduSexHarassment &&
      eduPrivacy &&
      eduDisability &&
      eduSafety &&
      eduPension;
    const nextVal = !isAllChecked;
    setEduSexHarassment(nextVal);
    setEduPrivacy(nextVal);
    setEduDisability(nextVal);
    setEduSafety(nextVal);
    setEduPension(nextVal);
  };

  const handleSelectAllMedical = () => {
    const isAllChecked =
      eduChildAbuse &&
      eduElderAbuse &&
      eduEmergency &&
      eduDisabilityAbuse &&
      eduInfection;
    const nextVal = !isAllChecked;
    setEduChildAbuse(nextVal);
    setEduElderAbuse(nextVal);
    setEduEmergency(nextVal);
    setEduDisabilityAbuse(nextVal);
    setEduInfection(nextVal);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrors({ name: "이름은 필수 입력사항입니다." });
      return;
    }
    const payload = {
      name: name.trim(),
      department,
      position,
      duty,
      edu_sex_harassment: eduSexHarassment,
      edu_privacy: eduPrivacy,
      edu_disability: eduDisability,
      edu_safety: eduSafety,
      edu_pension: eduPension,
      edu_child_abuse: eduChildAbuse,
      edu_elder_abuse: eduElderAbuse,
      edu_emergency: eduEmergency,
      edu_disability_abuse: eduDisabilityAbuse,
      edu_infection: eduInfection,
      is_license_holder: isLicenseHolder,
      edu_license_maintenance: isLicenseHolder ? eduLicenseMaintenance : false, // 면허 미소지 시 강제 false
    };
    if (mode === "create") await onSubmit(payload);
    else await onEdit({ id: worker?.id, ...payload });
    onClose();
  };

  return (
    <Drawer
      open={open}
      title={
        <Typography variant="H4">
          {mode === "create"
            ? "교육 정보 등록"
            : disabled
              ? "교육 정보 조회"
              : "교육 정보 수정"}
        </Typography>
      }
      showFooter={!disabled}
      confirmText={mode === "create" ? "저장하기" : "수정하기"}
      onClose={onClose}
      onCancel={onClose}
      onDelete={onDelete}
      onConfirm={handleSubmit}
    >
      <div className="flex flex-col px-5 pt-4 pb-12 gap-8">
        {/* 섹션 1: 대상자 정보 */}
        <section className="flex flex-col gap-4">
          <FlexWrapper items="center" gap={2}>
            <span className="w-1.5 h-5 bg-gray-400 rounded-full" />
            <Typography variant="B1" classes="font-extrabold text-gray-900">
              대상자 정보
            </Typography>
          </FlexWrapper>
          <div className="flex flex-col gap-4 pl-1">
            <FlexWrapper gap={2}>
              <FlexWrapper items="center" gap={2} classes="flex-1">
                <div className="shrink-0 w-[60px]">
                  <Label text="이름" required />
                </div>
                <TextInput
                  inputProps={{ value: name }}
                  onChange={(e) => setName(e.target.value)}
                  disabled={disabled}
                  classes="!h-[40px] flex-1"
                  error={!!errors.name}
                  errorMsg={errors.name}
                />
              </FlexWrapper>
              <FlexWrapper items="center" gap={2} classes="flex-1">
                <div className="shrink-0 w-[60px]">
                  <Label text="부서" />
                </div>
                <TextInput
                  inputProps={{ value: department }}
                  onChange={(e) => setDepartment(e.target.value)}
                  disabled={disabled}
                  classes="!h-[40px]"
                />
              </FlexWrapper>
            </FlexWrapper>
            <FlexWrapper gap={2}>
              <FlexWrapper items="center" gap={2} classes="flex-1">
                <div className="shrink-0 w-[60px] text-right">
                  <Label text="직급" />
                </div>
                <TextInput
                  inputProps={{ value: position }}
                  onChange={(e) => setPosition(e.target.value)}
                  disabled={disabled}
                  classes="!h-[40px]"
                />
              </FlexWrapper>
              <FlexWrapper items="center" gap={2} classes="flex-1">
                <div className="shrink-0 w-[60px]">
                  <Label text="직무" />
                </div>
                <TextInput
                  inputProps={{ value: duty }}
                  onChange={(e) => setDuty(e.target.value)}
                  disabled={disabled}
                  classes="!h-[40px] flex-1"
                />
              </FlexWrapper>
            </FlexWrapper>
          </div>
        </section>

        {/* 섹션 2: 5대 법정의무교육 */}
        <section className="flex flex-col gap-4">
          <FlexWrapper justify="between" items="center">
            <FlexWrapper items="center" gap={2}>
              <span className="w-1.5 h-5 bg-orange-500 rounded-full" />
              <Typography
                variant="B1"
                classes="font-extrabold !text-orange-700"
              >
                5대 법정의무교육
              </Typography>
            </FlexWrapper>
            {!disabled && (
              <Button
                onClick={handleSelectAllMandatory}
                variant="outline"
                size="sm"
              >
                {eduSexHarassment &&
                eduPrivacy &&
                eduDisability &&
                eduSafety &&
                eduPension
                  ? "선택 해제"
                  : "전체 선택"}
              </Button>
            )}
          </FlexWrapper>
          <div className="grid grid-cols-1 gap-3.5 pl-3">
            <Checkbox
              id="sex"
              label="직장 내 성희롱 예방교육"
              checked={eduSexHarassment}
              onChange={() => setEduSexHarassment(!eduSexHarassment)}
              disabled={disabled}
            />
            <Checkbox
              id="priv"
              label="개인정보 보호교육"
              checked={eduPrivacy}
              onChange={() => setEduPrivacy(!eduPrivacy)}
              disabled={disabled}
            />
            <Checkbox
              id="dis"
              label="직장 내 장애인 인식개선"
              checked={eduDisability}
              onChange={() => setEduDisability(!eduDisability)}
              disabled={disabled}
            />
            <Checkbox
              id="safe"
              label="산업안전 보건교육"
              checked={eduSafety}
              onChange={() => setEduSafety(!eduSafety)}
              disabled={disabled}
            />
            <Checkbox
              id="pen"
              label="퇴직연금 교육"
              checked={eduPension}
              onChange={() => setEduPension(!eduPension)}
              disabled={disabled}
            />
          </div>
        </section>

        {/* 섹션 3: 의료기관 특화 교육 */}
        <section className="flex flex-col gap-4">
          <FlexWrapper justify="between" items="center">
            <FlexWrapper items="center" gap={2}>
              <span className="w-1.5 h-5 bg-blue-500 rounded-full" />
              <Typography variant="B1" classes="font-extrabold !text-blue-700">
                의료기관 특화 교육
              </Typography>
            </FlexWrapper>
            {/* 전체 선택 버튼 */}
            {!disabled && (
              <Button
                onClick={handleSelectAllMedical}
                variant="outline"
                size="sm"
              >
                {eduChildAbuse &&
                eduElderAbuse &&
                eduEmergency &&
                eduDisabilityAbuse &&
                eduInfection
                  ? "선택 해제"
                  : "전체 선택"}
              </Button>
            )}
          </FlexWrapper>
          <div className="grid grid-cols-1 gap-3.5 pl-3">
            <Checkbox
              id="child"
              label="아동학대 신고의무자 교육"
              checked={eduChildAbuse}
              onChange={() => setEduChildAbuse(!eduChildAbuse)}
              disabled={disabled}
            />
            <Checkbox
              id="elder"
              label="노인학대 신고의무자 교육"
              checked={eduElderAbuse}
              onChange={() => setEduElderAbuse(!eduElderAbuse)}
              disabled={disabled}
            />
            <Checkbox
              id="emer"
              label="긴급복지 신고의무자 교육"
              checked={eduEmergency}
              onChange={() => setEduEmergency(!eduEmergency)}
              disabled={disabled}
            />
            <Checkbox
              id="dis_abuse"
              label="장애인학대 신고의무자 교육"
              checked={eduDisabilityAbuse}
              onChange={() => setEduDisabilityAbuse(!eduDisabilityAbuse)}
              disabled={disabled}
            />
            <Checkbox
              id="infect"
              label="감염관리 및 환자안전 교육"
              checked={eduInfection}
              onChange={() => setEduInfection(!eduInfection)}
              disabled={disabled}
            />
          </div>
        </section>

        {/* 섹션 4: 면허 보수교육 */}
        <section className="flex flex-col gap-4">
          <FlexWrapper items="center" gap={2}>
            <span className="w-1.5 h-5 bg-purple-500 rounded-full" />
            <Typography variant="B1" classes="font-extrabold !text-purple-700">
              면허 보수교육
            </Typography>
          </FlexWrapper>
          <div className="flex gap-4 items-center pl-3">
            <Checkbox
              id="license_holder"
              label="면허 소지 여부"
              checked={isLicenseHolder}
              onChange={() => {
                const nextVal = !isLicenseHolder;
                setIsLicenseHolder(nextVal);
                if (!nextVal) setEduLicenseMaintenance(false); // 면허 해제 시 보수교육도 해제
              }}
              disabled={disabled}
            />
            <div className={isLicenseHolder ? "" : "opacity-50"}>
              <Checkbox
                id="license_edu"
                label="면허 소지자 보수교육 이수"
                checked={eduLicenseMaintenance}
                onChange={() =>
                  setEduLicenseMaintenance(!eduLicenseMaintenance)
                }
                // 면허가 없거나 Drawer가 disabled일 때 비활성화
                disabled={disabled || !isLicenseHolder}
              />
            </div>
          </div>
        </section>
      </div>
    </Drawer>
  );
}
