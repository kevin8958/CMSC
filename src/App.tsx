import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
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
import Sales from "@/pages/Sales";
import Worker from "@/pages/Worker";
import classNames from "classnames";

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
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <div className="min-h-screen w-full">
      <Gnb />
      <FlexWrapper items="start" gap={0}>
        <Snb />
        <main
          className={classNames(
            "pt-[76px] px-4 flex-1 h-screen flex flex-col overflow-scroll",
            {
              "bg-[linear-gradient(to_bottom,#F3FCF9_0%,#F3FCF9_90%,white_100%)]":
                ["/dashboard", "/communication"].includes(pathname),
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
                <Route path="/sales" element={<Sales />} />
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
            </Routes>
          </BrowserRouter>
        </DialogProvider>
      </AlertProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
