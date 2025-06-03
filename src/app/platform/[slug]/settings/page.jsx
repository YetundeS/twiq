"use client";

import { Construction } from 'lucide-react';
import { useRouter } from 'next/navigation';

const UnderDevelopment = () => {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="bg-yellow-500/10 p-4 rounded-full border border-yellow-400/30 animate-pulse">
            <Construction className="h-12 w-12 text-yellow-400" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Page Under Development</h1>
        <p className="text-gray-300 text-lg">
          We're working hard to bring this page to life. Check back soon for updates!
        </p>
        <div className="pt-4">
          <button
            onClick={() => router.back()}
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-3 rounded-xl transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnderDevelopment;
