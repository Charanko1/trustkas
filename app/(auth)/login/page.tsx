"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState<
    "email" | "password" | null
  >(null);

  async function login() {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-blue-600">TrustKas</h1>
          <p className="text-gray-500 mt-3 text-lg">
            Sign in to your account
          </p>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Email
          </label>

          <div
            className={`flex items-center rounded-2xl border bg-white transition-all duration-300 ease-in-out overflow-hidden ${
              activeField === "email"
                ? "h-16 px-5 border-blue-600 shadow-lg"
                : "h-11 px-4 border-gray-300"
            }`}
          >
            <Mail
              size={20}
              className={`transition-colors ${
                activeField === "email"
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            />

            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setActiveField("email")}
              onBlur={() => setActiveField(null)}
              className="ml-3 w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-8">
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Password
          </label>

          <div
            className={`flex items-center rounded-2xl border bg-white transition-all duration-300 ease-in-out overflow-hidden ${
              activeField === "password"
                ? "h-16 px-5 border-blue-600 shadow-lg"
                : "h-11 px-4 border-gray-300"
            }`}
          >
            <Lock
              size={20}
              className={`transition-colors ${
                activeField === "password"
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            />

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setActiveField("password")}
              onBlur={() => setActiveField(null)}
              className="ml-3 w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-2xl transition disabled:bg-gray-400"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        {/* Register */}
        <p className="text-center text-gray-500 mt-7 text-sm">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}