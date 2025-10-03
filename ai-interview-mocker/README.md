# 🎯 AI Interview Mocker

> **Your personal AI-powered interview practice platform**

An advanced web application that helps you prepare for technical interviews using AI-generated questions, real-time speech recognition, and intelligent evaluation powered by Google Gemini AI.

---

## 📖 Overview

**AI Interview Mocker** is a comprehensive interview preparation platform that combines:
- 🤖 **AI-Generated Questions** - Tailored to your job description
- 🎤 **Voice Recording** - Practice speaking your answers
- ✅ **Spelling Correction** - Automatically fixes transcription errors
- 📊 **Intelligent Evaluation** - Get detailed feedback on your performance
- 🎯 **Quiz System** - Test your knowledge with timed quizzes
- 📈 **Performance Analytics** - Track your progress over time

---

## ✨ Features

### 🎤 **Mock Interviews**
- Generate customized interview questions based on job position, description, and experience
- 5 AI-generated questions per interview with expected answers
- Voice recording with real-time speech-to-text transcription
- Automatic spelling correction using Gemini AI
- Comprehensive evaluation with detailed scores and feedback
- Category-based scoring: Technical Accuracy, Completeness, Clarity, Relevance

### 🎯 **Quiz System**
- Create custom quizzes with topic selection (JavaScript, React, Node.js, Python, General)
- Multiple difficulty levels (Easy, Medium, Hard)
- Customizable question count (5-20) and time limits (10-30 seconds per question)
- Live quiz interface with timer and instant visual feedback
- Detailed results page with performance analytics and question review

