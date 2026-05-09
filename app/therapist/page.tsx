"use client";

import { useEffect, useState, useRef} from "react";
import AppLayout from "@/components/AppLayout";
import { useToast } from "@/components/ToastProvider";
import { io } from "socket.io-client";

export default function TherapistPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const { addToast } = useToast();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<any>(null);

  // 🔄 Scroll to bottom
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 📥 Fetch history
  useEffect(() => {
    const token = localStorage.getItem("token");
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL!);

    // 🔹 Get current user (IMPORTANT)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setUserId(data.user.id);
          const roomId = data.user.couple_id
            ? `couple_${data.user.couple_id}`
            : `couple_${data.user.id}`;

          socketRef.current.emit("join_room", roomId);
        }
      });

    // 🔹 Get chat history
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/therapist/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setMessages(data);
          setTimeout(scrollToBottom, 100);
        }
      });

    socketRef.current.on("new_message", (msg: any) => {
      setMessages(prev => [...prev, msg]);
      setTimeout(scrollToBottom, 100);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 📤 Send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    if (loading) return;

    const token = localStorage.getItem("token");

    const userMessage = {
      role: "user",
      message: input,
      user_id: userId,
    };

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/therapist/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: input }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        addToast(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      inputRef.current?.focus();

      setTimeout(scrollToBottom, 100);

    } catch (err) {
      addToast("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto flex flex-col h-[85vh] bg-white rounded-2xl shadow-md">
        
        {/* Header */}
        <div className="p-4 border-b text-center font-semibold text-pink-500">
          💬 Therapist
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[70%] p-3 rounded-xl ${
                msg.role === "assistant"
                  ? "mr-auto bg-gray-100 text-black"
                  : msg.user_id === userId
                  ? "ml-auto bg-pink-400 text-white"
                  : "mr-auto bg-blue-400 text-white"
              }`}
            >
              <div className={`text-xs mb-1 ${msg.role === "assistant" ? "text-gray-400" : "text-white/80"}`}>
                {msg.role === "assistant" ? "Therapist" : msg.name || "You"}
              </div>
              {msg.message}
            </div>
          ))}

          {loading && (
            <div className="mr-auto bg-gray-100 px-4 py-2 rounded-xl flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk about anything..."
            className="flex-1 border rounded-lg px-3 py-2 text-black"
          />

          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className={`px-4 rounded-lg text-white ${
              input.trim()
                ? "bg-pink-400 hover:bg-pink-500"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>

      </div>
    </AppLayout>
  );
}