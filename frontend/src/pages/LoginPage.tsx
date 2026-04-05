import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../const";
import { type UserName, useSession } from "../context/user";

type UserListItem = { name: string };

export function LoginPage() {
  const { user, login } = useSession();
  const [selected, setSelected] = useState<UserName | "">("");
  const [options, setOptions] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/users`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data: UserListItem[] = await res.json();
        if (!cancelled) {
          setOptions(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load users");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  if (user) {
    return <Navigate to="/" replace />;
  }

  function handleLogin() {
    if (!selected) return;
    login(selected);
    navigate("/", { replace: true });
  }

  return (
    <div className="login-page">
      <header className="login-page__header">
        <span className="brand">goat</span>
      </header>
      <main className="login-page__main">
        <div className="login-card">
          <h1 className="login-card__title">Sign in</h1>
          <p className="login-card__hint">Choose your name to continue.</p>
          <label className="login-card__label" htmlFor="login-user">
            User
          </label>
          <select
            id="login-user"
            className="login-card__select"
            value={selected}
            onChange={(e) => setSelected((e.target.value || "") as UserName | "")}
            disabled={loading || !!error || options.length === 0}
          >
            <option value="">
              {loading ? "Loading…" : error ? "Error" : "Select…"}
            </option>
            {options.map(({ name }) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          {error ? <p className="login-card__error">{error}</p> : null}
          <button
            type="button"
            className="login-card__button"
            disabled={!selected || loading || !!error}
            onClick={handleLogin}
          >
            Log in
          </button>
        </div>
      </main>
    </div>
  );
}
