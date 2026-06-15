import { useEffect, useState } from "react";
import {
  loadAuthState,
  saveAuthState,
  clearAuthState,
  type AuthState,
  type AuthUser,
} from "../../shared/types";
import { CalendarApp } from "./App";
import "./AppAuth.css";

const API_BASE = "http://localhost:3001/api";

export default function CalendarWithAuth() {
  const [auth, setAuth] = useState<AuthState>(() => loadAuthState());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    saveAuthState(auth);
  }, [auth]);

  async function submit() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Request failed");
      }

      const data: { token: string; user: AuthUser } = await res.json();
      setAuth({ token: data.token, user: data.user });
      setPassword("");
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setAuth({ user: null, token: null });
    clearAuthState();
  }

  if (!auth.user) {
    return (
      <div className="login-container">
        <h1 className="login-title">Family Calendar Login</h1>

        <div className="mode-buttons">
          <button
            className={`mode-button ${mode === "login" ? "mode-button-active" : ""}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>

          <button
            className={`mode-button ${mode === "register" ? "mode-button-active" : ""}`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <input
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="login-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />

        <button
          className="submit-button-login"
          disabled={loading}
          onClick={submit}
        >
          {loading ? "Working..." : mode === "login" ? "Login" : "Register"}
        </button>

        {error && <div className="error-text">{error}</div>}
      </div>
    );
  }

  //TODO: pass logout function and attach to family editing section
  return (
    <CalendarApp rh={{ token: auth.token, user: auth.user }} logout={logout} />
  );
  {
    /*<div className="flex flex-col h-screen">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div>
          Logged in as <b>{auth.user.username}</b>
        </div>
        <button className="px-3 py-1 border rounded" onClick={logout}>
          Logout
        </button>
      </div>
       Your existing component 
    </div>*/
  }
}
