from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import spacy
from transformers import MarianMTModel, MarianTokenizer

### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

# Load NLP models
nlp_de = spacy.load('de_core_news_md')
nlp_ja = spacy.load('ja_core_news_md')
nlp_en = spacy.load('en_core_web_md')
nlp_pl = spacy.load('pl_core_news_md')


# Load translation model
model_name = 'Helsinki-NLP/opus-mt-de-en'
tokenizer = MarianTokenizer.from_pretrained(model_name)
model = MarianMTModel.from_pretrained(model_name)



@app.get("/api/py/helloFastApi")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}

class AnalyzeTextRequest(BaseModel):
    word: str
    sourceLang: str

class FrequencyCheckRequest(BaseModel):
    uniqueWords: List[str]

class TranslateRequest(BaseModel):
    data: List[str]

@app.post("/nlp")
async def analyze_text(request: AnalyzeTextRequest):
    word = request.word
    sourceLang = request.sourceLang
    doc = None

    if not sourceLang:
        raise HTTPException(status_code=400, detail="Source language is required")
    
    if sourceLang == 'de':
        doc = nlp_de(word)
    elif sourceLang == 'ja':
        doc = nlp_ja(word)
    elif sourceLang == 'en':
        doc = nlp_en(word)
    elif sourceLang == 'pl':
        doc = nlp_pl(word)
    elif sourceLang == 'auto':
        doc = nlp_de(word)
    else:
        raise HTTPException(status_code=400, detail=f"Source language is not currently used: {sourceLang}")
    
    tokens_with_pos = {'lemma': doc[0].lemma_, 'pos': doc[0].pos_}
    return {'result': tokens_with_pos}

@app.post("/frequency")
async def frequency_check(request: FrequencyCheckRequest):
    unique_words = request.uniqueWords
    lemmatized_words = []

    for word in unique_words:
        cleaned_word = word.strip().lower()
        doc = nlp_de(cleaned_word)

        if len(doc) > 0:
            lemma = doc[0].lemma_.strip().lower()
            if lemma != cleaned_word:
                lemmatized_words.append({'word': cleaned_word, 'lemma': lemma})
            else:
                lemmatized_words.append({'word': cleaned_word, 'lemma': cleaned_word})
        else:
            lemmatized_words.append({'word': cleaned_word, 'lemma': cleaned_word})

    return {'data': lemmatized_words}

@app.post("/translate")
async def translate(request: TranslateRequest):
    texts = request.data

    if not texts:
        raise HTTPException(status_code=400, detail="Texts to translate are required")

    if isinstance(texts, str):
        texts = [texts]

    translated_texts = []
    for text in texts:
        inputs = tokenizer(text, return_tensors="pt")

        with tokenizer.as_target_tokenizer():
            outputs = model.generate(**inputs)

        translated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        translated_texts.append(translated_text)

    return {'data': translated_texts}

@app.get("/")
async def home():
    return {'message': 'Welcome to the Language Learning FastAPI!'}

