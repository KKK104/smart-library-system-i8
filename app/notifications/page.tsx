"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Clock, CheckCircle, AlertTriangle, Send } from 'lucide-react'

export default function NotificationsPage() {
  const [notifications] = useState([
    {
      id: 1,
      type: "due_reminder",
      user: "John Doe",
      email: "john.doe@email.com",
      book: "The Great Gatsby",
      dueDate: "2024-01-20",
      daysUntilDue: 3,
      status: "pending",
      scheduledTime: "2024-01-17 09:00:00"
    },
    {
      id: 2,
      type: "overdue",
      user: "Jane Smith",
      email: "jane.smith@email.com",
      book: "To Kill a Mockingbird",
      dueDate: "2024-01-15",
      daysUntilDue: -2,
      status: "sent",
      scheduledTime: "2024-01-16 09:00:00"
    },
    {
      id: 3,
      type: "due_reminder",
      user: "Mike Johnson",
      email: "mike.johnson@email.com",
      book: "1984",
      dueDate: "2024-01-18",
      daysUntilDue: 1,
      status: "pending",
      scheduledTime: "2024-01-17 09:00:00"
    },
    {
      id: 4,
      type: "return_confirmation",
      user: "Sarah Wilson",
      email: "sarah.wilson@email.com",
      book: "Pride and Prejudice",
      dueDate: "2024-01-22",
      daysUntilDue: 5,
      status: "sent",
      scheduledTime: "2024-01-16 14:30:00"
    }
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case "sent":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Sent</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "due_reminder":
        return <Badge variant="outline">Due Reminder</Badge>
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      case "return_confirmation":
        return <Badge className="bg-blue-100 text-blue-800">Return Confirmation</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const pendingNotifications = notifications.filter(n => n.status === 'pending')
  const sentNotifications = notifications.filter(n => n.status === 'sent')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Notification System</h1>
          <p className="text-lg text-gray-600">Automated email reminders for due dates and returns</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                  <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                </div>
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingNotifications.length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sent Today</p>
                  <p className="text-2xl font-bold text-gray-900">{sentNotifications.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue Items</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {notifications.filter(n => n.type === 'overdue').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notification System */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Automated Email System</CardTitle>
            <CardDescription>
              The system automatically sends email reminders 3 days and 1 day before due dates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">3-Day Reminder</h4>
                <p className="text-sm text-gray-600">Sent 3 days before due date to give users time to renew or return</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium mb-2">1-Day Reminder</h4>
                <p className="text-sm text-gray-600">Final reminder sent 1 day before due date</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-medium mb-2">Overdue Notice</h4>
                <p className="text-sm text-gray-600">Sent immediately when books become overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Track all automated email notifications</CardDescription>
              </div>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Send Pending
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Notifications</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingNotifications.length})</TabsTrigger>
                <TabsTrigger value="sent">Sent ({sentNotifications.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Days Until Due</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Scheduled</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{notification.user}</div>
                            <div className="text-sm text-gray-500">{notification.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{notification.book}</TableCell>
                        <TableCell>{getTypeBadge(notification.type)}</TableCell>
                        <TableCell>{notification.dueDate}</TableCell>
                        <TableCell>
                          <Badge variant={notification.daysUntilDue < 0 ? "destructive" : notification.daysUntilDue <= 1 ? "secondary" : "outline"}>
                            {notification.daysUntilDue < 0 ? `${Math.abs(notification.daysUntilDue)} days overdue` : `${notification.daysUntilDue} days`}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(notification.status)}</TableCell>
                        <TableCell className="text-sm text-gray-500">{notification.scheduledTime}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="pending">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Days Until Due</TableHead>
                      <TableHead>Scheduled</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingNotifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{notification.user}</div>
                            <div className="text-sm text-gray-500">{notification.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{notification.book}</TableCell>
                        <TableCell>{getTypeBadge(notification.type)}</TableCell>
                        <TableCell>{notification.dueDate}</TableCell>
                        <TableCell>
                          <Badge variant={notification.daysUntilDue <= 1 ? "secondary" : "outline"}>
                            {notification.daysUntilDue} days
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">{notification.scheduledTime}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="sent">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Sent At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sentNotifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{notification.user}</div>
                            <div className="text-sm text-gray-500">{notification.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{notification.book}</TableCell>
                        <TableCell>{getTypeBadge(notification.type)}</TableCell>
                        <TableCell>{notification.dueDate}</TableCell>
                        <TableCell className="text-sm text-gray-500">{notification.scheduledTime}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
