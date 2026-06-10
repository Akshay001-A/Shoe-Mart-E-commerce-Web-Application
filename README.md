<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:ff512f,50:dd2476,100:1e3c72&height=260&section=header&text=Shoe%20Mart&fontSize=55&fontColor=ffffff&animation=fadeIn&fontAlignY=38"/>

# 👟 Shoe Mart

### 🛒 AI-Powered Full Stack MERN eCommerce Web Application

<p align="center">
  <img src="https://img.shields.io/badge/React.js-Frontend-61DAFB?style=for-the-badge&logo=react"/>
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb"/>
  <img src="https://img.shields.io/badge/Express.js-REST_API-black?style=for-the-badge&logo=express"/>
  <img src="https://img.shields.io/badge/Gemini_2.5_Flash-Generative_AI-blue?style=for-the-badge&logo=google-gemini"/>
  <img src="https://img.shields.io/badge/OpenCLIP-AI_Vision_Model-purple?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/PyTorch-Deep_Learning-red?style=for-the-badge&logo=pytorch"/>
</p>

### 🚀 [Explore the Live Demo Website!](https://shoemart-frontend.onrender.com/)

<br/>

<img src="https://readme-typing-svg.herokuapp.com?font=Poppins&size=28&duration=3000&color=36BCF7&center=true&vCenter=true&width=1000&lines=State-of-the-Art+AI-Powered+eCommerce;Multimodal+Gemini+Assistant+%7C+OpenCLIP+Search;Voice-Activated+Chatbot+%7C+Blazing+Fast+Vision;Modern+MERN+Stack+Platform"/>

</div>

---

# 🌟 Project Overview

Shoe Mart is a highly advanced **AI-Powered Full Stack MERN eCommerce Platform** designed to deliver next-generation shopping experiences. By bridging state-of-the-art Generative AI and mathematical Computer Vision, Shoe Mart offers shoppers a smart, fluid, and personalized outfit-matching interface.

### The application combines three powerful architectures:
1. 🌐 **Full-Stack MERN E-Commerce**: Full user shopping cart pipelines, secure checkout, product catalog management, and administrative dashboards.
2. 🤖 **Gemini 2.5 Flash Chatbot (Fashion Guru)**: A voice-enabled conversational assistant that uses multimodal outfit uploads to suggest matching shoes directly from MongoDB.
3. 📸 **CLIP-AI Search Microservice**: An open-source computer vision server running OpenCLIP to mathematically find visually identical shoes from raw pictures in <5ms.

---

# 🤖 The AI Fashion Guru Chatbot
<p align="center">
  <img src="https://img.shields.io/badge/Conversational_AI-Google_Gemini-blue?style=flat-square&logo=google-gemini"/>
  <img src="https://img.shields.io/badge/Voice_Transcribe-Web_Speech_API-green?style=flat-square"/>
  <img src="https://img.shields.io/badge/Image_Analysis-Multimodal-purple?style=flat-square"/>
</p>

The **Shoe Mart Fashion Guru** is a premium, collapsable AI chatbot floating directly on the storefront, designed to mimic a human retail assistant.

### 🌟 Key Chatbot Superpowers:
* **📸 Multimodal Visual Outfit Search**: Users can upload a photo of their outfit (e.g. a green dress, jeans and sweater, or sports apparel) using the camera (📷) trigger. Gemini 2.5 Flash visually analyzes the outfit colors and style, calls our database search tool, and recommends the perfect coordinating footwear!
* **🎤 Voice-Activated Input (Web Speech API)**: Users can speak their questions hands-free by clicking the microphone (🎤) button. The app uses the native browser Web Speech API to transcribe their voice directly into the chatbox with a high-end glowing red pulsing mic animation.
* **🛠️ Direct Database Integration (Function Calling)**: Instead of hallucinating shoes that do not exist, Gemini is declared with active database tools. When asked for suggestions, the AI executes a MongoDB query to fetch real-time stock and display shoes instantly.
* **🛒 Interactive Checkout Carousel**: Matching shoes are rendered inside an interactive horizontal product carousel right inside the chat window. Users can add products to their shopping cart with a single click inside the chat.


# 🤖 AI Chatbot Preview

<div align="center">

