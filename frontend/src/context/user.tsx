import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type UserName = string;

export type UserSessionContextValue = {
  user: UserName | null;
  login: (name: UserName) => void;
  logout: () => void;
};

const UserSessionContext = createContext<UserSessionContextValue | null>(null);

export function UserSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserName | null>(null);
  const login = useCallback((name: UserName) => {
    setUser(name);
  }, []);
  const logout = useCallback(() => {
    setUser(null);
  }, []);
  const value = useMemo(
    () => ({ user, login, logout }),
    [user, login, logout],
  );
  return <UserSessionContext.Provider value={value}>{children}</UserSessionContext.Provider>;
}

export function useSession(): UserSessionContextValue {
  const ctx = useContext(UserSessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within UserSessionProvider");
  }
  return ctx;
}

export function useUser(): UserName | null {
  return useSession().user;
}
