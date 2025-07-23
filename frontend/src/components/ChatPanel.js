import React from "react";

export default function ChatPanel({ messages, input, setInput, sendMessage }) {
  return (
    <div style={{ flex: 1, borderLeft: "1px solid #444", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ marginBottom: 5 }}>
            <strong>{m.userId}:</strong> {m.message}
          </div>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        <input style={{ flex: 1 }} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && sendMessage()} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
