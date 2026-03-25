import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Get link by short ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  try {
    const { shortId } = await params
    
    if (!shortId) {
      return NextResponse.json({ error: 'Invalid short ID' }, { status: 400 })
    }

    const supabase = createServerClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('links')
      .select('id, title, description, url, file_size, short_id, image_url, created_at')
      .eq('short_id', shortId)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Delete link by short ID - requires owner_token
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  try {
    const { shortId } = await params
    
    if (!shortId) {
      return NextResponse.json({ error: 'Invalid short ID' }, { status: 400 })
    }

    // Get owner_token from request body or headers
    let ownerToken: string | null = null
    
    try {
      const body = await request.json()
      ownerToken = body.owner_token
    } catch {
      // Try to get from header if body parsing fails
      ownerToken = request.headers.get('x-owner-token')
    }

    if (!ownerToken) {
      return NextResponse.json(
        { error: 'Unauthorized: owner_token required' },
        { status: 401 }
      )
    }

    const supabase = createServerClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // First, verify the owner_token matches
    const { data: link, error: fetchError } = await supabase
      .from('links')
      .select('id, owner_token')
      .eq('short_id', shortId)
      .single()

    if (fetchError || !link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    // Check if owner_token matches
    if (link.owner_token !== ownerToken) {
      return NextResponse.json(
        { error: 'Unauthorized: you can only delete your own links' },
        { status: 403 }
      )
    }

    // Delete the link
    const { error: deleteError } = await supabase
      .from('links')
      .delete()
      .eq('id', link.id)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Link deleted successfully' })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
