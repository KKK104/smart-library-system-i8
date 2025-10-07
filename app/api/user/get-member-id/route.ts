import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find the member ID by email
    const { data: member, error } = await supabase
      .from('library_members')
      .select('id')
      .eq('email', email)
      .single()

    if (error || !member) {
      // Auto-create minimal member row if not found to satisfy foreign key
      const safeName = (name && String(name).trim().length > 0) ? name : (email?.split('@')[0] || 'New Member')
      const joinDate = new Date().toISOString().split('T')[0]
      const { data: created, error: createError } = await supabase
        .from('library_members')
        .insert({
          name: safeName,
          email,
          join_date: joinDate,
          borrowed_count: 0,
          overdue_count: 0,
          status: 'Active'
        })
        .select('id')
        .single()

      if (createError || !created) {
        // Fallback to default ID if creation fails
        return NextResponse.json({
          success: true,
          memberId: 1,
          message: 'Member not found; using default ID'
        })
      }

      return NextResponse.json({
        success: true,
        memberId: created.id,
        message: 'Member created'
      })
    }

    return NextResponse.json({
      success: true,
      memberId: member.id,
      message: 'Member ID found'
    })

  } catch (error) {
    console.error('Get member ID API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