<img src="https://github.com/Akshay001-A/Shoe-Mart-E-commerce-Web-Application/blob/main/screenshots/chatbot.png?raw=true" width="100%"/>

### 💬 Integrated AI Shopping Assistant

</div>

---

# ⚡ Dual AI Search Architecture

Shoe Mart employs two distinct, highly optimized AI workflows:

### A. Conversational Gemini Chatbot Workflow (Semantic & Outfit Matching)
```text
User uploads Outfit Photo + asks "What goes with this?"
                   ↓
React Frontend converts image to Base64 & packages prompt
                   ↓
Express Backend routes to handleChat controller
                   ↓
Gemini 2.5 Flash processes Multimodal Parts [image, text]
                   ↓
AI executes "searchShoes" database tool call with arguments
                   ↓
MongoDB returns matching products matching query parameters
                   ↓
Gemini returns fashion advice alongside products
                   ↓
Frontend displays text reply & adds shoes to interactive cart carousel
```

### B. Flask CLIP-AI Search Workflow (Visual Search / Google Lens)
```text
User uploads a Shoe photo to visual search bar
                   ↓
Express Server forwards image to Flask AI Server (Port 8000)
                   ↓
OpenCLIP Model (ViT-B-32) extracts the image feature tensor
                   ↓
Server executes rapid Cosine Similarity against cached database embeddings
                   ↓
Flask returns the top 5 visually similar database product IDs in <5ms
                   ↓
React Frontend renders visually matching catalog items instantly
```

---

# ⚡ Blazing-Fast CLIP-AI Optimizations

The Python **`clip-ai`** Flask microservice has been completely optimized to follow high-speed, professional-grade deep learning standards:

* **🚀 Startup Embedding Cache**: Instead of encoding the entire database on every single request (which causes massive CPU bottlenecks), the Flask server pre-computes all product image embeddings **once** on launch and stores them in memory. Image search comparisons now take **less than 5 milliseconds**!
* **🌐 Cross-Origin Headers (CORS)**: Built native response header wrappers to support pre-flight requests, enabling React (Port 3000) to communicate directly with Flask (Port 8000) seamlessly.
* **📦 Dynamic Cache Refresh**: Includes a `/refresh-cache` POST endpoint. If administrators add new products to the catalog, they can rebuild the embedding cache dynamically in real-time without needing to restart the Python process.


# 📸 AI Visual Search Demo

<div align="center">

<img src="https://github.com/Akshay001-A/Shoe-Mart-E-commerce-Web-Application/blob/main/screenshots/search.png?raw=true" width="100%"/>

### 🤖 AI Visual Product Matching System

</div>

---



# 🧰 Technology Stack

<div align="center">

| Layer | Technologies Used | Purpose |
|---|---|---|
| **Frontend** | React.js (v18), Vanilla CSS3, HTML5 | Modern responsive client shell |
| **Backend** | Node.js, Express.js | Core REST API and database orchestration |
| **AI Orchestration**| Google Generative AI SDK, Web Speech API | Powers Gemini 2.5 Flash chatbot and voice assist |
| **Database** | MongoDB Atlas, Mongoose ODM | Managed cloud storage for products & orders |
| **AI Vision Server**| Python 3, Flask | Deep learning microservice on Port 8000 |
| **Vision Models** | OpenCLIP (`ViT-B-32`), PyTorch | Feature extraction and pixel cosine similarity |

</div>

---

# 👤 Product & Shopping Highlights

✅ **20+ Premium Shoe Catalog**: Pre-populated with diverse, high-quality Nike, Adidas, Puma, Reebok, Woodlands, and Red Tape athletic, casual, formal, and trail shoes.  
✅ **Interactive Shopping Cart**: Live quantity increments, real-time total calculations, and out-of-stock validation.  
✅ **Role-Based Dashboards**: Full customer panels to view past orders and responsive administrative forms to edit/delete items.  
✅ **Robust Error Handling**: Chatbot automatically switches to a graceful offline demo search mode if API keys are unconfigured, preventing site crashes.

---

# 📸 Application Screenshots

### 🏠 Storefront Catalog
<img src="https://github.com/Akshay001-A/Shoe-Mart-E-commerce-Web-Application/blob/main/screenshots/home1.png?raw=true" width="100%"/>

