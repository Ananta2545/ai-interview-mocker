# 🎯 AI Interview Mocker

> **Your AI-powered interview practice platform with advanced proctoring features**

A comprehensive web application that helps you prepare for technical interviews using AI-generated questions, real-time speech recognition, screen sharing, fullscreen enforcement, and intelligent evaluation powered by Google Gemini AI.

---

## 📖 Overview

**AI Interview Mocker** is a professional interview preparation platform that simulates real interview conditions with:
- 🤖 **AI-Generated Questions** - Customized to your job description and experience
- 🎤 **Voice Recording** - Real-time speech-to-text transcription
- 🖥️ **Screen Sharing** - Monitor-only screen sharing for security
- 🔒 **Fullscreen Enforcement** - 3-warning system for maintaining focus
- ✅ **Auto Correction** - AI-powered spelling and grammar correction
- 📊 **Intelligent Evaluation** - Detailed feedback with scoring categories
- 🎯 **Quiz System** - Timed knowledge tests with instant feedback
- 📈 **Performance Analytics** - Track your improvement over time

---

## ✨ Features

### 🎤 **Mock Interviews with Advanced Proctoring**
- **Setup Phase:**
  - Enable webcam and microphone
  - **Mandatory screen sharing** (full monitor only - no windows/tabs)
  - Visual status indicators for webcam and screen sharing
  - Start interview button (enabled after all requirements met)

- **Interview Phase:**
  - **Fullscreen enforcement** with automatic re-entry modal
  - **3-warning system** for fullscreen exits (redirects to dashboard after 3 violations)
  - Real-time speech-to-text transcription
  - 50-second timer per question
  - Visual recording indicators
  - Active speaking detection

- **AI Generation & Evaluation:**
  - 5 customized questions based on job position, description, and experience
  - Automatic spelling/grammar correction using Gemini AI
  - Comprehensive evaluation with scoring:
    - Technical Accuracy
    - Completeness
    - Clarity & Communication
    - Relevance
  - Overall grade (A+ to D) with detailed feedback
  - Improvement suggestions for each answer

### 🎯 **Interactive Quiz System**
- **Quiz Creation:**
  - Topic selection: JavaScript, React, Node.js, Python, Java, DSA, or General
  - Difficulty levels: Easy, Medium, Hard
  - Customizable question count (5-20 questions)
  - Adjustable time limits (10-30 seconds per question)

- **Quiz Interface:**
  - Live countdown timer per question
  - Progress bar showing completion
  - Instant visual feedback (✓ green for correct, ✗ red for incorrect)
  - Auto-progression after 2 seconds
  - Skip option with penalty
  - Loading state during submission

- **Results & Analytics:**
  - Overall score percentage
  - Questions answered correctly/incorrectly
  - Time spent per question
  - Question-by-question review
  - Visual performance charts

### 📊 **Dashboard & History**
- Card-based layout showing all interviews
- Interview details: Job position, description, experience, date
- Quick actions: Start new interview, view feedback
- Quiz history with scores and topics
- Recent activity timeline

---

## 🚀 Quick Start

### **Prerequisites**
```bash
Node.js 18+
npm or yarn
PostgreSQL database (Neon recommended)
API Keys: Clerk, Gemini AI
```

### **Installation**
```bash
# Clone repository
git clone https://github.com/yourusername/ai-interview-mocker.git
cd ai-interview-mocker

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Push database schema
npx drizzle-kit push

# Start development server
npm run dev
```

Visit `http://localhost:3000`

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Icons:** Lucide React
- **Forms:** React Hook Form

### **Backend**
- **API:** Next.js API Routes
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Drizzle ORM
- **Authentication:** Clerk

### **AI & Media**
- **AI Model:** Google Gemini 1.5 Flash
- **Speech Recognition:** Web Speech API (react-speech-recognition)
- **Video:** react-webcam
- **Screen Sharing:** Screen Capture API
- **Notifications:** react-hot-toast

