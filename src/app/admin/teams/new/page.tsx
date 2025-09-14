import { Metadata } from 'next';
import TeamForm from '@/components/admin/forms/TeamForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Neues Team erstellen | Admin Dashboard',
  description: 'Erstellen Sie ein neues Team',
};

export default function NewTeamPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Neues Team erstellen</h1>
        <p className="text-muted-foreground">
          Fügen Sie ein neues Team zur Datenbank hinzu
        </p>
      </div>

      <TeamForm />
    </div>
  );
}