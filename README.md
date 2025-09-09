CloakTalk (Privacy-Focused Real-Time Chat)

**CloakTalk** is a **real-time, room-based chat application** with **AES encryption**, **automatic sensitive data detection**, and **self-destructing messages**.  
It’s built using **React**, **Node.js**, and **Socket.io**, ensuring **secure and instant communication** between users.

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Features

- **End-to-End AES Encryption** – Messages are encrypted in the browser before being sent.
- **Message Sensitivity Classification**:
  -- **High** – Credit card, Aadhaar, PAN, SSN, OTP → Auto-deletes in **30s**.
  -- **Medium** – Email addresses, phone numbers → Auto-deletes in **60s**.
  --**Low** – Normal text, no auto-deletion.
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

