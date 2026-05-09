"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RedemptionsSection from "@/components/RedemptionsSection";
import { useToast } from "@/components/ToastProvider";
import AppLayout from "@/components/AppLayout";

export default function RedemptionsPage() {
  const [pendingRedemptions, setPendingRedemptions] = useState<any[]>([]);
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rewards/redemptions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) setPendingRedemptions(data);
      });
  }, []);

  const fulfillReward = async (id: number) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/rewards/${id}/fulfill`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    if (!data.error) {
      setPendingRedemptions(
        pendingRedemptions.filter(r => r.reward_id !== id)
      );
      addToast("Reward fulfilled 💕");
    }
  };

  return (
    <AppLayout>
      <RedemptionsSection
        pendingRedemptions={pendingRedemptions}
        fulfillReward={fulfillReward}
      />
    </AppLayout>
  );
}