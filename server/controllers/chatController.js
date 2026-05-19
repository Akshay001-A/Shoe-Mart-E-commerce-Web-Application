/**
 * =================================================================================
 * CHAT CONTROLLER WITH DUAL AI & PERSONALIZED ORDER HISTORY ENGINE
 * =================================================================================
 * 
 * WHAT IT DOES:
 * This controller orchestrates natural language processing and multimodal vision
 * suggestions via Google's Gemini 2.5 Flash API. It acts as the bridge between 
 * the React client, our MongoDB catalog databases, and individual user histories.
 * 
 * WHY WE USE IT:
 * 1. To authenticate active clients optionally and pull their transaction history
 *    for styling personalization.
 * 2. To strictly validate session sequences (Gemini alternating history guidelines).
 * 3. To serve as a high-performance system routing natural queries to matching db products.
 * 
 * USEFULNESS:
 * Turns a standard chatbot into a smart retail fashion assistant that feels 
 * contextually aware and matches real products in stock rather than hallucinating.
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Order = require("../models/Order");

/**
 * =================================================================================
 * HELPER: DATABASE SEARCH LOGIC (searchShoesDb)
 * =================================================================================
 * WHAT IT DOES: 
 * Queries Mongoose products dynamically using optional regex filters on keywords, 
 * brand, category, and minimum/maximum price thresholds.
 * 
 * WHY WE USE IT:
 * Acts as the official function calling tool target. When Gemini wants to look up 
 * inventory, it triggers this helper rather than guessing.
 */
async function searchShoesDb({ keyword, category, brand, minPrice, maxPrice }) {
  try {
    const query = {};

    // 1. Text keyword search: Matches either product name or description (Case-Insensitive)
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // 2. Category matching (Case-Insensitive)
    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    // 3. Brand matching (Case-Insensitive)
    if (brand) {
      query.brand = { $regex: brand, $options: "i" };
    }

    // 4. Numeric range queries for exact pricing budgets
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    // Limit to 6 matched items for clean client carousel rendering
    return await Product.find(query).limit(6);
  } catch (error) {
    console.error("Database search error:", error);
    return [];
  }
}

/**
 * =================================================================================
 * CONTROLLER: MAIN CHAT INTERACTION ROUTE (handleChat)
 * =================================================================================
 * WHAT IT DOES:
 * Resolves prompt conversations, checks for multimodal outfit images, queries 
 * user order histories, and executes tool search actions using Gemini 2.5 Flash.
 */
