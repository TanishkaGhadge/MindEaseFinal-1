# MindEase 🌿

MindEase is a mental wellness web application developed as part of the **Navonmesh Innovation Hackathon** by **Team Aikyam**.

The application focuses on helping users understand their emotional well-being through simple mood check-ins, AI-powered chat support, and **advanced breathing detection using MediaPipe Pose**.

---
## 🎯 Problem

Mental health tools are often complex, expensive, or intrusive. Many people lack simple ways to track emotions, manage stress, and practice mindfulness privately.

---

## 💡 Solution

MindEase provides a **simple, accessible, and ethical wellness platform** combining AI and evidence-based mental health practices in one place.

---

## ✨ Key Features

### 🧠 Mood Tracker

* Daily mood check-ins
* Mood history & emotional trends

### 💬 AI Chat Support

* Empathetic conversational AI
* Helps users talk through stress, anxiety, and emotions

### 🫁 AI Breathing Detection (Core Innovation)

* Real-time breathing detection using **MediaPipe Pose**
* Tracks shoulder movement via webcam
* Detects inhale, exhale, and hold phases
* 100% client-side, no data storage

### 🌬️ Guided Breathing & Meditation

* Box Breathing, Calm Breathing, 4-7-8, Coherent Breathing, and more
* Visual breathing guides
* Fixed-duration sessions for daily practice

### 🌱 Relief Techniques

* Stress relief exercises
* Anxiety calming techniques
* Emotional grounding activities

---

## 🛠️ Tech Stack

* **Frontend:** React, TypeScript, Vite
* **UI:** Tailwind CSS, shadcn/ui
* **AI:** MediaPipe Pose
* **Backend:** Supabase

---
## 🏗️ Project Structure
src/
├── components/
│   ├── breathing/
│   │   ├── MediaPipeBreathingDetector.tsx  (Main breathing detection)
│   │   └── CameraBreathingExercise.tsx     (Wrapper component)
│   ├── chat/                                (AI chat interface)
│   ├── meditation/                          (Meditation tools)
│   ├── mood/                                (Mood tracking)
│   └── ui/                                  (shadcn components)
├── pages/
│   ├── Dashboard.tsx                        (Main dashboard)
│   ├── BreathingDemo.tsx                    (Breathing demo page)
│   └── ...
└── integrations/
    └── supabase/                            (Backend integration)

---

## 🚀 Run Locally

```bash
git clone https://github.com/TanishkaGhadge/MindEaseFinal.git
cd MindEaseFinal
npm install
npm run dev
```

App runs at `http://localhost:8081`

---

## 🔐 Privacy First

* No video recording or storage
* No data sent to servers
* Camera used only with user consent
