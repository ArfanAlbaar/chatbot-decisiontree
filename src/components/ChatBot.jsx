// src/components/ChatBot.jsx
import { useState } from "react";
import "../assets/ChatBot.css"; // custom style below
import decisionTree from "../data/chatbotData.json";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentNode, setCurrentNode] = useState("start");

  function toggleChat() {
    if (open) {
      setIsClosing(true);
      setTimeout(() => {
        setOpen(false);
        setIsClosing(false);
        setCurrentNode("start");
      }, 400); // Match this with CSS transition duration
    } else {
      setOpen(true);
    }
  }

  const currentNodeData = decisionTree[currentNode];
  const fallbackNodeKey = decisionTree.default_fallback_node_key || "start"; // Default to "start" if not defined

  return (
    <>
      <button
        className="btn btn-primary rounded-circle chatbot-button"
        onClick={toggleChat}
      >
        {open ? "✕" : "💬"} {/* Change icon when open */}
      </button>

      {open && (
        <div className={`chatbot-box ${isClosing ? "" : "active"}`}>
          {" "}
          <div className="card-body">
            {currentNodeData ? (
              <>
                {currentNodeData.image_url && (
                  <img
                    src={currentNodeData.image_url}
                    alt="Chatbot content image"
                    className="img-fluid rounded mb-2"
                    style={{ maxHeight: "150px", objectFit: "cover" }}
                  />
                )}
                <p style={{ whiteSpace: "pre-wrap" }}>
                  {currentNodeData.message}
                </p>
                <div className="d-grid gap-2 mt-2">
                  {currentNodeData.options.map((opt, idx) => {
                    const buttonClasses = `btn btn-sm text-start ${
                      opt.isEmphasized ? "btn-primary" : "btn-outline-secondary"
                    }`;

                    if (opt.type === "external_link" && opt.url) {
                      return (
                        <a
                          key={idx}
                          href={opt.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={buttonClasses}
                          style={{ "--index": idx }}
                        >
                          {opt.label}
                        </a>
                      );
                    }
                    return (
                      <button
                        key={idx}
                        className={buttonClasses}
                        onClick={() => {
                          if (opt.next && decisionTree[opt.next]) {
                            setCurrentNode(opt.next);
                          } else if (opt.next) {
                            console.error(
                              `Chatbot Error: Node "${opt.next}" tidak ditemukan. Menggunakan fallback node.`
                            );
                            setCurrentNode(
                              decisionTree[fallbackNodeKey]
                                ? fallbackNodeKey
                                : "start"
                            );
                          }
                          // If no opt.next (e.g. for an external link that doesn't navigate internally), do nothing extra.
                        }}
                        style={{ "--index": idx }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <p>Maaf, terjadi kesalahan pada chatbot.</p> // Fallback if currentNodeData is somehow undefined
            )}
          </div>
        </div>
      )}
    </>
  );
}
