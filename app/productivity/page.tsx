"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, ArrowLeft, Target, FolderOpen, TrendingUp, Calendar, Flag, Users, X, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { getUserTasks, getUserProjects, updateTask, updateProject, deleteTask, deleteProject } from "@/lib/firebase"

interface Task {
  id: string
  title: string
  dueDate: string
  priority: string
  description: string
  createdAt: string
  status: string
  progress?: number
  completed?: boolean
  completedAt?: string | null
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
  progress?: number
  completed?: boolean
  completedAt?: string | null
}

export default function ProductivityPage() {
  const { currentUser } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedItem, setSelectedItem] = useState<Task | Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [overallProgress, setOverallProgress] = useState(0)

  useEffect(() => {
    if (currentUser?.email) {
      loadData()
    }
  }, [currentUser])

  const loadData = async () => {
    try {
      if (!currentUser?.uid) return
      
      const [firebaseTasks, firebaseProjects] = await Promise.all([
        getUserTasks(currentUser.uid),
        getUserProjects(currentUser.uid)
      ])
      
      // Filter for active tasks and projects
      const activeTasks = firebaseTasks
        .filter((task: Task) => !task.completed)
        .map((task: Task) => ({
          ...task,
          completed: task.completed || false,
          completedAt: task.completedAt || null
        }))
      
      const activeProjects = firebaseProjects
        .filter((project: Project) => !project.completed)
        .map((project: Project) => ({
          ...project,
          completed: project.completed || false,
          completedAt: project.completedAt || null
        }))
      
      setTasks(activeTasks)
      setProjects(activeProjects)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setIsLoading(false)
    }
  }

  const calculateOverallProgress = (taskList: Task[], projectList: Project[]) => {
    const allItems = [...taskList, ...projectList]
    if (allItems.length === 0) {
      setOverallProgress(0)
      return
    }

    // Calculate based on completed vs total items (matching dashboard logic)
    const totalItems = allItems.length
    const completedItems = allItems.filter(item => item.completed).length
    const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    setOverallProgress(progressPercentage)
  }

  const updateProgress = async (id: string, newProgress: number, type: 'task' | 'project') => {
    if (!currentUser?.uid) return
    
    const clampedProgress = Math.max(0, Math.min(100, newProgress))
    
    try {
      if (type === 'task') {
        const updatedTasks = tasks.map(task => 
          task.id === id ? { ...task, progress: clampedProgress } : task
        )
        setTasks(updatedTasks)
        
        // Update Firebase
        await updateTask(currentUser.uid, id, { progress: clampedProgress })
        
        // Check if progress reached 100% for auto-completion
        if (clampedProgress === 100) {
          const taskToComplete = updatedTasks.find(task => task.id === id)
          if (taskToComplete) {
            const completedTask = {
              ...taskToComplete,
              completed: true,
              completedAt: new Date().toISOString()
            }
            
            // Update task as completed in Firebase
            await updateTask(currentUser.uid, id, {
              completed: true,
              completedAt: new Date().toISOString()
            })
            
            // Remove from active tasks
            const remainingTasks = updatedTasks.filter(task => task.id !== id)
            setTasks(remainingTasks)
            
            toast.success("Task completed! 🎉")
          }
        }
      } else {
        const updatedProjects = projects.map(project => 
          project.id === id ? { ...project, progress: clampedProgress } : project
        )
        setProjects(updatedProjects)
        
        // Update Firebase
        await updateProject(currentUser.uid, id, { progress: clampedProgress })
        
        // Check if progress reached 100% for auto-completion
        if (clampedProgress === 100) {
          const projectToComplete = updatedProjects.find(project => project.id === id)
          if (projectToComplete) {
            const completedProject = {
              ...projectToComplete,
              completed: true,
              completedAt: new Date().toISOString()
            }
            
            // Update project as completed in Firebase
            await updateProject(currentUser.uid, id, {
              completed: true,
              completedAt: new Date().toISOString()
            })
            
            // Remove from active projects
            const remainingProjects = updatedProjects.filter(project => project.id !== id)
            setProjects(remainingProjects)
            
            toast.success("Project completed! 🎉")
          }
        }
      }
      
      // Recalculate overall progress
      calculateOverallProgress(tasks, projects)
    } catch (error) {
      console.error('Error updating progress:', error)
      toast.error("Failed to update progress")
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

  const isOverdue = (dueDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day
    const itemDueDate = new Date(dueDate)
    return itemDueDate < today
  }

  const getDueDateDisplay = (dueDate: string) => {
    const overdue = isOverdue(dueDate)
    const formattedDate = new Date(dueDate).toLocaleDateString()
    return {
      text: overdue ? `Overdue: ${formattedDate}` : formattedDate,
      isOverdue: overdue
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!currentUser?.uid) return

    try {
      const updatedTasks = tasks.filter(task => task.id !== taskId)
      setTasks(updatedTasks)
      
      // Remove from Firebase
      await deleteTask(currentUser.uid, taskId)
      
      toast.success("Task deleted successfully!")
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error("Failed to delete task")
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!currentUser?.uid) return

    try {
      const updatedProjects = projects.filter(project => project.id !== projectId)
      setProjects(updatedProjects)
      
      // Remove from Firebase
      await deleteProject(currentUser.uid, projectId)
      
      toast.success("Project deleted successfully!")
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error("Failed to delete project")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading productivity data...</p>
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
                <TrendingUp className="h-7 w-7 text-white" />
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
            <div className="inline-block p-6 bg-gradient-to-r from-pink-400 to-blue-400 rounded-3xl shadow-2xl mb-6">
              <TrendingUp className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Productivity Dashboard</h1>
            <p className="text-xl text-gray-600">Track your progress and manage your tasks & projects</p>
          </div>

          {/* Overall Progress Card */}
          <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden mb-8">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-blue-50 pb-6">
              <CardTitle className="text-2xl text-gray-800 text-center">Overall Progress</CardTitle>
              <CardDescription className="text-gray-600 text-center">
                Combined progress across all your tasks and projects
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <div className="h-28 w-28 rounded-full bg-gradient-to-r from-pink-400 to-blue-400 flex items-center justify-center text-white text-3xl font-bold">
                      {overallProgress}%
                    </div>
                  </div>
                </div>
                <Progress value={overallProgress} className="h-3 w-full max-w-md mx-auto" />
                <p className="text-gray-600 mt-4">
                  {tasks.length + projects.length} total items • {overallProgress}% complete
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Section */}
          <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden mb-8">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100 pb-6">
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8 text-pink-600" />
                <div>
                  <CardTitle className="text-2xl text-gray-800">Tasks</CardTitle>
                  <CardDescription className="text-gray-600">
                    {tasks.length} active tasks
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {tasks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Target className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No tasks created yet</p>
                  <p className="text-sm">Create your first task to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 border-2 rounded-2xl transition-all duration-300 cursor-pointer hover:shadow-lg ${
                        selectedItem?.id === task.id 
                          ? 'border-pink-400 bg-pink-50' 
                          : getDueDateDisplay(task.dueDate).isOverdue
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200 hover:border-pink-300'
                      }`}
                      onClick={() => setSelectedItem(task)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                            {getPriorityIcon(task.priority)} {task.priority}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm ${
                            getDueDateDisplay(task.dueDate).isOverdue 
                              ? 'text-red-600 font-semibold' 
                              : 'text-gray-500'
                          }`}>
                            Due: {getDueDateDisplay(task.dueDate).text}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{task.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`progress-${task.id}`} className="text-sm font-medium text-gray-700">
                            Progress: {task.progress || 0}%
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id={`progress-${task.id}`}
                              type="number"
                              min="0"
                              max="100"
                              value={task.progress || 0}
                              onChange={(e) => updateProgress(task.id, parseInt(e.target.value), 'task')}
                              className="w-20 h-8 text-center border-gray-300 rounded-lg"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="text-sm text-gray-500">%</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteTask(task.id)
                              }}
                              className="p-1 hover:bg-red-100 rounded-full transition-colors"
                              title="Delete task"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                        <Progress value={task.progress || 0} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Projects Section */}
          <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-6">
              <div className="flex items-center space-x-3">
                <FolderOpen className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl text-gray-800">Projects</CardTitle>
                  <CardDescription className="text-gray-600">
                    {projects.length} active projects
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {projects.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FolderOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No projects created yet</p>
                  <p className="text-sm">Create your first project to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className={`p-4 border-2 rounded-2xl transition-all duration-300 cursor-pointer hover:shadow-lg ${
                        selectedItem?.id === project.id 
                          ? 'border-blue-400 bg-blue-50' 
                          : getDueDateDisplay(project.dueDate).isOverdue
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedItem(project)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(project.priority)}`}>
                            {getPriorityIcon(project.priority)} {project.priority}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm ${
                            getDueDateDisplay(project.dueDate).isOverdue 
                              ? 'text-red-600 font-semibold' 
                              : 'text-gray-500'
                          }`}>
                            Due: {getDueDateDisplay(project.dueDate).text}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{project.description}</p>
                      
                      {project.teamMembers && (
                        <p className="text-sm text-gray-500 mb-2">
                          <Users className="h-4 w-4 inline mr-1" />
                          Team: {project.teamMembers}
                        </p>
                      )}
                      
                      {project.milestones && (
                        <p className="text-sm text-gray-500 mb-4">
                          <Flag className="h-4 w-4 inline mr-1" />
                          Milestones: {project.milestones}
                        </p>
                      )}
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`progress-${project.id}`} className="text-sm font-medium text-gray-700">
                            Progress: {project.progress || 0}%
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id={`progress-${project.id}`}
                              type="number"
                              min="0"
                              max="100"
                              value={project.progress || 0}
                              onChange={(e) => updateProgress(project.id, parseInt(e.target.value), 'project')}
                              className="w-20 h-8 text-center border-gray-300 rounded-lg"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="text-sm text-gray-500">%</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteProject(project.id)
                              }}
                              className="p-1 hover:bg-red-100 rounded-full transition-colors"
                              title="Delete project"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                        <Progress value={project.progress || 0} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Item Details */}
          {selectedItem && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-2xl bg-white border-0 shadow-2xl rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-blue-50 pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-gray-800">
                      {selectedItem.title}
                    </CardTitle>
                    <Button
                      onClick={() => setSelectedItem(null)}
                      variant="ghost"
                      className="h-8 w-8 p-0 rounded-full hover:bg-white/80"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="text-gray-600">
                    {selectedItem.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Priority</Label>
                        <p className="text-lg font-semibold text-gray-800 capitalize">{selectedItem.priority}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Due Date</Label>
                        <p className="text-lg font-semibold text-gray-800">
                          {new Date(selectedItem.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Progress</Label>
                      <div className="flex items-center space-x-3 mt-2">
                        <Progress 
                          value={selectedItem.progress || 0} 
                          className="flex-1 h-3" 
                        />
                        <span className="text-lg font-semibold text-gray-800 min-w-[3rem]">
                          {selectedItem.progress || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
