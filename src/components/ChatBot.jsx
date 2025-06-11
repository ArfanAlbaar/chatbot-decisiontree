// src/components/ChatBot.jsx
import Fuse from "fuse.js"; // Import Fuse.js
import { useEffect, useRef, useState } from "react";
import "../assets/ChatBot.css";
import decisionTree from "../data/ChatBotData.json";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const chatEndRef = useRef(null);

  // Function to scroll to the latest message
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to scroll down when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to initialize the chat when it opens, with personalization
  useEffect(() => {
    if (open) {
      const hasVisitedBefore = localStorage.getItem("chatbot_visited");
      const startNode = decisionTree.start;
      const greeting = hasVisitedBefore
        ? "Halo lagi! Senang bertemu denganmu kembali. Ada yang bisa dibantu?"
        : startNode.message;

      setMessages([
        {
          sender: "bot",
          text: greeting,
          options: startNode.options,
        },
      ]);

      if (!hasVisitedBefore) {
        localStorage.setItem("chatbot_visited", "true");
      }
    } else {
      setMessages([]); // Clear messages when closed
    }
  }, [open]);

  // Main function to handle user's choice (from button or text)
  const handleUserChoice = (option) => {
    const { label, next, type, url } = option;

    // Add user's choice to the chat messages
    const userMessage = { sender: "user", text: label };
    setMessages((prev) => [...prev, userMessage]);

    // Process the bot's response
    if (type === "external_link") {
      const botResponse = {
        sender: "bot",
        text: `Tentu, silakan klik tautan untuk ${label} di bawah ini.`,
        isLink: true,
        url: url,
        options: decisionTree["start"]?.options || [], // Provide main menu for next step
      };
      setTimeout(() => setMessages((prev) => [...prev, botResponse]), 500);
      return;
    }

    const nextNodeKey = next || decisionTree.default_fallback_node_key;
    const botNode =
      decisionTree[nextNodeKey] ||
      decisionTree[decisionTree.default_fallback_node_key];

    if (botNode) {
      const botResponse = {
        sender: "bot",
        text: botNode.message,
        options: botNode.options,
        imageUrl: botNode.image_url,
      };
      setTimeout(() => setMessages((prev) => [...prev, botResponse]), 500);
    }
  };

  // Handle text input submission with Fuzzy Matching
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const lastBotMessage = messages.filter((m) => m.sender === "bot").pop();
    const currentOptions = lastBotMessage?.options || [];

    // Fuse.js setup to search in both label and keywords
    const fuse = new Fuse(currentOptions, {
      keys: ["label", "keywords"],
      includeScore: true,
      threshold: 0.4, // Adjust for sensitivity (lower is stricter)
    });

    const result = fuse.search(userInput);

    // Add the raw user input to messages first
    const userMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, userMessage]);

    const matchedOption = result.length > 0 ? result[0].item : null;

    if (matchedOption) {
      // Trigger the bot response based on the best match
      const nextNodeKey =
        matchedOption.next || decisionTree.default_fallback_node_key;
      const botNode =
        decisionTree[nextNodeKey] ||
        decisionTree[decisionTree.default_fallback_node_key];
      const botResponse = {
        sender: "bot",
        text: botNode.message,
        options: botNode.options,
        imageUrl: botNode.image_url,
      };
      setTimeout(() => setMessages((prev) => [...prev, botResponse]), 500);
    } else {
      // If no good match, trigger the improved fallback node
      const fallbackNode = decisionTree[decisionTree.default_fallback_node_key];
      const botResponse = {
        sender: "bot",
        text: fallbackNode.message,
        options: fallbackNode.options,
      };
      setTimeout(() => setMessages((prev) => [...prev, botResponse]), 500);
    }
    setUserInput("");
  };

  // Toggle chat window open/close
  const toggleChat = () => {
    if (open) {
      setIsClosing(true);
      setTimeout(() => {
        setOpen(false);
        setIsClosing(false);
      }, 400);
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <button className="chatbot-button" onClick={toggleChat}>
        <i className={`bi ${open ? "bi-x-lg" : "bi-chat-dots-fill"}`}></i>
      </button>

      {open && (
        <div className={`chatbot-box ${isClosing ? "" : "active"}`}>
          <div className="chatbot-header">
            <span>Butuh Bantuan?</span>
            <button onClick={toggleChat} className="chatbot-close-btn">
              &times;
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-container ${msg.sender}`}>
                <div className="message">
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="chat content"
                      className="message-image"
                    />
                  )}
                  <p>{msg.text}</p>
                  {msg.isLink && (
                    <a
                      href={msg.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm mt-2"
                    >
                      Buka Tautan
                    </a>
                  )}
                </div>
                {msg.sender === "bot" &&
                  index === messages.length - 1 &&
                  msg.options && (
                    <div className="options-container">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          className="option-button"
                          onClick={() => handleUserChoice(opt)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="chatbot-input-form">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ketik pesanmu..."
              className="chatbot-input"
            />
            <button type="submit" className="chatbot-send-btn">
              <i className="bi bi-send-fill"></i>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
