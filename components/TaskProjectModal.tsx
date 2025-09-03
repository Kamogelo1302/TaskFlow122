"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Calendar, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface TaskProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TaskProjectModal({ isOpen, onClose }: TaskProjectModalProps) {
  const router = useRouter()

  const handleCreateTask = () => {
    onClose()
    router.push("/create-task")
  }

  const handleCreateProject = () => {
    onClose()
    router.push("/create-project")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            What would you like to create?
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Choose between creating a quick task or starting a new project
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Task Option */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-pink-300"
            onClick={handleCreateTask}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-pink-600">Quick Task</CardTitle>
              <CardDescription className="text-gray-600">
                Create a simple task with a title, description, and due date
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Perfect for daily to-dos, reminders, and simple tasks
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                onClick={handleCreateTask}
              >
                Create Task
              </Button>
            </CardContent>
          </Card>

          {/* Project Option */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300"
            onClick={handleCreateProject}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-blue-600">New Project</CardTitle>
              <CardDescription className="text-gray-600">
                Organize multiple tasks into a structured project
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Great for complex work, team collaboration, and long-term goals
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                onClick={handleCreateProject}
              >
                Create Project
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
