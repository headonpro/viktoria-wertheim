import { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase/server';
import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import RecentActivity from '@/components/admin/dashboard/RecentActivity';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import SystemHealth from '@/components/admin/dashboard/SystemHealth';

export const metadata: Metadata = {
  title: 'Admin Dashboard | SV Viktoria Wertheim',
  description: 'Verwaltung und Übersicht des SV Viktoria Wertheim',
};

export default async function AdminDashboard() {
  // Use service client for admin operations to bypass RLS
  const supabase = createServiceClient();

  // Fetch dashboard data
  const [
    { count: newsCount },
    { count: matchesCount },
    { count: teamsCount },
    { count: newsletterCount }
  ] = await Promise.all([
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('matches').select('*', { count: 'exact', head: true }),
    supabase.from('teams').select('*', { count: 'exact', head: true }),
    supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true })
  ]);

  const stats = {
    news: newsCount || 0,
    matches: matchesCount || 0,
    members: newsletterCount || 0,
    teams: teamsCount || 0
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard Übersicht
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Willkommen im Administrationsbereich von SV Viktoria Wertheim
        </p>
      </div>

      {/* Stats Grid */}
      <DashboardStats stats={stats} />

      {/* Activity and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <QuickActions />
          <SystemHealth />
        </div>
      </div>
    </div>
  );
}