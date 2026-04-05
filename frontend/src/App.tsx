import { useState, type ReactNode } from "react";
import { LeftSideBar } from "./components/common/left_side_bar";
import { UserContext, type UserName } from "./context/user";

function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="topbar">
        <span className="brand">goat</span>
      </header>
      <div className="layout">
        <LeftSideBar />
        <main className="main">{children}</main>
      </div>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState<UserName | null>(null);

  return (
    <UserContext.Provider value={user}>
      <AppShell>
        <p className="lead">Session</p>
        <p className="caption">
          {user ? `Signed in as ${user}.` : "No user selected (wire login UI next)."}
        </p>
        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="user-pick" className="caption">
            Dev: pick user
          </label>
          <select
            id="user-pick"
            value={user ?? ""}
            onChange={(e) => setUser((e.target.value || null) as UserName | null)}
            style={{ display: "block", marginTop: "0.35rem", maxWidth: "12rem" }}
          >
            <option value="">—</option>
            <option value="Marcin">Marcin</option>
            <option value="Emilia">Emilia</option>
            <option value="Ala">Ala</option>
            <option value="Artur">Artur</option>
          </select>
        </div>
      </AppShell>
    </UserContext.Provider>
  );
}
