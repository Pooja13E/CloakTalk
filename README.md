CloakTalk (Privacy-Focused Real-Time Chat)

**CloakTalk** is a **real-time, room-based chat application** with **AES encryption**, **automatic sensitive data detection**, and **self-destructing messages**.  
It’s built using **React**, **Node.js**, and **Socket.io**, ensuring **secure and instant communication** between users.

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Features

- **End-to-End AES Encryption** – Messages are encrypted in the browser before being sent.
- **Message Sensitivity Classification**:
  - **High** – Credit card, Aadhaar, PAN, SSN, OTP → Auto-deletes in **30s**.
  - **Medium** – Email addresses, phone numbers → Auto-deletes in **60s**.
  - **Low** – Normal text, no auto-deletion.
- **Room-Based Chat** – Join or leave any room instantly.
- **Self-Destructing Messages** – Auto-removal of sensitive messages with countdown.
- **Typing Indicators** – See when others are typing.
- **Responsive UI** – Modern, clean design that works on desktop & mobile.
- **Real-Time Communication** – Powered by Socket.io.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Tech Stack

**Frontend:**
- React (Vite)
- CryptoJS (AES Encryption)
- CSS (Custom styling)

**Backend:**
- Node.js
- Express.js
- Socket.io
- UUID

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Getting Started

(1) Install Dependencies

**Backend:**
- cd backend
- npm install

**Frontend:**
- cd frontend
- npm install

(2) Run the Backend Server

- cd backend
- node server.js

- Output Screen: Server runs at: http://localhost:4000

(3) Run the Frontend

- cd frontend
- npm run dev

- Output Screen: http://localhost:5173 (Vite default)

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## How It Works

1. Set Username – Prompted when you first load the app.
2. Join a Room – Enter a room name to start chatting.
3. Send Messages – Messages are encrypted before being sent.
4. Auto-Delete Sensitive Data – Based on detected patterns:
     High sensitivity → Deletes in 30s.
     Medium sensitivity → Deletes in 60s.
5. Leave Room – Instantly disconnects from that chat.

(Open two tabs at a time and check user interaction - use the same room name to connect)

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Preview

Enter you name, and share a same room name to chat.

<img width="1916" height="1006" alt="Screenshot 2025-09-09 233046" src="https://github.com/user-attachments/assets/f837de74-0bdf-49c9-9aae-1aaec72fe54e" />

OTP is classified as highly sensitive.

<img width="1919" height="1000" alt="Screenshot 2025-09-09 233232" src="https://github.com/user-attachments/assets/a34dfccb-143c-4ac3-9fb5-94f45688ceff" />

Email ID is classified as medium sensitive.

<img width="1919" height="1007" alt="Screenshot 2025-09-09 233318" src="https://github.com/user-attachments/assets/5a4c4b6a-48d0-4046-b6ea-4332a45105e3" />

Notifies when a person- joins, leaves and types.

<img width="1919" height="1006" alt="Screenshot 2025-09-09 233409" src="https://github.com/user-attachments/assets/ed99f28f-34e2-42e6-a213-bb3fbb7629b2" />



