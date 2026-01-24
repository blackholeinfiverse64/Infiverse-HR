# BHIV HR Platform - Frontend

A modern, production-ready HR SaaS platform built with React, TypeScript, and Tailwind CSS.

## Features

### 🎯 Three Portal System
- **Recruiter Console**: Job creation, applicant management, feedback system, automation triggers
- **Candidate Portal**: Profile management, job applications, interviews & tasks, feedback tracking
- **Client View**: Dashboard overview, shortlist review, recruitment analytics

### ✨ Key Highlights
- Clean, modern dark UI with excellent UX
- Fully responsive design (desktop-first)
- Reusable component architecture
- Centralized API service with mock data
- Toast notifications for user feedback
- Role-based navigation
- Production-ready code structure

## Tech Stack

- **React 18** with TypeScript
- **Vite** for blazing fast builds
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Git

### Installation

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Create environment file (optional):**
   ```bash
   cp .env.example .env
   ```
   
   Update `VITE_API_BASE_URL` if you have a backend running.

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Table.tsx
│   │   ├── FormInput.tsx
│   │   ├── StatsCard.tsx
│   │   └── Loading.tsx
│   ├── pages/              # Page components
│   │   ├── recruiter/      # Recruiter portal pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── JobCreation.tsx
│   │   │   ├── ApplicantsMatching.tsx
│   │   │   ├── FeedbackForm.tsx
│   │   │   └── AutomationPanel.tsx
│   │   ├── candidate/      # Candidate portal pages
│   │   │   ├── Login.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── AppliedJobs.tsx
│   │   │   ├── InterviewTaskPanel.tsx
│   │   │   └── Feedback.tsx
│   │   └── client/         # Client portal pages
│   │       ├── Dashboard.tsx
│   │       └── ShortlistReview.tsx
│   ├── services/           # API & service layer
│   │   └── api.ts
│   ├── App.tsx             # Main app component
│   ├── routes.tsx          # Route configuration
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Available Routes

### Recruiter Console
- `/recruiter` - Dashboard with job overview
- `/recruiter/create-job` - Create new job posting
- `/recruiter/applicants/:jobId` - View and manage applicants
- `/recruiter/feedback/:candidateId` - Submit candidate feedback
- `/recruiter/automation` - Trigger automated notifications

### Candidate Portal
- `/candidate` - Login page
- `/candidate/profile` - Edit profile and upload resume
- `/candidate/applied-jobs` - View application status
- `/candidate/interviews` - Upcoming interviews and tasks
- `/candidate/feedback` - View employer feedback

### Client View
- `/client` - Dashboard with recruitment analytics
- `/client/shortlist/:jobId` - Review and approve candidates

## API Integration

The app uses a centralized API service (`src/services/api.ts`) with:

- **Mock Data**: Currently using mock data for demo purposes
- **Easy Integration**: Replace mock functions with actual API calls
- **Axios Interceptors**: Built-in auth token handling and error management

### Connecting to Backend

Update the API base URL in `.env`:

```env
VITE_API_BASE_URL=http://your-backend-url.com/api
```

Then uncomment the actual API calls in `src/services/api.ts` and remove mock data.

## Features by Portal

### Recruiter Console
- ✅ Job creation with detailed form
- ✅ Applicant matching with scores
- ✅ Candidate feedback form with values assessment
- ✅ Automation triggers (notifications)
- ✅ Resume viewing
- ✅ Shortlist/Reject actions

### Candidate Portal
- ✅ Simple login (email/ID)
- ✅ Profile management with resume upload
- ✅ Applied jobs tracking
- ✅ Interview schedule with meeting links
- ✅ Task management
- ✅ Feedback viewing with values

### Client View
- ✅ Overall recruitment analytics
- ✅ Job-wise breakdown
- ✅ Shortlist review with filtering
- ✅ Candidate approval workflow
- ✅ Request more profiles

## Customization

### Theme Colors
Edit `tailwind.config.js` to customize the color scheme.

### Components
All components are in `src/components/` and can be easily customized or extended.

### Mock Data
Modify mock data in `src/services/api.ts` to match your testing needs.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this for your projects!

## Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for BHIV HR Platform**
