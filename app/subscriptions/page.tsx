"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Crown, CheckCircle, Star } from "lucide-react"
import Link from "next/link"

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 via-pink-400 to-blue-400 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Crown className="h-7 w-7 text-white" />
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
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl shadow-2xl mb-6">
              <Crown className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Subscription Plans</h1>
            <p className="text-xl text-gray-600">Choose the perfect plan for your productivity needs</p>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Free Plan */}
            <Card className="bg-white border-2 border-gray-200 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-gray-800">Free Plan</CardTitle>
                <div className="text-4xl font-bold text-gray-800 mb-2">$0</div>
                <CardDescription className="text-gray-600">Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">10 projects</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">20 tasks</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Email support</span>
                  </li>
                </ul>
                <Button className="w-full bg-gray-500 hover:bg-gray-600 text-white" disabled>
                  Current Plan
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-white border-2 border-yellow-300 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 relative">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white">
                Popular
              </Badge>
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-gray-800">Pro Plan</CardTitle>
                <div className="text-4xl font-bold text-gray-800 mb-2">R120</div>
                <CardDescription className="text-gray-600">per month</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Unlimited projects</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Unlimited tasks</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Advanced analytics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Priority support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Custom themes</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-white border-2 border-purple-300 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-gray-800">Enterprise</CardTitle>
                <div className="text-4xl font-bold text-gray-800 mb-2">R240</div>
                <CardDescription className="text-gray-600">per month</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Everything in Pro</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Team collaboration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Custom integrations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Dedicated support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">API access</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  <Star className="h-4 w-4 mr-2" />
                  Upgrade to Enterprise
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features Comparison */}
          <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 pb-6">
              <CardTitle className="text-2xl text-gray-800 text-center">Feature Comparison</CardTitle>
              <CardDescription className="text-gray-600 text-center">
                Compare what's included in each plan
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Feature</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-700">Free</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-700">Pro</th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-700">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4 text-gray-700">Projects</td>
                      <td className="py-4 px-4 text-center">10</td>
                      <td className="py-4 px-4 text-center">Unlimited</td>
                      <td className="py-4 px-4 text-center">Unlimited</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4 text-gray-700">Tasks</td>
                      <td className="py-4 px-4 text-center">20</td>
                      <td className="py-4 px-4 text-center">Unlimited</td>
                      <td className="py-4 px-4 text-center">Unlimited</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4 text-gray-700">Support</td>
                      <td className="py-4 px-4 text-center">Email</td>
                      <td className="py-4 px-4 text-center">Priority</td>
                      <td className="py-4 px-4 text-center">Dedicated</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4 text-gray-700">Team Features</td>
                      <td className="py-4 px-4 text-center">-</td>
                      <td className="py-4 px-4 text-center">-</td>
                      <td className="py-4 px-4 text-center">✓</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 text-gray-700">API Access</td>
                      <td className="py-4 px-4 text-center">-</td>
                      <td className="py-4 px-4 text-center">-</td>
                      <td className="py-4 px-4 text-center">✓</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
