"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
    localStorage.setItem("token", data.token);
    router.push("/dashboard");
    } else {
    alert(data.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8EE]">
      <div className="bg-white p-8 rounded-2xl shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-pink-400">Login</h2>

        <input
          className="w-full mb-3 p-2 border rounded-lg text-black"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-3 p-2 border rounded-lg text-black"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-pink-400 hover:bg-pink-500 transition text-white p-2 rounded-lg"
        >
          Login
        </button>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Don’t have an account?{" "}
          <span
            className="text-pink-500 cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}