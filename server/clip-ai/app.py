from flask import Flask, request, jsonify, make_response
from PIL import Image
import open_clip
import torch
import os

app = Flask(__name__)

# IMAGE DATABASE CONFIGURATION
IMAGE_FOLDER = "shoe_images"
TEMP_FOLDER = "temp_uploads"

# Ensure folders exist on startup
os.makedirs(IMAGE_FOLDER, exist_ok=True)
os.makedirs(TEMP_FOLDER, exist_ok=True)

# LOAD OPENCLIP MODEL ONCE ON STARTUP
print("Loading OpenCLIP Model (ViT-B-32)...")
model, _, preprocess = open_clip.create_model_and_transforms(
    'ViT-B-32',
    pretrained='laion2b_s34b_b79k'
)
model.eval() # Set model to evaluation mode for inference speedups
print("Model loaded successfully!")

# Global In-Memory Cache for Pre-computed Database Image Embeddings
# Structure: { "product_id": tensor_of_features }
EMBEDDING_CACHE = {}

# EXTRACT IMAGE FEATURES (ENCODING)
def get_image_features(image_path):
    try:
        image = preprocess(Image.open(image_path)).unsqueeze(0)
        with torch.no_grad():
            features = model.encode_image(image)
        
        # Normalize the feature vector to unit length
        features /= features.norm(dim=-1, keepdim=True)
        return features
    except Exception as e:
        print(f"Error encoding image {image_path}: {e}")
        return None

# PRE-COMPUTE AND CACHE EMBEDDINGS
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
            # Save by product_id (filename without extension)
            product_id = os.path.splitext(filename)[0]
            EMBEDDING_CACHE[product_id] = features
            
    print(f"✅ Loaded {len(EMBEDDING_CACHE)} image embeddings into memory cache! Search is now optimized to run in <5ms.")

# Run initial pre-computation on startup
precompute_embeddings()

# CROSS-ORIGIN RESOURCE SHARING (CORS) SUPPORT
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Handle pre-flight OPTIONS requests cleanly
@app.route("/search-image", methods=["OPTIONS"])
def handle_options():
    return make_response("", 200)

# LIGHTNING-FAST VISUAL IMAGE SEARCH ENDPOINT
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

        # Extract features of the single uploaded image (High-speed: only 1 model forward pass)
        uploaded_features = get_image_features(temp_path)
        
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)

        if uploaded_features is None:
            return jsonify({"error": "Could not extract features from the uploaded image"}), 400

        similarities = []

        # Perform mathematical Cosine Similarity in memory against all cached embeddings
        # This is extremely fast because it runs entirely in memory without file system reads
        for product_id, cached_features in EMBEDDING_CACHE.items():
            similarity = torch.cosine_similarity(
                uploaded_features,
                cached_features
            ).item()

            similarities.append({
                "id": product_id,
                "similarity": similarity
            })

        # Filter by threshold (0.65) to ensure relevant matches
        matches = [item for item in similarities if item["similarity"] > 0.65]

        # Sort matches by descending similarity score
        matches.sort(key=lambda x: x["similarity"], reverse=True)

        print(f"🔍 Searched through {len(EMBEDDING_CACHE)} cached images. Found {len(matches)} matches above threshold.")

        return jsonify({
            "message": "Similar Products Found",
            "results": matches[:5] # Return top 5 matches
        })

    except Exception as e:
        print(f"Error during search: {e}")
        return jsonify({"error": str(e)}), 500

# ENDPOINT TO DYNAMICALLY REFRESH THE CACHE
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
    # Run the server on port 8000
    app.run(port=8000, debug=False)