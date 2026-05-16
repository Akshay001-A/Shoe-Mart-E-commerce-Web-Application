from flask import Flask, request, jsonify
from PIL import Image
import open_clip
import torch
import os

app = Flask(__name__)

# LOAD CLIP MODEL

model, _, preprocess = open_clip.create_model_and_transforms(

    'ViT-B-32',

    pretrained='laion2b_s34b_b79k'

)

# IMAGE DATABASE FOLDER

IMAGE_FOLDER = "shoe_images"

# EXTRACT IMAGE FEATURES

def get_image_features(image_path):

    image = preprocess(

        Image.open(image_path)

    ).unsqueeze(0)

    with torch.no_grad():

        features = model.encode_image(image)

    # NORMALIZE FEATURES

    features /= features.norm(
        dim=-1,
        keepdim=True
    )

    return features


@app.route("/search-image", methods=["POST"])
def search_image():

    try:

        # GET UPLOADED IMAGE

        uploaded_image = request.files["image"]

        uploaded_path = "temp.jpg"

        uploaded_image.save(uploaded_path)

        # EXTRACT FEATURES

        uploaded_features = get_image_features(

            uploaded_path

        )

        similarities = []

        # LOOP THROUGH DATABASE IMAGES

        for filename in os.listdir(
            IMAGE_FOLDER
        ):

            image_path = os.path.join(

                IMAGE_FOLDER,

                filename

            )

            db_features = get_image_features(

                image_path

            )

            # COSINE SIMILARITY

            similarity = torch.cosine_similarity(

                uploaded_features,

                db_features

            ).item()

            similarities.append({

                # PRODUCT ID

                "id":
                    filename.split(".")[0],

                # SIMILARITY SCORE

                "similarity":
                    similarity

            })

        # REMOVE LOW MATCHES

        similarities = [

            item for item in similarities

            if item["similarity"] > 0.65

        ]

        # SORT BEST MATCHES

        similarities.sort(

            key=lambda x:
                x["similarity"],

            reverse=True

        )

        return jsonify({

            "message":
                "Similar Products Found",

            "results":
                similarities[:5]

        })

    except Exception as e:

        return jsonify({

            "error": str(e)

        })


if __name__ == "__main__":

    app.run(port=8000)