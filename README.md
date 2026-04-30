# AI Resume Analyzer

An intelligent, full-stack application that analyzes resumes against job descriptions using Google's Gemini AI. The application provides detailed Applicant Tracking System (ATS) scoring, identifies missing keywords, assesses job fit, and offers actionable feedback to help candidates improve their resumes.

## 🚀 Features

- **Automated Resume Parsing**: Securely uploads and extracts text from PDF resumes using in-memory buffering.
- **ATS Scoring**: Analyzes resumes against specific Job Roles and Descriptions to calculate an ATS compatibility score.
- **Keyword Optimization**: Identifies missing skills and keywords required by the job posting.
- **Gap Analysis**: Highlights strengths and missing skills, providing personalized suggestions on what to learn.
- **Learning Resources**: Suggests YouTube topics and resources to bridge missing skills.
- **Security-First Backend**: Implements strict rate limiting, CORS scoping, and file type validation to prevent abuse and ensure data privacy.

## 🛠️ Technology Stack

### Frontend
- **React**: Built using Vite for blazing fast development.
- **Styling**: Tailwind CSS / Custom CSS for responsive, modern UI.
- **Environment**: Configured via `.env` pointing to the backend API.

### Backend
- **Node.js & Express**: Fast, scalable server handling file uploads and API requests.
- **Google Gemini API**: Utilizes `@google/genai` to generate comprehensive resume analysis.
- **Multer**: Secure, memory-buffered file uploads (`multer.memoryStorage()`) limited to PDF files only.
- **PDF-Parse**: Extracts clean text from uploaded resumes.
- **Express Rate Limit**: Protects the API from DoS attacks and excessive AI parsing costs.

## 📁 Project Structure

The repository is split into two main directories:

- `/resume_analyzer_frontend`: The React codebase.
- `/resume_analyzer_backend`: The Express server and LLM integration.

## ⚙️ Local Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/sanik4144/resume_analyzer.git
cd resume_analyzer
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure your environment.

```bash
cd resume_analyzer_backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=3000
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-3-flash-preview  # or gemini-1.5-flash depending on your access
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm start
# or for development:
npm run dev
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies.

```bash
cd ../resume_analyzer_frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:3000
```

Start the frontend development server:
```bash
npm run dev
```

## 🔒 Security Measures

This project was built with security in mind:
- **No Global State Caching**: Resume texts are scoped directly to the request lifecycle preventing data leaks between concurrent users.
- **Memory File Storage**: No physical files are saved to disks, avoiding path traversal risks and disk space exhaustion.
- **Rate-Limiting**: The `/analyze` endpoint uses `express-rate-limit` to prevent AI-driven DoS attacks that could inflate API costs.
- **Type Validation**: Only `.pdf` Mime-type signatures are allowed through Multer middleware logic.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License.
