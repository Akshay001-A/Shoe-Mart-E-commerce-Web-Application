/**
 * =================================================================================
 * FRONTEND CHATBOT COMPONENT (Chatbot.js) WITH VISION, VOICE & ORDER HISTORY
 * =================================================================================
 * 
 * WHAT IT DOES:
 * Renders a high-end collapsible floating conversational interface. It handles:
 * 1. 🎤 Speech-to-Text inputs natively via the Web Speech API.
 * 2. 📷 Base64 file attachments for outfit outfit matching.
 * 3. 👤 Dynamic JWT Authorization headers for personalized customer histories.
 * 4. 🛒 Dynamic inline product carousels to purchase shoes directly from the chat.
 * 
 * WHY WE USE IT:
 * Brings natural-language interaction, computer vision recommendations, and 
 * hands-free accessibility together into one beautiful React widget.
 * 
 * USEFULNESS:
 * Turns passive product browsing into a futuristic, conversational shopping spree!
 */

import { useState, useEffect, useRef } from "react";
import { API_URL } from "../config";
import "./Chatbot.css";

function Chatbot({ addToCart }) {
  // --- STATE HOOKS ---
  const [isOpen, setIsOpen] = useState(false); // Controls chat panel visibility
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am your Shoe Mart Fashion Guru 👟✨. Ask me any fashion advice, outfit matching tips, or shoe recommendations! You can also tap the 📷 icon to upload your outfit image, or the 🎤 icon to speak to me!",
      products: [],
    },
  ]);
  const [input, setInput] = useState(""); // Captures keyboard typing inputs
  const [isLoading, setIsLoading] = useState(false); // Manages bot styling loader states
  
  // Voice Assist States (Speech-to-Text Hooks)
  const [isListening, setIsListening] = useState(false); // Active microphone state
  const [recognition, setRecognition] = useState(null); // Reference to the Web Speech engine

  // Visual Multimodal Search States (Upload Hooks)
  const [selectedImage, setSelectedImage] = useState(null); // Stores base64, mime, and blob preview url
  const fileInputRef = useRef(null); // Reference to secret file input element

  const messagesEndRef = useRef(null); // Controls auto-scroll viewport anchors

  // AUTO-SCROLLER EFFECT
  // Scrolls the message window to the absolute bottom smoothly when new messages arrive.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /**
   * ===============================================================================
   * SPEECH RECOGNITION SETUP (Web Speech API)
   * ===============================================================================
   * WHAT IT DOES:
   * Initializes the browser's native speech-to-text recognition engine.
   * 
   * USEFULNESS:
   * Hands-free accessibility. Converts vocalized sound waves into active text characters.
   */
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false; // Stops recording immediately when the speaker finishes speaking
      rec.interimResults = false; // Only returns finalized transcriptions
      rec.lang = "en-IN"; // Configured for Indian English accents

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? prev + " " + transcript : transcript)); // Append speech directly to text input
      };

      rec.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, []);

  // Controls microphone toggle click listeners
  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  /**
   * ===============================================================================
   * FILE TO BASE64 ENCODER (FileReader)
   * ===============================================================================
   * WHAT IT DOES:
   * Reads raw uploaded local images and parses them into a safe base64-encoded string.
   * 
   * USEFULNESS:
   * Enables sending image files to backend Express routes as standard text strings inside 
   * standard JSON POST requests, avoiding complicated FormData boundaries.
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result.split(",")[1]; // Split out header meta data
      setSelectedImage({
        data: base64Data,
        mimeType: file.type,
        preview: URL.createObjectURL(file), // Generate localized Blob URL for temporary browser display
      });
    };
    reader.readAsDataURL(file);
  };

  // Clears active image attachments and cleans browser memory
  const removeImage = () => {
    if (selectedImage && selectedImage.preview) {
      URL.revokeObjectURL(selectedImage.preview); // Prevent memory leaks
    }
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /**
   * ===============================================================================
   * CORE MESSAGE PIPELINE (handleSend)
   * ===============================================================================
   * WHAT IT DOES:
   * Packages user prompts, history buffers, base64 images, and authorization tokens, 
   * sends them to the Node/Express server, and renders the natural language response.
   */
  const handleSend = async (textToSend) => {
    let queryText = textToSend || input;

    // Auto-prompt fallback if the user attaches an outfit but forgets to write text
    if (!queryText.trim() && selectedImage) {
      queryText = "Suggest the perfect shoes in your collection to match this outfit!";
    }

    if (!queryText.trim()) return;

    if (!textToSend) {
      setInput("");
    }

    const activeImage = selectedImage;
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Append user message instantly to visual conversation thread
    const userMsg = { 
      sender: "user", 
      text: queryText, 
      products: [], 
      imagePreview: activeImage ? activeImage.preview : null 
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Gather last 6 active conversation turns as a rolling memory buffer
      const chatHistory = updatedMessages.slice(-6).map((msg) => ({
        sender: msg.sender,
        text: msg.text,
      }));

      // Pull customer credentials for personalized greetings
      const userInfoLocal = JSON.parse(localStorage.getItem("userInfo"));

      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userInfoLocal && userInfoLocal.token ? { "Authorization": `Bearer ${userInfoLocal.token}` } : {}),
        },
        body: JSON.stringify({
          message: queryText,
          history: chatHistory,
          image: activeImage ? { data: activeImage.data, mimeType: activeImage.mimeType } : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data.message,
            products: data.products || [], // Inline database matches
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
      if (activeImage && activeImage.preview) {
        // Clean up visual Blob URL from browser RAM after delay
        setTimeout(() => URL.revokeObjectURL(activeImage.preview), 3000);
      }
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
      {/* Floating Chat Trigger Button */}
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

      {/* Main Chat Frame */}
      {isOpen && (
        <div className="chatbot-container">
          {/* Header Panel */}
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

          {/* Interactive Chat Thread Area */}
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
                    {/* Render visual upload previews in history cards */}
                    {msg.imagePreview && (
                      <div className="chatbot-message-image-wrapper">
                        <img
                          src={msg.imagePreview}
                          alt="Uploaded Outfit"
                          className="chatbot-message-image-content"
                        />
                      </div>
                    )}
                    <p className="chatbot-message-text">{msg.text}</p>
                  </div>

                  {/* Dynamic Product Recommendation Carousels */}
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
                                  // Quick conversational purchase indicator
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

            {/* AI Typing Indicator Dots */}
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

          {/* Quick Styling Suggestion Chips */}
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

          {/* Selected Attachment Preview Panel */}
          {selectedImage && (
            <div className="chatbot-image-upload-preview-container">
              <div className="chatbot-image-preview-wrapper">
                <img
                  src={selectedImage.preview}
                  alt="Selected Outfit"
                  className="chatbot-image-upload-preview"
                />
                <button
                  className="chatbot-image-upload-remove-btn"
                  onClick={removeImage}
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* User Input controls */}
          <div className="chatbot-input-area">
            {/* Hidden native input uploader */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

            {/* 📷 Outfit Camera Trigger */}
            <button
              type="button"
              className="chatbot-attach-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Attach outfit image"
              disabled={isLoading}
            >
              📷
            </button>

            {/* 🎤 Web Speech Microphone button */}
            <button
              type="button"
              className={`chatbot-mic-btn ${isListening ? "listening" : ""}`}
              onClick={toggleListening}
              title={isListening ? "Listening... click to stop" : "Speak to fashion assistant"}
              disabled={isLoading}
            >
              🎤
            </button>

            <input
              type="text"
              placeholder={isListening ? "Listening... speak now" : "Ask for style matching, recommendations..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="chatbot-input"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              className="chatbot-send-btn"
              disabled={(!input.trim() && !selectedImage) || isLoading}
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
