from detection_service import detect_objects
import json

image_path = "data/city-street-scene-traffic-pedestrians-vector-60649786.avif"
results = detect_objects(image_path)
print(json.dumps(results, indent=2))
