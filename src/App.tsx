import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import FlexWrapper from "./layout/FlexWrapper";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = useSession();
  if (session === undefined) return null; // 로딩 중에는 아무것도 안 렌더링
  if (!session) return <Navigate to="/login" replace />;
  return children;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <Gnb />
      <FlexWrapper items="start" gap={0}>
        <Snb />
        <main className="pt-[76px] px-4 flex-1 h-screen flex flex-col overflow-scroll">
          {children}
        </main>
      </FlexWrapper>
    </div>
  );
}
function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <AlertProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </AppLayout>
              }
            />
            <Route
              path="/communication"
              element={
                <AppLayout>
                  <ProtectedRoute>
                    <Communication />
                  </ProtectedRoute>
                </AppLayout>
              }
            />
            <Route
              path="/employee"
              element={
                <AppLayout>
                  <ProtectedRoute>
                    <Employee />
                  </ProtectedRoute>
                </AppLayout>
              }
            />
            <Route
              path="/income"
              element={
                <AppLayout>
                  <ProtectedRoute>
                    <Income />
                  </ProtectedRoute>
                </AppLayout>
              }
            />
            <Route
              path="/document"
              element={
                <AppLayout>
                  <ProtectedRoute>
                    <Document />
                  </ProtectedRoute>
                </AppLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </AlertProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