### **Deployment**
- **Platform:** Vercel (recommended)
- **Database:** Neon PostgreSQL
- **CDN:** Vercel Edge Network

---

## 📁 Project Structure

```
ai-interview-mocker/
├── app/
│   ├── (auth)/                     # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── api/                        # API Routes
│   │   ├── gemini/                # Interview question generation
│   │   ├── correct/               # Spelling correction
│   │   ├── answers/               # Answer submission & evaluation
│   │   ├── interview/             # Interview CRUD operations
│   │   └── quiz/                  # Quiz generation & submission
│   ├── dashboard/
│   │   ├── interview/
│   │   │   └── [interviewId]/
│   │   │       ├── page.jsx       # Interview setup (webcam, screen share)
│   │   │       ├── start/         # Interview page (questions & recording)
│   │   │       │   ├── page.jsx   # Main interview interface
│   │   │       │   └── _components/
│   │   │       │       ├── QuestionSection.jsx
│   │   │       │       └── RecordAnswerSection.jsx  # Recording logic
│   │   │       └── feedback/
│   │   │           └── page.jsx   # Evaluation results
│   │   ├── questions/             # Quiz system
│   │   │   ├── page.jsx          # Quiz dashboard
│   │   │   ├── quiz/[quizId]/    # Quiz taking interface
│   │   │   └── results/[resultId]/ # Quiz results
│   │   ├── how-it-works/
│   │   └── page.jsx              # Main dashboard
│   ├── how-it-works/             # Landing page features
│   ├── globals.css               # Global styles
│   ├── layout.js                 # Root layout with Clerk provider
│   └── page.js                   # Landing page
├── components/ui/                # shadcn/ui components
│   ├── button.jsx
│   ├── card.jsx
│   ├── dialog.jsx
│   ├── progress.jsx
│   └── ...
├── utils/
│   ├── db.js                     # Drizzle database connection
│   └── schema.js                 # Database schema definitions
├── middleware.js                 # Clerk authentication middleware
├── drizzle.config.js            # Drizzle ORM configuration
├── next.config.mjs              # Next.js configuration
└── package.json                 # Dependencies
```

---

## 🔌 API Endpoints

### **Interview APIs**
```javascript
POST   /api/gemini              // Generate 5 interview questions
POST   /api/correct             // Correct spelling in transcript
POST   /api/answers             // Submit & evaluate answer
GET    /api/answers?interviewId // Get evaluation for specific interview
POST   /api/interview           // Create new interview
GET    /api/interview/:id       // Get interview details
GET    /api/interview/user/:userId // Get user's interview history
```

### **Quiz APIs**
```javascript
POST   /api/quiz/generate       // Generate quiz with AI
GET    /api/quiz/:quizId        // Fetch quiz questions
POST   /api/quiz/submit         // Submit quiz answers
GET    /api/quiz/results/:resultId // Get quiz results
```

### **Request/Response Examples**

**Generate Interview Questions:**
```json
POST /api/gemini
{
  "jobPosition": "Full Stack Developer",
  "jobDescription": "React, Node.js, PostgreSQL",
  "jobExperience": "3 years"
}

Response: {
  "questions": [
    {
      "question": "Explain React hooks...",
      "expectedAnswer": "React hooks are..."
    }
  ]
}
```

---

## 🗄️ Database Schema

### **Tables**

#### `mockInterview`
Stores interview sessions and AI-generated questions
```sql
- id (serial, PK)
- mockId (varchar, unique)
- jsonMockResp (text) -- JSON array of Q&A
- jobPosition (varchar)
- jobDesc (text)
- jobExperience (varchar)
- userId (varchar, FK to Clerk)
- createdAt (timestamp)
```

#### `userAnswers`
Stores user responses and AI evaluations
```sql
- id (serial, PK)
- interviewId (integer, FK)
- userId (varchar)
- questionIndex (integer)
- question (text)
- correctAnswer (text)
- userAnswer (text)
- rawTranscript (text)
- evaluation (text) -- JSON with scores
- overallScore (numeric)
- createdAt (timestamp)
```

