"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Calendar, Target, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { saveTask } from "@/lib/firebase"


interface Task {
  id?: string
  title: string
  dueDate: string
  priority: string
  description: string
  createdAt: string
  status?: string
  completed?: boolean
  completedAt?: string | null
}

export default function CreateTaskPage() {
  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const { currentUser } = useAuth()
  const router = useRouter()

  // Set default due date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setDueDate(today)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!title.trim() || !dueDate || !priority || !description.trim()) {
        throw new Error("Please fill in all fields")
      }

      const newTask: Task = {
        title: title.trim(),
        dueDate,
        priority,
        description: description.trim(),
        createdAt: new Date().toISOString(),
        completed: false,
        completedAt: null
      }

      // Store task in Firebase
      const taskId = await saveTask(currentUser?.uid || "", newTask)

      setSuccess(true)
      
      // Reset form
      setTitle("")
      setDueDate("")
      setPriority("")
      setDescription("")

      // Redirect to tasks page after 2 seconds
      setTimeout(() => {
        router.push('/todays-tasks')
      }, 2000)

    } catch (error: any) {
      setError(error.message || "Failed to create task")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-pink-400 to-blue-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Task Created!</h1>
            <p className="text-gray-600">Your task has been successfully created. Redirecting to dashboard...</p>
          </div>
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
                <CheckCircle className="h-7 w-7 text-white" />
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
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-6 bg-gradient-to-r from-pink-400 to-blue-400 rounded-3xl shadow-2xl mb-6">
              <Target className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Create Task</h1>
            <p className="text-xl text-gray-600">Let's get organized! Fill out the details below to create your task.</p>
          </div>

          {/* Form Card */}
          <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-blue-50 pb-8">
              <CardTitle className="text-2xl text-gray-800 text-center">Task Details</CardTitle>
              <CardDescription className="text-gray-600 text-center">
                Fill in the information below to create your task
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Task/Project Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-lg font-semibold text-gray-700">
                    Task Title *
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter task title"
                    className="h-12 text-lg border-2 border-gray-200 focus:border-pink-400 focus:ring-pink-400/20 rounded-xl transition-all duration-300"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="text-lg font-semibold text-gray-700">
                    Due Date *
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="dueDate"
                      type="date"
                      className="h-12 text-lg border-2 border-gray-200 focus:border-pink-400 focus:ring-pink-400/20 rounded-xl pl-10 transition-all duration-300"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-lg font-semibold text-gray-700">
                    Priority *
                  </Label>
                  <Select value={priority} onValueChange={setPriority} required>
                    <SelectTrigger className="h-12 text-lg border-2 border-gray-200 focus:border-pink-400 focus:ring-pink-400/20 rounded-xl transition-all duration-300">
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high" className="text-red-600 font-semibold">🔴 High</SelectItem>
                      <SelectItem value="medium" className="text-yellow-600 font-semibold">🟡 Medium</SelectItem>
                      <SelectItem value="low" className="text-green-600 font-semibold">🟢 Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Task Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-lg font-semibold text-gray-700">
                    Task Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your task in detail..."
                    className="min-h-32 text-lg border-2 border-gray-200 focus:border-pink-400 focus:ring-pink-400/20 rounded-xl transition-all duration-300 resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Error Display */}
                {error && (
                  <div className="text-red-600 text-center bg-red-50 p-4 rounded-xl border border-red-200">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-14 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white text-xl font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-pink-300/50"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Task..." : "💾 Save Task"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-gradient-to-r from-pink-100 to-blue-100 text-gray-700 px-6 py-3 rounded-2xl">
              <p className="text-sm font-medium">💡 Tip: Set realistic due dates and clear priorities to stay on track!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
