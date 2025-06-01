// app/not-found.tsx
'use client';

import { Ghost } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white px-6">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-red-500/10 p-4 rounded-full border border-red-400/30 animate-bounce">
            <Ghost className="h-12 w-12 text-red-400" />
          </div>
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight">404</h1>
        <p className="text-xl md:text-2xl font-medium text-gray-300">Oops! The page you’re looking for doesn’t exist.</p>
        <Link href="/">
          <span className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl transition duration-200">
            Go Back Home
          </span>
        </Link>
      </div>
    </main>
  );
}