#### `correctedAnswers`
Audit trail for spelling corrections
```sql
- id (serial, PK)
- interviewId (integer)
- userId (varchar)
- questionIndex (integer)
- originalText (text)
- correctedText (text)
- createdAt (timestamp)
```

#### `quizQuestions`
Stores quiz questions with options
```sql
- id (serial, PK)
- quizId (varchar)
- questionText (text)
- options (text[]) -- Array of options
- correctAnswer (text)
- topic (varchar)
- difficulty (varchar)
- createdAt (timestamp)
```

#### `quizAnswers`
Stores user quiz responses
```sql
- id (serial, PK)
- userId (varchar)
- questionId (integer, FK)
- selectedAnswer (text)
- isCorrect (boolean)
- createdAt (timestamp)
```

#### `quizResults`
Aggregated quiz scores
```sql
- id (serial, PK)
- userId (varchar)
- quizId (varchar)
- score (integer)
- totalQuestions (integer)
- createdAt (timestamp)
```

---

## 🔄 How It Works

### **Mock Interview Flow**

1. **Setup Phase** (`/dashboard/interview/[id]`)
   - User fills in job details (position, description, experience)
   - Clicks "Start Interview" → AI generates 5 questions
   - Redirects to interview setup page

2. **Proctoring Setup** (`/dashboard/interview/[id]/page`)
   - Enable webcam and microphone
   - Enable screen sharing (validates full monitor only)
   - Click "Start Interview" → Opens fullscreen modal
   - Enters fullscreen mode → Redirects to interview page

3. **Interview Phase** (`/dashboard/interview/[id]/start`)
   - Fullscreen enforcement active (3-warning system)
   - Display question with expected answer
   - User clicks "Start Speaking" → Enters fullscreen + starts recording
   - 50-second timer countdown
   - Real-time speech-to-text transcription
   - "Stop" button to end recording early
   - "Save Answer" button enabled when transcript available

4. **Processing** (Backend)
   - Send transcript to `/api/correct` → Gemini corrects spelling
   - Send corrected answer to `/api/answers` → Gemini evaluates
   - Save to database: original, corrected, evaluation
   - Return scores and feedback

5. **Results** (`/dashboard/interview/[id]/feedback`)
   - Display overall score and grade
   - Show category breakdown (Technical, Completeness, Clarity, Relevance)
   - List all questions with user answers and evaluations
   - Provide improvement suggestions

### **Quiz Flow**

1. **Quiz Creation** (`/dashboard/questions`)
   - Select topic, difficulty, question count, time limit
   - Click "Generate Quiz" → AI generates questions via `/api/quiz/generate`

2. **Quiz Interface** (`/dashboard/questions/quiz/[id]`)
   - Display question with 4 options
   - Timer countdown per question
   - Click option → Shows correct/incorrect (2s delay)
   - Auto-progress to next question
   - "Skip" button available

3. **Submission** (After last question)
   - Validate all answers have questionId
   - Submit to `/api/quiz/submit`
   - Calculate score and save results

4. **Results** (`/dashboard/questions/results/[id]`)
   - Show score percentage
   - Display correct/incorrect/skipped counts
   - Review each question with selected vs correct answer

---

## 🔒 Security Features

### **Proctoring**
- ✅ Webcam required (with live preview)
- ✅ Microphone required (for speech recognition)
- ✅ Screen sharing required (full monitor only)
- ✅ Fullscreen enforcement (automatic re-entry modal)
- ✅ 3-warning system (redirects to dashboard after 3 exits)
- ✅ Visual status indicators

### **Authentication**
- ✅ Clerk authentication (email/password, OAuth)
- ✅ Protected routes via middleware
- ✅ User session management
- ✅ Automatic redirects for unauthenticated users

