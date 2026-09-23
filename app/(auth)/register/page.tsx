"use client";

import Link from "next/link";
import { User, Mail, Lock } from "lucide-react";
import { useRegister } from "./hooks/useRegister";

export default function RegisterPage() {
  const {
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
  } = useRegister();

  const inputClass = (field: "name" | "email" | "password") =>
    `flex items-center rounded-2xl border bg-white transition-all duration-300 overflow-hidden ${
      activeField === field
        ? "h-16 px-5 border-blue-600 shadow-lg"
        : "h-11 px-4 border-gray-300"
    }`;

  const iconClass = (field: "name" | "email" | "password") =>
    activeField === field ? "text-blue-600" : "text-gray-400";

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
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

          <div className={inputClass("name")}>
            <User size={20} className={iconClass("name")} />
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

          <div className={inputClass("email")}>
            <Mail size={20} className={iconClass("email")} />
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

          <div className={inputClass("password")}>
            <Lock size={20} className={iconClass("password")} />
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

        <button
          onClick={register}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-2xl transition disabled:bg-gray-400"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

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