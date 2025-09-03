# 🚀 Firebase Setup Guide for TaskFlow

## Quick Setup (5 minutes)

### 1. Create Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com/)
- Click "Create a project"
- Name: `taskflow-app` (or your preferred name)
- Enable Google Analytics (optional)
- Click "Create project"

### 2. Enable Authentication
- Click "Authentication" in left sidebar
- Click "Get started"
- Click "Sign-in method" tab
- Enable "Email/Password"
- Click "Save"

### 3. Create Database
- Click "Firestore Database" in left sidebar
- Click "Create database"
- Choose "Start in test mode"
- Select location (closest to you)
- Click "Done"

### 4. Get Your Config
- Click gear icon ⚙️ → "Project settings"
- Scroll to "Your apps" section
- Click web icon (</>)
- App nickname: `TaskFlow Web App`
- Click "Register app"
- Copy the config object

### 5. Update Config File
Replace the demo values in `firebase-config.js` with your real values:

```javascript
export const firebaseConfig = {
  apiKey: "your-real-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
}
```

### 6. Test the App
- Restart your app: `pnpm dev`
- Go to signup page
- Create a new user account
- Check Firebase Console to see the new user!

## 🔧 What This Gives You

✅ **Real User Authentication**
✅ **Persistent Database Storage**
✅ **User Data Security**
✅ **Scalable Infrastructure**
✅ **Real-time Updates**

## 🆘 Need Help?

If you get stuck:
1. Check Firebase Console for errors
2. Verify your config values
3. Make sure Authentication is enabled
4. Ensure Firestore is created

## 🎯 Next Steps

After setup:
1. Test user signup
2. Test user login
3. Create some tasks/projects
4. Check Firestore for data
5. Set up security rules

---

**Ready to get started? Follow the steps above and let me know when you have your Firebase config!** 🚀


