import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  // useLocation,
} from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Navigate } from "react-router-dom";
import { AlertProvider } from "@/components/AlertProvider";
import Gnb from "@/layout/Gnb";
import Communication from "@/pages/Communication";
import Employee from "@/pages/Employee";
import Document from "@/pages/Document";
import Company from "@/pages/Company";
import CompanyDetail from "@/components/company/CompanyDetail";
import Member from "@/pages/Member";
import ForgotPassword from "@/pages/ForgotPassword";
import Settings from "@/pages/Settings";
import Snb from "@/layout/Snb";
import FlexWrapper from "@/layout/FlexWrapper";
import { DialogProvider } from "@/hooks/useDialog";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import SignupInvite from "@/pages/SignupInvite";
import Inquiry from "@/pages/Inquiry";
import Salary from "@/pages/Salary";
import Attendance from "@/pages/Attendance";
import Expense from "@/pages/Expense";
import Income from "@/pages/Income";
import Worker from "@/pages/Worker";
import classNames from "classnames";
import UpdatePassword from "./pages/UpdatePassword";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { init, initialized, user } = useAuthStore();

  useEffect(() => {
    init();
  }, []);

  // 아직 init 중
  if (!initialized) return null;

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
// ✅ Outlet 기반 AppLayout
function AppLayout() {
  // const location = useLocation();
  // const pathname = location.pathname;
  return (
    <div className="min-h-screen w-full">
      <Gnb />
      <FlexWrapper items="start" gap={0}>
        <Snb />
        <main
          className={classNames(
            "pt-[76px] px-4 flex-1 h-screen flex flex-col overflow-scroll",
            {
              "bg-[linear-gradient(to_bottom,#F3FCF9_0%,#F3FCF9_90%,white_100%)]": true,
              // ["/dashboard", "/communication"].includes(pathname),
            }
          )}
        >
          <Outlet /> {/* ✅ 여기에 자식 페이지들이 자동으로 렌더 */}
        </main>
      </FlexWrapper>
    </div>
  );
}

function App() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("access_token")) return;

    // invite 타입인지 확인
    const params = new URLSearchParams(hash.replace("#", ""));
    const type = params.get("type");

    if (type === "invite") {
      // 토큰은 그대로 두고 경로만 이동
      window.location.replace(`/signup/invite${hash}`);
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <AlertProvider>
        <DialogProvider>
          <BrowserRouter>
            <Routes>
              {/* 비로그인용 */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />

              {/* 로그인 후 영역 */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/communication" element={<Communication />} />
                <Route path="/employee" element={<Employee />} />
                <Route path="/expense" element={<Expense />} />
                <Route path="/income" element={<Income />} />
                <Route path="/salary" element={<Salary />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/worker" element={<Worker />} />
                <Route path="/document" element={<Document />} />
                <Route path="/company" element={<Company />} />
                <Route path="/company/:companyId" element={<CompanyDetail />} />
                <Route path="/member" element={<Member />} />
                <Route path="/inquiry" element={<Inquiry />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="/signup/invite" element={<SignupInvite />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
            </Routes>
          </BrowserRouter>
        </DialogProvider>
      </AlertProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
