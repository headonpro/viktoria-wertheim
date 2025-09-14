import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import AdminHeader from '@/components/admin/layout/AdminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log('[Admin Layout] No user found, redirecting to login');
    redirect('/auth/login');
  }

  console.log('[Admin Layout] User found:', user.email);

  // Check if user has admin role in profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  console.log('[Admin Layout] Profile check:', { profile, error: profileError });

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    // Fallback: Check admin emails for initial setup
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    console.log('[Admin Layout] Admin emails:', adminEmails);
    console.log('[Admin Layout] User email:', user.email);

    if (!adminEmails.includes(user.email || '')) {
      console.log('[Admin Layout] User not in admin emails, redirecting to home');
      redirect('/');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <AdminHeader user={user} />

          {/* Main content area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-6 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}