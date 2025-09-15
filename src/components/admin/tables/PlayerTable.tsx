'use client';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { IconEdit, IconTrash, IconPlus, IconCheck, IconX, IconStar } from '@tabler/icons-react';
import { toast } from 'sonner';

interface Player {
  id: string;
  name: string;
  number: number | null;
  position: string | null;
  age: number | null;
  is_captain: boolean;
  is_active: boolean;
}

interface PlayerTableProps {
  teamId: string;
  players: Player[];
  onPlayersChange?: () => void;
}

const positions = [
  { value: 'TW', label: 'Torwart' },
  { value: 'IV', label: 'Innenverteidiger' },
  { value: 'LV', label: 'Linksverteidiger' },
  { value: 'RV', label: 'Rechtsverteidiger' },
  { value: 'DM', label: 'Defensives Mittelfeld' },
  { value: 'ZM', label: 'Zentrales Mittelfeld' },
  { value: 'OM', label: 'Offensives Mittelfeld' },
  { value: 'LM', label: 'Linkes Mittelfeld' },
  { value: 'RM', label: 'Rechtes Mittelfeld' },
  { value: 'ST', label: 'Stürmer' },
  { value: 'LF', label: 'Linksaußen' },
  { value: 'RF', label: 'Rechtsaußen' },
];

