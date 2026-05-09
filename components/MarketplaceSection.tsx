"use client";

export default function MarketplaceSection({
  rewards,
  newRewardTitle,
  newRewardCost,
  setNewRewardTitle,
  setNewRewardCost,
  createReward,
  redeemReward,
  hasCouple,
}: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold text-black mb-4">
        Marketplace
      </h2>

      <div className="flex gap-2 mb-4">
        <input
          value={newRewardTitle}
          onChange={(e) => setNewRewardTitle(e.target.value)}
          className="flex-1 border p-2 rounded-lg text-black"
          placeholder="Reward title"
        />
        <input
          value={newRewardCost}
          onChange={(e) => setNewRewardCost(e.target.value)}
          className="w-20 border p-2 rounded-lg text-black"
          placeholder="Cost"
        />
       <button
        onClick={createReward}
        className={`px-4 py-2 rounded-lg text-white transition ${
            hasCouple
            ? "bg-purple-400 hover:bg-purple-500 cursor-pointer"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        >
        Add
        </button>
      </div>

      {rewards.map((reward: any) => (
        <div
          key={reward.id}
          className="flex justify-between items-center mb-2"
        >
          <span className="text-black">
            {reward.title} — {reward.cost} coins
          </span>

          <button
            onClick={() => redeemReward(reward.id)}
            className="text-sm bg-blue-400 hover:bg-blue-500 transition cursor-pointertext-white px-2 py-1 rounded-lg"
          >
            Redeem
          </button>
        </div>
      ))}
    </div>
  );
}