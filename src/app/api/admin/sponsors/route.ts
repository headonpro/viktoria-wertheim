import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Use service client to bypass RLS for admin operations
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .order('category, name'); // Combined order in single call

    if (error) {
      console.error('Error fetching sponsors:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}