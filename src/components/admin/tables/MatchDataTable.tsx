'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { IconDots, IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { toast } from 'sonner';

interface Match {
  id: string;
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  match_date: string;
  match_time: string | null;
  location: string | null;
  match_type: string | null;
  status: string | null;
  season: string | null;
}

interface MatchDataTableProps {
  matches: Match[];
}

const statusConfig = {
  scheduled: {
    label: 'Geplant',
    variant: 'secondary' as const,
  },
  live: {
    label: 'Live',
    variant: 'destructive' as const,
  },
  completed: {
    label: 'Beendet',
    variant: 'default' as const,
  },
  cancelled: {
    label: 'Abgesagt',
    variant: 'outline' as const,
  },
};

const matchTypeConfig = {
  league: 'Liga',
  cup: 'Pokal',
  friendly: 'Freundschaftsspiel',
  tournament: 'Turnier',
};

export default function MatchDataTable({ matches: initialMatches }: MatchDataTableProps) {
  const router = useRouter();
  const [matches, setMatches] = useState(initialMatches);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setMatches(matches.filter(m => m.id !== deleteId));
      toast.success('Spiel erfolgreich gelöscht');
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting match:', error);
      toast.error('Fehler beim Löschen des Spiels');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatMatchDate = (date: string) => {
    return format(new Date(date), 'dd.MM.yyyy', { locale: de });
  };

  const formatMatchTime = (time: string | null) => {
    if (!time) return '-';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const getMatchResult = (match: Match) => {
    if (match.status !== 'completed' || match.home_score === null || match.away_score === null) {
      return '-:-';
    }
    return `${match.home_score}:${match.away_score}`;
  };

  return (
    <>
      <div className="rounded-md border bg-white dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum</TableHead>
              <TableHead>Zeit</TableHead>
              <TableHead>Heimmannschaft</TableHead>
              <TableHead>Gastmannschaft</TableHead>
              <TableHead className="text-center">Ergebnis</TableHead>
              <TableHead>Ort</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.length > 0 ? (
              matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell className="font-medium">
                    {formatMatchDate(match.match_date)}
                  </TableCell>
                  <TableCell>{formatMatchTime(match.match_time)}</TableCell>
                  <TableCell className="font-medium">{match.home_team}</TableCell>
                  <TableCell className="font-medium">{match.away_team}</TableCell>
                  <TableCell className="text-center font-bold">
                    {getMatchResult(match)}
                  </TableCell>
                  <TableCell>{match.location || '-'}</TableCell>
                  <TableCell>
                    {match.match_type
                      ? matchTypeConfig[match.match_type as keyof typeof matchTypeConfig] || match.match_type
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {match.status && statusConfig[match.status as keyof typeof statusConfig] ? (
                      <Badge variant={statusConfig[match.status as keyof typeof statusConfig].variant}>
                        {statusConfig[match.status as keyof typeof statusConfig].label}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Unbekannt</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <IconDots className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => router.push(`/matches/${match.id}`)}
                        >
                          <IconEye className="w-4 h-4 mr-2" />
                          Ansehen
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/matches/${match.id}`)}
                        >
                          <IconEdit className="w-4 h-4 mr-2" />
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(match.id)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <IconTrash className="w-4 h-4 mr-2" />
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  Keine Spiele vorhanden
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Spiel löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie dieses Spiel löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Löschen...' : 'Löschen'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}