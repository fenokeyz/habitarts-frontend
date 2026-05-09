"use client";

export default function RedemptionsSection({
  pendingRedemptions,
  fulfillReward,
}: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold text-black mb-4">
        Pending Redemptions
      </h2>

      {pendingRedemptions.length === 0 && (
        <p className="text-gray-400">No pending rewards</p>
      )}

      {pendingRedemptions.map((item: any) => (
        <div
          key={item.redemption_id}
          className="flex justify-between items-center mb-2"
        >
          <span className="text-black">
            {item.title}
          </span>

          <button
            onClick={() => fulfillReward(item.reward_id)}
            className="text-sm bg-pink-400 text-white hover:bg-pink-500 transition cursor-pointer px-2 py-1 rounded-lg"
          >
            Mark Fulfilled
          </button>
        </div>
      ))}
    </div>
  );
}