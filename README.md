# Her Safe Space (AI-Powered Personal Emotional Support)

> *"You don't have to be okay all the time."*

**Her Safe Space** is a full-stack, production-minded personal emotional support web application designed to give girls and young women a warm, gentle, private digital harbor to process difficult emotions, quiet overwhelm, and family stress.

It features an empathetic AI companion with four distinct support modes, a private journal with rich prompts, an interactive Calm Corner (guided 4-6 breathing, 5-4-3-2-1 sensory grounding, 60-second micro-resets, and synthesized ambient rain/wave soundscapes), personal comforting reminders, and transparent data privacy controls.

---

## 🌸 Key Features

1. **AI Emotional Support Companion:**
   - **4 Support Modes:**
     - `LISTEN`: Vent without unsolicited advice or interruptions.
     - `COMFORT`: Reassurance, validation, and gentle warmth.
     - `CALM DOWN`: De-escalating anxiety with soothing breathing cues.
     - `THINK IT THROUGH`: Untangling facts from feelings and sorting what is controllable.
   - Built using the official **OpenAI Python SDK** with an empathetic, non-judgmental system prompt.
   - Transparent fallback demo mode when API keys are not supplied.
   - Severe distress detection that provides non-clinical compassion and verified 24/7 emergency helplines.

2. **Private Journal:**
   - Unhurried writing space with suggested prompts ("What has been weighing on your mind?", "What is outside your control today?").
   - Filter by feeling tags or search by keyword.
   - Export journal reflections as plain text or structured JSON.
   - Protected by PostgreSQL Row Level Security (RLS) policies.

3. **Calm Corner:**
   - **Guided 4-6 Breathing:** Gentle visual pulsing circle expanding on inhale (4s) and softly contracting on exhale (6s). No forced breath holding.
   - **5-4-3-2-1 Sensory Grounding:** Step-by-step interactive re-anchoring into physical surroundings.
   - **60-Second Short Reset:** 5 quick micro-actions to release bodily tension.
   - **Synthesized Ambient Soundscapes:** Continuous rain, ocean waves, and night breeze synthesized via Web Audio API—zero external MP3 dependencies, no broken links, and strictly opt-in (no autoplay).

4. **Little Reminders:**
   - Comforting notes categorized by situation (*Overwhelm*, *Family*, *Burnout*, *Self-Worth*, *Grounding*).
   - "Comfort Me Now" random reminder drawer.
   - Pin favorite reminders directly to the Home Dashboard.

5. **Transparency & Security:**
   - Supabase Auth + Row Level Security (RLS) ensuring strict user data isolation.
   - Data minimization: Journal entries and mood records are **never** sent to the AI.
   - Instant guest exploration in Local Demo Mode.
   - One-click full data wipe and account deletion.

---

## 🛠 Tech Stack

- **Frontend:** React 19, Vite 6, TypeScript, Tailwind CSS, Lucide React, Framer Motion, React Router 7.
- **Backend:** Python 3.10+, FastAPI, Pydantic v2, Pydantic-Settings, Uvicorn, Official OpenAI SDK.
- **Database & Auth:** Supabase Auth, PostgreSQL 15+ with Row Level Security (RLS).
- **Testing:** Vitest & React Testing Library (Frontend), Pytest & HTTPX (Backend).

---

## 📂 Project Structure

```
her-safe-space/
├── frontend/                     # React + Vite + TypeScript application
│   ├── src/
│   │   ├── components/
│   │   │   ├── calm/             # Breathing, grounding, audio components
│   │   │   ├── chat/             # AI chat interface, mode selector, prompts
│   │   │   ├── common/           # Buttons, cards, modals, disclaimers
│   │   │   ├── dashboard/        # Greeting, mood check-in, recent snippet
│   │   │   ├── journal/          # Editor, journal cards, prompt picker
│   │   │   ├── layout/           # Navbar, sidebar, footer, layout shell
│   │   │   └── reminders/        # Reminder cards, comfort modal
│   │   ├── context/              # AuthContext and AppContext
│   │   ├── lib/                  # Supabase client, Web Audio, storage, constants
│   │   ├── pages/                # Landing, Auth, Dashboard, Chat, Journal, etc.
│   │   ├── services/             # API client, chat, mood, journal services
│   │   ├── styles/               # index.css with Tailwind & animations
│   │   ├── test/                 # Vitest test setup and test suites
│   │   ├── types/                # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── .env.example
├── backend/                      # Python FastAPI application
│   ├── app/
│   │   ├── api/                  # Routes: health, profile, mood, journal, chat, etc.
│   │   ├── core/                 # Config, security, rate limiter
│   │   ├── schemas/              # Pydantic request/response schemas
│   │   ├── services/             # OpenAI AI service, Supabase storage
│   │   └── main.py               # FastAPI entry point & CORS
│   ├── tests/                    # Pytest test suite
│   ├── requirements.txt
│   └── .env.example
├── supabase/
│   ├── migrations/               # PostgreSQL schema & RLS policies
│   └── seed.sql                  # Initial comforting reminder seed scripts
├── SECURITY.md                   # Threat model & privacy boundaries
├── README.md
└── .gitignore
```

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended).
- **Python**: v3.10 or higher.
- **Supabase Account**: (Optional, required only for remote cloud sync; works out-of-the-box in local demo mode).
- **OpenAI API Key**: (Optional, required only for live LLM responses; falls back to transparent demo companion when omitted).

