"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Mail, Lock, Eye, EyeOff, User, Shield } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [nickname, setNickname] = useState("")
  const [roleModel, setRoleModel] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const { signup } = useAuth()
  const router = useRouter()
  
  // Password validation states
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    capital: false,
    number: false,
    character: false
  })
  
  // Check password requirements
  const checkPasswordRequirements = (pass: string) => {
    setPasswordRequirements({
      length: pass.length >= 5 && pass.length <= 12,
      capital: /[A-Z]/.test(pass),
      number: /\d/.test(pass),
      character: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    })
  }
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    checkPasswordRequirements(newPassword)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validate required fields
    if (!email || !password || !confirmPassword || !fullName) {
      const errorMsg = "Please fill in all required fields"
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      const errorMsg = "Passwords do not match"
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }
    
    // Check if all password requirements are met
    if (!Object.values(passwordRequirements).every(req => req)) {
      const errorMsg = "Please ensure all password requirements are met"
      setError(errorMsg)
      toast.error(errorMsg)
      return
    }
    
    setIsLoading(true)
    
    try {
      await signup(email, password, fullName, nickname, roleModel)
      setShowSuccess(true)
      toast.success("Account created successfully! Redirecting to login...")
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create account"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
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
            {showSuccess ? (
              <>
                <CardTitle className="text-2xl font-bold text-green-600">Account Created Successfully!</CardTitle>
                <CardDescription>Your account was successfully created. Redirecting to login page...</CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
                <CardDescription>Join TaskFlow and start organizing your work</CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {showSuccess ? (
              <div className="text-center space-y-4">
                <div className="text-green-600 text-6xl mb-4">✅</div>
                <p className="text-muted-foreground">Your account was successfully created!</p>
                <div className="space-y-2">
                  <Button 
                    onClick={() => router.push('/login')}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Go to Login Page
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    You will be automatically redirected in a few seconds...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Social Signup */}
                <div className="space-y-3">
              <Button variant="outline" className="w-full border-border hover:bg-muted bg-transparent">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <Button variant="outline" className="w-full border-border hover:bg-muted bg-transparent">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                </svg>
                Continue with GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            {/* Signup Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10 border-border focus:ring-primary"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 border-border focus:ring-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="pl-10 pr-10 border-border focus:ring-primary"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {/* Password Requirements */}
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground font-medium">Password requirements:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`flex items-center space-x-2 ${passwordRequirements.length ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordRequirements.length ? 'bg-green-500' : 'bg-muted'}`}></div>
                      <span>5-12 characters</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${passwordRequirements.capital ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordRequirements.capital ? 'bg-green-500' : 'bg-muted'}`}></div>
                      <span>1 capital letter</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${passwordRequirements.number ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordRequirements.number ? 'bg-green-500' : 'bg-muted'}`}></div>
                      <span>1 number</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${passwordRequirements.character ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <div className={`w-2 h-2 rounded-full ${passwordRequirements.character ? 'bg-green-500' : 'bg-muted'}`}></div>
                      <span>1 special character</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 border-border focus:ring-primary"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {password && confirmPassword && (
                  <div className={`text-sm ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                    {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </div>
                )}
              </div>

              {/* Security Questions */}
              <div className="space-y-4 pt-4 border-t border-border">
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

              {/* Verification Checkbox */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="verification"
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                  required
                />
                <Label htmlFor="verification" className="text-sm text-muted-foreground">
                  I agree to receive email notifications and updates from TaskFlow
                </Label>
              </div>

              {/* Form Ready Indicator */}
              {email && password && confirmPassword && fullName && password === confirmPassword && Object.values(passwordRequirements).every(req => req) && (
                <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-md border border-green-200">
                  ✓ Form is ready to submit!
                </div>
              )}

              {/* Form Incomplete Indicator */}
              {!(email && password && confirmPassword && fullName && password === confirmPassword && Object.values(passwordRequirements).every(req => req)) && (
                <div className="text-blue-600 text-sm text-center bg-blue-50 p-3 rounded-md border border-blue-200">
                  ℹ️ Please complete all fields and meet password requirements to create your account
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md border border-red-200">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className={`w-full text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed ${
                  email && password && confirmPassword && fullName && password === confirmPassword && Object.values(passwordRequirements).every(req => req)
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-primary hover:bg-primary/90'
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                Log in
              </Link>
            </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Terms */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:text-primary/80">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:text-primary/80">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
