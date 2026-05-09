"use client";

export default function GoalsSection({
  goals,
  newGoal,
  setNewGoal,
  addGoal,
  completeGoal,
}: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold text-black mb-4">
        Today's Goals
      </h2>

      <div className="flex gap-2 mb-4">
        <input
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          className="flex-1 border p-2 rounded-lg text-black"
          placeholder="Add a goal..."
        />
        <button
        onClick={addGoal}
        className="bg-pink-400 hover:bg-pink-500 transition cursor-pointer text-white px-4 rounded-lg"
        >
        Add
        </button>
      </div>

      {goals.map((goal: any) => (
        <div
          key={goal.id}
          className="flex justify-between items-center mb-2"
        >
          <span
            className={`text-black ${
              goal.is_completed ? "line-through text-gray-400" : ""
            }`}
          >
            {goal.title}
          </span>

          {!goal.is_completed && (
            <button
              onClick={() => completeGoal(goal.id)}
              className="text-sm bg-green-400 text-white px-2 py-1 rounded-lg"
            >
              Complete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}