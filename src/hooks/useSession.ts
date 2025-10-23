import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function useSession() {
  // undefined = 로딩 중, null = 로그인 안 됨, Session = 로그인 중
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    // 1️⃣ 현재 세션 불러오기 (앱 처음 로드 시)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // 2️⃣ 세션 변경 감지 구독
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
      }
    );

    // 3️⃣ 언마운트 시 구독 해제
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return session;
}
