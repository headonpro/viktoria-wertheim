import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/server';
import MemberForm from '@/components/admin/forms/MemberForm';

export const metadata: Metadata = {
  title: 'Mitglied bearbeiten | Admin Dashboard',
  description: 'Bearbeiten Sie die Mitgliedsdaten',
};

interface EditMemberPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditMemberPage({ params }: EditMemberPageProps) {
  const { id } = await params;

  // Use service client for admin operations to bypass RLS
  const supabase = createServiceClient();

  const { data: member, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !member) {
    notFound();
  }

  // Convert the member data to the format expected by MemberForm
  const formattedData = {
    member_number: member.member_number || '',
    first_name: member.first_name || '',
    last_name: member.last_name || '',
    email: member.email || '',
    phone: member.phone || '',
    date_of_birth: member.date_of_birth || '',
    joined_date: member.joined_date || '',
    membership_type: (member.membership_type as 'active' | 'passive' | 'youth' | 'honorary' | 'suspended') || 'active',
    membership_status: (member.membership_status as 'active' | 'inactive' | 'pending') || 'active',
    street: member.street || '',
    house_number: member.house_number || '',
    postal_code: member.postal_code || '',
    city: member.city || '',
    country: member.country || 'Deutschland',
    notes: member.notes || '',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mitglied bearbeiten
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Bearbeiten Sie die Daten von {member.first_name} {member.last_name}
        </p>
      </div>

      {/* Member Form */}
      <MemberForm initialData={formattedData} memberId={id} />
    </div>
  );
}