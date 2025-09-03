"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Mail, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [showSecurityQuestions, setShowSecurityQuestions] = useState(false)
  const [nickname, setNickname] = useState("")
  const [roleModel, setRoleModel] = useState("")
  const [showResetForm, setShowResetForm] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setShowSecurityQuestions(true)
    }
  }

  const handleSecurityQuestionsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nickname && roleModel) {
      setShowResetForm(true)
    }
  }

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword === confirmPassword) {
      // Here you would typically make an API call to reset the password
      alert("Password reset successfully! You can now log in with your new password.")
      window.location.href = '/login'
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">TaskFlow</span>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
            <CardDescription>
              {!showSecurityQuestions && !showResetForm && "Enter your email to reset your password"}
              {showSecurityQuestions && !showResetForm && "Answer your security questions"}
              {showResetForm && "Create a new password"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Email Input Step */}
            {!showSecurityQuestions && !showResetForm && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="pl-10 border-border focus:ring-primary"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Confirm
                </Button>
              </form>
            )}

            {/* Security Questions Step */}
            {showSecurityQuestions && !showResetForm && (
              <form onSubmit={handleSecurityQuestionsSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">Security Questions</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="nickname">What is your childhood nickname?</Label>
                      <Input
                        id="nickname"
                        type="text"
                        placeholder="Enter your childhood nickname"
                        className="border-border focus:ring-primary"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="roleModel">Who's your role model?</Label>
                      <Input
                        id="roleModel"
                        type="text"
                        placeholder="Enter your role model's name"
                        className="border-border focus:ring-primary"
                        value={roleModel}
                        onChange={(e) => setRoleModel(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Verify
                </Button>
              </form>
            )}

            {/* Password Reset Step */}
            {showResetForm && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="pr-10 border-border focus:ring-primary"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="pr-10 border-border focus:ring-primary"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Reset Password
                </Button>
              </form>
            )}

            {/* Back to Login */}
            <div className="text-center">
              <Link href="/login" className="inline-flex items-center space-x-2 text-sm text-primary hover:text-primary/80">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to login</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



