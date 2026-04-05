import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useSession } from "../../context/user";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useSession();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
