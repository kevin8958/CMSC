import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";

function SettingsPage() {
  const navigate = useNavigate();

  const onLogout = async () => {
    await supabase.auth.signOut(); // ✅ 세션 제거
    navigate("/login"); // ✅ 로그인페이지로 이동
  };

  return (
    <FlexWrapper classes="w-full" items="center" justify="center" gap={4}>
      <FlexWrapper classes="w-[400px]" direction="col" gap={4}>
        <Typography variant="H3">설정</Typography>
        <FlexWrapper
          classes="h-[400px] border rounded-md p-3"
          direction="col"
          items="center"
          justify="between"
        >
          <p>추가예정</p>
          <Button
            variant="contain"
            color="primary"
            size="md"
            classes="w-full"
            onClick={onLogout}
          >
            로그아웃
          </Button>
        </FlexWrapper>
      </FlexWrapper>
    </FlexWrapper>
  );
}

export default SettingsPage;
