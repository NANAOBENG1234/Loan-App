"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RegisterForm } from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50/50 to-white px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-extrabold text-gradient">QuickLoan</Link>
          <h1 className="text-2xl font-bold mt-6 mb-1">Create Account</h1>
          <p className="text-sm text-secondary-500">Join thousands of Ghanaians</p>
        </div>
        <div className="card !p-6">
          <RegisterForm />
        </div>
        <p className="text-center text-sm text-secondary-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-500 font-semibold hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
