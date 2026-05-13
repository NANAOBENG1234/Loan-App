"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50/50 to-white px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-extrabold text-gradient">QuickLoan</Link>
          <h1 className="text-2xl font-bold mt-6 mb-1">Welcome Back</h1>
          <p className="text-sm text-secondary-500">Sign in to continue</p>
        </div>
        <div className="card !p-6">
          <LoginForm />
        </div>
        <p className="text-center text-sm text-secondary-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary-500 font-semibold hover:underline">Register</Link>
        </p>
      </motion.div>
    </div>
  );
}
