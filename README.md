# Tattoo Iconic — Solo Master Tattoo Artist Web Platform

An ultra-luxury editorial web application, booking management system, and portfolio for solo master tattoo artist **Jainik Patel** ([@tatoo.iconic](https://www.instagram.com/tatoo.iconic)) based in Bhadam, Rajpipla, Narmada, Gujarat.

---

## 🎨 Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS, Vanilla CSS animations
- **Interactivity & 3D**: Framer Motion, Lusion-style spotlight cards, dynamic continuous canvas

### Backend
- **Framework**: Django 5 + Django REST Framework
- **Database**: PostgreSQL (`tatto`)
- **Integration**: Instagram sync ingestion & booking workflows

---

## 🚀 Getting Started

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
API runs at [http://127.0.0.1:8000](http://127.0.0.1:8000).

---

## 📸 Key Features
- **5-Second Rotating Hero Carousel**: Real-time synchronized headlines and quotes matching high-standard creative tattoo artworks.
- **Continuous Editorial Storytelling**: Meet Jainik Patel with interactive timeline beats and biography.
- **Interactive Multi-Step Booking**: Custom sizing, anatomical placement, reference upload, and instant WhatsApp integration.
- **Instagram Live Wall & Masterpiece Portfolio**: Direct synchronization with authentic studio artworks and watermarked pieces.
