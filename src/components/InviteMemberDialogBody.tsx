import { useEffect, useState } from "react";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { useDialog } from "@/hooks/useDialog";
import { useAlert } from "@/components/AlertProvider";
import { useMemberStore } from "@/stores/useMemberStore";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { inviteMember } from "@/actions/memberActions";

function InviteMemberDialogBody() {
  const { close } = useDialog();
  const { showAlert } = useAlert();
  const { currentCompanyId } = useCompanyStore();
  const { fetchMembers, addExistingAdmin } = useMemberStore();

  const [email, setEmail] = useState("");
  const [adminCandidates, setAdminCandidates] = useState<any[]>([]);

  // 1. 로딩 상태 추가 (중복 클릭 방지용)
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadAdmins = async () => {
      if (!currentCompanyId) return;

      try {
        const res = await fetch(
          `/api/backoffice/admin-candidates?company_id=${currentCompanyId}`
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load admins");
        setAdminCandidates(json.data || []);
      } catch (err) {
        console.error("❌ loadAdmins error:", err);
      }
    };

    loadAdmins();
  }, [currentCompanyId]);

  // 신규 초대
  const onInvite = async () => {
    // 2. 이미 제출 중이면 함수 실행 방지
    if (submitting) return;

    try {
      if (!currentCompanyId) throw new Error("회사를 찾을 수 없습니다.");

      setSubmitting(true); // 로딩 시작

      const member = await inviteMember({
        company_id: currentCompanyId,
        email,
      });
      if (member) {
        showAlert(`${email}로 초대가 완료되었습니다.`, {
          type: "success",
          durationMs: 3000,
        });
      }
      fetchMembers();
      close(true);
    } catch (err: any) {
      showAlert(err?.message || "초대 중 오류가 발생했습니다.", {
        type: "danger",
        durationMs: 3000,
      });
    } finally {
      // 3. 성공하든 실패하든 로딩 상태 해제 (다시 누를 수 있게)
      setSubmitting(false);
    }
  };

  // 기존 admin 추가
  const onAddAdmin = async (userId: string) => {
    if (submitting) return;

    try {
      if (!currentCompanyId) throw new Error("회사를 찾을 수 없습니다.");

      setSubmitting(true); // 로딩 시작

      await addExistingAdmin(currentCompanyId, userId);

      showAlert("관리자 추가 완료되었습니다.", {
        type: "success",
        durationMs: 3000,
      });

      fetchMembers();
      close(true);
    } catch (err: any) {
      showAlert(err?.message || "관리자 추가 중 오류가 발생했습니다.", {
        type: "danger",
        durationMs: 3000,
      });
    } finally {
      setSubmitting(false); // 로딩 해제
    }
  };

  return (
    <FlexWrapper direction="col" gap={6} classes="w-full">
      {/* 신규 초대 */}
      <FlexWrapper direction="col" gap={3}>
        <Typography variant="H4">신규 멤버 추가</Typography>
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
          // 4. 이메일이 없거나 제출 중일 때 버튼 비활성화
          disabled={email.trim() === "" || submitting}
          onClick={onInvite}
        >
          {submitting ? "초대 중..." : "초대하기"}
        </Button>
      </FlexWrapper>

      <div className="h-px bg-gray-200" />

      {/* 기존 admin pool */}
      <FlexWrapper direction="col" gap={3}>
        <Typography variant="H4">관리자 추가</Typography>
        {adminCandidates.length === 0 ? (
          <Typography variant="B2" classes="text-gray-500">
            추가 가능한 관리자가 없습니다.
          </Typography>
        ) : (
          <FlexWrapper
            direction="col"
            gap={0}
            classes="border rounded-lg scroll-thin overflow-y-auto max-h-[240px]"
          >
            {adminCandidates.map((adm) => (
              <FlexWrapper
                key={adm.id}
                justify="between"
                items="center"
                classes="px-3 py-3 border-b border-gray-100"
              >
                <FlexWrapper direction="col" gap={0}>
                  <Typography
                    variant="B1"
                    classes={`${adm.alreadyAssigned ? "opacity-50" : ""}`}
                  >
                    {adm.display_name}
                  </Typography>
                  <Typography
                    variant="C1"
                    classes={`${adm.alreadyAssigned ? "opacity-50" : ""}`}
                  >
                    {adm.email}
                  </Typography>
                </FlexWrapper>
                <Button
                  size="sm"
                  variant="outline"
                  // 5. 이미 추가되었거나 다른 작업이 처리 중일 때 비활성화
                  disabled={adm.alreadyAssigned || submitting}
                  onClick={() => onAddAdmin(adm.id)}
                >
                  {adm.alreadyAssigned
                    ? "이미 추가됨"
                    : submitting
                      ? "추가 중"
                      : "추가"}
                </Button>
              </FlexWrapper>
            ))}
          </FlexWrapper>
        )}
      </FlexWrapper>
    </FlexWrapper>
  );
}

export default InviteMemberDialogBody;
