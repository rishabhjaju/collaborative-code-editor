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
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 3 }}>
        <select value={language} onChange={(e) => {
          setLanguage(e.target.value);
          socketRef.current.emit("language-change", { roomId, language: e.target.value });
        }}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="json">JSON</option>
        </select>
        <Editor height="90vh" language={language} theme="vs-dark" value={code} onChange={onChange} />
      </div>
      <ChatPanel messages={messages} input={input} setInput={setInput} sendMessage={sendMessage} />
    </div>
  );
}
