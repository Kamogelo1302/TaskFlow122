"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Mail, Calendar, Target, CheckCircle, Crown, TrendingUp, Clock, Users } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { getUserTasks, getUserProjects } from "@/lib/firebase"

interface UserStats {
  totalProjects: number
  totalTasks: number
  completedTasks: number
  completedProjects: number
  joinedDate: string
}

export default function ProfilePage() {
  const { currentUser } = useAuth()
  const [userStats, setUserStats] = useState<UserStats>({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    completedProjects: 0,
    joinedDate: new Date().toISOString()
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (currentUser?.email) {
      loadUserStats()
    }
  }, [currentUser])

  const loadUserStats = async () => {
    try {
      if (!currentUser?.uid) {
        setIsLoading(false)
        return
      }

      // Load user data from Firebase
      const [firebaseTasks, firebaseProjects] = await Promise.all([
        getUserTasks(currentUser.uid),
        getUserProjects(currentUser.uid)
      ])

      const completedTasks = firebaseTasks.filter((task: any) => task.completed)
      const completedProjects = firebaseProjects.filter((project: any) => project.completed)

      setUserStats({
        totalProjects: firebaseProjects.length,
        totalTasks: firebaseTasks.length,
        completedTasks: completedTasks.length,
        completedProjects: completedProjects.length,
        joinedDate: currentUser?.metadata?.creationTime || new Date().toISOString()
      })
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading user stats:', error)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 via-pink-400 to-blue-400 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <User className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white drop-shadow-lg">TaskFlow</span>
            </div>

            <Link href="/dashboard">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm rounded-xl px-6 py-2 transition-all duration-300 hover:scale-105 shadow-lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-6 bg-gradient-to-r from-pink-400 to-blue-400 rounded-3xl shadow-2xl mb-6">
              <User className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">View Profile</h1>
            <p className="text-xl text-gray-600">Your account information and statistics</p>
          </div>

          {/* Profile Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Basic Information */}
            <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-blue-50 pb-6">
                <CardTitle className="text-2xl text-gray-800 flex items-center space-x-3">
                  <User className="h-6 w-6 text-pink-600" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800">{currentUser?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Joined Date</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(userStats.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-500">Subscription Plan</p>
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      Free Plan
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Renewal Date</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-6">
                <CardTitle className="text-2xl text-gray-800 flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  <span>Your Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl">
                    <Target className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-pink-600">{userStats.totalProjects}</p>
                    <p className="text-sm text-gray-600">Total Projects</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                    <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{userStats.totalTasks}</p>
                    <p className="text-sm text-gray-600">Total Tasks</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{userStats.completedTasks}</p>
                    <p className="text-sm text-gray-600">Tasks Completed</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                    <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">{userStats.completedProjects}</p>
                    <p className="text-sm text-gray-600">Projects Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upgrade Plan Section */}
          <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 pb-6">
              <CardTitle className="text-2xl text-gray-800 flex items-center space-x-3">
                <Crown className="h-6 w-6 text-yellow-600" />
                <span>Upgrade Your Plan</span>
              </CardTitle>
              <CardDescription className="text-gray-600">
                Unlock premium features and boost your productivity
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 border-2 border-gray-200 rounded-2xl">
                  <h3 className="font-semibold text-gray-800 mb-2">Free Plan</h3>
                  <p className="text-2xl font-bold text-gray-800 mb-2">$0</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ 10 projects</li>
                    <li>✓ 20 tasks</li>
                    <li>✓ Email support</li>
                  </ul>
                </div>
                
                <div className="text-center p-4 border-2 border-yellow-300 bg-yellow-50 rounded-2xl relative">
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white">
                    Popular
                  </Badge>
                  <h3 className="font-semibold text-gray-800 mb-2">Pro Plan</h3>
                  <p className="text-2xl font-bold text-gray-800 mb-2">R120</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Unlimited projects</li>
                    <li>✓ Unlimited tasks</li>
                    <li>✓ Advanced analytics</li>
                    <li>✓ Priority support</li>
                  </ul>
                </div>
                
                <div className="text-center p-4 border-2 border-purple-300 bg-purple-50 rounded-2xl">
                  <h3 className="font-semibold text-gray-800 mb-2">Enterprise</h3>
                  <p className="text-2xl font-bold text-gray-800 mb-2">R240</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Everything in Pro</li>
                    <li>✓ Team collaboration</li>
                    <li>✓ Custom integrations</li>
                    <li>✓ Dedicated support</li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center">
                <Link href="/subscriptions">
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 text-lg font-semibold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
                    <Crown className="h-5 w-5 mr-2" />
                    Upgrade Plan
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
