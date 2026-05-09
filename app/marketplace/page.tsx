"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MarketplaceSection from "@/components/MarketplaceSection";
import { useToast } from "@/components/ToastProvider";
import AppLayout from "@/components/AppLayout";

export default function MarketplacePage() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [newRewardTitle, setNewRewardTitle] = useState("");
  const [newRewardCost, setNewRewardCost] = useState("");
  const [hasCouple, setHasCouple] = useState(true);

  const router = useRouter();
  const { addToast } = useToast();

    useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        router.push("/login");
        return;
    }

    // Fetch rewards
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rewards`, {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then(res => res.json())
        .then(data => {
        if (!data.error) setRewards(data);
        });

    // Fetch profile to check couple
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then(res => res.json())
        .then(data => {
        if (!data.couple) {
            setHasCouple(false);
        }
        });

    }, []);

    const createReward = async () => {
    if (!hasCouple) {
    addToast("You must be in a couple to create rewards 💕");
    return;
    }
    if (!newRewardTitle.trim() || !newRewardCost) return;

    const token = localStorage.getItem("token");

    try {
        const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/rewards/create`,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
            title: newRewardTitle,
            cost: Number(newRewardCost),
            }),
        }
        );

        const data = await res.json();

        if (!res.ok) {
        addToast(data.error || "You must be in a couple to create rewards 💕");
        return;
        }

        setRewards([data, ...rewards]);
        setNewRewardTitle("");
        setNewRewardCost("");
        addToast("Reward created 💝");

    } catch (err) {
        addToast("Something went wrong");
    }
    };

    const redeemReward = async (id: number) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/rewards/${id}/redeem`,
        {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        }
    );

    const data = await res.json();

    if (!res.ok) {
        addToast(data.error || "Cannot redeem reward");
        return;
    }

    setRewards(rewards.filter(r => r.id !== id));
    addToast("Reward redeemed 🎉");
    };

  return (
    <AppLayout>
      <MarketplaceSection
        rewards={rewards}
        newRewardTitle={newRewardTitle}
        newRewardCost={newRewardCost}
        setNewRewardTitle={setNewRewardTitle}
        setNewRewardCost={setNewRewardCost}
        createReward={createReward}
        redeemReward={redeemReward}
        hasCouple={hasCouple}
      />
    </AppLayout>
  );
}