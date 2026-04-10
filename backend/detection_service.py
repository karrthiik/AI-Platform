from transformers import pipeline
from PIL import Image

_detector = None

def get_detector():
    global _detector
    if _detector is None:
        print("Loading Object Detection Model (DETR)...")
        # facebook/detr-resnet-50 is a popular and effective object detection model
        _detector = pipeline("object-detection", model="facebook/detr-resnet-50", device="cpu")
    return _detector

def detect_objects(image_path):
    try:
        detector = get_detector()
        # Open image to ensure it's valid
        img = Image.open(image_path)
        results = detector(img)
        
        # results is a list of dicts: [{'score': 0.9, 'label': 'person', 'box': {...}}, ...]
        # Object detection results usually contain many overlapping boxes.
        # We'll group them by label and count them.
        # Normalizing common labels for a better UX
        LABEL_MAP = {
            "person": "People",
            "bicycle": "Cycle",
            "car": "Car",
            "motorcycle": "Motorcycle",
            "truck": "Truck",
            "bus": "Bus",
            "traffic light": "Traffic Light"
        }
        
        detections = {}
        for res in results:
            if res['score'] > 0.4: # Lower threshold to catch more objects
                original_label = res['label'].lower()
                label = LABEL_MAP.get(original_label, original_label.title())
                
                if label not in detections:
                    detections[label] = {"count": 0, "max_score": 0}
                
                detections[label]["count"] += 1
                detections[label]["max_score"] = max(detections[label]["max_score"], res['score'])
        
        # Format for frontend badges
        output = []
        for label, data in detections.items():
            display_label = f"{data['count']}x {label}" if data['count'] > 1 else label
            output.append({
                "label": display_label,
                "confidence": float(data['max_score'])
            })
            
        return output
    except Exception as e:
        print(f"Detection Error: {e}")
        return []
