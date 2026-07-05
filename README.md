# PersonaBot — Interactive AI Chat with Hitesh & Piyush

PersonaBot is an AI-powered conversational chatbot inspired by two prominent coding educators, **Hitesh Choudhary** (Chai aur Code) and **Piyush Garg**. The system runs on a real, tool-using backend powered by the OpenAI Agents SDK and features a production-quality frontend that streams responses in real-time using custom-styled UI components, interactive 3D WebGL scenes, and client-side page transitions.

<!-- TODO: add screenshot -->
<!-- Place animated GIF of streaming conversation here -->

---

## 🛠️ Architecture Summary

This project is built as a decoupled client-server architecture:
- **Backend (Express 5 & OpenAI Agents SDK)**: Operates a validation loop via a custom Zod-based Guardrail Agent. If valid, the query executes on the target mentor agent (`hitesh` or `piyush`), running sub-tools like YouTube video queries, weather reports, and automated Resend email dispatches. The backend streams raw text chunks directly back using plain text writes (`res.write()`).
- **Frontend (React 19, Vite, TanStack Router)**: Features a dual-theme UI built on a custom CSS-variable color system. It reads the raw incoming response stream in real-time, displays incremental chunks to simulate active typing, isolates conversation contexts using dedicated states, and renders documentation guides via client-side routing.

---

## 📂 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── agents/
│   │   │   ├── hitesh/         # Hitesh Sir Agent instructions & guardrails
│   │   │   └── piyush/         # Piyush Sir Agent instructions & guardrails
│   │   └── app.ts              # Express routes, cookie configs, and OpenAI stream runs
│   ├── server.ts               # Server entry point
│   ├── package.json            # Backend scripts and dependencies
│   └── .env                    # Environment credentials (Git ignored)
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── chat.ts         # Stream fetch reader API module
│   │   ├── components/         # Interactive UI, 3D WebGL Canvas, Whiteboard SVG
│   │   ├── routes/             # App page routes (Dashboard, Docs sidebar & sections)
│   │   ├── router.ts           # React TanStack Router tree
│   │   └── main.tsx            # App bootstrap mounting
│   ├── package.json            # Frontend script commands
│   └── vite.config.ts          # Vite plugin configs (Forces strictPort: 5173)
└── README.md                   # Repository Guide
```

---

## 🚀 Setup & Run Instructions

Both the backend and frontend servers must be running concurrently for the application to function.

### 1. Backend Server Setup
1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   bun install
   ```
3. Create an environment configuration file at `backend/.env` (Note: do not edit or create this file inside the repository if it already exists, just make sure these keys are present):
   ```env
   PORT=8000
   OPENAI_API_KEY=your_openai_api_key
   RESEND_API_KEY=your_resend_api_key
   YOUTUBE_API_KEY=your_youtube_api_key
   HITESH_SIR_CHANNEL_ID=UCNQ6FEtztATuaVhZKCY28Yw
   PIYUSH_SIR_CHANNEL_ID=UCf9T51_FmMlfhiGpoes0yFA
   ```
4. Start the backend watch server:
   ```bash
   bun run start
   ```
   *The backend will boot on `http://localhost:8000`.*

---

### 2. Frontend App Setup
1. Open a new terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   bun install
   ```
3. Start the Vite development server:
   ```bash
   bun run dev
   ```
   *The development server will boot on port `5173`.*

> [!IMPORTANT]
> **Port Constraint**: The frontend server MUST run on exactly port `5173` (`http://localhost:5173`). The backend's CORS policy is locked strictly to this origin, and any requests from other ports (e.g. 5174) will be rejected. The Vite config is set with `strictPort: true` to prevent automatic port shifting.

---

## 📖 System Documentation

Once the frontend application is running locally, you can navigate to the `/docs` route directly in your browser:
- **[System Overview & Request Flow](http://localhost:5173/docs)**: Features a hand-drawn Excalidraw-style flowchart detailing the pipeline from the user's browser, through backend guardrails, and back as streamed tokens.
- **[Persona Grounding](http://localhost:5173/docs/persona-data)**: Explains prompt grounding, biographies, Hinglish language constraints, and lists actual config files.
- **[Prompt Engineering](http://localhost:5173/docs/prompt-engineering)**: Outlines the structured pre-filtering Guardrail Agent and the custom tools workflow sequence.
- **[Session & Cookie Management](http://localhost:5173/docs/context-management)**: Explains the Express session cookie lifecycle (30-second window) and how client-side state decouples this to maintain a smooth UI.
- **[Tone Comparisons](http://localhost:5173/docs/sample-conversations)**: Displays side-by-side read-only chat dialogue transcripts comparing Hitesh Sir's and Piyush Sir's conversational voices.

---

## 🎓 License & Credits

This project is a fan-made educational implementation.
- Special thanks to **Hitesh Choudhary** and **Piyush Garg** for their incredible educational content, streams, and mentoring.
- Built using **React 19**, **Vite**, **Tailwind CSS v4**, **TanStack Router**, **Framer Motion**, and **Three.js**.
