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
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  IconDots,
  IconTrash,
  IconMail,
  IconSearch,
  IconDownload,
  IconUserX,
  IconUserCheck
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { toast } from 'sonner';

interface Subscriber {
  id: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

interface SubscriberTableProps {
  subscribers: Subscriber[];
  onRefresh?: () => void;
}

export default function SubscriberTable({ subscribers: initialSubscribers, onRefresh }: SubscriberTableProps) {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [filteredSubscribers, setFilteredSubscribers] = useState(initialSubscribers);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteIds, setDeleteIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Filter subscribers based on search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = subscribers.filter(sub =>
      sub.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredSubscribers(filtered);
  };

  // Toggle selection
  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  // Toggle all selections
  const toggleAllSelection = () => {
    if (selectedIds.size === filteredSubscribers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSubscribers.map(s => s.id)));
    }
  };

  // Handle unsubscribe
  const handleUnsubscribe = async (ids: string[]) => {
    setActionLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({
          is_active: false,
          unsubscribed_at: new Date().toISOString()
        })
        .in('id', ids);

      if (error) throw error;

      setSubscribers(prev =>
        prev.map(sub =>
          ids.includes(sub.id)
            ? { ...sub, is_active: false, unsubscribed_at: new Date().toISOString() }
            : sub
        )
      );

      setFilteredSubscribers(prev =>
        prev.map(sub =>
          ids.includes(sub.id)
            ? { ...sub, is_active: false, unsubscribed_at: new Date().toISOString() }
            : sub
        )
      );

      toast.success(`${ids.length} Abonnent(en) abgemeldet`);
      setSelectedIds(new Set());
    } catch (error: any) {
      console.error('Error unsubscribing:', error);
      toast.error('Fehler beim Abmelden', {
        description: error.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle resubscribe
  const handleResubscribe = async (ids: string[]) => {
    setActionLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({
          is_active: true,
          unsubscribed_at: null
        })
        .in('id', ids);

      if (error) throw error;

      setSubscribers(prev =>
        prev.map(sub =>
          ids.includes(sub.id)
            ? { ...sub, is_active: true, unsubscribed_at: null }
            : sub
        )
      );

      setFilteredSubscribers(prev =>
        prev.map(sub =>
          ids.includes(sub.id)
            ? { ...sub, is_active: true, unsubscribed_at: null }
            : sub
        )
      );

      toast.success(`${ids.length} Abonnent(en) wieder angemeldet`);
      setSelectedIds(new Set());
    } catch (error: any) {
      console.error('Error resubscribing:', error);
      toast.error('Fehler beim Anmelden', {
        description: error.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (deleteIds.length === 0) return;

    setIsDeleting(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .in('id', deleteIds);

      if (error) throw error;

      setSubscribers(prev => prev.filter(sub => !deleteIds.includes(sub.id)));
      setFilteredSubscribers(prev => prev.filter(sub => !deleteIds.includes(sub.id)));

      toast.success(`${deleteIds.length} Abonnent(en) gelöscht`);
      setSelectedIds(new Set());
    } catch (error: any) {
      console.error('Error deleting:', error);
      toast.error('Fehler beim Löschen', {
        description: error.message,
      });
    } finally {
      setIsDeleting(false);
      setDeleteIds([]);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const selected = selectedIds.size > 0
      ? filteredSubscribers.filter(s => selectedIds.has(s.id))
      : filteredSubscribers;

    const csv = [
      ['Email', 'Status', 'Angemeldet am', 'Abgemeldet am'],
      ...selected.map(sub => [
        sub.email,
        sub.is_active ? 'Aktiv' : 'Inaktiv',
        format(new Date(sub.subscribed_at), 'dd.MM.yyyy HH:mm', { locale: de }),
        sub.unsubscribed_at
          ? format(new Date(sub.unsubscribed_at), 'dd.MM.yyyy HH:mm', { locale: de })
          : ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `newsletter-abonnenten-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();

    toast.success(`${selected.length} Abonnenten exportiert`);
  };

  const activeCount = filteredSubscribers.filter(s => s.is_active).length;
  const inactiveCount = filteredSubscribers.filter(s => !s.is_active).length;

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Email-Adresse suchen..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            {selectedIds.size > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const selected = Array.from(selectedIds);
                    const activeSelected = selected.filter(id =>
                      filteredSubscribers.find(s => s.id === id)?.is_active
                    );
                    if (activeSelected.length > 0) {
                      handleUnsubscribe(activeSelected);
                    }
                  }}
                  disabled={actionLoading}
                >
                  <IconUserX className="h-4 w-4 mr-2" />
                  Abmelden ({selectedIds.size})
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const selected = Array.from(selectedIds);
                    const inactiveSelected = selected.filter(id =>
                      !filteredSubscribers.find(s => s.id === id)?.is_active
                    );
                    if (inactiveSelected.length > 0) {
                      handleResubscribe(inactiveSelected);
                    }
                  }}
                  disabled={actionLoading}
                >
                  <IconUserCheck className="h-4 w-4 mr-2" />
                  Anmelden ({selectedIds.size})
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteIds(Array.from(selectedIds))}
                  disabled={actionLoading}
                >
                  <IconTrash className="h-4 w-4 mr-2" />
                  Löschen ({selectedIds.size})
                </Button>
              </>
            )}

            <Button
              variant="outline"
              onClick={exportToCSV}
            >
              <IconDownload className="h-4 w-4 mr-2" />
              CSV Export
            </Button>
          </div>
        </div>

        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{filteredSubscribers.length} Gesamt</span>
          <span className="text-green-600">{activeCount} Aktiv</span>
          <span className="text-gray-500">{inactiveCount} Inaktiv</span>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedIds.size === filteredSubscribers.length && filteredSubscribers.length > 0}
                  onCheckedChange={toggleAllSelection}
                />
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Angemeldet am</TableHead>
              <TableHead>Abgemeldet am</TableHead>
              <TableHead className="w-[100px]">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscribers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Keine Abonnenten gefunden.
                </TableCell>
              </TableRow>
            ) : (
              filteredSubscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(subscriber.id)}
                      onCheckedChange={() => toggleSelection(subscriber.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <IconMail className="h-4 w-4 text-muted-foreground" />
                      {subscriber.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={subscriber.is_active ? 'default' : 'secondary'}>
                      {subscriber.is_active ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(subscriber.subscribed_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                  </TableCell>
                  <TableCell>
                    {subscriber.unsubscribed_at
                      ? format(new Date(subscriber.unsubscribed_at), 'dd.MM.yyyy HH:mm', { locale: de })
                      : '-'}
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
                        {subscriber.is_active ? (
                          <DropdownMenuItem
                            onClick={() => handleUnsubscribe([subscriber.id])}
                          >
                            <IconUserX className="mr-2 h-4 w-4" />
                            Abmelden
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleResubscribe([subscriber.id])}
                          >
                            <IconUserCheck className="mr-2 h-4 w-4" />
                            Wieder anmelden
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteIds([subscriber.id])}
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

      <AlertDialog open={deleteIds.length > 0} onOpenChange={() => setDeleteIds([])}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Abonnenten löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. {deleteIds.length} Abonnent(en)
              werden dauerhaft aus der Datenbank gelöscht.
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