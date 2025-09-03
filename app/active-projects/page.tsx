"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, ArrowLeft, FolderOpen, Edit, X, Calendar, Flag, Users, CheckSquare, Square, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { getUserProjects, updateProject, deleteProject } from "@/lib/firebase"

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
  completed?: boolean
  completedAt?: string | null
}

export default function ActiveProjectsPage() {
  const { currentUser } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editForm, setEditForm] = useState({
    title: "",
    dueDate: "",
    priority: "",
    description: "",
    teamMembers: "",
    milestones: ""
  })

  useEffect(() => {
    if (currentUser?.email) {
      loadProjects()
    }
  }, [currentUser])

  const loadProjects = async () => {
    try {
      if (!currentUser?.uid) return
      
      const firebaseProjects = await getUserProjects(currentUser.uid)
      
      // Filter for active projects
      const activeProjects = firebaseProjects
        .filter((project: Project) => !project.completed)
        .map((project: Project) => ({
          ...project,
          completed: project.completed || false,
          completedAt: project.completedAt || null
        }))
      
      setProjects(activeProjects)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading projects:', error)
      setIsLoading(false)
    }
  }

  const refreshProjects = () => {
    setIsLoading(true)
    setTimeout(() => {
      loadProjects()
    }, 500)
  }

  const toggleProjectCompletion = async (projectId: string) => {
    if (!currentUser?.uid) return

    try {
      const updatedProjects = projects.map(project => {
        if (project.id === projectId) {
          const completed = !project.completed
          return {
            ...project,
            completed,
            completedAt: completed ? new Date().toISOString() : null
          }
        }
        return project
      })

      setProjects(updatedProjects)
      
      // Update Firebase
      const projectToUpdate = updatedProjects.find(project => project.id === projectId)
      if (projectToUpdate) {
        await updateProject(currentUser.uid, projectId, {
          completed: projectToUpdate.completed,
          completedAt: projectToUpdate.completedAt
        })
      }
      
      toast.success("Project status updated successfully!")
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error("Failed to update project status")
    }
  }

  const startEditing = (project: Project) => {
    setEditingProject(project)
    setEditForm({
      title: project.title,
      dueDate: project.dueDate,
      priority: project.priority,
      description: project.description,
      teamMembers: project.teamMembers,
      milestones: project.milestones
    })
  }

  const saveEdit = async () => {
    if (!editingProject || !currentUser?.uid) return

    try {
      const updatedProject = {
        ...editingProject,
        title: editForm.title,
        dueDate: editForm.dueDate,
        priority: editForm.priority,
        description: editForm.description,
        teamMembers: editForm.teamMembers,
        milestones: editForm.milestones
      }

      const updatedProjects = projects.map(project =>
        project.id === editingProject.id ? updatedProject : project
      )
      setProjects(updatedProjects)

      // Update Firebase
      await updateProject(currentUser.uid, editingProject.id, {
        title: editForm.title,
        dueDate: editForm.dueDate,
        priority: editForm.priority,
        description: editForm.description,
        teamMembers: editForm.teamMembers,
        milestones: editForm.milestones
      })

      setEditingProject(null)
      toast.success("Project updated successfully!")
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error("Failed to update project")
    }
  }

  const cancelEdit = () => {
    setEditingProject(null)
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
    const projectDueDate = new Date(dueDate)
    return projectDueDate < today
  }

  const getDueDateDisplay = (dueDate: string) => {
    const overdue = isOverdue(dueDate)
    const formattedDate = new Date(dueDate).toLocaleDateString()
    return {
      text: overdue ? `Overdue: ${formattedDate}` : formattedDate,
      isOverdue: overdue
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your projects...</p>
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
                <FolderOpen className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white drop-shadow-lg">TaskFlow</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm rounded-xl px-6 py-2 transition-all duration-300 hover:scale-105 shadow-lg">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Button 
                onClick={refreshProjects}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm rounded-xl px-6 py-2 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <span className="mr-2">🔄</span>
                Refresh
              </Button>
              <Link href="/create-project">
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm rounded-xl px-6 py-2 transition-all duration-300 hover:scale-105 shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  + New Project
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
            <div className="inline-block p-6 bg-gradient-to-r from-blue-400 to-blue-500 rounded-3xl shadow-2xl mb-6">
              <FolderOpen className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Active Projects</h1>
            <p className="text-xl text-gray-600">Manage and track your ongoing projects</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-blue-400 to-blue-500 text-white border-0 shadow-2xl">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">{projects.length}</div>
                <div className="text-sm opacity-90">Total Projects</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white border-0 shadow-2xl">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">{projects.filter(p => !p.completed).length}</div>
                <div className="text-sm opacity-90">Pending</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-400 to-green-500 text-white border-0 shadow-2xl">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">{projects.filter(p => p.completed).length}</div>
                <div className="text-sm opacity-90">Completed</div>
              </CardContent>
            </Card>
          </div>

          {/* Projects List */}
          <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-gray-800">Active Projects</CardTitle>
                  <CardDescription className="text-gray-600">
                    {projects.length} project{projects.length !== 1 ? 's' : ''} • {projects.filter(p => p.completed).length} completed
                  </CardDescription>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated {new Date().toLocaleTimeString()}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {projects.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FolderOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No active projects!</p>
                  <p className="text-sm mb-6">Great job staying on top of things!</p>
                  <Link href="/create-project">
                    <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      + Create Your First Project
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className={`p-6 border-2 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                        project.completed 
                          ? 'border-green-200 bg-green-50' 
                          : getDueDateDisplay(project.dueDate).isOverdue
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <button
                            onClick={() => toggleProjectCompletion(project.id)}
                            className="mt-1 flex-shrink-0"
                          >
                            {project.completed ? (
                              <CheckSquare className="h-6 w-6 text-green-600" />
                            ) : (
                              <Square className="h-6 w-6 text-gray-400 hover:text-blue-500 transition-colors" />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className={`text-lg font-semibold ${
                                project.completed ? 'text-green-700 line-through' : 'text-gray-800'
                              }`}>
                                {project.title}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(project.priority)}`}>
                                {getPriorityIcon(project.priority)} {project.priority}
                              </span>
                            </div>
                            
                            <p className={`text-gray-600 mb-3 ${
                              project.completed ? 'line-through' : ''
                            }`}>
                              {project.description}
                            </p>
                            
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className={`h-4 w-4 ${getDueDateDisplay(project.dueDate).isOverdue ? 'text-red-500' : ''}`} />
                                <span className={`${
                                  getDueDateDisplay(project.dueDate).isOverdue 
                                    ? 'text-red-600 font-semibold' 
                                    : ''
                                }`}>
                                  Due: {getDueDateDisplay(project.dueDate).text}
                                </span>
                              </div>
                              {project.teamMembers && (
                                <div className="flex items-center space-x-1">
                                  <Users className="h-4 w-4" />
                                  <span>Team: {project.teamMembers}</span>
                                </div>
                              )}
                            </div>
                            
                            {project.milestones && (
                              <div className="mt-3 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Flag className="h-4 w-4" />
                                  <span>Milestones: {project.milestones}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => startEditing(project)}
                            className="p-2 hover:bg-blue-100 rounded-full transition-colors"
                            title="Edit Project"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2 hover:bg-red-100 rounded-full transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-white border-0 shadow-2xl rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-gray-800">Edit Project</CardTitle>
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
                <div>
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={editForm.dueDate}
                      onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={editForm.priority} onValueChange={(value) => setEditForm({ ...editForm, priority: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="teamMembers">Team Members</Label>
                  <Input
                    id="teamMembers"
                    value={editForm.teamMembers}
                    onChange={(e) => setEditForm({ ...editForm, teamMembers: e.target.value })}
                    className="mt-1"
                    placeholder="Enter your team members (optional)"
                  />
                </div>

                <div>
                  <Label htmlFor="milestones">Milestones</Label>
                  <Textarea
                    id="milestones"
                    value={editForm.milestones}
                    onChange={(e) => setEditForm({ ...editForm, milestones: e.target.value })}
                    className="mt-1"
                    rows={2}
                    placeholder="Enter project milestones (optional)"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => editingProject && handleDeleteProject(editingProject.id)}
                    variant="outline" 
                    className="border-red-500 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                  <Button onClick={saveEdit} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
