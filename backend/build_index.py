import faiss
import numpy as np
import os
import json
from feature_extractor import extract_features

features = []
paths = []

if not os.path.exists("data"):
    os.makedirs("data")

for file in os.listdir("data"):
    if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.avif')):
        path = os.path.join("data", file)
        feat = extract_features(path)
        features.append(feat)
        paths.append(file) # Store just the filename for cleaner UI

if features:
    index = faiss.IndexFlatL2(len(features[0]))
    index.add(np.array(features))
    faiss.write_index(index, "faiss.index")
    
    with open("paths.json", "w") as f:
        json.dump(paths, f)
    print(f"Successfully indexed {len(paths)} images.")
else:
    print("No images found to index.")