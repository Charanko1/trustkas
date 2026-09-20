"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock } from "lucide-react";

export default function RegisterPage() {
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

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-blue-600">TrustKas</h1>
          <p className="text-gray-500 mt-3 text-lg">
            Create your account
          </p>
        </div>

        {/* Name */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Full Name
          </label>

          <div
            className={`flex items-center rounded-2xl border bg-white transition-all duration-300 overflow-hidden ${
              activeField === "name"
                ? "h-16 px-5 border-blue-600 shadow-lg"
                : "h-11 px-4 border-gray-300"
            }`}
          >
            <User
              size={20}
              className={
                activeField === "name"
                  ? "text-blue-600"
                  : "text-gray-400"
              }
            />

            <input
              type="text"
              placeholder="Ridwan Aziz"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setActiveField("name")}
              onBlur={() => setActiveField(null)}
              className="ml-3 w-full outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Email
          </label>

          <div
            className={`flex items-center rounded-2xl border bg-white transition-all duration-300 overflow-hidden ${
              activeField === "email"
                ? "h-16 px-5 border-blue-600 shadow-lg"
                : "h-11 px-4 border-gray-300"
            }`}
          >
            <Mail
              size={20}
              className={
                activeField === "email"
                  ? "text-blue-600"
                  : "text-gray-400"
              }
            />

            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setActiveField("email")}
              onBlur={() => setActiveField(null)}
              className="ml-3 w-full outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-8">
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Password
          </label>

          <div
            className={`flex items-center rounded-2xl border bg-white transition-all duration-300 overflow-hidden ${
              activeField === "password"
                ? "h-16 px-5 border-blue-600 shadow-lg"
                : "h-11 px-4 border-gray-300"
            }`}
          >
            <Lock
              size={20}
              className={
                activeField === "password"
                  ? "text-blue-600"
                  : "text-gray-400"
              }
            />

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setActiveField("password")}
              onBlur={() => setActiveField(null)}
              className="ml-3 w-full outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={register}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-2xl transition disabled:bg-gray-400"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {/* Login */}
        <p className="text-center text-gray-500 mt-7 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}