import React, { useRef, useEffect } from "react";

export default function ChatPanel({ messages, input, setInput, sendMessage }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white/80">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="text-xs text-indigo-500 font-semibold mb-1">{m.name || m.userId || "User"}</span>
            <span className="bg-indigo-100 text-indigo-800 rounded-lg px-3 py-2 w-fit max-w-full break-words shadow">
              {m.message}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center border-t border-indigo-200 p-2 bg-white">
        <input
          className="flex-1 rounded-lg border border-indigo-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 mr-2 text-sm"
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition text-sm shadow"
        >
          Send
        </button>
      </div>
    </div>
  );
}
