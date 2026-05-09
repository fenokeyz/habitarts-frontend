"use client";

import TransactionChart from "./TransactionChart";

export default function WalletCard({
  wallet,
  transactions,
}: any) {
  if (!wallet) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col h-[450px]">
      <h2 className="text-xl font-semibold text-black">
        Wallet Balance
      </h2>

      <div className="text-3xl font-bold text-pink-500 mt-2">
        {wallet.balance} coins
      </div>

      <div className="flex-1 mt-4 min-h-0">
        <TransactionChart data={transactions} />
      </div>
    </div>
  );
}