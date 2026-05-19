import { useState, useEffect, useRef } from "react";
import { API_URL } from "../config";
import "./Chatbot.css";

function Chatbot({ addToCart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am your Shoe Mart Fashion Guru 👟✨. Ask me any fashion advice, outfit matching tips, or shoe recommendations!",
      products: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle message send
  const handleSend = async (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    // Clear input
    if (!textToSend) {
      setInput("");
    }

    // Add user message
    const userMsg = { sender: "user", text: queryText, products: [] };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Gather chat history (excluding the very first greeting if desired, but passing last 6 is fine)
      const chatHistory = updatedMessages.slice(-6).map((msg) => ({
        sender: msg.sender,
        text: msg.text,
      }));

      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: queryText,
          history: chatHistory,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data.message,
            products: data.products || [],
          },
        ]);
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Chatbot request error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Oops! I encountered an error while coordinating with the style center. Please check your internet or try again in a bit! 😔",
          products: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const quickSuggestions = [
    "Suggest top running shoes 🏃‍♂️",
    "What shoes fit formal suits? 👔",
    "Show me stylish casual sneakers 👟",
    "Sizing & fashion tips 💡",
  ];

  return (
    <div className="chatbot-wrapper">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          className="chatbot-toggle-btn"
          onClick={() => setIsOpen(true)}
          title="Ask Fashion Guru"
        >
          <span className="chatbot-btn-icon">💬</span>
          <span className="chatbot-btn-badge">AI</span>
        </button>
      )}

      {/* Chat Box Container */}
      {isOpen && (
        <div className="chatbot-container">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <span className="chatbot-avatar-status"></span>
              <div>
                <h3>Fashion Guru</h3>
                <span className="chatbot-subtitle">Shoe Mart AI Assistant</span>
              </div>
            </div>
            <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          {/* Messages Viewport */}
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message-row ${
                  msg.sender === "user" ? "user-row" : "bot-row"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="chatbot-msg-avatar">🤖</div>
                )}
                
                <div className="chatbot-message-bubble-wrapper">
                  <div className="chatbot-message-bubble">
                    <p className="chatbot-message-text">{msg.text}</p>
                  </div>

                  {/* Inline Product Recommendations Carousel */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="chatbot-products-carousel">
                      {msg.products.map((product) => (
                        <div key={product._id} className="chatbot-product-card">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="chatbot-product-img"
                          />
                          <div className="chatbot-product-info">
                            <h4 className="chatbot-product-name">{product.name}</h4>
                            <p className="chatbot-product-brand">{product.brand}</p>
                            <p className="chatbot-product-price">₹{product.price}</p>
                            
                            {product.countInStock > 0 ? (
                              <button
                                onClick={() => {
                                  addToCart(product);
                                  // Add visual response
                                  setMessages((prev) => [
                                    ...prev,
                                    {
                                      sender: "bot",
                                      text: `Added ${product.name} to your cart! 🛒✨`,
                                      products: [],
                                    },
                                  ]);
                                }}
                                className="chatbot-product-add-btn"
                              >
                                Add to Cart
                              </button>
                            ) : (
                              <button className="chatbot-product-out-btn" disabled>
                                Out of Stock
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Loader */}
            {isLoading && (
              <div className="chatbot-message-row bot-row">
                <div className="chatbot-msg-avatar">🤖</div>
                <div className="chatbot-message-bubble loading-bubble">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && !isLoading && (
            <div className="chatbot-suggestions">
              {quickSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(suggestion)}
                  className="chatbot-suggestion-chip"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="chatbot-input-area">
            <input
              type="text"
              placeholder="Ask for style matching, recommendations..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="chatbot-input"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              className="chatbot-send-btn"
              disabled={!input.trim() || isLoading}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
