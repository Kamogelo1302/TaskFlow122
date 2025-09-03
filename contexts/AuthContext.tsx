"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

interface AuthContextType {
  currentUser: User | null
  signup: (email: string, password: string, fullName: string, nickname: string, roleModel: string) => Promise<User>
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  verifySecurityQuestions: (email: string, nickname: string, roleModel: string) => Promise<boolean>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const signup = useCallback(async (email: string, password: string, fullName: string, nickname: string, roleModel: string) => {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update profile with display name
      await updateProfile(user, {
        displayName: fullName
      })

      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        fullName,
        nickname,
        roleModel,
        createdAt: new Date().toISOString()
      })

      setCurrentUser(user)
      return user
    } catch (error: any) {
      console.error('Error during signup:', error)
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email already registered. Please use a different email or try logging in.')
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use a stronger password.')
      } else {
        throw new Error('Failed to create account. Please try again.')
      }
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      setCurrentUser(user)
      return user
    } catch (error: any) {
      console.error('Error during login:', error)
      if (error.code === 'auth/user-not-found') {
        throw new Error('User not found. Please check your email or create an account.')
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.')
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email format. Please check your email.')
      } else {
        throw new Error('Login failed. Please try again.')
      }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await signOut(auth)
      setCurrentUser(null)
    } catch (error) {
      console.error('Error during logout:', error)
      throw error
    }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
      console.log('Password reset email sent to:', email)
    } catch (error: any) {
      console.error('Error during password reset:', error)
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address.')
      } else {
        throw new Error('Failed to send password reset email. Please try again.')
      }
    }
  }, [])

  const verifySecurityQuestions = useCallback(async (email: string, nickname: string, roleModel: string) => {
    try {
      // Find user by email in Firestore
      const usersRef = doc(db, 'users', 'email', email)
      const userDoc = await getDoc(usersRef)
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        return userData.nickname === nickname && userData.roleModel === roleModel
      }
      
      return false
    } catch (error) {
      console.error('Error verifying security questions:', error)
      return false
    }
  }, [])

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    verifySecurityQuestions,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}