import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import { useAuth } from "../context/AuthContext";
import ChatPanel from "./ChatPanel";

export default function EditorRoom() {
  const { roomId } = useParams();
  const { token } = useAuth();
  const socketRef = useRef();
  const [code, setCode] = useState("// Happy coding!");
  const [language, setLanguage] = useState("javascript");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socketRef.current = io("http://localhost:5000", {
      auth: { token },
    });

    socketRef.current.emit("join-room", { roomId });

    socketRef.current.on("init", (state) => {
      setCode(state.code);
      setLanguage(state.language);
    });
    socketRef.current.on("code-change", ({ code }) => setCode(code));
    socketRef.current.on("language-change", ({ language }) => setLanguage(language));
    socketRef.current.on("chat-message", (msg) => setMessages((prev) => [...prev, msg]));

    return () => socketRef.current.disconnect();
  }, [roomId, token]);

  const onChange = (val) => {
    setCode(val);
    socketRef.current.emit("code-change", { roomId, code: val });
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    socketRef.current.emit("chat-message", { roomId, message: input });
    setInput("");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex-1 flex flex-col p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-indigo-700">Room:</span>
            <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-sm font-mono">{roomId}</span>
          </div>
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              socketRef.current.emit("language-change", { roomId, language: e.target.value });
            }}
            className="border border-indigo-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-indigo-700 font-medium shadow"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="json">JSON</option>
          </select>
        </div>
        <div className="flex-1 rounded-xl overflow-hidden shadow-lg border border-indigo-200 bg-white">
          <Editor
            height="75vh"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={onChange}
            options={{ fontSize: 16, minimap: { enabled: false } }}
          />
        </div>
      </div>
      <div className="w-full md:w-96 border-l border-indigo-200 bg-white/80 shadow-lg flex flex-col">
        <ChatPanel messages={messages} input={input} setInput={setInput} sendMessage={sendMessage} />
      </div>
    </div>
  );
}
