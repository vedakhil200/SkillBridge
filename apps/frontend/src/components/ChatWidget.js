import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./chat.css";

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { sender: "bot", text: "👋 Hi! I'm your SkillBridge AI assistant." }
  ]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    const newChat = [...chat, { sender: "user", text: userMessage }];
    setChat(newChat);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/chat", // ✅ FIXED ENDPOINT
        {
          message: userMessage
        }
      );

      setChat([
        ...newChat,
        { sender: "bot", text: res.data.reply }
      ]);
    } catch (err) {
      console.error(err);

      setChat([
        ...newChat,
        { sender: "bot", text: "⚠️ Error connecting to AI" }
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className="chat-button" onClick={() => setIsOpen(true)}>
          ✨
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-container">
          {/* Header */}
          <div className="chat-header">
            <div>
              <strong>✨ SkillBridge AI</strong>
              <p>Your learning assistant</p>
            </div>
            <span onClick={() => setIsOpen(false)}>✖</span>
          </div>

          {/* Messages */}
          <div className="chat-body">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.sender === "user"
                    ? "chat-message user"
                    : "chat-message bot"
                }
              >
                {msg.text.split("\n").map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="chat-message bot">Typing...</div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          {/* Input */}
          <div className="chat-input">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatWidget;