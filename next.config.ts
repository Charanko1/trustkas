import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    ".app.github.dev", // semua domain Codespaces
  ],
};

module.exports = nextConfig;