### **Data Validation**
- ✅ API input validation
- ✅ Database constraints (NOT NULL, UNIQUE)
- ✅ Error handling with try-catch
- ✅ Toast notifications for user feedback

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Neon PostgreSQL Database
DATABASE_URL=postgresql://user:password@ep-xxxxx.neon.tech/dbname?sslmode=require

# Google Gemini AI
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXX
```

### **Getting API Keys**

#### Clerk (Authentication)
1. Visit [clerk.com](https://clerk.com)
2. Create account → New application
3. Copy publishable key and secret key
4. Add to `.env.local`

#### Neon (Database)
1. Visit [neon.tech](https://neon.tech)
2. Create project → Get connection string
3. Replace `DATABASE_URL` in `.env.local`
4. Run `npx drizzle-kit push` to create tables

#### Google Gemini AI
1. Visit [ai.google.dev](https://ai.google.dev)
2. Get API key from Google AI Studio
3. Add to `.env.local` as `GEMINI_API_KEY`

---

## 🐛 Troubleshooting

### **Common Issues**

#### Authentication Errors
```bash
# Issue: Clerk redirect loop
# Fix: Verify middleware.js has correct public routes
# Check: NEXT_PUBLIC_CLERK_* variables are set

# Issue: "User not authenticated"
# Fix: Clear cookies, restart dev server
# Check: User is signed in via /sign-in
```

#### Database Errors
```bash
# Issue: "Connection refused"
# Fix: Verify DATABASE_URL format
# Check: Neon project is active

# Issue: "Table does not exist"
# Fix: Run: npx drizzle-kit push
# Check: Schema matches utils/schema.js

# Issue: "questionId is null"
# Fix: Quiz questions must have valid IDs
# Check: Quiz generation API response
```

#### Screen Sharing Errors
```bash
# Issue: "API can only be initiated by a user gesture"
# Fix: Screen sharing requires user button click
# Already handled: Setup page has manual button

# Issue: "Please share full screen"
# Fix: Select "Entire Screen" not window/tab
# Validation: App checks displaySurface === "monitor"

# Issue: "Screen sharing stopped"
# Fix: User stopped sharing - must re-enable
# Check: Screen share status indicator
```

#### Speech Recognition Errors
```bash
# Issue: "Browser does not support speech recognition"
# Fix: Use Chrome, Edge, or Safari
# Not supported: Firefox (use Chromium-based browser)

# Issue: Transcript is empty
# Fix: Check microphone permissions
# Check: Microphone is not muted
# Test: Browser mic access granted
```

#### Fullscreen Errors
```bash
# Issue: "Failed to execute requestFullscreen"
# Fix: Fullscreen requires user interaction
# Handled: RecordAnswerSection requests on button click

# Issue: Warning modal appears on page load
# Fix: Added grace period (1 second)
# Handled: Only warns after user was in fullscreen
```

#### AI/Gemini Errors
```bash
# Issue: "GEMINI_API_KEY is invalid"
# Fix: Verify key from Google AI Studio
# Check: Key format starts with "AIzaSy"

# Issue: "Rate limit exceeded"
# Fix: Wait and retry (3 retries implemented)
# Check: API usage quota

# Issue: "Failed to generate questions"
# Fix: Check job description is not empty
# Retry: API has exponential backoff
```

---

## 🚀 Deployment

### **Deploy to Vercel** (Recommended)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/ai-interview-mocker.git
git push -u origin main
```

