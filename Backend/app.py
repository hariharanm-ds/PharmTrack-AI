import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
import re

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

PRIMARY_MODEL = "google/flan-t5-base"
FALLBACK_MODEL = "google/flan-t5-small"  

device = 0 if torch.cuda.is_available() else -1

def load_model(model_name):
    try:
        logger.info(f"Loading model: {model_name}")
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
        generator = pipeline(
            "text2text-generation",
            model=model,
            tokenizer=tokenizer,
            device=device
        )
        logger.info(f"✅ Loaded model: {model_name}")
        return generator, tokenizer, model_name
    except Exception as e:
        logger.exception(f"❌ Failed to load {model_name}, trying fallback {FALLBACK_MODEL}")
        try:
            tokenizer = AutoTokenizer.from_pretrained(FALLBACK_MODEL)
            model = AutoModelForSeq2SeqLM.from_pretrained(FALLBACK_MODEL)
            generator = pipeline(
                "text2text-generation",
                model=model,
                tokenizer=tokenizer,
                device=device
            )
            logger.info(f"✅ Loaded fallback model: {FALLBACK_MODEL}")
            return generator, tokenizer, FALLBACK_MODEL
        except Exception as e2:
            logger.exception("❌ Failed to load fallback model")
            raise

generator, tokenizer, LOADED_MODEL = load_model(PRIMARY_MODEL)

# -----------------------------
# Routes
# -----------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "ok",
        "model": LOADED_MODEL,
        "device": "cuda" if torch.cuda.is_available() else "cpu"
    })

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json(force=True)
    question = (data.get("question") or "").strip()
    if not question:
        return jsonify({"error": "Missing question"}), 400

    max_new_tokens = min(int(data.get("max_new_tokens", 100)), 200)

    # -----------------------------
    # Optimized prompt for FLAN-T5
    # -----------------------------
    prompt = (
        f"Answer this medical question in 2-3 clear sentences. "
        f"Include practical advice if relevant.\n\n"
        f"Question: {question}\n\n"
        f"Answer:"
    )

    try:
        outputs = generator(
            prompt,
            max_new_tokens=max_new_tokens,  # Changed from max_length
            do_sample=False,
            num_beams=4,
            early_stopping=True,
            temperature=1.0
        )

        logger.info(f"Raw generator output: {outputs}")

        result_text = outputs[0]["generated_text"].strip()

        # Remove prompt echo if present
        if prompt in result_text:
            result_text = result_text.replace(prompt, "").strip()
        
        # Remove common artifacts
        cleanup_patterns = [
            r'<[^>]+>',  # Remove any HTML-like tags
            r'▃+',       # Remove special characters
            r'Answer:\s*',  # Remove "Answer:" prefix
            r'Question:.*?(?=\n|$)',  # Remove question repetition
        ]
        
        for pattern in cleanup_patterns:
            result_text = re.sub(pattern, '', result_text, flags=re.IGNORECASE)

        # Remove excessive whitespace
        result_text = re.sub(r'\s+', ' ', result_text).strip()
        
        # Remove word repetitions (e.g., "the the the")
        result_text = re.sub(r'\b(\w+)(\s+\1\b)+', r'\1', result_text)

        # Ensure proper capitalization
        if result_text and not result_text[0].isupper():
            result_text = result_text[0].upper() + result_text[1:]

        # Fallback if output is too short or empty
        if len(result_text) < 10:
            result_text = "I apologize, but I need more context to provide a helpful answer. Could you please rephrase your question with more details?"

        return jsonify({
            "answers": [result_text],
            "model": LOADED_MODEL,
            "success": True
        })

    except Exception as e:
        logger.exception("Error during generation")
        return jsonify({
            "error": str(e),
            "success": False
        }), 500


if __name__ == "__main__":
    print("🚀 Starting PharmTrack AI Doctor with FLAN-T5...")
    print(f"📱 Using device: {'CUDA (GPU)' if torch.cuda.is_available() else 'CPU'}")
    app.run(host="0.0.0.0", port=5000, debug=True)