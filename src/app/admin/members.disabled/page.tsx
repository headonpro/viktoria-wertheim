import { Metadata } from 'next';
import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
// import MemberDataTable from '@/components/admin/tables/MemberDataTable';

export const metadata: Metadata = {
  title: 'Mitglieder verwalten | Admin Dashboard',
  description: 'Verwalten Sie alle Vereinsmitglieder',
};

export default async function MembersPage() {
  // Use service client for admin operations to bypass RLS
  const supabase = createServiceClient();

  const { data: members, error } = await supabase
    .from('members')
    .select('*')
    .order('last_name', { ascending: true });

  if (error) {
    console.error('Error fetching members:', error);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mitglieder verwalten
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Verwalten Sie alle Vereinsmitglieder
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/admin/members/new">
            <Button>
              <IconPlus className="w-4 h-4 mr-2" />
              Neues Mitglied
            </Button>
          </Link>
        </div>
      </div>

      {/* Members Table */}
      {/* <MemberDataTable members={members || []} /> */}
      <div>Members-Tabelle temporär deaktiviert</div>
    </div>
  );
}