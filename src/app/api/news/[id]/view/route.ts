import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const newsId = params.id
    
    if (!newsId) {
      return NextResponse.json(
        { error: 'News ID is required' },
        { status: 400 }
      )
    }

    // Get or create viewed articles tracking from cookies
    const cookieStore = cookies()
    const viewedArticles = cookieStore.get('viewed_articles')
    let viewedList: string[] = []
    
    if (viewedArticles) {
      try {
        viewedList = JSON.parse(viewedArticles.value)
      } catch {
        viewedList = []
      }
    }
    
    // Check if this article was already viewed in this session
    if (viewedList.includes(newsId)) {
      // Return current view count without incrementing
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('news')
        .select('views')
        .eq('id', newsId)
        .single()
      
      if (error) {
        console.error('Error fetching current views:', error)
        return NextResponse.json(
          { error: 'Failed to fetch view count' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({ 
        views: data?.views || 0,
        incremented: false 
      })
    }
    
    // Increment the view counter in the database
    const supabase = await createClient()
    
    // First, get current views
    const { data: currentData, error: fetchError } = await supabase
      .from('news')
      .select('views')
      .eq('id', newsId)
      .single()
    
    if (fetchError) {
      console.error('Error fetching news article:', fetchError)
      return NextResponse.json(
        { error: 'News article not found' },
        { status: 404 }
      )
    }
    
    const currentViews = currentData?.views || 0
    const newViews = currentViews + 1
    
    // Update the views
    const { error: updateError } = await supabase
      .from('news')
      .update({ 
        views: newViews,
        updated_at: new Date().toISOString()
      })
      .eq('id', newsId)
    
    if (updateError) {
      console.error('Error updating views:', updateError)
      return NextResponse.json(
        { error: 'Failed to update view count' },
        { status: 500 }
      )
    }
    
    // Add this article to the viewed list
    viewedList.push(newsId)
    
    // Update the cookie with the new viewed list
    // Cookie expires in 24 hours
    const response = NextResponse.json({ 
      views: newViews,
      incremented: true 
    })
    
    response.cookies.set({
      name: 'viewed_articles',
      value: JSON.stringify(viewedList),
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })
    
    return response
    
  } catch (error) {
    console.error('Unexpected error in view counter:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET method to retrieve current view count
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const newsId = params.id
    
    if (!newsId) {
      return NextResponse.json(
        { error: 'News ID is required' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('news')
      .select('views')
      .eq('id', newsId)
      .single()
    
    if (error) {
      console.error('Error fetching views:', error)
      return NextResponse.json(
        { error: 'Failed to fetch view count' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ views: data?.views || 0 })
    
  } catch (error) {
    console.error('Unexpected error fetching views:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}