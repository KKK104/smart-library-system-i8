"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Lightbulb, MapPin, BookOpen } from "lucide-react"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedShelf, setSelectedShelf] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<any[]>([])

  const books = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "978-0-7432-7356-5",
      shelf: "A1-2",
      available: true,
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "978-0-06-112008-4",
      shelf: "A2-1",
      available: true,
    },
    { id: 3, title: "1984", author: "George Orwell", isbn: "978-0-452-28423-4", shelf: "B1-3", available: false },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      isbn: "978-0-14-143951-8",
      shelf: "C2-2",
      available: true,
    },
    {
      id: 5,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      isbn: "978-0-316-76948-0",
      shelf: "A3-1",
      available: true,
    },
  ]

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    const results = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery),
    )
    setSearchResults(results)
  }

  const lightUpShelf = async (shelf: string) => {
    setSelectedShelf(shelf)

    try {
      // Send command to turn the light ON
      await fetch("/api/shelf/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shelfId: shelf, state: "on" }),
      })

      // Simulate the light staying on for 5 seconds, then turn it off
      setTimeout(async () => {
        await fetch("/api/shelf/control", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shelfId: shelf, state: "off" }),
        })
        setSelectedShelf(null)
      }, 5000)
    } catch (error) {
      console.error("Failed to control shelf light:", error)
      setSelectedShelf(null) // Reset UI on error
    }
  }

  const renderShelfGrid = () => {
    const rows = ["A", "B", "C"]
    const cols = [1, 2, 3]

    return (
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {rows.map((row) =>
          cols.map((col) => {
            const shelfId = `${row}${col}`
            const isLit = selectedShelf?.startsWith(shelfId)
            return (
              <div
                key={shelfId}
                className={`aspect-square border-2 rounded-lg flex flex-col items-center justify-center p-4 transition-all duration-300 ${
                  isLit ? "bg-yellow-200 border-yellow-400 shadow-lg shadow-yellow-300" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="text-lg font-bold mb-2">{shelfId}</div>
                <div className={`w-6 h-6 rounded-full ${isLit ? "bg-yellow-500" : "bg-gray-300"}`} />
                {isLit && <Lightbulb className="h-4 w-4 text-yellow-600 mt-1" />}
              </div>
            )
          }),
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Search & Lighting</h1>
          <p className="text-lg text-gray-600">Find books and illuminate their exact shelf location</p>
        </div>

        {/* Search Interface */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Book Search
            </CardTitle>
            <CardDescription>Search by title, author, or ISBN to activate shelf lighting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter book title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Results */}
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                {searchResults.length > 0
                  ? `Found ${searchResults.length} book(s)`
                  : "Enter a search term to find books"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((book) => (
                    <div key={book.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{book.title}</h3>
                          <p className="text-gray-600">by {book.author}</p>
                          <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">Shelf: {book.shelf}</span>
                            <Badge variant={book.available ? "default" : "destructive"}>
                              {book.available ? "Available" : "Borrowed"}
                            </Badge>
                          </div>
                        </div>
                        <Button onClick={() => lightUpShelf(book.shelf)} disabled={!book.available} className="ml-4">
                          <Lightbulb className="h-4 w-4 mr-2" />
                          Light Up
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No search results yet. Try searching for a book!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shelf Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Library Shelf (3x3 Grid)</CardTitle>
              <CardDescription>
                {selectedShelf
                  ? `Shelf ${selectedShelf} is currently lit up`
                  : "LED lights will illuminate when you search for a book"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderShelfGrid()}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    <span>LED Off</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span>LED On</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>System Components</CardTitle>
            <CardDescription>Each shelf cell contains the following components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded mx-auto mb-2"></div>
                <h4 className="font-medium">LED Light</h4>
                <p className="text-sm text-gray-600">Illuminates shelf location</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded mx-auto mb-2"></div>
                <h4 className="font-medium">ESP32</h4>
                <p className="text-sm text-gray-600">Microcontroller unit</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-500 rounded mx-auto mb-2"></div>
                <h4 className="font-medium">Breadboard</h4>
                <p className="text-sm text-gray-600">Circuit connections</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="w-8 h-8 bg-red-500 rounded mx-auto mb-2"></div>
                <h4 className="font-medium">Power Supply</h4>
                <p className="text-sm text-gray-600">5V DC power source</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
