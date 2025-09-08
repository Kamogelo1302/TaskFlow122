"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Target, FolderOpen, CheckCircle, Calendar, Trophy, Users, Flag } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserTasks, getUserProjects } from "@/lib/firebase"

interface Task {
  id: string
  title: string
  dueDate: string
  priority: string
  description: string
  createdAt: string
  status: string
  completed: boolean
  completedAt: string
}

interface Project {
  id: string
  title: string
  dueDate: string
  priority: string
  description: string
  teamMembers: string
  milestones: string
  createdAt: string
  status: string
  completed: boolean
  completedAt: string
}

export default function CompletedPage() {
  const { currentUser } = useAuth()
  const [completedTasks, setCompletedTasks] = useState<Task[]>([])
  const [completedProjects, setCompletedProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'tasks' | 'projects'>('tasks')

  useEffect(() => {
    if (currentUser?.uid) {
      loadCompletedItems()
    }
  }, [currentUser])

  const loadCompletedItems = async () => {
    try {
      if (!currentUser?.uid) {
        setIsLoading(false)
        return
      }

      // Load tasks and projects from Firebase
      const [firebaseTasks, firebaseProjects] = await Promise.all([
        getUserTasks(currentUser.uid),
        getUserProjects(currentUser.uid)
      ])

      // Filter for completed tasks
      const completedTasksList = firebaseTasks.filter((task: Task) => task.completed)
      setCompletedTasks(completedTasksList)

      // Filter for completed projects
      const completedProjectsList = firebaseProjects.filter((project: Project) => project.completed)
      setCompletedProjects(completedProjectsList)

      setIsLoading(false)
    } catch (error) {
      console.error('Error loading completed items:', error)
      setIsLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading completed items...</p>
        </div>
      </div>
    )
  }

  const totalCompleted = completedTasks.length + completedProjects.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-500 via-green-400 to-emerald-400 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Trophy className="h-7 w-7 text-white" />
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
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-3xl shadow-2xl mb-6">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Completed Items</h1>
            <p className="text-xl text-gray-600">Celebrate your achievements and track your progress</p>
          </div>

          {/* Stats Card */}
          <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden mb-8">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-6">
              <CardTitle className="text-2xl text-gray-800 text-center">Completion Summary</CardTitle>
              <CardDescription className="text-gray-600 text-center">
                Overview of your completed tasks and projects
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-6 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl">
                  <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800">{totalCompleted}</h3>
                  <p className="text-green-600 font-medium">Total Completed</p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-pink-100 to-pink-200 rounded-2xl">
                  <div className="h-16 w-16 rounded-full bg-pink-500 flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-pink-800">{completedTasks.length}</h3>
                  <p className="text-pink-600 font-medium">Tasks Completed</p>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl">
                  <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4">
                    <FolderOpen className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800">{completedProjects.length}</h3>
                  <p className="text-blue-600 font-medium">Projects Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'tasks'
                    ? 'bg-pink-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-pink-600'
                }`}
              >
                <Target className="h-5 w-5 inline mr-2" />
                Completed Tasks ({completedTasks.length})
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'projects'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <FolderOpen className="h-5 w-5 inline mr-2" />
                Completed Projects ({completedProjects.length})
              </button>
            </div>
          </div>

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden mb-8">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100 pb-6">
                <div className="flex items-center space-x-3">
                  <Target className="h-8 w-8 text-pink-600" />
                  <div>
                    <CardTitle className="text-2xl text-gray-800">Completed Tasks</CardTitle>
                    <CardDescription className="text-gray-600">
                      {completedTasks.length} tasks completed
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {completedTasks.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Target className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No completed tasks yet</p>
                    <p className="text-sm">Complete some tasks to see them here!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-4 border-2 border-green-200 bg-green-50 rounded-2xl hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <h3 className="text-lg font-semibold text-gray-800 line-through">
                              {task.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                              {getPriorityIcon(task.priority)} {task.priority}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-through">{task.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Created: {formatDate(task.createdAt)}</span>
                          <span className="text-green-600 font-medium">
                            Completed: {formatDate(task.completedAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-6">
                <div className="flex items-center space-x-3">
                  <FolderOpen className="h-8 w-8 text-blue-600" />
                  <div>
                    <CardTitle className="text-2xl text-gray-800">Completed Projects</CardTitle>
                    <CardDescription className="text-gray-600">
                      {completedProjects.length} projects completed
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {completedProjects.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FolderOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No completed projects yet</p>
                    <p className="text-sm">Complete some projects to see them here!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedProjects.map((project) => (
                      <div
                        key={project.id}
                        className="p-4 border-2 border-green-200 bg-green-50 rounded-2xl hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <h3 className="text-lg font-semibold text-gray-800 line-through">
                              {project.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(project.priority)}`}>
                              {getPriorityIcon(project.priority)} {project.priority}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Due: {new Date(project.dueDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-2 line-through">{project.description}</p>
                        
                        {project.teamMembers && (
                          <p className="text-sm text-gray-500 mb-2">
                            <Users className="h-4 w-4 inline mr-1" />
                            Team: {project.teamMembers}
                          </p>
                        )}
                        
                        {project.milestones && (
                          <p className="text-sm text-gray-500 mb-3">
                            <Flag className="h-4 w-4 inline mr-1" />
                            Milestones: {project.milestones}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Created: {formatDate(project.createdAt)}</span>
                          <span className="text-green-600 font-medium">
                            Completed: {formatDate(project.completedAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Motivation Message */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 text-gray-700 px-8 py-6 rounded-2xl shadow-lg">
              <Trophy className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <p className="text-lg font-semibold mb-2">🎉 Amazing Progress! 🎉</p>
              <p className="text-sm text-gray-600">
                You've completed {totalCompleted} items. Keep up the great work and stay productive!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}



