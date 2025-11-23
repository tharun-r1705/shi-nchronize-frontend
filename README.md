# Shinchronize Platform

Shinchronize is an AI-assisted readiness platform that helps students practice job interviews, track progress, and share structured insights with recruiters. The project combines a Vite/React frontend, an Express/MongoDB backend, and Groq-powered AI services to deliver adaptive mock interviews, recruiter dashboards, and autofill helpers.

## Key Features

- **Adaptive Mock Interview Lab** – Groq-driven interviewer generates 10-question MCQ tests with progressive difficulty, real-time scoring, and recruiter-friendly summaries.
- **Recruiter & Student Dashboards** – Visualize readiness trends, review historical tests, and share learning curves.
- **LinkedIn PDF Autofill** – Students can upload the LinkedIn profile export (PDF) to prefill headline, summary, skills, contact data, and more directly inside the profile page.
- **Resume Analysis & Text Extraction** – Upload resumes for Groq-powered critiques or quick text extraction.
- **Coding Activity Sync** – Fetch LeetCode/HackerRank data to enrich the readiness score.
- **Secure REST API** – Role-based access (students, recruiters, admins) enforced through JWT auth.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Recharts |
| Backend | Node.js, Express, MongoDB/Mongoose, Multer, pdf-parse |
| AI Integrations | Groq SDK (Llama 3.x) for interview questions, scoring, and summaries |
| Tooling | ESLint, Nodemon, PostCSS, Vercel config for deployment |

## Getting Started

### Prerequisites
- Node.js v18+
- npm or pnpm
- MongoDB instance
- Groq API key (`GROQ_API_KEY`)

### Install Dependencies
```bash
# frontend
npm install

# backend
cd backend
npm install
```

### Environment Variables
Create `.env` files in project root(s):

```
# backend/.env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shinchronize
JWT_SECRET=super-secret
GROQ_API_KEY=your_key
GROQ_INTERVIEW_MODEL=llama-3.1-8b-instant
```

Optional: set `VITE_API_URL` in the frontend `.env` to point to the backend (`http://localhost:5000/api`).

### Development Scripts
```bash
# backend (Express API)
cd backend
npm run dev

# frontend (Vite)
npm run dev
```

### Linting
```bash
# frontend lint
npx eslint src/**/*.{ts,tsx}

# backend lint
cd backend
npx eslint controllers/**/*.js routes/**/*.js utils/**/*.js
```

## LinkedIn PDF Autofill Workflow

1. Export your LinkedIn profile as a PDF (LinkedIn > More > Save to PDF).
2. Visit the Student Profile page and click **LinkedIn Autofill**.
3. Upload the PDF; the backend processes it with `pdf-parse` and `linkedinParser` to extract:
   - First/last name
   - Headline, summary, location
   - Contact data (email/phone/LinkedIn URL)
   - Normalized skills list (merged with any existing skills)
4. Review the populated fields and click **Save Profile** to persist.
5. No data is stored until you explicitly save, keeping the upload private.

## Project Submission PDF Requirements

When submitting your project (for hackathons, accelerator reviews, or recruiter showcases), prepare **one PDF** containing:

- **Technology Stack**
- **System Architecture**
- **Data Model & Storage**
- **AI / ML / Automation Components**
- **Security & Compliance**
- **Scalability & Performance**

Additionally include:

- A link to your code repository (GitHub/Drive) inside the PDF.
- A video link (YouTube, Vimeo, or Google Drive) demonstrating the prototype.
- Ensure the PDF file size stays under **5 MB**.

These requirements mirror what recruiters expect, so the platform encourages you to keep this PDF alongside your interview history.

## API Highlights

- `POST /students/profile/linkedin-import` – Upload LinkedIn PDF and receive structured profile data.
- `POST /students/interviews/session` – Start a mock interview session.
- `POST /interviews/:id/question` & `POST /interviews/:id/answer` – Drive the adaptive MCQ flow.
- `POST /students/extract-resume-text` – Extract raw text from resume PDFs.

Full route definitions live under `backend/routes/`.

## Folder Structure (excerpt)

```
/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── utils/
├── docs/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── lib/
└── README.md
```

## Contributing

1. Fork and clone the repository.
2. Create a feature branch (`git checkout -b feature/new-module`).
3. Commit with descriptive messages.
4. Run lint/tests before opening a PR.

## License

MIT © Shinchronize. See repository for details.
