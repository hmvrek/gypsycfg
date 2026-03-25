import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Create a new link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, url, file_size, short_id, image_url, owner_token } = body

    if (!url || !short_id || !owner_token) {
      return NextResponse.json(
        { error: 'Missing required fields: url, short_id, and owner_token are required' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('links')
      .insert({
        title: title || 'My Link',
        description: description || '',
        url,
        file_size: file_size || 'Unknown',
        short_id,
        image_url: image_url || null,
        owner_token,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create link' },
        { status: 500 }
      )
    }

    // Return data without owner_token for security
    const { owner_token: _, ...safeData } = data
    return NextResponse.json(safeData, { status: 201 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get all links
export async function GET() {
  try {
    const supabase = createServerClient()
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('links')
      .select('id, title, description, url, file_size, short_id, image_url, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch links' },
        { status: 500 }
      )
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
