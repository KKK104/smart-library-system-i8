"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Nfc, MapPin, Plus, Smartphone, Navigation } from 'lucide-react'

export default function NFCPage() {
  const [nfcTags] = useState([
    {
      id: 1,
      tagId: "NFC001",
      location: "Section A - Fiction",
      shelf: "A1-A3",
      description: "Classic Literature and Modern Fiction",
      status: "active",
      lastScanned: "2024-01-16 14:30:00",
      scanCount: 45
    },
    {
      id: 2,
      tagId: "NFC002",
      location: "Section B - Science",
      shelf: "B1-B3",
      description: "Physics, Chemistry, and Biology",
      status: "active",
      lastScanned: "2024-01-16 11:15:00",
      scanCount: 32
    },
    {
      id: 3,
      tagId: "NFC003",
      location: "Section C - History",
      shelf: "C1-C3",
      description: "World History and Biographies",
      status: "active",
      lastScanned: "2024-01-16 09:45:00",
      scanCount: 28
    },
    {
      id: 4,
      tagId: "NFC004",
      location: "Information Desk",
      shelf: "Main Desk",
      description: "Library Information and Help",
      status: "active",
      lastScanned: "2024-01-16 16:20:00",
      scanCount: 78
    },
    {
      id: 5,
      tagId: "NFC005",
      location: "Study Area",
      shelf: "Study Tables",
      description: "Quiet Study and Reading Area",
      status: "inactive",
      lastScanned: "2024-01-15 18:00:00",
      scanCount: 15
    }
  ])

  const [newTag, setNewTag] = useState({
    tagId: "",
    location: "",
    shelf: "",
    description: ""
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">NFC Mapping System</h1>
          <p className="text-lg text-gray-600">Navigate the library with NFC-enabled location tags</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total NFC Tags</p>
                  <p className="text-2xl font-bold text-gray-900">{nfcTags.length}</p>
                </div>
                <Nfc className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Tags</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {nfcTags.filter(tag => tag.status === 'active').length}
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Scans</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {nfcTags.reduce((sum, tag) => sum + tag.scanCount, 0)}
                  </p>
                </div>
                <Smartphone className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Locations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(nfcTags.map(tag => tag.location.split(' - ')[0])).size}
                  </p>
                </div>
                <Navigation className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How NFC Navigation Works</CardTitle>
            <CardDescription>
              Users can tap NFC tags with their smartphones to get precise location information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Smartphone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium mb-2">1. Tap NFC Tag</h4>
                <p className="text-sm text-gray-600">User taps their phone on an NFC tag</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium mb-2">2. Get Location</h4>
                <p className="text-sm text-gray-600">System identifies exact location</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Navigation className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-medium mb-2">3. Show Directions</h4>
                <p className="text-sm text-gray-600">Display navigation to desired book</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Nfc className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium mb-2">4. Light Up Shelf</h4>
                <p className="text-sm text-gray-600">Activate LED lighting for precise location</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NFC Tags Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>NFC Tag Management</CardTitle>
                <CardDescription>Monitor and manage all NFC location tags</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add NFC Tag
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New NFC Tag</DialogTitle>
                    <DialogDescription>Register a new NFC tag for library navigation</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tagId">Tag ID</Label>
                      <Input
                        id="tagId"
                        value={newTag.tagId}
                        onChange={(e) => setNewTag({...newTag, tagId: e.target.value})}
                        placeholder="Enter NFC tag ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newTag.location}
                        onChange={(e) => setNewTag({...newTag, location: e.target.value})}
                        placeholder="Enter location description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shelf">Shelf Reference</Label>
                      <Input
                        id="shelf"
                        value={newTag.shelf}
                        onChange={(e) => setNewTag({...newTag, shelf: e.target.value})}
                        placeholder="Enter shelf reference"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newTag.description}
                        onChange={(e) => setNewTag({...newTag, description: e.target.value})}
                        placeholder="Enter description"
                      />
                    </div>
                    <Button className="w-full">
                      Add NFC Tag
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Shelf Reference</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scan Count</TableHead>
                  <TableHead>Last Scanned</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nfcTags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell className="font-medium">{tag.tagId}</TableCell>
                    <TableCell>{tag.location}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{tag.shelf}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{tag.description}</TableCell>
                    <TableCell>{getStatusBadge(tag.status)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{tag.scanCount}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{tag.lastScanned}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Test</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Library Map */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Library Layout with NFC Tags</CardTitle>
            <CardDescription>Visual representation of NFC tag locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              {/* Section A */}
              <div className="p-6 bg-blue-50 rounded-lg text-center border-2 border-blue-200">
                <Nfc className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium">Section A</h4>
                <p className="text-sm text-gray-600">Fiction</p>
                <Badge className="mt-2 bg-green-100 text-green-800">NFC001</Badge>
              </div>
              
              {/* Section B */}
              <div className="p-6 bg-green-50 rounded-lg text-center border-2 border-green-200">
                <Nfc className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium">Section B</h4>
                <p className="text-sm text-gray-600">Science</p>
                <Badge className="mt-2 bg-green-100 text-green-800">NFC002</Badge>
              </div>
              
              {/* Section C */}
              <div className="p-6 bg-orange-50 rounded-lg text-center border-2 border-orange-200">
                <Nfc className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-medium">Section C</h4>
                <p className="text-sm text-gray-600">History</p>
                <Badge className="mt-2 bg-green-100 text-green-800">NFC003</Badge>
              </div>
              
              {/* Information Desk */}
              <div className="p-6 bg-purple-50 rounded-lg text-center border-2 border-purple-200">
                <Nfc className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium">Info Desk</h4>
                <p className="text-sm text-gray-600">Help & Info</p>
                <Badge className="mt-2 bg-green-100 text-green-800">NFC004</Badge>
              </div>
              
              {/* Study Area */}
              <div className="p-6 bg-gray-50 rounded-lg text-center border-2 border-gray-200">
                <Nfc className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <h4 className="font-medium">Study Area</h4>
                <p className="text-sm text-gray-600">Quiet Zone</p>
                <Badge className="mt-2 bg-gray-100 text-gray-800">NFC005</Badge>
              </div>
              
              {/* Empty Space */}
              <div className="p-6 bg-white rounded-lg text-center border-2 border-dashed border-gray-300">
                <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h4 className="font-medium text-gray-400">Available</h4>
                <p className="text-sm text-gray-400">Add NFC Tag</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
