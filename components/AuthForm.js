"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const isSignup = mode === "signup";

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      router.push("/tasks");
      router.refresh();
    } catch {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className = "container authContainer">
        <button class = "Button backButton" onClick={() => router.back()}>
          Back
        </button>
        <form onSubmit={handleSubmit} className = "form">
          <h1>{isSignup ? "Create account" : "Log in"}</h1>

          <div className="formFields">
            {isSignup && (
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            )}
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit" disabled={loading} className = "Button">
              {loading ? "Please wait..." : isSignup ? "Sign up" : "Log in"}
            </button>
          </div>
          

          <p>
            {isSignup ? (
              <>Already have an account? <Link href="/login">Log in</Link></>
            ) : (
              <>No account? <Link href="/signup">Sign up</Link></>
            )}
          </p>
        </form>
      </div>
    </main>
      
    
  );
}