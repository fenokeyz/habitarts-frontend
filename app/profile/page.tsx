"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import { useToast } from "@/components/ToastProvider";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [partner, setPartner] = useState<any>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [couple, setCouple] = useState<any>(null);
  const [editingDate, setEditingDate] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [creatingCouple, setCreatingCouple] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();
  


 const createCouple = async () => {
  if (creatingCouple) return; // safety guard

  setCreatingCouple(true);

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/couples/create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!data.error) {
      addToast("Couple created 💕");

      setUser({
        ...user,
        couple_id: data.id,
      });

      setCouple(data);
      setPartner(null);
    }
  } catch (err) {
    console.error(err);
    addToast("Something went wrong");
  } finally {
    setCreatingCouple(false); // unlock button
  }
};

const handleUnlink = async () => {
  const confirmUnlink = window.confirm(
    "Are you sure you want to unlink from your partner?"
  );

  if (!confirmUnlink) return;

  const token = localStorage.getItem("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/couples/unlink`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!data.error) {
    addToast("Unlinked successfully 💔");

    setUser({
      ...user,
      couple_id: null,
    });

    setCouple(null);
    setPartner(null);
  }
};

const handleCancelInvite = async () => {
  const confirmCancel = window.confirm(
    "Cancel this invite? This cannot be undone."
  );

  if (!confirmCancel) return;

  const token = localStorage.getItem("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/couples/cancel`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!data.error) {
    addToast("Invite cancelled");

    setUser({
      ...user,
      couple_id: null,
    });

    setCouple(null);
  }
};



  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setUser(data.user);
          setPartner(data.partner);
          setCouple(data.couple);
        }
      });
  }, []);

  const joinCouple = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/couples/join`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inviteCode }),
      }
    );

    const data = await res.json();

    if (!data.error) {
        addToast("Couple linked successfully 💕");

        setCouple(data.couple);
        setPartner(data.partner);

        setUser({
            ...user,
            couple_id: data.couple.id,
        });

        setInviteCode(""); // optional cleanup
        }
  };

  const saveDate = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/couples/update-date`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ date: newDate }),
    }
  );

  const data = await res.json();

  if (!data.error) {
    addToast("Relationship date updated 💖");

    setCouple({
        ...couple,
        created_at: newDate,
    });

    setEditingDate(false);
    }
};

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-pink-400 mb-6">
          Profile 💖
        </h2>

        {user && (
          <>
            <p className="text-black mb-2">
              <strong>Name:</strong> {user.name}
            </p>
            <p className="text-black mb-6">
              <strong>Email:</strong> {user.email}
            </p>
          </>
        )}

        {couple ? (

        <div className="mt-6 space-y-4">

            <h3 className="text-lg font-semibold text-black">
            Partner
            </h3>

            {partner ? (
            <p className="text-black">{partner.name}</p>
            ) : (
            <p className="text-gray-400">
                Waiting for partner to join...
            </p>
            )}

            <div>
            {couple?.invite_code && (
            <p className="text-black">
                <strong>Invite Code:</strong> {couple.invite_code}
            </p>
            )}
            </div>
            {!partner && (
                <button
                    onClick={handleCancelInvite}
                    className="text-gray-500 text-sm hover:underline"
                >
                    Cancel Invite
                </button>
                )}

            {couple && partner && (
            <>

                <div>
                    <p className="text-black mb-2">
                        <strong>Relationship Started:</strong>
                    </p>

                    {!editingDate ? (
                        <div className="flex items-center gap-3">
                        <span className="text-black">
                            {new Date(couple.created_at).toLocaleDateString()}
                        </span>

                        <button
                            onClick={() => {
                            setEditingDate(true);
                            setNewDate(couple.created_at.split("T")[0]);
                            }}
                            className="text-sm text-pink-500 hover:underline"
                        >
                            Edit
                        </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                        <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="border p-1 rounded text-black"
                        />

                        <button
                            onClick={saveDate}
                            className="bg-pink-400 hover:bg-pink-500 text-white px-3 py-1 rounded"
                        >
                            Save
                        </button>

                        <button
                            onClick={() => setEditingDate(false)}
                            className="text-gray-500 text-sm"
                        >
                            Cancel
                        </button>
                        </div>
                    )}
                </div>

                <div>
                {couple?.created_at && (
                <p className="text-black">
                    <strong>Streak:</strong>{" "}
                    {Math.floor(
                    (Date.now() - new Date(couple.created_at).getTime()) /
                    (1000 * 60 * 60 * 24)
                    )} days 💖
                </p>
                )}
                </div>
                <div className="mt-4">
                <button
                    onClick={handleUnlink}
                    className="text-red-500 hover:text-red-600 text-sm underline"
                >
                    Unlink from partner
                </button>
                </div>
            </>
            )}

        </div>

        ) : (

        <div className="mt-6 space-y-4">

            <h3 className="text-lg font-semibold text-black">
            Link With Partner
            </h3>

            <button
            onClick={createCouple}
            disabled={creatingCouple}
            className={`px-4 py-2 rounded-lg text-white transition ${
                creatingCouple
                ? "bg-purple-300 cursor-not-allowed"
                : "bg-purple-400 hover:bg-purple-500"
            }`}
            >
            {creatingCouple ? "Creating..." : "Create Couple"}
            </button>

            <div>
            <input
                placeholder="Enter invite code"
                className="w-full border p-2 rounded-lg text-black mb-3"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
            />

            <button
                onClick={joinCouple}
                className="bg-pink-400 hover:bg-pink-500 transition text-white px-4 py-2 rounded-lg"
            >
                Join
            </button>
            </div>

        </div>

        )}
      </div>
    </AppLayout>
  );
}