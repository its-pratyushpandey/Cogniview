# AI Voice Interview Platform

A sophisticated AI-powered voice interview platform that helps users practice job interviews with realistic voice interactions. Built with Next.js, Firebase, and VAPI for seamless voice AI integration.

## 🚀 Features

### 🎯 Interview Generation
- **AI-Powered Question Creation**: Generate personalized interview questions based on job role, experience level, and tech stack
- **Intelligent Customization**: Tailored questions for Technical, Behavioral, or Mixed interview types
- **Voice-Based Requirements Gathering**: Natural conversation to understand your interview needs

### 🎤 Voice Interview Experience
- **Realistic AI Interviewer**: Professional interviewer persona with natural conversation flow
- **Dynamic Follow-ups**: Intelligent follow-up questions based on your responses
- **Real-time Voice Interaction**: Seamless voice-to-voice communication using VAPI

### 📊 Feedback & Analytics
- **Comprehensive Scoring**: Multi-dimensional evaluation across Communication, Technical Knowledge, Problem Solving, Cultural Fit, and Confidence
- **Detailed Feedback**: Personalized strengths and improvement areas
- **Interview History**: Track your progress over multiple interview sessions

### 🔐 User Management
- **Firebase Authentication**: Secure user accounts with email/password
- **Personal Dashboard**: Manage your interviews and view feedback history
- **Responsive Design**: Optimized for desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.3.0, React, TypeScript, Tailwind CSS
- **Backend**: Firebase Admin SDK, Firestore Database
- **Authentication**: Firebase Authentication
- **Voice AI**: VAPI (@vapi-ai/web v2.2.5)
- **AI Integration**: Google AI SDK with Gemini
- **Form Handling**: Zod validation
- **UI Components**: Custom components with shadcn/ui patterns

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Firebase project with Firestore and Authentication enabled
- VAPI account for voice AI functionality

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd AI-Voice-Interview-main
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up Firebase**:
   - Follow the detailed guide in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - Configure your `.env.local` with Firebase credentials

4. **Set up VAPI**:
   - Follow the detailed guide in [VAPI_SETUP.md](./VAPI_SETUP.md)
   - Add your VAPI Web Token to `.env.local`

5. **Start the development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

6. **Open your browser**:
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Create an account and start practicing interviews!

## 📁 Project Structure

```
├── app/                    # Next.js app router
│   ├── (auth)/            # Authentication pages
│   ├── (root)/            # Main application pages
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── Agent.tsx         # VAPI voice integration
│   ├── AuthForm.tsx      # Authentication forms
│   └── ...               # Other components
├── constants/            # Application constants
├── firebase/             # Firebase configuration
├── lib/                  # Utility functions and actions
│   ├── actions/          # Server actions
│   └── vapi.sdk.ts       # VAPI SDK configuration
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="your_private_key"

# Firebase Client SDK (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# VAPI Configuration
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token
```

## 🎯 How It Works

### 1. Interview Generation Flow
1. User clicks "Generate Interview" on the homepage
2. VAPI voice AI assistant gathers requirements:
   - Job role/position
   - Experience level
   - Interview type preference
   - Relevant tech stack
   - Number of questions
3. AI generates personalized interview questions
4. Questions are saved to Firebase for the interview session

### 2. Interview Conduct Flow
1. User starts an interview session
2. VAPI interviewer AI conducts the interview:
   - Asks prepared questions
   - Listens to responses via voice
   - Provides natural follow-up questions
   - Maintains professional interview atmosphere
3. Interview is recorded and analyzed
4. Comprehensive feedback is generated and stored

### 3. Feedback Analysis
- Multi-dimensional scoring system
- Detailed category-wise evaluation
- Personalized improvement suggestions
- Historical progress tracking

## 📊 Features in Detail

### Voice AI Integration (VAPI)
- **Real-time Voice Processing**: Natural speech-to-text and text-to-speech
- **Conversation Management**: Intelligent conversation flow with context awareness
- **Professional Voice**: High-quality AI voice with professional tone
- **Error Handling**: Graceful fallbacks for connection issues

### Firebase Integration
- **Authentication**: Secure user management with email/password
- **Firestore Database**: Real-time data synchronization
- **Error Boundaries**: Comprehensive error handling with user-friendly messages
- **Responsive Queries**: Optimized database queries with fallback strategies

### User Experience
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Loading States**: Professional loading indicators and skeleton screens
- **Error Handling**: User-friendly error messages and recovery options
- **Accessibility**: WCAG-compliant design patterns

## 🚀 Deployment

### Recommended Platforms
- **Vercel** (recommended): Optimized for Next.js with automatic HTTPS
- **Netlify**: Good alternative with easy deployment
- **Railway**: Full-stack deployment with database support

### Deployment Checklist
- [ ] Set up production Firebase project
- [ ] Configure production VAPI account
- [ ] Set environment variables in deployment platform
- [ ] Enable HTTPS (required for microphone access)
- [ ] Test voice functionality on production domain

## 🔒 Security Considerations

- Environment variables are properly scoped (NEXT_PUBLIC_ for client-side only)
- Firebase security rules configured for user data protection
- VAPI tokens use public keys safe for client-side usage
- Authentication required for all interview features

## 📱 Browser Compatibility

### Supported Browsers
- Chrome 60+ (recommended)
- Firefox 55+
- Safari 11+ (iOS)
- Edge 79+

### Requirements
- Microphone access permission
- HTTPS in production (for microphone access)
- Modern JavaScript support (ES2018+)

## 🐛 Troubleshooting

### Common Issues

1. **Voice not working**:
   - Check microphone permissions
   - Ensure HTTPS in production
   - Verify VAPI token configuration

2. **Firebase errors**:
   - Verify environment variables
   - Check Firebase project settings
   - Review security rules

3. **Authentication issues**:
   - Clear browser cache and cookies
   - Check Firebase Authentication configuration
   - Verify client-side configuration

### Getting Help
- Check browser console for detailed error messages
- Review setup guides (FIREBASE_SETUP.md, VAPI_SETUP.md)
- Verify all environment variables are correctly set

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- VAPI for providing excellent voice AI capabilities
- Firebase for robust backend infrastructure
- Next.js team for the amazing framework
- Google AI for Gemini integration
- All contributors and testers

---

**Ready to practice your next interview?** Get started by following the setup guides and launching your first AI-powered mock interview! 🎤✨
"# Cogniview" 
