import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

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
      // If member not found, return default ID
      return NextResponse.json({
        success: true,
        memberId: 1, // Default member ID
        message: 'Member not found, using default ID'
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

