"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Goals", path: "/goals" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Redemptions", path: "/redemptions" },
    { name: "Profile", path: "/profile" },
    { name: "Therapist", path: "/therapist" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8EE] relative">

      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-white shadow-md">
        <button
          onClick={() => setOpen(true)}
          className="text-2xl text-pink-500"
        >
          ☰
        </button>

        <h1 className="text-lg font-semibold text-pink-400">
          💖 Habitarts
        </h1>

        <div />
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col justify-between h-full p-6">

            {/* Top Nav */}
            <div>
                <h2 className="text-xl font-bold text-pink-400 mb-6">
                Navigation
                </h2>

                <nav className="space-y-4">
                {navItems.map((item) => (
                    <button
                    key={item.path}
                    onClick={() => {
                        router.push(item.path);
                        setOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-lg ${
                        pathname === item.path
                        ? "bg-pink-100 text-pink-500"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    >
                    {item.name}
                    </button>
                ))}
                </nav>
            </div>

            {/* Logout */}
            <button
                onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
                }}
                className="mt-6 bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg"
            >
                Logout
            </button>

            </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}