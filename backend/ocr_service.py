import easyocr
from PIL import Image
import numpy as np

# Global variable for lazy loading
_reader = None

def get_ocr_reader():
    global _reader
    if _reader is None:
        print("Loading EasyOCR Reader (English)...")
        # Initialize the reader for English. 
        # gpu=False to avoid CUDA issues on CPU machines.
        _reader = easyocr.Reader(['en'], gpu=False)
    return _reader

def extract_text_from_image(image_path):
    try:
        # EasyOCR works best with file paths or numpy arrays
        reader = get_ocr_reader()
        
        # We can pass the path directly
        results = reader.readtext(image_path)
        
        # Results is a list of tuples: (bbox, text, confidence)
        full_text = " ".join([res[1] for res in results])
        
        if not full_text.strip():
            print("OCR did not detect any text.")
            
        return full_text
    except Exception as e:
        print(f"OCR Error with EasyOCR: {e}")
        return ""
