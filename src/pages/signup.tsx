import React, { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import { createAccount } from "@/utils/api/auth";

const SignUp: React.FC = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [group, setGroup] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const groupNumber = parseInt(group, 10); // 文字列を数値に変換
      if (isNaN(groupNumber)) {
        setError("Group must be a valid number");
        return;
      }
      await createAccount(loginId, password, groupNumber);
      await router.push("/login");
    } catch (err) {
      setError("Failed to create account. Please try again.");
    }
  };

  return (
    <Layout>
      <h1>Sign Up</h1>
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
        <div>
          <label htmlFor="group">Group:</label>
          <input type="number" id="group" value={group} onChange={(e) => setGroup(e.target.value)} required />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </Layout>
  );
};

export default SignUp;
