import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

export default async function DebugMembersPage() {
  // Direct test with service role key
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Debug info available in rendered output below

  // Test 1: Service Client
  const serviceClient = createSupabaseClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  const { data: serviceData, error: serviceError } = await serviceClient
    .from('members')
    .select('*');

  // Test 2: Anon Client
  const anonClient = createSupabaseClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  const { data: anonData, error: anonError } = await anonClient
    .from('members')
    .select('*');

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Debug Members Page</h1>

      <div className="bg-blue-100 p-4 rounded">
        <h2 className="font-bold">Service Client Result:</h2>
        <p>Data count: {serviceData?.length || 0}</p>
        <p>Error: {serviceError ? JSON.stringify(serviceError) : 'none'}</p>
      </div>

      <div className="bg-green-100 p-4 rounded">
        <h2 className="font-bold">Anon Client Result:</h2>
        <p>Data count: {anonData?.length || 0}</p>
        <p>Error: {anonError ? JSON.stringify(anonError) : 'none'}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold">Environment Check:</h2>
        <p>URL exists: {!!supabaseUrl ? 'Yes' : 'No'}</p>
        <p>Service Key exists: {!!supabaseServiceKey ? 'Yes' : 'No'}</p>
        <p>Service Key length: {supabaseServiceKey?.length || 0}</p>
      </div>
    </div>
  );
}