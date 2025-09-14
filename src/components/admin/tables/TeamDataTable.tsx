'use client';

import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { IconDots, IconEdit, IconTrash, IconEye, IconUsers, IconSearch, IconPlus, IconDownload } from '@tabler/icons-react';
import { toast } from 'sonner';
import { exportData, formatDataForExport } from '@/lib/utils/export';

interface Player {
  id: string;
  name: string;
  position: string | null;
  number: number | null;
  is_captain: boolean;
}

interface Team {
  id: string;
  name: string;
  short_name: string | null;
  league: string | null;
  team_type: string | null;
  is_own_team: boolean;
  coach: string | null;
  captain: string | null;
  created_at: string;
  updated_at: string;
  players?: Player[];
  player_count?: number;
}

interface TeamDataTableProps {
  teams: Team[];
}

const teamTypeConfig = {
  first: {
    label: '1. Mannschaft',
    variant: 'default' as const,
  },
  second: {
    label: '2. Mannschaft',
    variant: 'secondary' as const,
  },
  third: {
    label: '3. Mannschaft',
    variant: 'outline' as const,
  },
  youth: {
    label: 'Jugend',
    variant: 'destructive' as const,
  },
};

export default function TeamDataTable({ teams: initialTeams }: TeamDataTableProps) {
  const router = useRouter();
  const [teams, setTeams] = useState(initialTeams);
  const [filteredTeams, setFilteredTeams] = useState(initialTeams);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'own' | 'opponent'>('all');
  const [teamTypeFilter, setTeamTypeFilter] = useState<string>('all');

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const supabase = createClient();

    try {
      // First check if team has players
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('id')
        .eq('team_id', deleteId)
        .limit(1);

      if (playersError) throw playersError;

      if (players && players.length > 0) {
        toast.error('Team kann nicht gelöscht werden', {
          description: 'Das Team hat noch Spieler. Bitte erst alle Spieler entfernen oder zu anderen Teams verschieben.',
        });
        setIsDeleting(false);
        setDeleteId(null);
        return;
      }

      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setTeams(prev => prev.filter(team => team.id !== deleteId));
      setFilteredTeams(prev => prev.filter(team => team.id !== deleteId));

      toast.success('Team gelöscht', {
        description: 'Das Team wurde erfolgreich gelöscht.',
      });
    } catch (error: any) {
      console.error('Error deleting team:', error);
      toast.error('Fehler beim Löschen', {
        description: error.message || 'Das Team konnte nicht gelöscht werden.',
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Filter teams based on search and filters
  const applyFilters = () => {
    let filtered = [...teams];

    // Apply ownership filter
    if (filterType === 'own') {
      filtered = filtered.filter(team => team.is_own_team);
    } else if (filterType === 'opponent') {
      filtered = filtered.filter(team => !team.is_own_team);
    }

    // Apply team type filter
    if (teamTypeFilter !== 'all') {
      filtered = filtered.filter(team => team.team_type === teamTypeFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.league?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.coach?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTeams(filtered);
  };

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterType, teamTypeFilter]);

  // Export teams
  const handleExport = (format: 'csv' | 'xlsx' | 'json' = 'xlsx') => {
    const dataToExport = filteredTeams.map(team => ({
      Name: team.name,
      Kurzname: team.short_name || '',
      Liga: team.league || '',
      Typ: team.team_type || '',
      Trainer: team.coach || '',
      Kapitän: team.captain || '',
      'Eigenes Team': team.is_own_team ? 'Ja' : 'Nein',
      'Anzahl Spieler': team.player_count || 0,
    }));

    exportData(dataToExport, {
      filename: `teams-${new Date().toISOString().split('T')[0]}`,
      format,
    });

    toast.success('Export erfolgreich', {
      description: `${filteredTeams.length} Teams exportiert`,
    });
  };

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Team, Liga oder Trainer suchen..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                applyFilters();
              }}
              className="pl-10"
            />
          </div>

          <Select
            value={filterType}
            onValueChange={(value: 'all' | 'own' | 'opponent') => {
              setFilterType(value);
              applyFilters();
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Alle Teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Teams</SelectItem>
              <SelectItem value="own">Eigene Teams</SelectItem>
              <SelectItem value="opponent">Gegner Teams</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={teamTypeFilter}
            onValueChange={(value) => {
              setTeamTypeFilter(value);
              applyFilters();
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Team-Typ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Typen</SelectItem>
              <SelectItem value="first">1. Mannschaft</SelectItem>
              <SelectItem value="second">2. Mannschaft</SelectItem>
              <SelectItem value="third">3. Mannschaft</SelectItem>
              <SelectItem value="youth">Jugend</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => handleExport('xlsx')}
            className="whitespace-nowrap"
          >
            <IconDownload className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button
            onClick={() => router.push('/admin/teams/new')}
            className="whitespace-nowrap"
          >
            <IconPlus className="h-4 w-4 mr-2" />
            Neues Team
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          {filteredTeams.length} von {teams.length} Teams
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team</TableHead>
              <TableHead>Liga</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Trainer</TableHead>
              <TableHead className="text-center">
                <IconUsers className="h-4 w-4 mx-auto" />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Keine Teams gefunden.
                </TableCell>
              </TableRow>
            ) : (
              filteredTeams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{team.name}</div>
                      {team.short_name && (
                        <div className="text-xs text-muted-foreground">
                          {team.short_name}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{team.league || '-'}</TableCell>
                  <TableCell>
                    {team.team_type && teamTypeConfig[team.team_type as keyof typeof teamTypeConfig] ? (
                      <Badge variant={teamTypeConfig[team.team_type as keyof typeof teamTypeConfig].variant}>
                        {teamTypeConfig[team.team_type as keyof typeof teamTypeConfig].label}
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>{team.coach || '-'}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">
                      {team.player_count || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={team.is_own_team ? 'default' : 'secondary'}>
                      {team.is_own_team ? 'Eigenes Team' : 'Gegner'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Menü öffnen</span>
                          <IconDots className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/teams/${team.id}`)}
                        >
                          <IconEye className="mr-2 h-4 w-4" />
                          Anzeigen
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/teams/${team.id}/edit`)}
                        >
                          <IconEdit className="mr-2 h-4 w-4" />
                          Bearbeiten
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteId(team.id)}
                          className="text-red-600"
                        >
                          <IconTrash className="mr-2 h-4 w-4" />
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Team löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Das Team wird
              dauerhaft aus der Datenbank gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Wird gelöscht...' : 'Löschen'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}