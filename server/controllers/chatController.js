const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../models/Product");

// Helper function to search shoes in MongoDB
async function searchShoesDb({ keyword, category, brand, minPrice, maxPrice }) {
  try {
    const query = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    if (brand) {
      query.brand = { $regex: brand, $options: "i" };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    // Return up to 6 matched shoes
    return await Product.find(query).limit(6);
  } catch (error) {
    console.error("Database search error:", error);
    return [];
  }
}

// Controller logic for chat
const handleChat = async (req, res) => {
  const { message, history, image } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // GRACEFUL FALLBACK IF GEMINI API KEY IS MISSING OR NOT CONFIGURED
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    console.warn("GEMINI_API_KEY is not set. Using offline fallback mode.");
    
    // Look at message keywords to offer an intelligent mock response
    let products = [];
    let responseText = "";

    const msgLower = message.toLowerCase();
    if (msgLower.includes("run") || msgLower.includes("sport") || msgLower.includes("athlet")) {
      products = await Product.find({ category: /running/i }).limit(3);
      responseText = "Hello! I'm in Demo Mode since the Google Gemini API key is not configured. But I noticed you are looking for running/sport shoes! Here are some excellent high-performance shoes from our collection:";
    } else if (msgLower.includes("casual") || msgLower.includes("sneaker")) {
      products = await Product.find({ category: /casual/i }).limit(3);
      responseText = "Hello there! I'm in Demo Mode right now. It looks like you're interested in casual shoes or sneakers! Here are some of our most stylish everyday options:";
    } else if (msgLower.includes("formal") || msgLower.includes("dress") || msgLower.includes("boot")) {
      products = await Product.find({ category: { $in: [/formal/i, /boot/i] } }).limit(3);
      responseText = "Hi! Since the API key is not yet set up, I'm running in offline mode. For a formal or premium look, here are some elegant models we recommend:";
    } else {
      products = await Product.find({}).limit(3);
      responseText = "Welcome! I'm the Shoe Mart Fashion Guru. Currently, I'm in Demo Mode (please add a GEMINI_API_KEY to server/.env to enable full AI style advice). How can I assist you with your fashion choice? Here is a quick peak at some of our popular shoes:";
    }

    return res.json({
      message: responseText,
      products: products
    });
  }

  try {
    // Initialize Gemini SDK
    const genAI = new GoogleGenerativeAI(apiKey);

    // Format frontend history to Gemini format
    // Expected: [{ role: 'user'|'model', parts: [{ text: '...' }] }]
    // Gemini SDK requires history to alternate user/model turns and start with a user turn.
    let formattedHistory = [];
    let expectedRole = "user"; // First message must be user
    
    (history || []).forEach((h) => {
      // Skip if it's the current active message to avoid duplication
      if (h.text.trim() === message.trim() && h.sender === "user") {
        return;
      }
      
      const role = h.sender === "user" ? "user" : "model";
      if (role === expectedRole) {
        formattedHistory.push({
          role: role,
          parts: [{ text: h.text }],
        });
        // Alternate expected role
        expectedRole = expectedRole === "user" ? "model" : "user";
      }
    });

    // Since the last message in formattedHistory must be from "model" for sendMessage to work:
    // If the history ends with a "user" turn, we drop the last turn so the next turn is "user" (sendMessage).
    if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === "user") {
      formattedHistory.pop();
    }

    // Declare the searchShoes tool
    const searchShoesTool = {
      name: "searchShoes",
      description: "Search the store's shoe database by keyword, brand, category, and price range to recommend matching shoes to the user.",
      parameters: {
        type: "OBJECT",
        properties: {
          keyword: {
            type: "STRING",
            description: "A keyword to match in shoe name or description (e.g. 'sport', 'retro', 'waterproof').",
          },
          category: {
            type: "STRING",
            description: "The shoe category (e.g. 'Running', 'Casual', 'Formal', 'Boots').",
          },
          brand: {
            type: "STRING",
            description: "The brand name (e.g. 'Nike', 'Adidas', 'Puma').",
          },
          minPrice: {
            type: "NUMBER",
            description: "Minimum price threshold.",
          },
          maxPrice: {
            type: "NUMBER",
            description: "Maximum price threshold.",
          },
        },
      },
    };

    // System instruction for the assistant
    const systemInstruction = 
      "You are a highly stylish and friendly fashion chatbot assistant for Shoe Mart, a premium e-commerce shoe store. " +
      "Your name is 'Shoe Mart Fashion Guru'. Your goal is to help users with fashion advice (e.g. style coordination, " +
      "outfit recommendations, trends) and direct shoe recommendations. If the user asks to see shoes, recommendations, " +
      "or looks for products, you MUST call the 'searchShoes' tool to retrieve actual shoes from the database. " +
      "Do not make up or hallucinate shoes that do not exist. Keep responses brief, stylish, elegant, and engaging.";

     // Get the generative model with tools and instructions
     const model = genAI.getGenerativeModel({
       model: "gemini-2.5-flash",
       tools: [{ functionDeclarations: [searchShoesTool] }],
       systemInstruction: systemInstruction,
     });

    // Start a chat session
    const chat = model.startChat({
      history: formattedHistory,
    });

    // Handle multimodal image payload if present
    let messagePayload = message;
    if (image && image.data && image.mimeType) {
      messagePayload = [
        {
          inlineData: {
            data: image.data,
            mimeType: image.mimeType,
          },
        },
        { text: message },
      ];
    }

    // Send user message
    const result = await chat.sendMessage(messagePayload);
    const functionCalls = result.response.functionCalls();

    // Check if the AI called a function
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      
      if (call.name === "searchShoes") {
        console.log("Gemini requested searchShoes with args:", call.args);
        
        // Execute database search
        const products = await searchShoesDb(call.args);

        // Format search results to send back to the AI
        const functionResponsePart = {
          functionResponse: {
            name: "searchShoes",
            response: {
              products: products.map((p) => ({
                id: p._id.toString(),
                name: p.name,
                brand: p.brand,
                category: p.category,
                price: p.price,
                description: p.description,
              })),
            },
          },
        };

        // Send function result back to Gemini to get the final natural language answer
        const finalResult = await chat.sendMessage([functionResponsePart]);
        const finalMessage = finalResult.response.text();

        return res.json({
          message: finalMessage,
          products: products,
        });
      }
    }

    // Standard conversational response (no tool call needed)
    return res.json({
      message: result.response.text(),
      products: [],
    });

  } catch (error) {
    console.error("Gemini Chat API Error:", error);
    
    // In case of any rate limit or API key error, use graceful fallback
    try {
      const products = await Product.find({}).limit(3);
      return res.json({
        message: "I'm having a little trouble connecting to my creative center right now, but here are some of our wonderful shoes that are always in style! How can I help you choose today?",
        products: products,
      });
    } catch (dbError) {
      return res.status(500).json({ message: "An error occurred on the chat server." });
    }
  }
};

module.exports = {
  handleChat,
};
