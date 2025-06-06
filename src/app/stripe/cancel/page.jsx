// pages/cancel.js
"use client";

import { generateSignString } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import Link from "next/link";

export default function CancelPage() {
  const { user } = useAuthStore();
  const signString = generateSignString(user?.organization_name);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-red-50 text-red-800">
      <div className="text-center p-8 bg-white shadow-lg rounded-xl max-w-md">
        <h1 className="text-3xl font-bold mb-4">❌ Payment Canceled</h1>
        <p className="text-lg mb-6">Your payment was not completed. Feel free to try again anytime.</p>
        <Link href={`/platform/${signString}/`} className="text-white bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md transition">
          Return Home
        </Link>
      </div>
    </div>
  );
}
