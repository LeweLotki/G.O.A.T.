import { type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { LeftSideBar } from "./components/common/left_side_bar";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { FileBrowseProvider } from "./context/file_browse";
import { useSession } from "./context/user";
import { LoginPage } from "./pages/LoginPage";
import { MainViewPage } from "./pages/MainViewPage";

function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useSession();
  const navigate = useNavigate();

  return (
    <>
      <header className="topbar">
        <span className="brand">goat</span>
        <div className="topbar__right">
          <span className="topbar__user">{user}</span>
          <button
            type="button"
            className="topbar__logout"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            Sign out
          </button>
        </div>
      </header>
      <div className="layout">
        <LeftSideBar />
        <main className="main">{children}</main>
      </div>
    </>
  );
}

function MainLayout() {
  return (
    <ProtectedRoute>
      <FileBrowseProvider>
        <AppShell>
          <MainViewPage />
        </AppShell>
      </FileBrowseProvider>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MainLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
