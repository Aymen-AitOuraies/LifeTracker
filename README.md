# 🧠 AI Life Tracker

<p align="center">
  <img src="./life-tracker-meme.jpg" alt="Welcome to AI Life Tracker" width="900">
</p>

<p align="center">
  <strong>Trying to get my life together with AI because apparently I can't do it alone. 💀</strong>
</p>

<p align="center">
  An AI-powered personal life management application designed to help users plan their days, organize tasks, and improve their schedules based on their feedback and habits.
</p>

---

## 🚧 Project Status

| Feature | Status |
|---|---|
| 🔐 Authentication | 🟢 Complete |
| 👤 Users | 🟢 Complete |
| 📅 Schedules | 🟢 Complete |
| ✅ Tasks | 🟢 Complete |
| 💬 Feedback | 🟢 Complete |
| 🤖 AI Integration | 🟡 In Progress |
| 🎨 Frontend | 🟡 In Progress |

---

## 🎯 Project Goal

The idea behind **AI Life Tracker** is simple:

> Instead of manually planning every part of your day, let an AI assistant help you create a realistic schedule based on your tasks, available time, previous schedules, and feedback.

The long-term goal is to build a personal scheduling assistant that becomes better at planning for each individual user over time.

Less chaos. More focus. Better days. 🚀

---

# 🏗️ Architecture

The application is built around a modular NestJS backend with AI capabilities being added as a separate layer.

```text
                       ┌──────────────┐
                       │   Frontend   │
                       └──────┬───────┘
                              │
                              │ REST API
                              ▼
                       ┌──────────────┐
                       │    NestJS    │
                       │   Backend    │
                       └──────┬───────┘
                              │
              ┌───────────────┼────────────────┐
              │               │                │
              ▼               ▼                ▼
          Auth Module    CRUD Services      AI Module
              │               │                │
              │               │                ▼
              │               │            LLM API
              │               │                │
              │               │        ┌───────┴───────┐
              │               │        │               │
              │               │        ▼               ▼
              │               │   Structured       Function
              │               │    Outputs         Calling
              │               │        │               │
              └───────────────┼────────┴───────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │ PostgreSQL   │
                       └──────────────┘