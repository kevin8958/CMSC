import { useEffect, useState } from "react";
import FlexWrapper from "@/layout/FlexWrapper";
import Typography from "@/foundation/Typography";
import CustomDatePicker from "@/components/DatePicker";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";
import Expense from "@/components/dashboard/Expense";
import Assets from "@/components/dashboard/Assets";

function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(
    dayjs().toDate()
  );
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUserName("사용자");
        return;
      }

      // profiles 조회
      const { data: profile } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", user.id)
        .maybeSingle();

      setUserName(profile?.nickname || "사용자");
    };

    loadProfile();
  }, []);

  return (
    <>
      <FlexWrapper gap={4} direction="col" classes="w-full">
        <FlexWrapper justify="between" items="center" classes="w-full">
          <FlexWrapper direction="col" items="start" gap={0}>
            <Typography variant="H3">{userName}님 안녕하세요</Typography>
            <Typography variant="B2" classes="!text-gray-500">
              이번 달 데이터를 확인해주세요.
            </Typography>
          </FlexWrapper>
          <CustomDatePicker
            variant="outline"
            size="md"
            type="month"
            isMonthPicker
            dateFormat="YYYY.MM"
            value={selectedMonth}
            onChange={(date) => setSelectedMonth(date)}
          />
        </FlexWrapper>
        <FlexWrapper gap={4} direction="col" classes="lg:flex-row w-full">
          <Expense />
          <Assets selectedMonth={selectedMonth} />
        </FlexWrapper>
      </FlexWrapper>
    </>
  );
}
export default Dashboard;
