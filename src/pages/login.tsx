import React, { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import { login } from "@/utils/api/auth";

const Login: React.FC = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginId, password);
      // 一旦ホームページにリダイレクト
      await router.push("/");
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    }
  };

  return (
    <Layout>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="loginId">Login ID:</label>
          <input type="text" id="loginId" value={loginId} onChange={(e) => setLoginId(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </Layout>
  );
};

export default Login;