export default function PlayerTable({ teamId, players: initialPlayers, onPlayersChange }: PlayerTableProps) {
  const [players, setPlayers] = useState(initialPlayers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Player>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    name: '',
    number: null,
    position: '',
    age: null,
    is_captain: false,
    is_active: true,
  });

  const handleEdit = (player: Player) => {
    setEditingId(player.id);
    setEditForm(player);
  };

  const handleSave = async () => {
    if (!editingId || !editForm) return;

    const supabase = createClient();

    try {
      // If setting as captain, unset other captains first
      if (editForm.is_captain && !players.find(p => p.id === editingId)?.is_captain) {
        await supabase
          .from('players')
          .update({ is_captain: false })
          .eq('team_id', teamId)
          .neq('id', editingId);
      }

      const { error } = await supabase
        .from('players')
        .update({
          name: editForm.name,
          number: editForm.number,
          position: editForm.position,
          age: editForm.age,
          is_captain: editForm.is_captain,
          is_active: editForm.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingId);

      if (error) throw error;

      setPlayers(prev =>
        prev.map(p => (p.id === editingId ? { ...p, ...editForm } : p))
      );

      toast.success('Spieler aktualisiert');
      setEditingId(null);
      setEditForm({});
      onPlayersChange?.();
    } catch (error: any) {
      console.error('Error updating player:', error);
      toast.error('Fehler beim Aktualisieren', {
        description: error.message,
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = async (playerId: string) => {
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId);

      if (error) throw error;

      setPlayers(prev => prev.filter(p => p.id !== playerId));
      toast.success('Spieler entfernt');
      onPlayersChange?.();
    } catch (error: any) {
      console.error('Error deleting player:', error);
      toast.error('Fehler beim Löschen', {
        description: error.message,
      });
    }
  };

  const handleAddPlayer = async () => {
    if (!newPlayer.name) {
      toast.error('Bitte geben Sie einen Namen ein');
      return;
    }

    const supabase = createClient();

    try {
      // If setting as captain, unset other captains first
      if (newPlayer.is_captain) {
        await supabase
          .from('players')
          .update({ is_captain: false })
          .eq('team_id', teamId);
      }

      const { data, error } = await supabase
        .from('players')
        .insert([{
          team_id: teamId,
          name: newPlayer.name,
          number: newPlayer.number,
          position: newPlayer.position,
          age: newPlayer.age,
          is_captain: newPlayer.is_captain,
          is_active: newPlayer.is_active,
        }])
        .select()
        .single();

      if (error) throw error;

      setPlayers(prev => [...prev, {
        ...data,
        is_captain: data.is_captain ?? false,
        is_active: data.is_active ?? true
      }]);
      toast.success('Spieler hinzugefügt');
      setIsAddDialogOpen(false);
      setNewPlayer({
        name: '',
        number: null,
        position: '',
        age: null,
        is_captain: false,
        is_active: true,
      });
      onPlayersChange?.();
    } catch (error: any) {
      console.error('Error adding player:', error);
      toast.error('Fehler beim Hinzufügen', {
        description: error.message,
      });
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Spieler-Kader ({players.length})</h3>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <IconPlus className="h-4 w-4 mr-2" />
                Spieler hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neuen Spieler hinzufügen</DialogTitle>
                <DialogDescription>
                  Fügen Sie einen neuen Spieler zum Team-Kader hinzu
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={newPlayer.name}
                    onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="number" className="text-right">
                    Nummer
                  </Label>
                  <Input
                    id="number"
                    type="number"
                    value={newPlayer.number || ''}
                    onChange={(e) => setNewPlayer({ ...newPlayer, number: e.target.value ? parseInt(e.target.value) : null })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right">
                    Position
                  </Label>
                  <Select
                    value={newPlayer.position || ''}
                    onValueChange={(value) => setNewPlayer({ ...newPlayer, position: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Wählen Sie eine Position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map(pos => (
                        <SelectItem key={pos.value} value={pos.value}>
                          {pos.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="age" className="text-right">
                    Alter
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={newPlayer.age || ''}
                    onChange={(e) => setNewPlayer({ ...newPlayer, age: e.target.value ? parseInt(e.target.value) : null })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="captain" className="text-right">
                    Kapitän
                  </Label>
                  <Switch
                    id="captain"
                    checked={newPlayer.is_captain}
                    onCheckedChange={(checked: boolean) => setNewPlayer({ ...newPlayer, is_captain: checked })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="active" className="text-right">
                    Aktiv
                  </Label>
                  <Switch
                    id="active"
                    checked={newPlayer.is_active}
                    onCheckedChange={(checked: boolean) => setNewPlayer({ ...newPlayer, is_active: checked })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddPlayer}>Spieler hinzufügen</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Nr.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Alter</TableHead>
                <TableHead className="text-center">Kapitän</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-[120px]">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Keine Spieler im Kader. Fügen Sie Spieler hinzu.
                  </TableCell>
                </TableRow>
              ) : (
                players.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>
                      {editingId === player.id ? (
                        <Input
                          type="number"
                          value={editForm.number || ''}
                          onChange={(e) => setEditForm({ ...editForm, number: e.target.value ? parseInt(e.target.value) : null })}
                          className="w-16"
                        />
                      ) : (
                        player.number || '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === player.id ? (
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          {player.name}
                          {player.is_captain && (
                            <IconStar className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === player.id ? (
                        <Select
                          value={editForm.position || ''}
                          onValueChange={(value) => setEditForm({ ...editForm, position: value })}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Position wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            {positions.map(pos => (
                              <SelectItem key={pos.value} value={pos.value}>
                                {pos.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        positions.find(p => p.value === player.position)?.label || player.position || '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === player.id ? (
                        <Input
                          type="number"
                          value={editForm.age || ''}
                          onChange={(e) => setEditForm({ ...editForm, age: e.target.value ? parseInt(e.target.value) : null })}
                          className="w-16"
                        />
                      ) : (
                        player.age || '-'
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {editingId === player.id ? (
                        <Switch
                          checked={editForm.is_captain}
                          onCheckedChange={(checked: boolean) => setEditForm({ ...editForm, is_captain: checked })}
                        />
                      ) : (
                        player.is_captain && <IconStar className="h-4 w-4 mx-auto text-yellow-500 fill-yellow-500" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {editingId === player.id ? (
                        <Switch
                          checked={editForm.is_active}
                          onCheckedChange={(checked: boolean) => setEditForm({ ...editForm, is_active: checked })}
                        />
                      ) : (
                        <Badge variant={player.is_active ? 'default' : 'secondary'}>
                          {player.is_active ? 'Aktiv' : 'Inaktiv'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === player.id ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={handleSave}>
                            <IconCheck className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleCancel}>
                            <IconX className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(player)}>
                            <IconEdit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(player.id)}>
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}