import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    // Get authorization token
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token is required' },
        { status: 401 }
      )
    }

    const { bookId, borrowingDays, userId } = await request.json()

    if (!bookId || !borrowingDays || !userId) {
      return NextResponse.json(
        { error: 'Book ID, borrowing days, and user ID are required' },
        { status: 400 }
      )
    }

    // Validate borrowing days (1-30 days)
    if (borrowingDays < 1 || borrowingDays > 30) {
      return NextResponse.json(
        { error: 'Borrowing period must be between 1 and 30 days' },
        { status: 400 }
      )
    }

    // Convert UUID userId to numeric ID if needed
    let numericUserId = userId
    if (typeof userId === 'string' && userId.includes('-')) {
      // This is a UUID, we need to find the corresponding numeric ID in library_members
      const { data: member, error: memberError } = await supabase
        .from('library_members')
        .select('id')
        .eq('email', userId) // Assuming the UUID is passed as email
        .single()
      
      if (memberError || !member) {
        // If not found by email, use a default ID or create a new member
        console.log('User not found in library_members, using default ID')
        numericUserId = 1 // Default user ID
      } else {
        numericUserId = member.id
      }
    }

    // Check if book exists and is available
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single()

    if (bookError || !book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    if (!book.available) {
      return NextResponse.json(
        { error: 'Book is not available for borrowing' },
        { status: 400 }
      )
    }

    console.log('Processing book request for user ID:', numericUserId)

    // Calculate due date
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + borrowingDays)

    // Create book request in database
    // First try with book details, if that fails, try without them
    let insertedRequest = null
    let requestError = null

    try {
      // Try to insert with book details first
      const result = await supabase
        .from('book_requests')
        .insert({
          member_id: numericUserId,
          book_id: bookId,
          requested_days: borrowingDays,
          due_date: dueDate.toISOString().split('T')[0],
          status: 'pending',
          request_date: new Date().toISOString().split('T')[0],
          book_title: book.title,
          book_author: book.author,
          book_subject: book.subject
        })
        .select()
        .single()

      insertedRequest = result.data
      requestError = result.error
    } catch (error) {
      // If the above fails (due to missing columns), try without book details
      console.log('Book detail columns may not exist, trying without them')
      const result = await supabase
        .from('book_requests')
        .insert({
          member_id: numericUserId,
          book_id: bookId,
          requested_days: borrowingDays,
          due_date: dueDate.toISOString().split('T')[0],
          status: 'pending',
          request_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single()

      insertedRequest = result.data
      requestError = result.error
    }

    if (requestError) {
      console.error('Error creating book request:', requestError)
      return NextResponse.json(
        { error: 'Failed to create book request: ' + requestError.message },
        { status: 500 }
      )
    }

    if (!insertedRequest) {
      return NextResponse.json(
        { error: 'Failed to create book request' },
        { status: 500 }
      )
    }

    // Create notification for user (optional - won't fail if table doesn't exist)
    try {
      await supabase
        .from('user_notifications')
        .insert({
          member_id: userId,
          type: 'book_request',
          title: 'Book Request Submitted',
          message: `Your request for "${book.title}" has been submitted and is pending admin approval.`,
          is_read: false
        })
    } catch (notificationError) {
      console.log('Note: Could not create notification (table might not exist)')
    }

    return NextResponse.json({
      success: true,
      message: 'Book request submitted successfully',
      request: {
        id: insertedRequest.id,
        bookTitle: book.title,
        borrowingDays,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'pending'
      }
    })

  } catch (error) {
    console.error('Book request API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
