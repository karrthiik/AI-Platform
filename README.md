# 🚀 AI Multi-Modal Platform (Text + Image)

An AI-powered platform that processes **text and image inputs** to generate intelligent insights using machine learning and deep learning models.

---

## 🧠 Overview

This project demonstrates a **multi-modal AI system** capable of handling:

* 📄 Text → Summarization & Sentiment Analysis
* 🖼️ Image → Visual Search (Similarity Detection using CNN + FAISS)

---

## ✨ Features

* 🔹 Text summarization using NLP models
* 🔹 Sentiment analysis
* 🔹 Image feature extraction using ResNet50
* 🔹 Fast image similarity search using FAISS
* 🔹 Interactive UI using Streamlit
* 🔹 Backend API using FastAPI

---

## 🏗️ System Architecture

Frontend (Streamlit)
⬇
Backend API (FastAPI)
⬇
AI Services

* NLP Service
* Vision Service
  ⬇
  Storage + Model Layer

---

## 🛠️ Tech Stack

**Frameworks**

* FastAPI
* Streamlit

**AI Models**

* HuggingFace Transformers (NLP)
* ResNet50 (Image Feature Extraction)
* FAISS (Similarity Search)

---

## 📁 Project Structure

ai-platform/
│
├── backend/
│   ├── main.py
│   ├── text_service.py
│   ├── image_service.py
│   ├── feature_extractor.py
│   ├── build_index.py
│   ├── search.py
│
├── frontend/
│   └── app.py
│
├── data/
└── README.md

