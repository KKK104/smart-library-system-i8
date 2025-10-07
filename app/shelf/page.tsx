"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lightbulb, Zap, Wifi, AlertTriangle, CheckCircle, Activity, Calculator, Atom, Globe, Heart, Shield, Wrench } from 'lucide-react'
import { AdminSidebar } from "@/components/admin-sidebar"

export default function ShelfPage() {
  const [subjectData, setSubjectData] = useState([
    {
      id: "Mathematics",
      icon: Calculator,
      ledStatus: "off",
      esp32Status: "online",
      powerLevel: 95,
      lastUpdate: "2024-01-16 16:45:00",
      temperature: 24.5,
      books: 3,
      color: "bg-blue-500"
    },
    {
      id: "Science",
      ledPin: 2,
      icon: Atom,
      ledStatus: "off",
      esp32Status: "online",
      powerLevel: 88,
      lastUpdate: "2024-01-16 16:44:30",
      temperature: 23.8,
      books: 3,
      color: "bg-green-500"
    },
    {
      id: "Social Studies",
      ledPin: 3,
      icon: Globe,
      ledStatus: "off",
      esp32Status: "online",
      powerLevel: 92,
      lastUpdate: "2024-01-16 16:45:15",
      temperature: 24.1,
      books: 3,
      color: "bg-yellow-500"
    },
    {
      id: "PEHM",
      ledPin: 4,
      icon: Heart,
      ledStatus: "off",
      esp32Status: "online",
      powerLevel: 76,
      lastUpdate: "2024-01-16 16:43:45",
      temperature: 25.2,
      books: 3,
      color: "bg-red-500"
    },
    {
      id: "Values Education",
      ledPin: 5,
      icon: Shield,
      ledStatus: "off",
      esp32Status: "online",
      powerLevel: 91,
      lastUpdate: "2024-01-16 16:45:30",
      temperature: 24.7,
      books: 3,
      color: "bg-purple-500"
    },
    {
      id: "TLE",
      ledPin: 6,
      icon: Wrench,
      ledStatus: "off",
      esp32Status: "online",
      powerLevel: 84,
      lastUpdate: "2024-01-16 16:44:00",
      temperature: 23.5,
      books: 3,
      color: "bg-orange-500"
    }
  ])

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

  const getLEDStatusColor = (status: string, defaultColor: string) => {
    switch (status) {
      case "on":
        return "bg-yellow-400 shadow-lg shadow-yellow-300"
      case "blinking":
        return "bg-orange-400 animate-pulse"
      case "off":
        return defaultColor
      default:
        return defaultColor
    }
  }

  const getESP32StatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-100 text-green-800"><Wifi className="h-3 w-3 mr-1" />Online</Badge>
      case "offline":
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Offline</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPowerLevelColor = (level: number) => {
    if (level > 80) return "text-green-600"
    if (level > 50) return "text-yellow-600"
    return "text-red-600"
  }

  const testSubjectLED = async (subjectId: string) => {
    setSubjectData(prev => prev.map(subject => 
      subject.id === subjectId 
        ? { ...subject, ledStatus: "blinking" }
        : subject
    ))
    
    try {
      // Send command to turn the LED ON
      await fetch("/api/led/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          subject: subjectId, 
          ledPin: subjectData.find(s => s.id === subjectId)?.ledPin, 
          state: "on" 
        }),
      })

      // Turn off after 3 seconds
      setTimeout(async () => {
        await fetch("/api/led/control", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            subject: subjectId, 
            ledPin: subjectData.find(s => s.id === subjectId)?.ledPin, 
            state: "off" 
          }),
        })
        
        setSubjectData(prev => prev.map(subject => 
          subject.id === subjectId 
            ? { ...subject, ledStatus: "off" }
            : subject
        ))
      }, 3000)
    } catch (error) {
      console.error("Failed to test LED:", error)
      setSubjectData(prev => prev.map(subject => 
        subject.id === subjectId 
          ? { ...subject, ledStatus: "off" }
          : subject
      ))
    }
  }

  const renderSubjectGrid = () => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {subjectData.map((subject) => {
          const Icon = subject.icon
          return (
            <Card 
              key={subject.id}
              className={`cursor-pointer transition-all duration-300 ${
                selectedSubject === subject.id ? 'ring-2 ring-blue-500' : ''
              } ${subject.esp32Status === 'offline' ? 'opacity-60' : ''}`}
              onClick={() => setSelectedSubject(subject.id)}
            >
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Icon className="h-8 w-8 mr-2 text-gray-600" />
                  <div className="text-lg font-bold">{subject.id}</div>
                </div>
                
                {/* LED Indicator */}
                <div className={`w-12 h-12 rounded-full mx-auto mb-4 ${getLEDStatusColor(subject.ledStatus, subject.color)}`}>
                  {subject.ledStatus === 'on' && <Lightbulb className="h-6 w-6 text-yellow-800 mx-auto mt-3" />}
                </div>
                
                {/* Status Badges */}
                <div className="space-y-2 mb-4">
                  {/* Online badge, LED pin removed per request */}
                  <div className="text-sm text-gray-600">
                    {subject.books} books
                  </div>
                </div>
                
                {/* Power level removed per request */}
                
                {/* Test Button */}
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation()
                    testSubjectLED(subject.id)
                  }}
                  disabled={subject.esp32Status === 'offline'}
                  className="w-full"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Test LED
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  const onlineSubjectCount = subjectData.filter(subject => subject.esp32Status === 'online').length
  const averagePowerLevel = Math.round(subjectData.reduce((sum, subject) => sum + subject.powerLevel, 0) / subjectData.length)
  const totalBooks = subjectData.reduce((sum, subject) => sum + subject.books, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ESP32 LED Monitoring System</h1>
          <p className="text-lg text-gray-600">Real-time monitoring of 6 subject area LEDs and ESP32 controllers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Online Subjects</p>
                  <p className="text-2xl font-bold text-gray-900">{onlineSubjectCount}/6</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Power</p>
                  <p className="text-2xl font-bold text-gray-900">{averagePowerLevel}%</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Books</p>
                  <p className="text-2xl font-bold text-gray-900">{totalBooks}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active LEDs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {subjectData.filter(subject => subject.ledStatus !== 'off').length}
                  </p>
                </div>
                <Lightbulb className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Grid */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>6 Subject Areas - LED Status</CardTitle>
            <CardDescription>
              Click on any subject to view detailed information. Each subject has its own LED controlled by the ESP32.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderSubjectGrid()}
          </CardContent>
        </Card>

        {/* Detailed Information */}
        {selectedSubject && (
          <Card>
            <CardHeader>
              <CardTitle>{selectedSubject} - Detailed Information</CardTitle>
              <CardDescription>Real-time monitoring data and component status</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="components">Components</TabsTrigger>
                  <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  {(() => {
                    const subject = subjectData.find(s => s.id === selectedSubject)
                    if (!subject) return null
                    
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium mb-2">System Status</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>ESP32 Controller:</span>
                                {getESP32StatusBadge(subject.esp32Status)}
                              </div>
                              <div className="flex justify-between">
                                <span>LED Status:</span>
                                <Badge variant={subject.ledStatus === 'on' ? 'default' : 'outline'}>
                                  {subject.ledStatus}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>LED Pin:</span>
                                <span className="text-sm text-gray-600">GPIO {subject.ledPin}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Last Update:</span>
                                <span className="text-sm text-gray-600">{subject.lastUpdate}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium mb-2">Subject Information</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Books Available:</span>
                                <span>{subject.books}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Temperature:</span>
                                <span>{subject.temperature}°C</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium mb-2">Power Management</h4>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Battery Level</span>
                                  <span className={getPowerLevelColor(subject.powerLevel)}>
                                    {subject.powerLevel}%
                                  </span>
                                </div>
                                <Progress value={subject.powerLevel} className="h-3" />
                              </div>
                              <div className="text-sm text-gray-600">
                                Estimated runtime: {Math.round(subject.powerLevel / 10)} hours
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium mb-2">Quick Actions</h4>
                            <div className="space-y-2">
                              <Button 
                                onClick={() => testSubjectLED(subject.id)}
                                disabled={subject.esp32Status === 'offline'}
                                className="w-full"
                              >
                                <Lightbulb className="h-4 w-4 mr-2" />
                                Test LED Light
                              </Button>
                              <Button variant="outline" className="w-full">
                                <Activity className="h-4 w-4 mr-2" />
                                Run Diagnostics
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </TabsContent>
                
                <TabsContent value="components" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded"></div>
                        <h4 className="font-medium">LED Light Module</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span>High-brightness LED</span>
                        </div>
                        <div className="flex justify-between">
                          <span>GPIO Pin:</span>
                          <span>{subjectData.find(s => s.id === selectedSubject)?.ledPin}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Power:</span>
                          <span>5W</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge variant="outline">{subjectData.find(s => s.id === selectedSubject)?.ledStatus}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-500 rounded"></div>
                        <h4 className="font-medium">ESP32 Controller</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Model:</span>
                          <span>ESP32-WROOM-32</span>
                        </div>
                        <div className="flex justify-between">
                          <span>WiFi:</span>
                          <span>Connected</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Firmware:</span>
                          <span>v2.1.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          {getESP32StatusBadge(subjectData.find(s => s.id === selectedSubject)?.esp32Status || 'offline')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-green-500 rounded"></div>
                        <h4 className="font-medium">Breadboard</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span>Half-size breadboard</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Connections:</span>
                          <span>400 tie points</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge className="bg-green-100 text-green-800">Connected</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-red-500 rounded"></div>
                        <h4 className="font-medium">Power Supply</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Voltage:</span>
                          <span>5V DC</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Current:</span>
                          <span>2A max</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Battery:</span>
                          <span>{subjectData.find(s => s.id === selectedSubject)?.powerLevel}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="diagnostics" className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">System Health Check</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>ESP32 Communication</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          OK
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>LED Functionality</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          OK
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Power Supply</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          OK
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Network Connectivity</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          OK
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Response Time</span>
                        <div className="text-lg font-semibold">45ms</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Uptime</span>
                        <div className="text-lg font-semibold">99.8%</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Signal Strength</span>
                        <div className="text-lg font-semibold">-42 dBm</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Memory Usage</span>
                        <div className="text-lg font-semibold">68%</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
          </div>
        </div>
      </div>
    </div>
  )
}
