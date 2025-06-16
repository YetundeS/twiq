"use client";

import { generateSignString } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import Link from "next/link";

// pages/success.js
export default function SuccessPage() {
  const { user } = useAuthStore();
  const signString = generateSignString(user?.organization_name);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-green-50 text-green-800">
      <div className="text-center p-8 bg-white shadow-lg rounded-xl max-w-md">
        <h1 className="text-3xl font-bold mb-4">🎉 Payment Successful!</h1>
        <p className="text-lg mb-6">Thank you for your purchase. Your subscription is now active.</p>
        <Link href={`/platform/${signString}/`} className="text-white bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md transition">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
