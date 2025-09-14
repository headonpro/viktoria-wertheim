import { Metadata } from 'next';
import MemberForm from '@/components/admin/forms/MemberForm';

export const metadata: Metadata = {
  title: 'Neues Mitglied | Admin Dashboard',
  description: 'Neues Vereinsmitglied registrieren',
};

export default function NewMemberPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Neues Mitglied registrieren</h1>
        <p className="text-muted-foreground">
          Fügen Sie ein neues Mitglied zum Verein hinzu
        </p>
      </div>

      <MemberForm />
    </div>
  );
}