from typing import Union
from pydantic import BaseModel
import requests
from PIL import Image
from io import BytesIO
from fastapi import FastAPI, HTTPException
import random

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware
from models.fake_image_url import ImageURL
from models.bot_detection import Bot
from models.clickbait_detection import Clickbait
from models.political_misinfo import Political

from tensorflow.keras.models import load_model
import re
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle
import numpy as np
import spacy
import joblib
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.preprocessing.image import img_to_array

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://x.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Load spaCy model
nlp = spacy.load('en_core_web_sm')

# political misinfo model
# model_political = load_model('./ml_models/verity_function3(1.4).h5')
model_political = load_model('./ml_models/verity_function3_retrained.h5')
# model_bot = load_model('./ml_models/twitter_bot_detection_model_retrained(2.6).h5')
model_bot = load_model('./ml_models/retrained/twitter_bot_detection_model_retrained.h5')
# model_image = load_model('./ml_models/function1_retrain4(1).h5')
model_image = load_model('./ml_models/deepfake _srilankan.h5')
# model_image = load_model('./ml_models/hybrid5_deepfake_detection_model2.h5')
# model_clickbait = load_model('./ml_models/verity function4(4.5).h5')
# model_clickbait = load_model('./ml_models/srilanka_context_model.h5')
model_clickbait = load_model('./ml_models/F4_srilanka_context_model.h5')
# # Tokenizer settings (should match the settings used during training)
# max_words = 1000
max_seq_length = 100

# Initialize tokenizer
# tokenizer = Tokenizer(num_words=max_words)

# Load tokenizer
with open('./ml_models/tokenizer/function3_tokenizer.pkl', 'rb') as f:
    tokenizer_political = pickle.load(f)
    
with open('./ml_models/tokenizer/function2_tokenizer.pkl', 'rb') as f:
    tokenizer_bot = pickle.load(f)
    
# with open('./ml_models/tokenizer/function4_tokenizer.pkl', 'rb') as f:
#     tokenizer_clickbait = pickle.load(f)

with open('./ml_models/tokenizer/tokenizer.pickle', 'rb') as f:
    tokenizer_clickbait = pickle.load(f)
    
# Load Scaler
# scaler_bot = joblib.load("./ml_models/tokenizer/function2_scaler.pkl")
scaler_bot = joblib.load("./ml_models/retrained/function2_scaler.pkl")
    
    
def count_mentions(tweet):
    return len(re.findall(r'@\w+', tweet))

def extract_hashtags(tweet):
    return len(re.findall(r'#\w+', tweet))

def org_percentage(tweet):
    doc = nlp(tweet)
    org_count = sum(1 for ent in doc.ents if ent.label_ == 'ORG')
    return org_count / len(doc.ents) * 100 if len(doc.ents) > 0 else 0

def person_percentage(tweet):
    doc = nlp(tweet)
    person_count = sum(1 for ent in doc.ents if ent.label_ == 'PERSON')
    return person_count / len(doc.ents) * 100 if len(doc.ents) > 0 else 0

def clean_text(text):
    text = re.sub(r'\d+', '', text)  # Remove digits
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    text = re.sub(r'\s+', ' ', text)  # Remove multiple spaces
    text = text.lower().strip()  # Convert to lowercase and strip leading/trailing spaces
    return text

def fakeImage(image: Image.Image):
    # predict the labels
    image = image.resize((256, 256))
    your_image_arr = img_to_array(image)
    your_image_arr = np.expand_dims(your_image_arr, axis=0)
    your_image_arr = your_image_arr / 255.0
    print(your_image_arr)
    # Predict using your model
    result = model_image.predict(your_image_arr)
    print(result)
    return {"prediction": "Fake" if float(result[0][0]) > 0.5 else "Not Fake", "confidence":  float(result[0][0])}

def politicalMisinfo(data: Political):
    new_texts = data.description
    cleaned_article = clean_text(new_texts)
    # Preprocess the new texts
    new_sequences = tokenizer_political.texts_to_sequences([cleaned_article])
    new_data = pad_sequences(new_sequences, maxlen=max_seq_length)
    
    # Get predictions and news URLs
    new_predictions = model_political.predict(new_data)
    predicted_classes = (new_predictions > 0.5).astype(int)
    print(new_predictions)
    result = new_predictions[0][0]
    return {"prediction": "Misinfo" if float(result) > 0.5 else "Not Misinfo", "confidence":  float(result)}

def bot(data: Bot):
    print(data.description)
    print(count_mentions(data.description))
    print(extract_hashtags(data.description))
    print(org_percentage(data.description))
    print(person_percentage(data.description))
    tweet = data.description
    # retweets = 0
    mentions =count_mentions(data.description)
    hashtags =extract_hashtags(data.description)
    ORG_percentage =org_percentage(data.description)
    PERSON_percentage = person_percentage(data.description)
    # numeric_features = [
    # retweets,
    # mentions,
    # hashtags,
    # ORG_percentage,
    # PERSON_percentage
    # ]
    numeric_features = [
    mentions,
    hashtags,
    ORG_percentage,
    PERSON_percentage
    ]
    # scaled_numeric_features = np.array(numeric_features).reshape(1, -1)
    scaled_numeric_features = scaler_bot.transform([numeric_features])
    # # Preprocess the new texts
    new_sequences = tokenizer_bot.texts_to_sequences([tweet])
    new_data = pad_sequences(new_sequences, maxlen=max_seq_length)
    prediction = model_bot.predict([new_data, scaled_numeric_features])
    value = prediction[0][0]
    print(value)
    return {"prediction": "Bot" if float(value) > 0.5 else "Not Bot", "confidence": float(value)}

def clickbait(data:Clickbait):
    new_texts = data.title
    cleaned_article = clean_text(new_texts)
    # Preprocess the new texts
    new_sequences = tokenizer_clickbait.texts_to_sequences([cleaned_article])
    new_data = pad_sequences(new_sequences, maxlen=max_seq_length)
    
    # Get predictions and news URLs
    new_predictions = model_clickbait.predict(new_data)
    predicted_classes = (new_predictions > 0.5).astype(int)
    print(new_predictions)
    result = new_predictions[0][0]
    return {"prediction": "Clickbait" if float(result) > 0.5 else "Not Clickbait", "confidence":  float(result)}

@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.post("/fake-image-detection")
async def fakeImageDetection(url_data: ImageURL):
    try:
        # Download the image from the URL
        response = requests.get(url_data.url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Error downloading image: {str(e)}")
    
    try:
        # Open the image using PIL
        image = Image.open(BytesIO(response.content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")
    
    # Perform the prediction (this is where you would integrate your ML model)
    prediction = fakeImage(image)

    return {"url": url_data.url, "prediction": prediction}
    
@app.post("/bot-detection")
async def botDetection(data: Bot):
    prediction =bot(data)
    return {"prediction": prediction}

@app.post("/political-misinfo-detection")
async def politicalMisinfoDetection(data: Political):
    prediction =politicalMisinfo(data)
    return {"prediction": prediction}

@app.post("/clickbait-detection")
async def clickbaitDetection(data: Clickbait):
    prediction =clickbait(data)
    return {"prediction": prediction}