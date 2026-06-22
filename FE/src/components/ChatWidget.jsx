import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { API_URL } from "../config";
import styles from "./ChatWidget.module.css";

let socketInstance = null;

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadHistory = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await fetch(`${API_URL}/api/chat/history/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setMessages(data);
    } catch (_) {}
  }, [user?._id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user) return;
    // Only connect once
    if (!socketInstance) {
      socketInstance = io(API_URL, {
        auth: { token },
        transports: ["websocket"],
      });
    }

    socketInstance.on("connect", () => setConnected(true));
    socketInstance.on("disconnect", () => setConnected(false));

    socketInstance.on("message:new", (msg) => {
      setMessages((prev) => {
        // Avoid duplicate
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      if (!open && msg.senderRole === "admin") {
        setUnread((u) => u + 1);
      }
    });

    loadHistory();

    return () => {
      socketInstance?.off("message:new");
    };
  }, [open, loadHistory]);

  const handleOpen = () => {
    setOpen(true);
    setUnread(0);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !socketInstance) return;
    socketInstance.emit("customer:send", { text: input.trim() });
    setInput("");
  };

  // Only show for logged-in customers (not admin/vendor)
  if (!user || user.role !== "customer") return null;

  return (
    <div className={styles.chatWrapper}>
      {open && (
        <div className={styles.chatBox}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <div className={`${styles.statusDot} ${connected ? styles.online : styles.offline}`} />
              <div>
                <div className={styles.headerTitle}>Hỗ trợ AN Wedding</div>
                <div className={styles.headerSub}>{connected ? "Đang trực tuyến" : "Đang kết nối..."}</div>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className={styles.messages}>
            {messages.length === 0 && (
              <div className={styles.emptyState}>
                <span>👋</span>
                <p>Xin chào! Bạn cần hỗ trợ gì không? Hãy nhắn tin cho chúng tôi!</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={msg._id || idx}
                className={`${styles.message} ${msg.senderRole === "customer" ? styles.mine : styles.theirs}`}
              >
                {msg.senderRole === "admin" && (
                  <div className={styles.senderLabel}>{msg.senderName || "Admin AN Wedding"}</div>
                )}
                <div className={styles.bubble}>{msg.text}</div>
                <div className={styles.timestamp}>
                  {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className={styles.inputArea} onSubmit={handleSend}>
            <input
              className={styles.input}
              type="text"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
            />
            <button className={styles.sendBtn} type="submit" disabled={!input.trim()}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating toggle button */}
      <button className={styles.fabBtn} onClick={open ? () => setOpen(false) : handleOpen}>
        {open ? (
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        )}
        {unread > 0 && !open && <span className={styles.badge}>{unread}</span>}
      </button>
    </div>
  );
};

export default ChatWidget;