2. **Deploy on Vercel**
- Visit [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Add environment variables:
  - All `NEXT_PUBLIC_*` variables
  - `CLERK_SECRET_KEY`
  - `DATABASE_URL`
  - `GEMINI_API_KEY`
- Click "Deploy"

3. **Configure Clerk for Production**
- Go to Clerk Dashboard → your app
- Add production domain: `your-app.vercel.app`
- Update allowed redirect URLs

### **Deploy to Netlify**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Add environment variables in Netlify Dashboard
# Site settings → Environment variables
```

### **Database Setup for Production**

```bash
# Neon is already serverless - no changes needed
# Ensure DATABASE_URL is set in deployment platform
# Tables are created via drizzle-kit push
```

---

## � Key Features in Detail

### **Interview Setup Page**
- **Webcam Control**
  - Enable/disable button with preview
  - Visual indicator when active
  - Mirror mode for natural view

- **Screen Sharing**
  - "Enable Screen Sharing" button
  - Validates full monitor (not window/tab)
  - Status badge (active/inactive)
  - Error handling with user-friendly messages

- **Start Interview Flow**
  - Button enabled after webcam + screen share ready
  - Fullscreen modal with confirmation
  - Auto-enters fullscreen on confirm
  - Navigates to interview page

### **Interview Interface**
- **Question Display**
  - Current question text
  - Expected answer (for reference)
  - Question counter (1 of 5)
  - Progress indicator

- **Recording Section**
  - "Start Speaking" button (enters fullscreen)
  - Real-time transcript display
  - Speaking indicator (visual feedback)
  - 50-second countdown timer
  - "Stop" button to end early
  - "Save Answer" button (enabled when transcript available)
  - Loading state during save
  - Navigation: Previous/Next question buttons

- **Fullscreen Enforcement**
  - Monitors fullscreen status every 2 seconds
  - Shows warning modal on exit
  - "Re-Enter Fullscreen" button
  - Tracks exit count (1/3, 2/3, 3/3)
  - Redirects to dashboard after 3 exits

### **Feedback Page**
- **Overall Score**
  - Percentage score
  - Letter grade (A+, A, B+, B, C+, C, D)
  - Visual grade badge with color coding

- **Category Breakdown**
  - Technical Accuracy (progress bar)
  - Completeness (progress bar)
  - Clarity & Communication (progress bar)
  - Relevance (progress bar)

- **Question Review**
  - Each question with user answer
  - AI evaluation for each response
  - Improvement suggestions
  - Highlighting key strengths/weaknesses

### **Quiz System**
- **Setup Form**
  - Topic dropdown (8 options)
  - Difficulty radio buttons
  - Question count slider (5-20)
  - Time limit slider (10-30s)
  - Loading state during generation

- **Quiz Interface**
  - Question text with number
  - 4 multiple choice options
  - Timer countdown
  - Progress bar
  - Instant feedback (green ✓ / red ✗)
  - 2-second delay before next question
  - "Skip Question" button

- **Results Page**
  - Score percentage with visual gauge
  - Correct/Incorrect/Skipped counts
  - Question-by-question review
  - Selected vs Correct answer comparison
  - Time spent per question
  - "Retake Quiz" and "New Quiz" buttons

---

## 📊 Performance Optimization

### **Implemented Optimizations**
- ✅ Next.js App Router for optimal performance
- ✅ Server-side rendering where appropriate
- ✅ API route handlers for backend logic
- ✅ Drizzle ORM for efficient queries
- ✅ React hooks optimization (useCallback, useMemo)
- ✅ Lazy loading for heavy components
- ✅ Toast notifications instead of alerts
- ✅ Error boundaries for graceful failures

### **Best Practices**
- ✅ Environment variables for sensitive data
- ✅ Try-catch blocks for error handling
- ✅ Input validation on frontend and backend
- ✅ Database indexes on frequently queried columns
- ✅ Proper HTTP status codes (200, 400, 500)
- ✅ Loading states for async operations
- ✅ Debouncing for search/filter operations

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### **How to Contribute**

1. **Fork the repository**
```bash
# Click "Fork" button on GitHub
```

2. **Clone your fork**
```bash
git clone https://github.com/yourusername/ai-interview-mocker.git
cd ai-interview-mocker
```

3. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```

4. **Make your changes**
- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly

5. **Commit your changes**
```bash
git add .
git commit -m "Add: Amazing feature description"
```

6. **Push to your fork**
```bash
git push origin feature/amazing-feature
```

7. **Open a Pull Request**
- Go to original repository on GitHub
- Click "New Pull Request"
- Describe your changes in detail

### **Contribution Guidelines**
- ✅ Follow existing file structure
- ✅ Use TypeScript types where applicable
- ✅ Add error handling for all async operations
- ✅ Include toast notifications for user feedback
- ✅ Test on Chrome, Edge, and Safari
- ✅ Ensure responsive design (mobile-friendly)
- ✅ Update README if adding new features

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2025 AI Interview Mocker

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

Special thanks to the following technologies and communities:

- **[Next.js](https://nextjs.org/)** - The React Framework for Production
- **[Clerk](https://clerk.com/)** - Complete User Management & Authentication
- **[Neon](https://neon.tech/)** - Serverless Postgres Database
- **[Google Gemini](https://ai.google.dev/)** - Advanced AI Model for evaluation
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful and accessible components
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[Vercel](https://vercel.com/)** - Deployment and hosting platform

---

## 📞 Support & Contact

Need help or have questions?

### **Get Help**
- 📚 **Documentation**: Check this README and code comments
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/Ananta2545/ai-interview-mocker/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/Ananta2545/ai-interview-mocker/discussions)
- 📧 **Email**: your.email@example.com

### **Quick Links**
- 🌐 **Live Demo**: [View Demo](https://your-app.vercel.app)
- 📖 **API Docs**: See API Endpoints section above
- 🎥 **Video Tutorial**: [Coming Soon]
- 📱 **Social Media**: [Twitter](https://twitter.com/yourusername) | [LinkedIn](https://linkedin.com/in/yourusername)

---

## 📈 Future Enhancements

Planned features for upcoming releases:

### **Version 2.0**
- [ ] Multiple interview rounds (Technical, HR, Behavioral)
- [ ] Video recording alongside audio
- [ ] AI-powered resume analysis
- [ ] Mock coding challenges
- [ ] Peer-to-peer mock interviews

### **Version 2.1**
- [ ] Mobile app (React Native)
- [ ] Company-specific interview prep
- [ ] Interview scheduling system
- [ ] Live interviewer mode
- [ ] Interview tips and resources

### **Version 2.2**
- [ ] Advanced analytics dashboard
- [ ] Performance trends over time
- [ ] Skill gap analysis
- [ ] Personalized learning paths
- [ ] Integration with job boards

---

## ⭐ Show Your Support

If you find this project helpful, please consider:

- ⭐ **Star this repository** on GitHub
- 🐛 **Report bugs** you encounter
- 💡 **Suggest features** you'd like to see
- 🔀 **Fork and contribute** to the project
- 📢 **Share with others** who might benefit
- ☕ **Buy me a coffee** (if you're feeling generous)

---

## 📊 Project Stats

![GitHub Stars](https://img.shields.io/github/stars/Ananta2545/ai-interview-mocker?style=social)
![GitHub Forks](https://img.shields.io/github/forks/Ananta2545/ai-interview-mocker?style=social)
![GitHub Issues](https://img.shields.io/github/issues/Ananta2545/ai-interview-mocker)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Ananta2545/ai-interview-mocker)
![License](https://img.shields.io/github/license/Ananta2545/ai-interview-mocker)

---

<div align="center">

### 🚀 Built with passion to help you ace your interviews! 🎯

**Made with ❤️ and ☕ | Powered by AI**

---

[🌟 Star on GitHub](https://github.com/Ananta2545/ai-interview-mocker) • 
[🐛 Report Bug](https://github.com/Ananta2545/ai-interview-mocker/issues) • 
[💡 Request Feature](https://github.com/Ananta2545/ai-interview-mocker/issues) • 
[📖 Documentation](#-overview)

---

**Happy Interviewing! 🎉**

*Remember: Practice makes perfect. Keep interviewing, keep improving!* ✨

</div>
