"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, ArrowLeft, Target, Edit, X, Calendar, CheckSquare, Square, RefreshCw, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { getUserTasks, updateTask, deleteTask } from "@/lib/firebase"

interface Task {
  id: string
  title: string
  dueDate: string
  priority: string
  description: string
  createdAt: string
  status: string
  completed?: boolean
  completedAt?: string | null
}

export default function TodaysTasksPage() {
  const { currentUser } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editForm, setEditForm] = useState({
    title: "",
    dueDate: "",
    priority: "",
    description: ""
  })

  useEffect(() => {
    if (currentUser?.email) {
      loadTasks()
    }
  }, [currentUser])

  const loadTasks = async () => {
    try {
      if (!currentUser?.uid) return
      
      const firebaseTasks = await getUserTasks(currentUser.uid)
      
      // Filter for active tasks
      const activeTasks = firebaseTasks
        .filter((task: Task) => !task.completed)
        .map((task: Task) => ({
          ...task,
          completed: task.completed || false,
          completedAt: task.completedAt || null
        }))
      
      setTasks(activeTasks)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading tasks:', error)
      setIsLoading(false)
    }
  }

  const refreshTasks = () => {
    setIsLoading(true)
    setTimeout(() => {
      loadTasks()
    }, 500)
  }

  const toggleTaskCompletion = async (taskId: string) => {
    if (!currentUser?.uid) return

    try {
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          const completed = !task.completed
          return {
            ...task,
            completed,
            completedAt: completed ? new Date().toISOString() : null
          }
        }
        return task
      })

      setTasks(updatedTasks)
      
      // Update Firebase
      const taskToUpdate = updatedTasks.find(task => task.id === taskId)
      if (taskToUpdate) {
        await updateTask(currentUser.uid, taskId, {
          completed: taskToUpdate.completed,
          completedAt: taskToUpdate.completedAt
        })
      }
      
      toast.success("Task status updated successfully!")
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error("Failed to update task status")
    }
  }

  const startEditing = (task: Task) => {
    setEditingTask(task)
    setEditForm({
      title: task.title,
      dueDate: task.dueDate,
      priority: task.priority,
      description: task.description
    })
  }

  const saveEdit = async () => {
    if (!editingTask || !currentUser?.uid) return

    try {
      const updatedTasks = tasks.map(task => {
        if (task.id === editingTask.id) {
          return {
            ...task,
            ...editForm
          }
        }
        return task
      })

      setTasks(updatedTasks)
      
      // Update Firebase
      await updateTask(currentUser.uid, editingTask.id, editForm)

      setEditingTask(null)
      setEditForm({ title: "", dueDate: "", priority: "", description: "" })
      toast.success("Task updated successfully!")
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error("Failed to update task")
    }
  }

  const cancelEdit = () => {
    setEditingTask(null)
    setEditForm({ title: "", dueDate: "", priority: "", description: "" })
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!currentUser?.uid) return

    try {
      // Remove from current state
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
    const taskDueDate = new Date(dueDate)
    return taskDueDate < today
  }

  const getDueDateDisplay = (dueDate: string) => {
    const overdue = isOverdue(dueDate)
    const formattedDate = new Date(dueDate).toLocaleDateString()
    return {
      text: overdue ? `Overdue: ${formattedDate}` : formattedDate,
      isOverdue: overdue
    }
  }

  const getTaskCounts = () => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.completed).length
    const pendingTasks = totalTasks - completedTasks
    return { totalTasks, completedTasks, pendingTasks }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading today's tasks...</p>
        </div>
      </div>
    )
  }

  const { totalTasks, completedTasks, pendingTasks } = getTaskCounts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 via-pink-400 to-blue-400 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Target className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white drop-shadow-lg">TaskFlow</span>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={refreshTasks}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm rounded-xl px-4 py-2 transition-all duration-300 hover:scale-105 shadow-lg"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link href="/create-task">
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm rounded-xl px-4 py-2 transition-all duration-300 hover:scale-105 shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm rounded-xl px-6 py-2 transition-all duration-300 hover:scale-105 shadow-lg">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-6 bg-gradient-to-r from-pink-400 to-blue-400 rounded-3xl shadow-2xl mb-6">
              <Target className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Active Tasks</h1>
            <p className="text-xl text-gray-600">Manage and track your active tasks</p>
          </div>

          {/* Task Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-0 shadow-xl rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{totalTasks}</div>
                <p className="text-blue-700 font-medium">Total Tasks</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-0 shadow-xl rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{pendingTasks}</div>
                <p className="text-yellow-700 font-medium">Pending</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-0 shadow-xl rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{completedTasks}</div>
                <p className="text-green-700 font-medium">Completed</p>
              </CardContent>
            </Card>
          </div>

          {/* Tasks Table Card */}
          <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-blue-50 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-gray-800">Active Tasks</CardTitle>
                  <CardDescription className="text-gray-600">
                    {tasks.length} task{tasks.length !== 1 ? 's' : ''} • {completedTasks} completed
                  </CardDescription>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated {new Date().toLocaleTimeString()}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {tasks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Target className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No active tasks!</p>
                  <p className="text-sm mb-4">Great job staying on top of things!</p>
                  <Link href="/create-task">
                    <Button className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white rounded-xl px-6 py-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Task
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Task Details</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Due Date</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Priority</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr 
                          key={task.id} 
                          className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                            task.completed 
                              ? 'bg-green-50' 
                              : getDueDateDisplay(task.dueDate).isOverdue 
                                ? 'bg-red-50 border-l-4 border-l-red-500' 
                                : ''
                          }`}
                        >
                          <td className="py-4 px-4">
                            <button
                              onClick={() => toggleTaskCompletion(task.id)}
                              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                              title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                            >
                              {task.completed ? (
                                <CheckSquare className="h-6 w-6 text-green-600" />
                              ) : (
                                <Square className="h-6 w-6 text-gray-400" />
                              )}
                            </button>
                          </td>
                          <td className="py-4 px-4">
                            <div className="max-w-md">
                              <h3 className={`font-semibold text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className={`text-sm text-gray-600 mt-1 line-clamp-2 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                                  {task.description}
                                </p>
                              )}
                              <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                                <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                                {task.completed && task.completedAt && (
                                  <span>• Completed: {new Date(task.completedAt).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Calendar className={`h-4 w-4 ${getDueDateDisplay(task.dueDate).isOverdue ? 'text-red-500' : 'text-gray-400'}`} />
                              <span className={`text-sm ${
                                task.completed 
                                  ? 'text-gray-400' 
                                  : getDueDateDisplay(task.dueDate).isOverdue 
                                    ? 'text-red-600 font-semibold' 
                                    : 'text-gray-600'
                              }`}>
                                {getDueDateDisplay(task.dueDate).text}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                              {getPriorityIcon(task.priority)} {task.priority}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => startEditing(task)}
                                className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors duration-200"
                                disabled={task.completed}
                                title={task.completed ? "Cannot edit completed tasks" : "Edit task"}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-100 text-red-600 transition-colors duration-200"
                                title="Delete task"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit Task Modal */}
          {editingTask && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-2xl bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-gray-800">Edit Task</CardTitle>
                    <Button
                      onClick={cancelEdit}
                      variant="ghost"
                      className="h-8 w-8 p-0 rounded-full hover:bg-white/80"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title" className="text-sm font-medium text-gray-700">
                        Task Title *
                      </Label>
                      <Input
                        id="edit-title"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="h-12 border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-dueDate" className="text-sm font-medium text-gray-700">
                        Due Date *
                      </Label>
                      <Input
                        id="edit-dueDate"
                        type="date"
                        value={editForm.dueDate}
                        onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                        className="h-12 border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-priority" className="text-sm font-medium text-gray-700">
                        Priority *
                      </Label>
                      <Select value={editForm.priority} onValueChange={(value) => setEditForm({ ...editForm, priority: value })}>
                        <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">🔴 High</SelectItem>
                          <SelectItem value="medium">🟡 Medium</SelectItem>
                          <SelectItem value="low">🟢 Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700">
                        Description
                      </Label>
                      <Textarea
                        id="edit-description"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="min-h-24 border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl resize-none"
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button
                        onClick={saveEdit}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3"
                      >
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => handleDeleteTask(editingTask.id)}
                        variant="outline"
                        className="flex-1 border-red-500 text-red-600 rounded-xl py-3"
                        title="Delete Task"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                      <Button
                        onClick={cancelEdit}
                        variant="outline"
                        className="flex-1 border-gray-300 text-gray-600 rounded-xl py-3"
                      >
                        Cancel
                      </Button>
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

