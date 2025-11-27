
Football Match Live Score Streaming (SSE + Express + React)


A real-time football match tracking platform built using Event Streaming (SSE), Express.js, and React + TypeScript.
The system simulates multiple ongoing football matches and streams live updates (goals, scorers, score changes) to all connected clients instantly — without refreshing the page.

This project demonstrates modern backend–frontend communication using Server-Sent Events, a powerful technique for one-way real-time updates.

🚀 Features
🔹 User Features

View all currently active football matches

Open any match to watch live score updates

See goals and scorers appear instantly

Fully real-time using SSE (no polling, no refresh)
<img width="1892" height="1203" alt="image" src="https://github.com/user-attachments/assets/2b359f91-d2ab-4730-8f5b-8e78da489223" />


<img width="1891" height="1140" alt="image" src="https://github.com/user-attachments/assets/97902675-f81e-4da5-bcc3-3c6c2bafaaa7" />


🔹 Admin Features

Update match score

Add goals and scorer names

Instantly broadcast updates to all users watching the match
<img width="1892" height="1203" alt="image" src="https://github.com/user-attachments/assets/57232f61-6c96-4ebe-a9af-7a554522e495" />

<img width="1892" height="1203" alt="image" src="https://github.com/user-attachments/assets/6c955b34-5f99-48cc-84a1-13d1a5c6734c" />




🔹 Technical Features

Express.js backend with TypeScript

Real-time broadcasting using Server-Sent Events (SSE)

React + TypeScript frontend

Clean modular structure

No database required (in-memory matches)

Easy to expand into a real football tracking system

🧠 Why SSE?

Unlike regular API apps that send JSON only when the user requests it, SSE keeps a persistent connection from server → client.
This allows the backend to push updates instantly, making it perfect for:

Live sports

Stock price tickers

Chat message notifications

Realtime dashboards

SSE is lightweight, reliable, and supported by browsers without extra libraries.

🏗️ Tech Stack
Backend

Node.js

Express.js

TypeScript

Server-Sent Events (SSE)

Frontend

React

Vite

TypeScript

React Router

📂 Project Structure
backend/
  src/
    controllers/
    routes/
    services/
    types/
    data/
frontend/
  src/
    pages/
    services/
    types/

🌐 How It Works

User opens a match → frontend opens an SSE connection

Backend registers the client and keeps the connection alive

When admin updates score → backend broadcasts the update

All connected clients instantly receive the update

UI updates in real time without reload
