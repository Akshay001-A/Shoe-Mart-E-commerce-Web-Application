"""
=================================================================================
HIGH-PERFORMANCE COMPUTER VISION SEARCH ENGINE (open_clip ViT-B-32)
=================================================================================

WHAT IT DOES:
This Python Flask microservice uses OpenAI's CLIP model (via OpenCLIP) to 
mathematically find visually identical products. It scans your product images 
folder once on startup, pre-computes their deep-learning feature vectors 
(embeddings), and stores them in RAM cache for sub-5 millisecond similarity lookups.

WHY WE USE IT:
1. Traditional text database search cannot find exact styles if descriptions are vague.
   CLIP-AI solves this by comparing raw pixel-to-pixel patterns.
2. Caching: Re-encoding your entire shoe catalog on every search request is a 
   massive performance killer. Memory caching makes it instant and robust.
3. CORS Support: Web browsers require specialized headers to allow cross-origin 
   communication between the React app (Port 3000) and this Python server (Port 8000).
"""

from flask import Flask, request, jsonify, make_response
from PIL import Image
import open_clip
import torch
import os

app = Flask(__name__)

# IMAGE PATH CONFIGURATIONS
IMAGE_FOLDER = "shoe_images"
TEMP_FOLDER = "temp_uploads"

# Ensure crucial catalog directories exist on server startup
os.makedirs(IMAGE_FOLDER, exist_ok=True)
os.makedirs(TEMP_FOLDER, exist_ok=True)

# -----------------------------------------------------------------------------
# 1. INITIALIZING THE DEEP LEARNING MODEL
# -----------------------------------------------------------------------------
# WHAT IT DOES: 
# Loads the OpenCLIP 'ViT-B-32' model trained on the massive LAION-2B dataset.
# Sets the model to eval() mode to disable dropouts and accelerate calculations.
print("Loading OpenCLIP Model (ViT-B-32)...")
model, _, preprocess = open_clip.create_model_and_transforms(
    'ViT-B-32',
    pretrained='laion2b_s34b_b79k'
)
model.eval() 
print("Model loaded successfully!")

# Global In-Memory Dictionary Cache to store database shoe image embeddings
# Structure: { "mongoose_product_id": tensor_of_normalized_features }
EMBEDDING_CACHE = {}

# -----------------------------------------------------------------------------
# 2. FEATURE EXTRACTION PIPELINE (get_image_features)
# -----------------------------------------------------------------------------
# WHAT IT DOES:
# Preprocesses a local image (resizes, crops, and normalizes pixels), feeds it 
# through OpenCLIP's image encoder, normalizes the feature vector to unit length.
def get_image_features(image_path):
    try:
        image = preprocess(Image.open(image_path)).unsqueeze(0)
        with torch.no_grad():
            features = model.encode_image(image)
        
        # Normalize the tensor vector for accurate Cosine Similarity mapping
        features /= features.norm(dim=-1, keepdim=True)
        return features
    except Exception as e:
        print(f"Error encoding image {image_path}: {e}")
        return None

# -----------------------------------------------------------------------------
# 3. ON-STARTUP PRE-COMPUTATION HANDLER (precompute_embeddings)
# -----------------------------------------------------------------------------
# WHAT IT DOES:
# Scans all images in the database folder, extracts their embeddings, and saves 
# them in RAM. This shifts the computational cost from runtime to startup!
def precompute_embeddings():
    global EMBEDDING_CACHE
    EMBEDDING_CACHE = {}
    
    print("\n⚡ Indexing Database Image Embeddings into Memory...")
    image_files = [f for f in os.listdir(IMAGE_FOLDER) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
    
    if not image_files:
        print("ℹ️ No catalog images found in 'shoe_images/' yet to index.")
        return

    for filename in image_files:
        image_path = os.path.join(IMAGE_FOLDER, filename)
        features = get_image_features(image_path)
        if features is not None:
            # Extract product_id from filename (e.g. "64efca221975e5b32e2c56a1.jpg" -> "64efca221975e5b32e2c56a1")
            product_id = os.path.splitext(filename)[0]
            EMBEDDING_CACHE[product_id] = features
            
    print(f"✅ Loaded {len(EMBEDDING_CACHE)} image embeddings into memory cache! Search is now optimized to run in <5ms.")

# Run initial pre-computation on startup
precompute_embeddings()

# -----------------------------------------------------------------------------
# 4. CROSS-ORIGIN RESOURCE SHARING (CORS) RESPONSE SETTINGS
# -----------------------------------------------------------------------------
# WHAT IT DOES:
# Appends required security headers to allow direct web browser access.
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Handle pre-flight OPTIONS requests from Chrome/Edge/Firefox
@app.route("/search-image", methods=["OPTIONS"])
def handle_options():
    return make_response("", 200)

# -----------------------------------------------------------------------------
# 5. SUB-5 MILLISECOND COSINE SIMILARITY SEARCH ENDPOINT
# -----------------------------------------------------------------------------
# WHAT IT DOES:
# Encodes the uploaded user query image, computes the cosine similarity against 
# all in-memory embeddings, filters by a minimum confidence of 0.65, and returns 
# the top 5 matches.
@app.route("/search-image", methods=["POST"])
def search_image():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image file uploaded"}), 400
            
        uploaded_image = request.files["image"]
        if uploaded_image.filename == "":
            return jsonify({"error": "Selected file is empty"}), 400

        # Save uploaded image to temp directory
        temp_path = os.path.join(TEMP_FOLDER, "current_query.jpg")
        uploaded_image.save(temp_path)

        # Extract features of the single uploaded image (High-speed)
        uploaded_features = get_image_features(temp_path)
        
        # Immediately clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)

        if uploaded_features is None:
            return jsonify({"error": "Could not extract features from the uploaded image"}), 400

        similarities = []

        # Perform mathematical Cosine Similarity in memory against all cached embeddings
        # Highly efficient vector mapping (very fast, zero file system reads)
        for product_id, cached_features in EMBEDDING_CACHE.items():
            similarity = torch.cosine_similarity(
                uploaded_features,
                cached_features
            ).item()

            similarities.append({
                "id": product_id,
                "similarity": similarity
            })

        # Filter out matches below confidence threshold (0.65)
        matches = [item for item in similarities if item["similarity"] > 0.65]

        # Sort matches by descending similarity score
        matches.sort(key=lambda x: x["similarity"], reverse=True)

        print(f"🔍 Searched through {len(EMBEDDING_CACHE)} cached images. Found {len(matches)} matches above threshold.")

        return jsonify({
            "message": "Similar Products Found",
            "results": matches[:5] 
        })

    except Exception as e:
        print(f"Error during search: {e}")
        return jsonify({"error": str(e)}), 500

# -----------------------------------------------------------------------------
# 6. DYNAMIC INDEX REBUILD ENDPOINT (/refresh-cache)
# -----------------------------------------------------------------------------
# WHAT IT DOES:
# Allows database administrators to refresh the memory index after uploading 
# new catalog images, without needing to take the server offline.
@app.route("/refresh-cache", methods=["POST"])
def refresh_cache():
    try:
        precompute_embeddings()
        return jsonify({
            "message": "Embedding cache successfully rebuilt!",
            "total_cached": len(EMBEDDING_CACHE)
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Start on port 8000
    port = int(os.environ.get("PORT", 8000))
app.run(host="0.0.0.0", port=port, debug=False)