### 📊 **Performance Tracking**
- View all previous interviews in a card-based dashboard
- Comprehensive feedback reports with overall score and grade (A+ to D)
- Score breakdown by category with progress bars
- Improvement suggestions powered by AI
- Interview history with creation dates and job details

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ installed
- npm or yarn package manager
- Accounts: [Clerk](https://clerk.com/), [Neon](https://neon.tech/), [Google AI Studio](https://ai.google.dev/)

### **Installation**
```bash
# Clone the repository
git clone <your-repo-url>
cd ai-interview-mocker

# Install dependencies
npm install

# Set up environment variables
# Create .env.local file and add your API keys (see SETUP_GUIDE.md)

# Push database schema to Neon
npx drizzle-kit push:pg

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**📘 For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)**

---

## 🛠️ Technology Stack

### **Frontend**
- Next.js 15 with App Router
- React 19
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

### **Backend**
- Next.js API Routes
- Drizzle ORM
- Neon PostgreSQL (Serverless)

### **Authentication & AI**
- Clerk Authentication
- Google Gemini AI
- Web Speech API

**📘 For complete tech stack details, see [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)**

---

## 📁 Project Structure

```
ai-interview-mocker/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages
│   ├── api/                 # API routes
│   ├── dashboard/           # Dashboard & features
│   │   ├── interview/       # Interview system
│   │   └── questions/       # Quiz system
│   └── layout.js            # Root layout
├── components/ui/           # shadcn/ui components
├── utils/                   # Database utilities
├── middleware.js            # Clerk auth middleware
└── Documentation files      # See below
```

**📘 For detailed file structure, see [COMPONENT_HIERARCHY.md](./COMPONENT_HIERARCHY.md)**

---

## 🔌 API Endpoints

### **Interview APIs**
- `POST /api/gemini` - Generate interview questions
- `POST /api/correct` - Correct spelling in transcript
- `POST /api/answers` - Submit and evaluate answer
- `GET /api/answers` - Fetch evaluation results
- `GET /api/interviews` - List all user interviews

### **Quiz APIs**
- `POST /api/quiz/generate` - Generate quiz
- `GET /api/quiz/[quizId]` - Fetch quiz data
- `POST /api/quiz/submit` - Submit quiz answers
- `POST /api/quiz/results` - Fetch quiz results

**📘 For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

---

## 🗄️ Database Schema

The application uses 5 PostgreSQL tables:

| Table | Purpose |
|-------|---------|
| `mockInterview` | Store interview sessions and AI-generated questions |
| `userAnswers` | Store user responses and AI evaluations |
| `correctedAnswers` | Store spelling corrections for audit trail |
| `quizQuestions` | Store quiz questions with options and correct answers |
| `quizAnswers` | Store user quiz responses with timing data |

**📘 For detailed schema documentation, see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)**

---

## 🔄 How It Works

### **Mock Interview Flow**
1. User creates interview → AI generates 5 customized questions
2. User records answer → Speech-to-text transcription
3. System corrects spelling → Gemini AI evaluates answer
4. Scores saved to database → User views detailed feedback

### **Quiz Flow**
1. User sets up quiz (topic, difficulty, count, time limit)
2. AI generates questions → User takes timed quiz
3. Instant feedback on each answer (✓ or ✗)
4. Quiz submitted → Results calculated with analytics
5. User views detailed performance report

**📘 For detailed workflow diagrams, see [WORKFLOW.md](./WORKFLOW.md)**

---

## 📚 Complete Documentation

| Document | Description |
|----------|-------------|
| [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) | Complete project overview and architecture |
| [WORKFLOW.md](./WORKFLOW.md) | Visual workflow diagrams and data flows |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | Complete API reference with examples |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | Database schema, relationships, and queries |
| [COMPONENT_HIERARCHY.md](./COMPONENT_HIERARCHY.md) | File structure and component dependencies |
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Detailed installation and troubleshooting |

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Neon PostgreSQL Database
DATABASE_URL=postgresql://user:password@host/db?sslmode=require

# Google Gemini AI
GEMINI_API_KEY=AIzaSy...
```

**📘 For detailed environment setup, see [SETUP_GUIDE.md](./SETUP_GUIDE.md#environment-variables)**

---

## 🐛 Troubleshooting

### Common Issues

**Clerk redirect loop:**
- Check middleware.js has correct route matchers
- Verify all Clerk environment variables

**Database connection failed:**
- Verify DATABASE_URL format
- Check if Neon project is active
- Run `npx drizzle-kit push:pg`

**Gemini API error:**
- Verify GEMINI_API_KEY is correct
- Check API usage limits

**📘 For more troubleshooting, see [SETUP_GUIDE.md](./SETUP_GUIDE.md#common-issues)**

---

## 🚀 Deployment

### **Deploy to Vercel** (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel Dashboard
# Project Settings → Environment Variables
```

### **Deploy to Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Note:** Set all environment variables in your deployment platform.

---

## 🎨 Key Features Showcase

### Dashboard
- Clean card-based layout showing all your interviews
- Quick actions: Start Interview, View Feedback
- Interview details: Job position, experience, creation date

### Interview Interface
- Question display with expected answer
- Real-time voice recording with transcript
- Timer countdown
- Progress indicator (Question X of 5)

### Feedback Page
- Overall score with grade badge (A+, A, B+, etc.)
- Category breakdown with progress bars
- Detailed feedback for each question
- AI-powered improvement suggestions
- Performance insights

### Quiz System
- Interactive quiz setup form
- Live quiz with countdown timer
- Instant visual feedback (green ✓ / red ✗)
- Auto-progression between questions
- Comprehensive results with analytics

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit: `git commit -m "Add: Amazing feature"`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Next.js** - The React Framework for Production
- **Clerk** - Complete User Management
- **Neon** - Serverless Postgres
- **Google Gemini** - Advanced AI Capabilities
- **shadcn/ui** - Beautiful Component Library
- **Drizzle ORM** - TypeScript ORM

---

## 📞 Support

For questions, issues, or feature requests:
- 📧 Email: your.email@example.com
- 💬 GitHub Issues: [Create an issue](https://github.com/yourusername/ai-interview-mocker/issues)
- 📚 Documentation: See the files listed above

---

## ⭐ Show Your Support

If you found this project helpful:
- ⭐ Star this repository
- 🐛 Report bugs
- 💡 Suggest features
- 🔀 Fork and contribute

---

<div align="center">

**Made with ❤️ and ☕ | Powered by AI**

[📚 Documentation](./PROJECT_OVERVIEW.md) • [🐛 Report Bug](https://github.com/yourusername/ai-interview-mocker/issues) • [💡 Request Feature](https://github.com/yourusername/ai-interview-mocker/issues)

</div>
