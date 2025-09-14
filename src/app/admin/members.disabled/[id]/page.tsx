import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import MemberForm from '@/components/admin/forms/MemberForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  IconUser,
  IconMail,
  IconPhone,
  IconHome,
  IconCalendar,
  IconEdit,
  IconArrowLeft
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export const metadata: Metadata = {
  title: 'Mitglied Details | Admin Dashboard',
  description: 'Mitgliederdetails anzeigen und bearbeiten',
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const membershipTypeLabels = {
  active: 'Aktiv',
  passive: 'Passiv',
  youth: 'Jugend',
  honorary: 'Ehrenmitglied',
  suspended: 'Gesperrt',
};

const statusLabels = {
  active: 'Aktiv',
  inactive: 'Inaktiv',
  pending: 'Ausstehend',
};

export default async function MemberDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServiceClient();

  // Fetch member details
  const { data: member, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !member) {
    notFound();
  }

  // Calculate age
  const calculateAge = () => {
    if (!member.date_of_birth) return null;
    const today = new Date();
    const birthDate = new Date(member.date_of_birth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge();

  // Calculate membership duration
  const calculateMembershipDuration = () => {
    if (!member.joined_date) return null;
    const today = new Date();
    const joinedDate = new Date(member.joined_date);
    const years = today.getFullYear() - joinedDate.getFullYear();
    const months = today.getMonth() - joinedDate.getMonth();

    if (years === 0) {
      return `${months} Monat${months !== 1 ? 'e' : ''}`;
    } else if (months < 0) {
      return `${years - 1} Jahr${years - 1 !== 1 ? 'e' : ''}`;
    } else {
      return `${years} Jahr${years !== 1 ? 'e' : ''}`;
    }
  };

  const membershipDuration = calculateMembershipDuration();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {member.first_name} {member.last_name}
          </h1>
          <p className="text-muted-foreground">
            Mitgliedsnummer: {member.member_number || 'Nicht vergeben'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/members">
            <Button variant="outline">
              <IconArrowLeft className="h-4 w-4 mr-2" />
              Zurück
            </Button>
          </Link>
          <Link href={`/admin/members/${id}/edit`}>
            <Button>
              <IconEdit className="h-4 w-4 mr-2" />
              Bearbeiten
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="edit">Bearbeiten</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Status Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Mitgliedschaft</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant={member.membership_type === 'honorary' ? 'destructive' : 'default'}>
                    {membershipTypeLabels[member.membership_type as keyof typeof membershipTypeLabels] || member.membership_type}
                  </Badge>
                  <Badge variant={member.membership_status === 'active' ? 'default' : 'secondary'}>
                    {statusLabels[member.membership_status as keyof typeof statusLabels] || member.membership_status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Mitglied seit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {member.joined_date
                    ? format(new Date(member.joined_date), 'dd.MM.yyyy', { locale: de })
                    : 'Nicht angegeben'}
                </div>
                {membershipDuration && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {membershipDuration} im Verein
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Alter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {age ? `${age} Jahre` : 'Nicht angegeben'}
                </div>
                {member.date_of_birth && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Geboren am {format(new Date(member.date_of_birth), 'dd.MM.yyyy', { locale: de })}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUser className="h-5 w-5" />
                Kontaktinformationen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <IconMail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">E-Mail</p>
                    <p className="text-sm text-muted-foreground">
                      {member.email || 'Nicht angegeben'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <IconPhone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Telefon</p>
                    <p className="text-sm text-muted-foreground">
                      {member.phone || 'Nicht angegeben'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <IconHome className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Adresse</p>
                  <p className="text-sm text-muted-foreground">
                    {member.street && member.house_number
                      ? `${member.street} ${member.house_number}`
                      : 'Straße nicht angegeben'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.postal_code && member.city
                      ? `${member.postal_code} ${member.city}`
                      : 'Ort nicht angegeben'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.country || 'Deutschland'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {member.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notizen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{member.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Meta Information */}
          <Card>
            <CardHeader>
              <CardTitle>System-Informationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Erstellt am:</span>
                <span>
                  {(member as any).created_at ? format(new Date((member as any).created_at), 'dd.MM.yyyy HH:mm', { locale: de }) : 'Unbekannt'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Aktualisiert am:</span>
                <span>
                  {(member as any).updated_at ? format(new Date((member as any).updated_at), 'dd.MM.yyyy HH:mm', { locale: de }) : 'Unbekannt'}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit" className="space-y-4">
          <MemberForm
            initialData={{
              member_number: member.member_number || '',
              first_name: member.first_name,
              last_name: member.last_name,
              email: member.email || '',
              phone: member.phone || '',
              date_of_birth: member.date_of_birth || '',
              joined_date: member.joined_date || '',
              membership_type: member.membership_type as any || 'active',
              membership_status: member.membership_status as any || 'active',
              street: member.street || '',
              house_number: member.house_number || '',
              postal_code: member.postal_code || '',
              city: member.city || '',
              country: member.country || 'Deutschland',
              notes: member.notes || '',
            }}
            memberId={id}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}