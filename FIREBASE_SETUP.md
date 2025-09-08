# 🔥 Firebase Setup Guide for TaskFlow

This guide will help you set up Firebase so you can see your tasks and projects in the Firebase console!

## 🚀 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or **"Add project"**
3. Enter a project name (e.g., "taskflow-app")
4. Choose whether to enable Google Analytics (optional)
5. Click **"Create project"**

## ⚙️ Step 2: Enable Authentication

1. In your Firebase project, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Click on the **"Sign-in method"** tab
4. Click **"Email/Password"**
5. Enable **"Email/Password"** provider
6. Click **"Save"**

## 🗄️ Step 3: Enable Firestore Database

1. In your Firebase project, click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll secure it later)
4. Select a location close to your users
5. Click **"Enable"**

## 📱 Step 4: Add Web App

1. In your Firebase project, click the gear icon (⚙️) next to **"Project Overview"**
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click **"Add app"** and choose **"Web"** (</>)
5. Enter an app nickname (e.g., "TaskFlow Web")
6. Click **"Register app"**
7. **Copy the configuration object** - you'll need this for your `.env.local` file

## 🔑 Step 5: Create Environment File

1. In your project root, create a file called `.env.local`
2. Copy the contents from `firebase-config-template.txt`
3. Replace the placeholder values with your actual Firebase config:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## 🔒 Step 6: Set Firestore Security Rules

1. In Firebase Console, go to **"Firestore Database"**
2. Click on the **"Rules"** tab
3. Replace the existing rules with the contents of `firestore.rules`
4. Click **"Publish"**

## 🧪 Step 7: Test Your Setup

1. Restart your development server:
   ```bash
   pnpm dev
   ```

2. Create a new account or sign in
3. Create some tasks and projects
4. Check your Firebase console to see the data!

## 📊 Where to See Your Data

### Users Collection
- **Path**: `Firestore Database` → `users` collection
- **Contains**: User profiles, security questions, creation dates

### Tasks Collection
- **Path**: `Firestore Database` → `tasks` collection
- **Contains**: All your created tasks with details

### Projects Collection
- **Path**: `Firestore Database` → `projects` collection
- **Contains**: All your created projects with team and milestone info

## 🔍 Viewing Data in Firebase Console

1. Go to **"Firestore Database"** in Firebase Console
2. You'll see collections: `users`, `tasks`, `projects`
3. Click on any collection to see documents
4. Each document represents a user, task, or project
5. Click on a document to see all the fields and values

## 🚨 Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
- Check your `.env.local` file has correct values
- Make sure you copied the entire API key
- Restart your dev server after changing environment variables

### "Firebase: Error (auth/operation-not-allowed)"
- Make sure Email/Password authentication is enabled
- Check your Firestore security rules

### "Firebase: Error (permission-denied)"
- Check your Firestore security rules
- Make sure users are authenticated before accessing data

### Data not showing up
- Check browser console for errors
- Verify your Firebase project ID matches
- Make sure you're signed in to the app

## 🎯 Next Steps

Once Firebase is working:
1. **Monitor Usage**: Check Firebase Console for usage statistics
2. **Set Up Monitoring**: Enable Firebase Performance Monitoring
3. **Add Analytics**: Integrate Firebase Analytics for user insights
4. **Backup Data**: Set up automated backups for your Firestore data

## 📞 Need Help?

- Check [Firebase Documentation](https://firebase.google.com/docs)
- Visit [Firebase Community](https://firebase.google.com/community)
- Review your browser console for error messages

---

**🎉 Congratulations!** You now have a fully functional Firebase backend for TaskFlow. Your data will be stored securely in the cloud and you can view it all in the Firebase Console!