const handleChat = async (req, res) => {
  const { message, history, image } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  let currentUser = null;
  let orderHistoryText = "";

  /**
   * ===============================================================================
   * 1. PERSONALIZED USER PROFILE INSIGHTS (OPTIONAL AUTHENTICATION)
   * ===============================================================================
   * WHAT IT DOES:
   * Decodes JWT token if passed in the Authorization header to pull the logged-in 
   * user profile and their last 3 transactions.
   * 
   * USEFULNESS:
   * Enhances styling context. Instead of generic help, Gemini greets users by name 
   * and customizes fashion ideas around items they already own.
   */
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      currentUser = await User.findById(decoded.id).select("-password");
      
      if (currentUser) {
        // Fetch up to 3 most recent orders for this specific customer
        const orders = await Order.find({ user: currentUser._id })
          .sort({ createdAt: -1 })
          .limit(3);
        
        if (orders && orders.length > 0) {
          const purchasedItems = [];
          orders.forEach(order => {
            order.orderItems.forEach(item => {
              purchasedItems.push(`${item.name} (${item.quantity}x)`);
            });
          });
          if (purchasedItems.length > 0) {
            orderHistoryText = `\n\n[USER PERSONALIZATION]\n- Name: ${currentUser.name}\n- Past Purchases: ${purchasedItems.join(", ")}. Use this information to personalize your suggestions and recommend matching/complementary footwear options!`;
          } else {
            orderHistoryText = `\n\n[USER PERSONALIZATION]\n- Name: ${currentUser.name}\n- Past Purchases: None yet. Welcome them warmly as a new customer!`;
          }
        } else {
          orderHistoryText = `\n\n[USER PERSONALIZATION]\n- Name: ${currentUser.name}\n- Past Purchases: None yet. Welcome them warmly as a new customer!`;
        }
      }
    } catch (err) {
      console.warn("Optional JWT auth failed in chatController:", err.message);
    }
  }

  const apiKey = process.env.GEMINI_API_KEY;

  /**
   * ===============================================================================
   * 2. GRACEFUL OFFLINE DEMO SEARCH FALLBACK
   * ===============================================================================
   * WHAT IT DOES:
   * If the API key is not configured or fails, we analyze the prompt text for key 
   * words and return a mock localized search result, avoiding application failure.
   */
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    console.warn("GEMINI_API_KEY is not set. Using offline fallback mode.");
    
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
    // Initialize Gemini SDK with active API key
    const genAI = new GoogleGenerativeAI(apiKey);

    /**
     * ===============================================================================
     * 3. CHAT HISTORY SANITIZATION ALGORITHM (ROLLING DIALOGUE RULES)
     * ===============================================================================
     * WHAT IT DOES:
     * Gemini requires strict conversational history alternation (user -> model -> user).
     * This loops through incoming message threads, strips duplicates, drops consecutive 
     * turns from the same role, and ensures the history array ends on a model turn 
     * before sending the new user message.
     */
    let formattedHistory = [];
    let expectedRole = "user"; 
    
    (history || []).forEach((h) => {
      if (h.text.trim() === message.trim() && h.sender === "user") {
        return;
      }
      
      const role = h.sender === "user" ? "user" : "model";
      if (role === expectedRole) {
        formattedHistory.push({
          role: role,
          parts: [{ text: h.text }],
        });
        expectedRole = expectedRole === "user" ? "model" : "user";
      }
    });

    if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === "user") {
      formattedHistory.pop();
    }

    /**
     * ===============================================================================
     * 4. GEMINI TOOL & SYSTEM DECLARATIONS (FUNCTION CALLING)
     * ===============================================================================
     * WHAT IT DOES:
     * Defines a formal schema of parameters (searchShoesTool) that Gemini can use 
     * to invoke search queries in our local database, along with stylistic behavior keys.
     */
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

    const systemInstruction = 
      "You are a highly stylish and friendly fashion chatbot assistant for Shoe Mart, a premium e-commerce shoe store. " +
      "Your name is 'Shoe Mart Fashion Guru'. Your goal is to help users with fashion advice (e.g. style coordination, " +
      "outfit recommendations, trends) and direct shoe recommendations. If the user asks to see shoes, recommendations, " +
      "or looks for products, you MUST call the 'searchShoes' tool to retrieve actual shoes from the database. " +
      "Do not make up or hallucinate shoes that do not exist. Keep responses brief, stylish, elegant, and engaging." +
      orderHistoryText;

     const model = genAI.getGenerativeModel({
       model: "gemini-2.5-flash",
       tools: [{ functionDeclarations: [searchShoesTool] }],
       systemInstruction: systemInstruction,
     });

    const chat = model.startChat({
      history: formattedHistory,
    });

    /**
     * ===============================================================================
     * 5. MULTIMODAL VISION PREPARATION (OUTFIT ANALYSIS)
     * ===============================================================================
     * WHAT IT DOES:
     * If the frontend uploads a base64 image data payload, we pack it into Gemini's 
     * inlineData structure. This gives Gemini the capability to "see" colors, 
     * textures, and styles in clothes and match footwear.
     */
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

    // Send payload to active generative stream
    const result = await chat.sendMessage(messagePayload);
    const functionCalls = result.response.functionCalls();

    /**
     * ===============================================================================
     * 6. FUNCTION EXECUTION & RESULTS LOOP
     * ===============================================================================
     * WHAT IT DOES:
     * If Gemini requests our searchShoes tool, we execute `searchShoesDb` locally, 
     * retrieve the actual database documents, pass the results back to Gemini in a 
     * `functionResponsePart` payload, and get the final descriptive fashion response.
     */
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      
      if (call.name === "searchShoes") {
        console.log("Gemini requested searchShoes with args:", call.args);
        
        const products = await searchShoesDb(call.args);

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

        const finalResult = await chat.sendMessage([functionResponsePart]);
        const finalMessage = finalResult.response.text();

        return res.json({
          message: finalMessage,
          products: products,
        });
      }
    }

    // Return direct general dialogue response if no database search was triggered
    return res.json({
      message: result.response.text(),
      products: [],
    });

  } catch (error) {
    console.error("Gemini Chat API Error:", error);
    
    // Graceful fallback to prevent server crashing during API rate limits (e.g. 429 errors)
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
