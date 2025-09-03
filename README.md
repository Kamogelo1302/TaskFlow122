# TaskFlow - Task & Project Tracker

A modern, responsive task and project management application built with Next.js, Firebase, and Tailwind CSS.

## Features

- **User Authentication**: Secure signup/login with Firebase Auth
- **Password Validation**: Real-time password strength requirements
- **Security Questions**: Two-factor authentication with custom security questions
- **Dashboard**: Welcome page with user stats and quick actions
- **Responsive Design**: Works seamlessly on all devices
- **Modern UI**: Built with shadcn/ui components

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Firebase (Authentication, Firestore)
- **State Management**: React Context API
- **Package Manager**: pnpm

## Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)
- Firebase account

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd task_project_tracker
pnpm install
```

### 2. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication:
   - Go to Authentication → Sign-in method
   - Enable Email/Password authentication
4. Enable Firestore Database:
   - Go to Firestore Database → Create database
   - Start in test mode (for development)
5. Get your project configuration:
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click on the web app or create one
   - Copy the config object

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
cp env.example .env.local
```

Edit `.env.local` and replace the values with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Firestore Security Rules

Update your Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Run the Application

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
task_project_tracker/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── forgot-password/  # Password reset page
│   ├── layout.tsx        # Root layout with AuthProvider
│   └── page.tsx          # Landing page
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── contexts/              # React contexts
│   └── AuthContext.tsx   # Firebase authentication context
├── lib/                   # Utility libraries
│   └── firebase.ts       # Firebase configuration
├── .env.local            # Environment variables (create this)
├── env.example           # Environment variables template
└── README.md             # This file
```

## Authentication Flow

1. **Signup**: User creates account with email, password, and security questions
2. **Login**: User authenticates with email/password
3. **Dashboard**: Authenticated users see personalized welcome page
4. **Password Reset**: Users can reset password via security questions
5. **Logout**: Users can securely log out

## Firebase Integration

- **Authentication**: Email/password signup and login
- **Firestore**: User profile data storage
- **Security**: User data isolation and authentication checks
- **Real-time**: Automatic user state management

## Development

### Adding New Features

1. Create new pages in the `app/` directory
2. Add new components in `components/`
3. Update authentication context if needed
4. Test with Firebase emulators for development

### Firebase Emulators (Optional)

For local development without affecting production:

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize emulators
firebase init emulators

# Start emulators
firebase emulators:start
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

- **Netlify**: Similar to Vercel
- **Firebase Hosting**: Direct Firebase integration
- **Custom Server**: Any Node.js hosting platform

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | Yes |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Authentication domain | Yes |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket URL | Yes |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID | Yes |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | Yes |

## Troubleshooting

### Common Issues

1. **Firebase not initialized**: Check environment variables
2. **Authentication errors**: Verify Firebase Auth is enabled
3. **Firestore errors**: Check security rules and database creation
4. **Build errors**: Ensure all dependencies are installed

### Getting Help

- Check Firebase Console for configuration issues
- Review browser console for JavaScript errors
- Verify environment variables are loaded correctly
- Check Firebase project settings and permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check Firebase documentation
- Review Next.js documentation






