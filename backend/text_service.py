from transformers import pipeline

# Global variables for lazy loading
_summarizer = None
_sentiment = None

def get_summarizer():
    global _summarizer
    if _summarizer is None:
        print("Loading Summarization Model (Falconsai/text_summarization)...")
        # Ensure model is strictly on CPU and not using meta tensors
        _summarizer = pipeline("summarization", model="Falconsai/text_summarization", device="cpu")
    return _summarizer

def get_sentiment():
    global _sentiment
    if _sentiment is None:
        print("Loading Sentiment Analysis Model...")
        _sentiment = pipeline("sentiment-analysis", device="cpu")
    return _sentiment

def analyze_text(text):
    if not text.strip():
        return {"summary": "No text provided for analysis.", "sentiment": "N/A", "confidence": 0}

    # Word count check
    words = text.split()
    word_count = len(words)
    
    if word_count < 10:
        # For very short text, summarization is not needed
        sentiment_analyer = get_sentiment()
        senti = sentiment_analyer(text)[0]
        return {
            "summary": text, # Just return raw if too short
            "sentiment": senti['label'],
            "confidence": float(senti['score'])
        }

    try:
        summarizer = get_summarizer()
        sentiment_analyer = get_sentiment()

        # Dynamically set max_length
        # DistilBART usually needs at least 5-10 words minimum
        max_len = min(100, max(20, int(word_count * 0.7)))
        min_len = min(max_len - 5, 15)

        summary_result = summarizer(text, max_length=max_len, min_length=min_len, do_sample=False)
        summary = summary_result[0]['summary_text'] if summary_result else text
        
        senti = sentiment_analyer(text)[0]

        return {
            "summary": summary,
            "sentiment": senti['label'],
            "confidence": float(senti['score'])
        }
    except Exception as e:
        print(f"Summarization Error: {e}")
        return {
            "summary": "Error in summarization process.",
            "sentiment": "N/A",
            "confidence": 0.0
        }