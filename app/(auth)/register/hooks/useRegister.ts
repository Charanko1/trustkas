"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function useRegister() {
  const router = useRouter();
<<<<<<< HEAD

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState<
    "name" | "email" | "password" | null
  >(null);

  async function register() {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Register Success!");
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Register failed");
    } finally {
      setLoading(false);
    }
  }

  return {
    name,
    email,
    password,
    loading,
    activeField,
    setName,
    setEmail,
    setPassword,
    setActiveField,
    register,
  };
}
=======
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function register() {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) return setError("Please complete all fields.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), email: email.trim(), password }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.message === "string" ? data.message : "Registration failed.");
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally { setLoading(false); }
  }

  return { name, email, password, confirmPassword, loading, error, setName, setEmail, setPassword, setConfirmPassword, register };
}
>>>>>>> master
