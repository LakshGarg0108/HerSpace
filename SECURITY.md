# SECURITY & PRIVACY POLICY — HER SAFE SPACE

## 1. Overview & Threat Model
**Her Safe Space** is an emotional support and wellness sanctuary built for individuals processing family stress, relationship tension, burnout, and quiet overwhelm. Disclosures made within the application are emotionally intimate and must be safeguarded with defense-in-depth security principles.

### Key Threat Actors & Boundaries
1. **Shared-Device Observers (Primary Real-World Threat):**
   - In family conflict situations, family members or roommates may have physical access to the user's laptop, phone, or browser profile.
   - *Mitigation:* The application offers local history wiping, zero public URL exposure of journal IDs, instant session logout, and transparent warnings about browser profile access.
2. **Untrusted Network Attackers:**
   - Eavesdropping or man-in-the-middle on unencrypted connections.
   - *Mitigation:* Strict HTTPS in deployment, secure cookie/token handling, and no transmission of private text over unencrypted channels.
3. **Cross-Tenant Data Leakage:**
   - Malicious user A requesting resources owned by user B.
   - *Mitigation:* Database-level PostgreSQL Row Level Security (RLS) policies enforcing `auth.uid() = user_id`, plus backend application authorization checks on every endpoint. A forged user ID in requests is rejected.
4. **AI Provider Over-Exposure:**
   - Over-sharing private journal entries or background history with external AI models.
   - *Mitigation:* **Data Minimization.** Private journal entries and mood history are *never* transmitted to the AI provider. Only the current message explicitly entered in the AI Companion chat and immediate recent turns are sent.
5. **Accidental Logging of Private Disclosures:**
   - Application server logs recording user journal entries, mood notes, or chat messages.
   - *Mitigation:* Sensitive request bodies are excluded from application loggers. Logs only record high-level operational metrics and sanitized error types.

---

## 2. Secrets & Credential Management
- **Frontend vs Backend Separation:**
  - The frontend bundle contains **NO** private keys, database service-role secrets, or OpenAI keys.
  - The frontend environment only contains the public Supabase URL and the publishable/anon key.
  - The backend server environment holds `OPENAI_API_KEY`, `SUPABASE_JWT_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY`.
- **Restricted Database Role:**
  - Everyday user queries are authenticated via Supabase user-scoped JWTs subject to RLS.
  - Unrestricted service-role keys are reserved exclusively for administrative backend operations and are never exposed in user paths.

---

## 3. Row Level Security (RLS) Architecture
Every user-owned table has RLS explicitly enabled:
- `profiles`: `auth.uid() = id`
- `mood_entries`: `auth.uid() = user_id`
- `journal_entries`: `auth.uid() = user_id`
- `chat_conversations`: `auth.uid() = user_id`
- `chat_messages`: `auth.uid() = user_id`
- `personal_reminders`: `auth.uid() = user_id`

No user can read, create, modify, or delete another user's rows, even with direct SQL injection attempts or modified REST queries.

---

## 4. Distress & Crisis Protocol
- The application explicitly defines its boundaries: **It is an emotional wellness companion, NOT a medical provider or crisis hotline.**
- Heuristic safety detection monitors for indicators of immediate self-harm, suicidal ideation, or crisis.
- In severe distress scenarios, the AI responds with compassionate, non-punitive de-escalation, explicitly confirms its limitations as an AI, and surfaces verified, free, confidential 24/7 helplines (Tele-MANAS, Vandrevala Foundation, KIRAN, 988, NHS 111, Befrienders Worldwide).
- The user is never reported to creators or family members without consent, protecting her safety and autonomy.

---

## 5. OWASP Top 10 Compliance Review
- **A01: Broken Access Control:** Enforced via Supabase RLS and FastAPI dependency-injected user tokens.
- **A02: Cryptographic Failures:** Strong TLS in transit, JWT token verification, and salted password hashing managed by Supabase Auth (Argon2 / bcrypt).
- **A03: Injection:** Parameterized queries in PostgreSQL and Pydantic schema validation prevent SQL/Command injection.
- **A04: Insecure Design:** Rate limiting on chat endpoints, clear demo mode fallback, and no reliance on client-side authorization.
- **A05: Security Misconfiguration:** Restrictive CORS middleware configured with explicit allowed origins.
- **A07: Identification and Authentication Failures:** Rate-limited authentication flows, session persistence with secure tokens, and mandatory password complexity.
- **A09: Security Logging and Monitoring Failures:** Sanitized logging that records operational health while guarding private thoughts.

---

## 6. Honest Limitations & Vulnerability Reporting
No digital application is completely invulnerable to someone who has physical access, keystroke loggers, or screen recording software on the user's device. We urge users on shared family computers to use private browsing or clear local storage when finished.

If you discover a security vulnerability, please report it privately to the maintainers rather than opening a public issue.
