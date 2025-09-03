#!/usr/bin/env node

console.log('🚀 Quick Firebase Setup for TaskFlow')
console.log('=====================================')
console.log('')

console.log('📋 Follow these steps to get Firebase working:')
console.log('')

console.log('1. 🌐 Go to: https://console.firebase.google.com/')
console.log('2. ➕ Click "Create a project"')
console.log('3. 📝 Name it: taskflow-app')
console.log('4. ✅ Enable Google Analytics (optional)')
console.log('5. 🚀 Click "Create project"')
console.log('')

console.log('6. 🔐 Click "Authentication" in left sidebar')
console.log('7. 🚀 Click "Get started"')
console.log('8. 📧 Click "Sign-in method" tab')
console.log('9. ✅ Enable "Email/Password"')
console.log('10. 💾 Click "Save"')
console.log('')

console.log('11. 🗄️ Click "Firestore Database" in left sidebar')
console.log('12. 🚀 Click "Create database"')
console.log('13. 🧪 Choose "Start in test mode"')
console.log('14. 🌍 Select location (closest to you)')
console.log('15. ✅ Click "Done"')
console.log('')

console.log('16. ⚙️ Click gear icon → "Project settings"')
console.log('17. 📱 Scroll to "Your apps" section')
console.log('18. 🌐 Click web icon (</>)')
console.log('19. 📝 App nickname: TaskFlow Web App')
console.log('20. 🚀 Click "Register app"')
console.log('')

console.log('21. 📋 Copy the config object')
console.log('22. 📝 Update firebase-config.js with real values')
console.log('23. 🔄 Restart your app: pnpm dev')
console.log('24. 🧪 Test signup at: http://localhost:3001/signup')
console.log('')

console.log('🎯 Expected time: 3-5 minutes')
console.log('💡 Need help? Check the setup-firebase.md file')
console.log('')

console.log('🚀 Ready to get started? Open the Firebase Console now!')
console.log('')

// Open Firebase Console in browser
const { exec } = require('child_process')
exec('open https://console.firebase.google.com/', (error) => {
  if (error) {
    console.log('🌐 Open manually: https://console.firebase.google.com/')
  } else {
    console.log('✅ Firebase Console opened in your browser!')
  }
})
