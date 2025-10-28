import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useSession } from "@/hooks/useSession";
import { Navigate } from "react-router-dom";
import { AlertProvider } from "@/components/AlertProvider";
import Gnb from "@/layout/Gnb";
import Communication from "@/pages/Communication";
import Employee from "@/pages/Employee";
import Income from "@/pages/Income";
import Document from "@/pages/Document";
import Snb from "@/layout/Snb";
import FlexWrapper from "@/layout/FlexWrapper";
import { DialogProvider } from "@/hooks/useDialog";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = useSession();
  if (session === undefined) return null; // 로딩 중에는 아무것도 안 렌더링
  if (!session) return <Navigate to="/login" replace />;
  return children;
}

// ✅ Outlet 기반 AppLayout
function AppLayout() {
  return (
    <div className="min-h-screen w-full">
      <Gnb />
      <FlexWrapper items="start" gap={0}>
        <Snb />
        <main className="pt-[76px] px-4 flex-1 h-screen flex flex-col overflow-scroll">
          <Outlet /> {/* ✅ 여기에 자식 페이지들이 자동으로 렌더 */}
        </main>
      </FlexWrapper>
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <DialogProvider>
        <AlertProvider>
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
                <Route path="/income" element={<Income />} />
                <Route path="/document" element={<Document />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AlertProvider>
      </DialogProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
