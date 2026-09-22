"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function useRegister() {
  const router = useRouter();

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