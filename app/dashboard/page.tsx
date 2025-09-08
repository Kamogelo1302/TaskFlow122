"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, Target, TrendingUp, Users, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserTasks, getUserProjects } from "@/lib/firebase"
import ProfileDropdown from "@/components/ProfileDropdown"
import TaskProjectModal from "@/components/TaskProjectModal"

export default function DashboardPage() {
  const { currentUser } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardStats, setDashboardStats] = useState({
    totalTasks: 0,
    totalProjects: 0,
    completedTasks: 0,
    completedProjects: 0,
    productivityPercentage: 0
  })

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!currentUser?.uid) {
        setIsLoading(false)
        return
      }

      try {
        const [firebaseTasks, firebaseProjects] = await Promise.all([
          getUserTasks(currentUser.uid),
          getUserProjects(currentUser.uid)
        ])

        const completedTasks = firebaseTasks.filter((task: any) => task.completed).length
        const completedProjects = firebaseProjects.filter((project: any) => project.completed).length
        
        // Only count active (non-completed) tasks and projects
        const totalTasks = firebaseTasks.filter((task: any) => !task.completed).length
        const totalProjects = firebaseProjects.filter((project: any) => !project.completed).length

        const totalItems = totalTasks + totalProjects
        const completedItems = completedTasks + completedProjects
        const productivityPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

        setDashboardStats({
          totalTasks,
          totalProjects,
          completedTasks,
          completedProjects,
          productivityPercentage
        })
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        setDashboardStats({
          totalTasks: 0,
          totalProjects: 0,
          completedTasks: 0,
          completedProjects: 0,
          productivityPercentage: 0
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [currentUser])

  const handleGetStarted = useCallback(() => {
    setShowModal(true)
  }, [])


  const { totalTasks, totalProjects, completedTasks, completedProjects, productivityPercentage } = dashboardStats

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 via-pink-400 to-blue-400 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white drop-shadow-lg">TaskFlow</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#dashboard" className="text-white font-semibold text-lg hover:text-pink-100 transition-all duration-300 hover:scale-105">Dashboard</a>
              <Link href="/todays-tasks" className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105">Tasks</Link>
              <Link href="/active-projects" className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105">Projects</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 min-h-screen">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <div className="inline-block p-8 bg-gradient-to-r from-pink-400 to-blue-400 rounded-3xl shadow-2xl mb-8 transform hover:scale-105 transition-all duration-500">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-4 drop-shadow-2xl">
              WELCOME
            </h1>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-pink-600 dark:text-pink-400 mb-6 bg-white dark:bg-gray-800 px-8 py-3 rounded-2xl shadow-lg inline-block">
            {currentUser?.displayName || "User"}
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 text-pretty mb-10 max-w-3xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-lg">
            Are you ready to get things done? Set your daily tasks & projects.
          </p>
          <div className="flex flex-col items-center space-y-3">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white px-16 py-6 text-2xl font-bold rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-pink-300/50 cursor-pointer border-2 border-white/20 backdrop-blur-sm relative overflow-hidden group"
              onClick={handleGetStarted}
            >
              <span className="relative z-10 flex items-center space-x-3">
                <span className="text-3xl">🚀</span>
                <span>Get Started</span>
                <span className="text-3xl">✨</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              ✨ Stay on Track. Stay Ahead. ✨
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-pink-400 to-pink-500 text-white border-0 shadow-2xl hover:shadow-pink-300/50 transition-all duration-300 transform hover:scale-105 rounded-3xl overflow-hidden">
            <CardHeader className="pb-3 bg-white/10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white">Active Tasks</CardTitle>
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-4xl font-black text-white mb-2">{totalTasks}</p>
              <p className="text-sm text-pink-100">
                {totalTasks === 0 ? "Ready to tackle new challenges!" : 
                 totalTasks === 1 ? "One task, one victory!" : 
                 `${totalTasks} opportunities to shine!`}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-400 to-blue-500 text-white border-0 shadow-2xl hover:shadow-blue-300/50 transition-all duration-300 transform hover:scale-105 rounded-3xl overflow-hidden">
            <CardHeader className="pb-3 bg-white/10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white">Active Projects</CardTitle>
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-4xl font-black text-white mb-2">{totalProjects}</p>
              <p className="text-sm text-blue-100">{totalProjects === 0 ? "Time to build something amazing!" : `${totalProjects} dream${totalProjects === 1 ? '' : 's'} in progress`}</p>
            </CardContent>
          </Card>

            <Card className="bg-gradient-to-br from-purple-400 to-purple-500 text-white border-0 shadow-2xl hover:shadow-purple-300/50 transition-all duration-300 transform hover:scale-105 rounded-3xl overflow-hidden">
              <CardHeader className="pb-3 bg-white/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white">Performance</CardTitle>
                  <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-2xl font-black text-white mb-2">
                  {productivityPercentage === 0 ? "Ready to Rock! 🚀" :
                   productivityPercentage < 25 ? "Building Momentum! 💪" :
                   productivityPercentage < 50 ? "You're on Fire! 🔥" :
                   productivityPercentage < 75 ? "Almost Unstoppable! ⚡" :
                   productivityPercentage < 100 ? "So Close to Perfection! ✨" :
                   "Absolutely Crushing It! 🎉"}
                </p>
                <p className="text-sm text-purple-100">
                  {productivityPercentage === 0 ? "Every journey begins with a single step!" :
                   productivityPercentage < 25 ? "Keep building that momentum!" :
                   productivityPercentage < 50 ? "The fire is burning bright!" :
                   productivityPercentage < 75 ? "You're unstoppable!" :
                   productivityPercentage < 100 ? "Perfection is within reach!" :
                   "You're absolutely amazing!"}
                </p>
              </CardContent>
            </Card>

        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link href="/todays-tasks">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 rounded-3xl overflow-hidden group">
              <CardHeader className="pb-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-pink-300/50 transition-all duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200 mb-3">Tasks</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                  View and manage all your active tasks.
                </CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <div className="w-full h-2 bg-gradient-to-r from-pink-200 to-pink-300 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-400 to-pink-500 rounded-full w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/active-projects">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 rounded-3xl overflow-hidden group">
              <CardHeader className="pb-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue-300/50 transition-all duration-300">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200 mb-3">Projects</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                  Organize related tasks into a project structure.
                </CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <div className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/productivity">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 rounded-3xl overflow-hidden group">
              <CardHeader className="pb-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-purple-300/50 transition-all duration-300">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200 mb-3">Productivity</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                  Track your progress and productivity metrics.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/completed">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 rounded-3xl overflow-hidden group">
              <CardHeader className="pb-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-green-300/50 transition-all duration-300">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200 mb-3">Completed Items</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                  View your completed tasks and projects.
                </CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <div className="w-full h-2 bg-gradient-to-r from-green-200 to-green-300 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
                </div>
              </div>
            </Card>
          </Link>
        </div>
        
        {/* Fun Footer */}
        <div className="mt-20 text-center">
          <div className="inline-block bg-gradient-to-r from-pink-400 to-blue-400 text-white px-8 py-4 rounded-2xl shadow-lg">
            <p className="text-lg font-semibold">🎉 Ready to make magic happen? 🚀</p>
          </div>
        </div>
      </main>

      {/* Task/Project Selection Modal */}
      <TaskProjectModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  )
}
