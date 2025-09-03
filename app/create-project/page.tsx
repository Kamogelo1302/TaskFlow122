"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Calendar, FolderOpen, ArrowLeft, Users, Flag } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { saveProject } from "@/lib/firebase"
import { toast } from "sonner"


interface Project {
  id?: string
  title: string
  dueDate: string
  priority: string
  description: string
  teamMembers: string
  milestones: string
  createdAt: string
  status?: string
  completed?: boolean
  completedAt?: string | null
}

export default function CreateProjectPage() {
  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState("")
  const [description, setDescription] = useState("")
  const [teamMembers, setTeamMembers] = useState("")
  const [milestones, setMilestones] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const { currentUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!title.trim() || !dueDate || !priority || !description.trim()) {
        throw new Error("Please fill in all required fields")
      }

      const newProject: Project = {
        title: title.trim(),
        dueDate,
        priority,
        description: description.trim(),
        teamMembers: teamMembers.trim(),
        milestones: milestones.trim(),
        createdAt: new Date().toISOString(),
        completed: false,
        completedAt: null
      }

      // Store project in Firebase
      const projectId = await saveProject(currentUser?.uid || "", newProject)

      setSuccess(true)
      toast.success("Project created successfully!")
      
      // Reset form
      setTitle("")
      setDueDate("")
      setPriority("")
      setDescription("")
      setTeamMembers("")
      setMilestones("")

      // Redirect to active projects page after 2 seconds
      setTimeout(() => {
        window.location.href = '/active-projects'
      }, 2000)

    } catch (error: any) {
      setError(error.message || "Failed to create project")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Project Created!</h1>
            <p className="text-gray-600">Your project has been successfully created. Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 via-blue-400 to-purple-400 shadow-lg">
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
            <div className="inline-block p-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl shadow-2xl mb-6">
              <FolderOpen className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Create Project</h1>
            <p className="text-xl text-gray-600">Let's build something amazing! Fill out the details below to create your project.</p>
          </div>

          {/* Form Card */}
          <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-8">
              <CardTitle className="text-2xl text-gray-800 text-center">Project Details</CardTitle>
              <CardDescription className="text-gray-600 text-center">
                Fill in the information below to create your project
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-lg font-semibold text-gray-700">
                    Project Title *
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter project title"
                    className="h-12 text-lg border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all duration-300"
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
                      className="h-12 text-lg border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl pl-10 transition-all duration-300"
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
                    <SelectTrigger className="h-12 text-lg border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all duration-300">
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high" className="text-red-600 font-semibold">🔴 High</SelectItem>
                      <SelectItem value="medium" className="text-yellow-600 font-semibold">🟡 Medium</SelectItem>
                      <SelectItem value="low" className="text-green-600 font-semibold">🟢 Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Project Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-lg font-semibold text-gray-700">
                    Project Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project in detail..."
                    className="min-h-32 text-lg border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all duration-300 resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Team Members */}
                <div className="space-y-2">
                  <Label htmlFor="teamMembers" className="text-lg font-semibold text-gray-700">
                    Team Members
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="teamMembers"
                      type="text"
                      placeholder="Enter team member names (comma separated)"
                      className="h-12 text-lg border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl pl-10 transition-all duration-300"
                      value={teamMembers}
                      onChange={(e) => setTeamMembers(e.target.value)}
                    />
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-2">
                  <Label htmlFor="milestones" className="text-lg font-semibold text-gray-700">
                    Milestones
                  </Label>
                  <div className="relative">
                    <Flag className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Textarea
                      id="milestones"
                      placeholder="Enter project milestones (optional)"
                      className="min-h-24 text-lg border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl pl-10 transition-all duration-300 resize-none"
                      value={milestones}
                      onChange={(e) => setMilestones(e.target.value)}
                    />
                  </div>
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
                  className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xl font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-blue-300/50"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Project..." : "💾 Save Project"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 px-6 py-3 rounded-2xl">
              <p className="text-sm font-medium">💡 Tip: Break down complex projects into clear milestones for better tracking!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