---

### 👟 Advanced Shopping Cart
<img src="https://github.com/Akshay001-A/Shoe-Mart-E-commerce-Web-Application/blob/main/screenshots/cart.png?raw=true" width="100%"/>

---

### 🛠️ Admin Stock Dashboard
<img src="https://github.com/Akshay001-A/Shoe-Mart-E-commerce-Web-Application/blob/main/screenshots/admin.png?raw=true" width="100%"/>

---

### 👤 Profile Dashboard

<img src="https://github.com/Akshay001-A/Shoe-Mart-E-commerce-Web-Application/blob/main/screenshots/profile.png?raw=true" width="100%"/>

---

# 📂 Project Directory Structure

```bash
SHOE-MART/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Chatbot.js      # Voice & Multimodal Chatbot UI
│       │   ├── Chatbot.css     # Premium pulsing mic animations.
│       │   └── Cart.js         # Interactive Checkout
│       └── config.js           # Dynamic environment target
├── server/
│   ├── config/                 
│   ├── controllers/
│   │   └── chatController.js   # Gemini 2.5 API & history sanitization
│   ├── models/                 # MongoDB Mongoose schemas
│   ├── clip-ai/                # Python Computer Vision Server
│   │   ├── shoe_images/        # Visual Search Database Index
│   │   ├── app.py              # Optimized Flask cache API
│   │   └── requirements.txt
│   └── server.js              
├── screenshots/
└── README.md
```

---

# ⚙️ Installation & Setup Guide

---

# 🐳 Docker Support

This project includes complete Docker support.

Users can run the entire project without manually installing all dependencies.

---

# 🐳 Run Using Docker

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Akshay001-A/Shoe-Mart-E-commerce-Web-Application.git
```

---

## 2️⃣ Navigate To Project

```bash
cd Shoe-Mart-E-commerce-Web-Application
```

---

## 3️⃣ Start Docker

Make sure Docker Desktop is running.

---

## 4️⃣ Run Entire Project

```bash
docker-compose up --build
```

---

# ✅ Application Runs Automatically

This command starts:

✅ React Frontend  
✅ Node.js Backend  
✅ Flask AI Server  
✅ MongoDB Services  
✅ AI Search Engine  

---

# 🌐 Open Application

Frontend:

```bash
http://localhost:3000
```

Backend:

```bash
http://localhost:5000
```

AI Flask Server:

```bash
http://localhost:5001
```

---

# ⚙️ Manual Installation Guide

# 1️⃣ Clone Repository

```bash
git clone https://github.com/Akshay001-A/Shoe-Mart-E-commerce-Web-Application.git
```

---

# 2️⃣ Install Frontend Dependencies

```bash
cd client
npm install
```

---

# 3️⃣ Install Backend Dependencies

```bash
cd ../server
npm install
```

---

# 4️⃣ Install AI Server Dependencies

```bash
cd clip-ai
pip install flask torch torchvision pillow open_clip_torch
```

---

# ▶️ Start Backend

```bash
cd ..
npm start
```

---

# ▶️ Start Frontend

```bash
cd ../client
npm start
```

---

# ▶️ Start AI Flask Server

```bash
cd ../server/clip-ai
python app.py
```

---

# 🌐 Environment Variables

Create `.env` inside server folder:

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
```


---

# 📄 License

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for complete details.

---

# 👨‍💻 Developed By

<div align="center">

# Akshay R 🚀

### Full Stack AI Developer | MERN Specialist

<p align="center">
  <a href="https://github.com/Akshay001-A">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github"/>
  </a>
  <a href="https://www.linkedin.com/in/akshayofficial0207">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin"/>
  </a>
  <a href="https://www.instagram.com/akshay_authentic">
    <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram"/>
  </a>
</p>

</div>

---

<div align="center">

# ⭐ Give This Project a Star if You Like It! ⭐

<img src="https://readme-typing-svg.herokuapp.com?font=Poppins&size=24&duration=3000&color=00F7FF&center=true&vCenter=true&width=850&lines=AI-Powered+Fashion+Search+Platform;Modern+MERN+Stack+eCommerce+Application;Built+Using+React+Node+MongoDB+OpenCLIP+and+Gemini"/>

</div>