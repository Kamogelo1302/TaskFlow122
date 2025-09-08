"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, LogOut, Settings, User, Sun, Moon } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import Link from "next/link"

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setIsOpen(false)
      // Redirect to landing page
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (!currentUser) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm rounded-xl px-6 py-2 transition-all duration-300 hover:scale-105 shadow-lg"
      >
        <Users className="h-4 w-4 mr-2" />
        Profile
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
          <Card className="border-0 shadow-none">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 pb-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                  <AvatarImage src="" alt={currentUser.displayName || "User"} />
                  <AvatarFallback className="bg-gradient-to-r from-pink-400 to-blue-400 text-white text-xl font-bold">
                    {getInitials(currentUser.displayName || "User")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl text-gray-800 dark:text-gray-200">
                    {currentUser.displayName || "User"}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">{currentUser.email}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="space-y-1">
                <Link href="/profile">
                  <button className="w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">View Profile</span>
                  </button>
                </Link>
                
                <Link href="/settings">
                  <button className="w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">Settings</span>
                  </button>
                </Link>
                
                <button 
                  onClick={toggleTheme}
                  className="w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                  <span className="text-gray-700 dark:text-gray-300">
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </button>
                
                <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Log Out</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}



