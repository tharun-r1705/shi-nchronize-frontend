# Technical Specifications

## 1. Technology Stack

### Frontend
- **Framework:** React 18 (via Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Shadcn UI (Radix Primitives), Class Variance Authority (CVA)
- **State Management & Data Fetching:** React Query (@tanstack/react-query)
- **Routing:** React Router DOM
- **Visualization:** Recharts
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Form Handling:** React Hook Form + Zod (Validation)
- **Build Tool:** Vite

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** JavaScript (CommonJS)
- **Database ODM:** Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **Validation:** Express Validator, Zod (implied usage in modern stacks, though Mongoose handles schema validation)
- **Logging:** Morgan

### External Services & APIs
- **AI Inference:** Groq Cloud API (Llama 3 models)
- **Database:** MongoDB Atlas

## 2. System Architecture

The application follows a **Client-Server Architecture** with a RESTful API backend and a Single Page Application (SPA) frontend.

- **Frontend (Client):**
  - Hosted as a static site (Vite build).
  - Communicates with the backend via HTTP/HTTPS requests using `fetch` or `axios` (wrapped in `lib/api.ts`).
  - Handles UI rendering, client-side routing, and state management.

- **Backend (Server):**
  - REST API built with Express.js.
  - Stateless architecture using JWT for authentication.
  - Layered structure:
    - **Routes:** Define API endpoints (`/api/students`, `/api/interviews`, etc.).
    - **Controllers:** Handle request logic.
    - **Models:** Define data structure and database interactions.
    - **Utils/Services:** Encapsulate business logic (AI integration, scoring algorithms).

- **Database:**
  - MongoDB serves as the persistent data store.
  - Stores relational references (ObjectIDs) between Students, Recruiters, and Interview Sessions.

## 3. Data Model & Storage

The database is **MongoDB**, utilizing a document-oriented model. Key collections include:

### Students (`Student.js`)
- **Profile:** Personal info, education, contact details.
- **Professional Links:** LinkedIn, GitHub, Portfolio, LeetCode.
- **Activity Data:**
  - `projects`: List of academic/personal projects (status, verification).
  - `codingLogs`: Daily coding activity tracking.
  - `certifications`: External certifications.
  - `events`: Hackathons and workshops.
- **Metrics:**
  - `readinessScore`: Calculated metric (0-100).
  - `skillRadar`: Map of skill proficiency.
  - `leetcodeStats`: Cached statistics from LeetCode.

### Interview Sessions (`InterviewSession.js`)
- **Metadata:** Role, difficulty level, focus areas, mode (practice/test).
- **Participants:** References to `Student` and `Recruiter` (optional).
- **Content:**
  - `turns`: Array of Q&A pairs (Question, Answer, Feedback, Rubric scores).
- **Analytics:**
  - `proficiencyVector`: Scores for Technical Depth, Problem Solving, Communication.
  - `learningCurve`: Graph points tracking performance over time.
  - `summary`: AI-generated feedback and recommendations.

### Recruiters (`Recruiter.js`)
- **Profile:** Company details, role.
- **Preferences:** Hiring roles, minimum score requirements.
- **Saved Candidates:** References to interesting students.

### Admins (`Admin.js`)
- **Management:** Pending verifications queue for student uploads.
- **Permissions:** Role-based access control flags.

## 4. AI / ML / Automation Components

### AI Mentor (`aiMentor.js`)
- **Engine:** Groq SDK (Llama 3.1-8b-instant).
- **Function:** Analyzes student profile (skills, projects, activity) to generate:
  - **SWOT Analysis:** Strengths and Opportunities.
  - **Action Plan:** Time-bound tasks with metrics.
  - **Quick Wins:** Immediate suggestions.

### Mock Interview Chatbot (`mockInterview.js`)
- **Engine:** Groq SDK.
- **Functions:**
  - **Question Generation:** Dynamically creates multiple-choice technical questions based on difficulty and role.
  - **Answer Evaluation:** Grades answers against a rubric (Clarity, Accuracy, etc.) and provides specific feedback.
  - **Session Summary:** Generates a final report with highlights and recommendations.

### Readiness Score Algorithm (`readinessScore.js`)
- **Type:** Deterministic Algorithm.
- **Logic:** Calculates a weighted score (0-100) based on:
  - Project count and verification status.
  - Coding consistency (recent activity logs).
  - Certifications and Events participation.
  - Skill diversity and verified skill levels.
  - Streak bonuses.

## 5. Security & Compliance

### Authentication & Authorization
- **JWT (JSON Web Tokens):** Used for stateless session management. Tokens contain user ID and Role.
- **RBAC (Role-Based Access Control):** Middleware (`authMiddleware.js`) enforces permissions (e.g., only Admins can verify projects).
- **Password Security:** `bcryptjs` used for salting and hashing passwords.

### Data Protection
- **Environment Variables:** Sensitive keys (MongoDB URI, Groq API Key, JWT Secret) stored in `.env`.
- **Input Validation:** Mongoose schemas enforce data types and constraints.
- **CORS:** Configured to restrict cross-origin access.

## 6. Scalability & Performance

### Backend
- **Asynchronous I/O:** Node.js event loop handles concurrent requests efficiently.
- **Statelessness:** JWT auth allows the backend to be horizontally scaled across multiple instances without sticky sessions.
- **Database Indexing:** MongoDB indexes configured on frequently queried fields (`student`, `recruiter`, `createdAt`, `email`) to optimize read performance.

### Frontend
- **Build Optimization:** Vite provides tree-shaking and code-splitting.
- **Caching:** React Query handles server state caching, deduping requests, and background updates to minimize network load.
- **Lazy Loading:** React components can be lazy-loaded to reduce initial bundle size (implied capability with Vite/React).

### AI Integration
- **Offloading:** Heavy inference tasks are offloaded to the Groq API, preventing CPU blocking on the main application server.
