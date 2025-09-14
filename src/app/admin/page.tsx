import { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase/server';
import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import RecentActivity from '@/components/admin/dashboard/RecentActivity';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import SystemHealth from '@/components/admin/dashboard/SystemHealth';
import AttendanceChart from '@/components/admin/charts/AttendanceChart';
import RevenueChart from '@/components/admin/charts/RevenueChart';

// Helper function to process monthly data
function processMonthlyData(matches: any[]) {
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  const monthlyStats: any = {};

  matches.forEach(match => {
    if (!match.match_date) return;
    const date = new Date(match.match_date);
    const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;

    if (!monthlyStats[monthKey]) {
      monthlyStats[monthKey] = {
        month: monthKey,
        wins: 0,
        losses: 0,
        draws: 0,
        total: 0
      };
    }

    monthlyStats[monthKey].total++;

    if (match.status === 'completed' && match.home_score !== null && match.away_score !== null) {
      if (match.home_score > match.away_score) {
        monthlyStats[monthKey].wins++;
      } else if (match.home_score < match.away_score) {
        monthlyStats[monthKey].losses++;
      } else {
        monthlyStats[monthKey].draws++;
      }
    }
  });

  return Object.values(monthlyStats);
}

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
    { count: newsletterCount },
    { data: recentMatches },
    { data: monthlyStats }
  ] = await Promise.all([
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('matches').select('*', { count: 'exact', head: true }),
    supabase.from('teams').select('*', { count: 'exact', head: true }),
    supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
    // Get recent matches for attendance data
    supabase
      .from('matches')
      .select('*')
      .eq('status', 'completed')
      .order('match_date', { ascending: false })
      .limit(10),
    // Get monthly match stats
    supabase
      .from('matches')
      .select('match_date, home_score, away_score, status')
      .gte('match_date', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString())
      .order('match_date', { ascending: true })
  ]);

  const stats = {
    news: newsCount || 0,
    matches: matchesCount || 0,
    members: newsletterCount || 0,
    teams: teamsCount || 0
  };

  // Prepare chart data
  const attendanceData = recentMatches?.map(match => ({
    date: match.match_date,
    attendance: Math.floor(Math.random() * 500) + 100, // Placeholder - would come from actual data
    match: `${match.home_team} vs ${match.away_team}`
  })) || [];

  const monthlyData = processMonthlyData(monthlyStats || []);

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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart data={attendanceData} />
        <RevenueChart data={monthlyData} />
      </div>

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