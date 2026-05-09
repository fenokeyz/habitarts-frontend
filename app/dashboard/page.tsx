"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WalletCard from "@/components/WalletCard";
import { useToast } from "@/components/ToastProvider";
import AppLayout from "@/components/AppLayout";

export default function Dashboard() {
  const [wallet, setWallet] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [rewards, setRewards] = useState<any[]>([]);
  const [newRewardTitle, setNewRewardTitle] = useState("");
  const [newRewardCost, setNewRewardCost] = useState("");
  const [pendingRedemptions, setPendingRedemptions] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

    const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();
  const { addToast } = useToast();

  const buildChartData = (txData: any[]) => {
  let cumulative = 0;

  return txData.map((t: any) => {
    cumulative += Number(t.amount);

    return {
      timestamp: t.created_at,   // raw unique timestamp
      balance: cumulative,
    };
  });
};

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const payload = JSON.parse(
    atob(token.split(".")[1])
    );
    setUserInfo(payload);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wallet`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          router.push("/login");
        } else {
          setWallet(data);
        }
      });


    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goals/today`, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
    })
    .then(res => res.json())
    .then(data => {
        if (!data.error) {
        setGoals(data);
        }
    });
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rewards`, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
    })
    .then(res => res.json())
    .then(data => {
        if (!data.error) {
        setRewards(data);
        }
    });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rewards/redemptions`, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
    })
    .then(res => res.json())
    .then(data => {
        if (!data.error) {
        setPendingRedemptions(data);
        }
    });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wallet/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          const chartData = buildChartData(data);
          setTransactions(chartData);
        }
      });



  }, []);

  const addGoal = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goals/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: newGoal }),
  });

  const data = await res.json();

  if (!res.ok) {
    addToast(data.error || "Failed to create goal");
    return;
  }

  setGoals([...goals, data]);
  setNewGoal("");
  addToast("Goal created 💖");
};

const completeGoal = async (id: number) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/goals/${id}/complete`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!data.error) {
    setGoals(goals.map(g => g.id === id ? data.goal : g));

    // Refresh wallet
    const walletRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wallet`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const walletData = await walletRes.json();
    setWallet(walletData);

    const txRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/transactions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const txData = await txRes.json();

    const chartData = buildChartData(txData);
    setTransactions(chartData);

    addToast("Good job 💖 You earned 10 coins!");

  } else {
    alert(data.error);
  }
};

  if (!wallet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
const createReward = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rewards/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: newRewardTitle,
      cost: Number(newRewardCost),
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    addToast(data.error || "Failed to create reward");
    return;
  }

  setRewards([data, ...rewards]);
  setNewRewardTitle("");
  setNewRewardCost("");
  addToast("Reward created 💝");
};

const redeemReward = async (id: number) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/rewards/${id}/redeem`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!data.error) {
    setRewards(rewards.filter(r => r.id !== id));

    const walletRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wallet`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const walletData = await walletRes.json();
    setWallet(walletData);

    const txRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/transactions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const txData = await txRes.json();
    const chartData = buildChartData(txData);
    setTransactions(chartData);

    addToast("Reward redeemed 🎉");
  } else {
    alert(data.error);
  }
};

const fulfillReward = async (id: number) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/rewards/${id}/fulfill`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!data.error) {
    setPendingRedemptions(
      pendingRedemptions.filter(r => r.reward_id !== id)
    );
    addToast("Reward fulfilled 💕");
  } else {
    alert(data.error);
  }
};
console.log("DASHBOARD TX:", transactions);
return (
  <AppLayout>
    <div className="p-6 max-w-4xl mx-auto">
      <WalletCard wallet={wallet} transactions={transactions} />
    </div>
  </AppLayout>
);




}