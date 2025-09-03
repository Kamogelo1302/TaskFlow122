// Test Firebase Connection
// Run this with: node test-firebase.js

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Import your config
import { firebaseConfig } from './firebase-config.js'

console.log('🧪 Testing Firebase Connection...')
console.log('📋 Config check:')
console.log('  - API Key length:', firebaseConfig.apiKey?.length || 0)
console.log('  - Project ID:', firebaseConfig.projectId)
console.log('  - Auth Domain:', firebaseConfig.authDomain)

try {
  console.log('\n🚀 Initializing Firebase...')
  const app = initializeApp(firebaseConfig)
  console.log('✅ Firebase app initialized:', app.name)
  
  const auth = getAuth(app)
  console.log('✅ Firebase Auth initialized')
  
  const db = getFirestore(app)
  console.log('✅ Firestore initialized')
  
  console.log('\n🎉 SUCCESS! Firebase is properly configured and connected!')
  console.log('🌐 Your app is ready to use real Firebase authentication and database.')
  
} catch (error) {
  console.error('\n❌ Firebase initialization failed:')
  console.error('   Error:', error.message)
  console.error('\n💡 Troubleshooting:')
  console.error('   1. Check your firebase-config.js values')
  console.error('   2. Verify your Firebase project is active')
  console.error('   3. Ensure Authentication and Firestore are enabled')
  console.error('   4. Check if your API key is correct')
}

