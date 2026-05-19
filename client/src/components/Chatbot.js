import { useState, useEffect, useRef } from "react";
import { API_URL } from "../config";
import "./Chatbot.css";

function Chatbot({ addToCart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am your Shoe Mart Fashion Guru 👟✨. Ask me any fashion advice, outfit matching tips, or shoe recommendations! You can also tap the 📷 icon to upload your outfit image, or the 🎤 icon to speak to me!",
      products: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Voice Assist States
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Visual Multimodal Search States
  const [selectedImage, setSelectedImage] = useState(null); // { data: "base64", mimeType: "...", preview: "blobUrl" }
  const fileInputRef = useRef(null);

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Set up Speech Recognition on component mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-IN"; // Supports general English and Indian English accents

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? prev + " " + transcript : transcript));
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

  // Voice recognition toggle
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

  // Convert uploaded file to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result.split(",")[1];
      setSelectedImage({
        data: base64Data,
        mimeType: file.type,
        preview: URL.createObjectURL(file),
      });
    };
    reader.readAsDataURL(file);
  };

  // Remove selected image preview
  const removeImage = () => {
    if (selectedImage && selectedImage.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle message send
  const handleSend = async (textToSend) => {
    let queryText = textToSend || input;

    // Use default text prompt if they upload an image but type nothing
    if (!queryText.trim() && selectedImage) {
      queryText = "Suggest the perfect shoes in your collection to match this outfit!";
    }

    if (!queryText.trim()) return;

    // Clear input
    if (!textToSend) {
      setInput("");
    }

    // Keep references to active selected image
    const activeImage = selectedImage;
    
    // Clear preview image before API call
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Add user message
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
      // Gather chat history (excluding the first greeting, only passing last 6 messages)
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
      // Clean up blob URL memory
      if (activeImage && activeImage.preview) {
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
                    {/* Render visual search upload in message history */}
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

          {/* Selected Image Attachment Preview before sending */}
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

          {/* Input Area */}
          <div className="chatbot-input-area">
            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

            {/* Attach Image Button */}
            <button
              type="button"
              className="chatbot-attach-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Attach outfit image"
              disabled={isLoading}
            >
              📷
            </button>

            {/* Voice Control Button */}
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
