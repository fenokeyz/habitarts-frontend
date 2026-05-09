"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GoalsSection from "@/components/GoalsSection";
import { useToast } from "@/components/ToastProvider";
import AppLayout from "@/components/AppLayout";

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goals/today`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) setGoals(data);
      });
  }, []);

    const addGoal = async () => {
    if (!newGoal.trim()) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/goals/create`,
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newGoal }),
        }
    );

    const data = await res.json();

    if (!res.ok) {
        addToast(data.error || "Failed to add goal");
        return;
    }

    setGoals([...goals, data]);
    setNewGoal("");
    addToast("Goal added 💕");
    };
  const completeGoal = async (id: number) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/goals/${id}/complete`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    if (!data.error) {
      setGoals(goals.map(g => g.id === id ? data.goal : g));
      addToast("Goal completed 💖");
    }
  };

  return (
    <AppLayout>
      <GoalsSection
        goals={goals}
        newGoal={newGoal}
        setNewGoal={setNewGoal}
        addGoal={addGoal}
        completeGoal={completeGoal}
      />
    </AppLayout>
  );
}