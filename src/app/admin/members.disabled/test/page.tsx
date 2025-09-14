import { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Test Members Page',
  description: 'Testing members fetch',
};

export default async function TestMembersPage() {
  try {
    // Use service client for admin operations to bypass RLS
    const supabase = createServiceClient();

    console.log('Test: Service client created');

    // Simple fetch without any order
    const { data, error } = await supabase
      .from('members')
      .select('*');

    console.log('Test result:', {
      hasData: !!data,
      dataLength: data?.length,
      error: error?.message || 'none'
    });

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Test Members Page</h1>
        <div className="bg-white p-4 rounded shadow">
          <p>Members found: {data?.length || 0}</p>
          {error && <p className="text-red-500">Error: {JSON.stringify(error)}</p>}
          {data && (
            <ul className="mt-4">
              {data.map(member => (
                <li key={member.id}>
                  {member.first_name} {member.last_name} - {member.email}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  } catch (e: any) {
    console.error('Caught error:', e);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Test Members Page - Error</h1>
        <div className="bg-red-100 p-4 rounded">
          <p>Caught error: {e.message}</p>
        </div>
      </div>
    );
  }
}