"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF8EE] to-pink-100 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-lg text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-pink-500 mb-4">
          💖 Habitarts
        </h1>

        <p className="text-gray-600 mb-8">
          Build habits together, stay consistent, and grow stronger as a couple.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-pink-400 hover:bg-pink-500 text-white py-3 rounded-xl transition font-semibold"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="w-full border-2 border-pink-400 text-pink-500 hover:bg-pink-50 py-3 rounded-xl transition font-semibold"
          >
            Register
          </button>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-400">
        Made with 💕 for meaningful relationships
      </p>
    </main>
  );
}