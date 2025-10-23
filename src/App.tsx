import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useSession } from "@/hooks/useSession";
import { Navigate } from "react-router-dom";
import { AlertProvider } from "@/components/AlertProvider";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = useSession();
  if (session === undefined) return null; // 로딩 중에는 아무것도 안 렌더링
  if (!session) return <Navigate to="/login" replace />;
  return children;
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
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AlertProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
