import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from text_service import analyze_text, get_summarizer, get_sentiment
from image_service import save_image
from feature_extractor import extract_features
from ocr_service import extract_text_from_image, get_ocr_reader
from detection_service import detect_objects, get_detector

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pre-load heavy models in the background to speed up first requests.
    def preload_models():
        print("Starting model pre-loading in background...")
        get_summarizer()
        get_sentiment()
        get_detector()
        get_ocr_reader()
        print("Model pre-loading complete!")
        
    asyncio.create_task(asyncio.to_thread(preload_models))
    yield

app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI Platform Running"}

@app.post("/text")
async def process_text(text: str):
    # Run CPU bound analysis in thread
    result = await asyncio.to_thread(analyze_text, text)
    return result

@app.post("/image")
async def process_image(file: UploadFile = File(...)):
    # Save the file first
    path = await asyncio.to_thread(save_image, file)
    
    # 1 & 2: Run object detection and OCR concurrently!
    detection_task = asyncio.to_thread(detect_objects, path)
    ocr_task = asyncio.to_thread(extract_text_from_image, path)
    
    detections, extracted_text = await asyncio.gather(detection_task, ocr_task)
    
    # 3. Analyze extracted text if present
    if extracted_text.strip():
        text_analysis = await asyncio.to_thread(analyze_text, extracted_text)
    else:
        text_analysis = {
            "summary": "No readable text detected.",
            "sentiment": "N/A",
            "confidence": 0.0
        }

    return {
        "status": "success",
        "file_path": path,
        "detections": detections,
        "text_analysis": text_analysis,
        "raw_text": extracted_text
    }