---

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run development server
npm run dev
```
The frontend will start at `http://localhost:3000`.

---

### 3. Backend Setup

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment (optional but recommended)
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env

# Start FastAPI server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API documentation will be available at `http://localhost:8000/docs`.

---

## 🔑 Environment Variables Configuration

### Frontend (`frontend/.env`)
Only public, browser-safe variables belong here:

```env
# Supabase project details (leave blank for local demo mode)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Backend URL (leave blank to proxy /api to localhost:8000)
VITE_BACKEND_URL=
```

### Backend (`backend/.env`)
Private secrets live only on the server:

```env
ENVIRONMENT=development
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# OpenAI API Key (leave empty for demo mode)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Supabase Server Keys (optional for cloud persistence)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

RATE_LIMIT_PER_MINUTE=60
```

> ⚠️ **Security Warning:** Never place `OPENAI_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` in frontend `.env` files.

---

## 🗄 Supabase Project Setup & Database Migrations

1. Create a new project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/migrations/20240101000000_initial_schema.sql` and execute the query. This sets up:
   - `profiles`, `mood_entries`, `journal_entries`, `chat_conversations`, `chat_messages`, `personal_reminders`.
   - Enables **Row Level Security (RLS)** across every table with strict `auth.uid() = user_id` policies.
   - Creates foreign keys, timestamps, and indexes.
4. (Optional) Run `supabase/seed.sql` to register the default comforting reminder seeding routine.
5. In **Project Settings > API**, copy your `URL`, `anon public key`, and `JWT Secret` into your respective `.env` files.

---

## 🧪 Testing

### Frontend Tests (Vitest)
```bash
cd frontend
npm run test
```
Verifies:
- Dashboard rendering & tagline integrity.
- Mood check-in interaction and contextual response generation.
- 4-6 Breathing circle controls (Start, Pause, Reset).
- 5-4-3-2-1 Sensory Grounding step progression.
- 60-Second Short Reset flow.
- Emergency crisis hotline modal presentation.

### Backend Tests (Pytest)
```bash
cd backend
pytest -v
```
Verifies:
- `/health` status and configuration reporting.
- Authentication enforcement (unauthenticated requests rejected with `401`).
- Journal data isolation (User B cannot access or modify User A's entries).
- Chat support modes & transparent demo fallback.
- Distress keywords triggering crisis guidance and safety warnings.
- Rate limiter enforcement (`429 Too Many Requests`).
- Account deletion total data wipe.

---

## 📦 Production Build & Deployment

### Frontend (e.g. Vercel / Netlify)
```bash
cd frontend
npm run build
```
Generates an optimized static bundle in `frontend/dist/`.
- Deploy directory: `dist`
- Framework: Vite

### Backend (e.g. Render / Railway / Fly.io / AWS ECS)
Start command:
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

## 🛡 Privacy & Emergency Boundaries

1. **Not a Clinical Service:** Her Safe Space is an emotional wellness companion, not a licensed medical provider or crisis hotline.
2. **Data Minimization:** Private journal reflections and mood notes are stored solely in your encrypted private space; they are **never** shared with the AI model.
3. **Emergency Support:** If you or someone you know is in immediate physical danger or severe crisis, please reach out directly:
   - **India:** Tele-MANAS (`14416` or `1800-891-4416`) | Vandrevala Foundation (`+91 9999 666 555`)
   - **North America:** `988` (Call or text)
   - **United Kingdom:** `111`
   - **Global Directory:** [Befrienders Worldwide](https://www.befrienders.org)
