import React, { useEffect, useState, useRef } from "react";
import CryptoJS from "crypto-js";
import { socket } from "./socket";
import "./index.css";

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [now, setNow] = useState(Date.now());

  const chatBoxRef = useRef(null);
  const ENCRYPTION_KEY = "cloaktalk-secret-key";

  const classifyMessage = (msg) => {
    if (/\b\d{16}\b/.test(msg)) return "high"; // credit card
    if (/\b\d{12}\b/.test(msg)) return "high"; // aadhar
    if (/[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(msg)) return "high"; // PAN
    if (/\b\d{3}-\d{2}-\d{4}\b/.test(msg)) return "high"; // SSN
    if (/^\d{4,6}$/.test(msg.trim())) return "high"; // OTP
    if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(msg)) return "medium"; // email
    if (/\b\d{10}\b/.test(msg)) return "medium"; // phone
    return "low";
  };

  useEffect(() => {
    if (!username) {
      const name = prompt("Enter your username") || "Anonymous";
      setUsername(name);
      socket.emit("setUsername", name);
    }
  }, [username]);

  useEffect(() => {
    socket.on("chatMessage", (data) => {
      let decrypted = data.message;
      try {
        decrypted = CryptoJS.AES.decrypt(data.message, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
      } catch {}
      setMessages((prev) => [...prev, { ...data, message: decrypted }]);
    });

    socket.on("deleteMessage", ({ id }) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    });

    socket.on("systemMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("typing", ({ username }) => {
      setTypingUsers((prev) => [...new Set([...prev, username])]);
    });

    socket.on("stopTyping", ({ username }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== username));
    });

    return () => {
      socket.off("chatMessage");
      socket.off("deleteMessage");
      socket.off("systemMessage");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const joinRoom = () => {
    if (!room.trim()) return;
    socket.emit("joinRoom", room);
    setJoined(true);
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom");
    setJoined(false);
    setMessages([]);
    setRoom("");
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const sensitivity = classifyMessage(message);
    const encryptedMessage = CryptoJS.AES.encrypt(message, ENCRYPTION_KEY).toString();

    socket.emit("chatMessage", { username, message: encryptedMessage, sensitivity, timestamp: Date.now() });
    setMessage("");
    socket.emit("stopTyping");
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing");
    if (e.target.value === "") {
      socket.emit("stopTyping");
    }
  };

  const getCountdown = (msg) => {
    if (!msg.sensitivity || msg.sensitivity === "low") return null;
    const timeout = msg.sensitivity === "high" ? 30000 : 60000;
    const expiry = msg.timestamp + timeout;
    const remaining = Math.max(0, Math.ceil((expiry - now) / 1000));

    return remaining > 0 ? <strong>{remaining}s</strong> : null;
  };

  return (
    <div className="chat-container">
      <h2>CloakTalk</h2>

      {!joined && (
        <div className="room-selection">
          <input
            type="text"
            placeholder="Enter room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      )}

      {joined && (
        <>
          <div className="chat-header">
            <span className="room-name">Room: {room}</span>
            <button onClick={leaveRoom} className="leave-btn">Leave Room</button>
          </div>

          <div className="chat-box" ref={chatBoxRef}>
            {messages.length === 0 && <div className="placeholder">No messages yet</div>}
            {messages.map((msg) =>
              msg.username === "System" ? (
                <div key={msg.id} className="system-message">{msg.message}</div>
              ) : (
                <div
                  key={msg.id}
                  className={`message ${msg.sensitivity || ""} ${msg.username === username ? "own" : ""}`}
                >
                  <strong>{msg.username === username ? "You" : msg.username}:</strong> {msg.message}
                  {msg.sensitivity !== "low" && (
                    <div className="meta">(Auto-deletes in {getCountdown(msg)})</div>
                  )}
                </div>
              )
            )}
            {typingUsers.length > 0 && (
              <div className="typing">
                {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
              </div>
            )}
          </div>

          <form className="input-box" onSubmit={sendMessage}>
            <input
              type="text"
              value={message}
              onChange={handleTyping}
              placeholder="Type a message..."
            />
            <button type="submit">Send</button>
          </form>
        </>
      )}
    </div>
  );
}

export default App;
