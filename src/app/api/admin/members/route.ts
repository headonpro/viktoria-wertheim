import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Use service client to bypass RLS for admin operations
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('last_name', { ascending: true });

    if (error) {
      console.error('API: Error fetching members:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('API: Members fetched:', data?.length || 0);
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('API: Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}