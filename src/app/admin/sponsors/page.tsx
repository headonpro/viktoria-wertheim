'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import SponsorCard, { type Sponsor } from '@/components/admin/sponsors/SponsorCard';
import SponsorForm from '@/components/admin/sponsors/SponsorForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconPlus, IconCoin, IconTrophy, IconUsers, IconHeart } from '@tabler/icons-react';
import { toast } from 'sonner';


const categoryOrder = ['Hauptsponsor', 'Premium Partner', 'Partner', 'Förderer'];

const categoryIcons = {
  'Hauptsponsor': IconTrophy,
  'Premium Partner': IconCoin,
  'Partner': IconUsers,
  'Förderer': IconHeart,
};

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [deletingSponsor, setDeletingSponsor] = useState<Sponsor | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadSponsors();
  }, []);

  const loadSponsors = async () => {
    setLoading(true);

    try {
      // Fetch sponsors directly from Supabase
      const supabase = createClient();
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('sort_order')
        .order('name');

      if (error) {
        throw new Error('Failed to fetch sponsors');
      }

      setSponsors((data || []).map(sponsor => ({
        ...sponsor,
        is_active: sponsor.is_active ?? false,
        created_at: sponsor.created_at ?? undefined,
        updated_at: sponsor.updated_at ?? undefined
      })));
    } catch (error: any) {
      console.error('Error loading sponsors:', error);
      toast.error('Fehler beim Laden der Sponsoren', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (sponsor: Sponsor) => {
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('sponsors')
        .update({
          is_active: !sponsor.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sponsor.id);

      if (error) throw error;

      setSponsors(prev =>
        prev.map(s =>
          s.id === sponsor.id ? { ...s, is_active: !s.is_active } : s
        )
      );

      toast.success(
        sponsor.is_active ? 'Sponsor deaktiviert' : 'Sponsor aktiviert'
      );
    } catch (error: any) {
      console.error('Error toggling sponsor:', error);
      toast.error('Fehler beim Ändern des Status', {
        description: error.message,
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingSponsor) return;

    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('sponsors')
        .delete()
        .eq('id', deletingSponsor.id);

      if (error) throw error;

      setSponsors(prev => prev.filter(s => s.id !== deletingSponsor.id));
      toast.success('Sponsor gelöscht');
      setDeletingSponsor(null);
    } catch (error: any) {
      console.error('Error deleting sponsor:', error);
      toast.error('Fehler beim Löschen', {
        description: error.message,
      });
    }
  };

  const handleEdit = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setIsDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setEditingSponsor(null);
    loadSponsors();
  };

  // Group sponsors by category
  const groupedSponsors = sponsors.reduce((acc, sponsor) => {
    const category = sponsor.category || 'Andere';
    if (!acc[category]) acc[category] = [];
    acc[category].push(sponsor);
    return acc;
  }, {} as Record<string, Sponsor[]>);

  // Filter sponsors for tabs
  const getFilteredSponsors = () => {
    if (activeTab === 'all') return sponsors;
    if (activeTab === 'active') return sponsors.filter(s => s.is_active);
    if (activeTab === 'inactive') return sponsors.filter(s => !s.is_active);
    return sponsors;
  };

  const filteredSponsors = getFilteredSponsors();
  const filteredGroupedSponsors = filteredSponsors.reduce((acc, sponsor) => {
    const category = sponsor.category || 'Andere';
    if (!acc[category]) acc[category] = [];
    acc[category].push(sponsor);
    return acc;
  }, {} as Record<string, Sponsor[]>);

  // Statistics
  const stats = {
    total: sponsors.length,
    active: sponsors.filter(s => s.is_active).length,
    hauptsponsor: sponsors.filter(s => s.category === 'Hauptsponsor').length,
    premium: sponsors.filter(s => s.category === 'Premium Partner').length,
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Lade Sponsoren...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sponsoren verwalten</h1>
          <p className="text-muted-foreground">
            Verwalten Sie alle Sponsoren und Partner des Vereins
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <IconPlus className="h-4 w-4 mr-2" />
          Neuer Sponsor
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Sponsoren</CardTitle>
            <IconCoin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} aktiv
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hauptsponsoren</CardTitle>
            <IconTrophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hauptsponsor}</div>
            <p className="text-xs text-muted-foreground">
              Höchste Stufe
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Partner</CardTitle>
            <IconCoin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.premium}</div>
            <p className="text-xs text-muted-foreground">
              Premium Stufe
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Sponsoren</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Auf Website sichtbar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sponsors Grid with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Alle Sponsoren</CardTitle>
          <CardDescription>
            Sponsoren nach Kategorien gruppiert. Ziehen Sie Karten zum Umsortieren.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                Alle ({sponsors.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Aktive ({stats.active})
              </TabsTrigger>
              <TabsTrigger value="inactive">
                Inaktive ({sponsors.length - stats.active})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              {categoryOrder.map(category => {
                const categorySponsors = filteredGroupedSponsors[category];
                if (!categorySponsors || categorySponsors.length === 0) return null;

                const Icon = categoryIcons[category as keyof typeof categoryIcons] || IconCoin;

                return (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-4">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">{category}</h3>
                      <Badge variant="secondary">
                        {categorySponsors.length}
                      </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {categorySponsors.map(sponsor => (
                        <SponsorCard
                          key={sponsor.id}
                          sponsor={sponsor}
                          onEdit={handleEdit}
                          onDelete={setDeletingSponsor}
                          onToggleActive={handleToggleActive}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {filteredSponsors.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  Keine Sponsoren in dieser Kategorie gefunden.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSponsor ? 'Sponsor bearbeiten' : 'Neuer Sponsor'}
            </DialogTitle>
            <DialogDescription>
              {editingSponsor
                ? 'Bearbeiten Sie die Informationen des Sponsors'
                : 'Fügen Sie einen neuen Sponsor hinzu'}
            </DialogDescription>
          </DialogHeader>
          <SponsorForm
            initialData={editingSponsor ? {
              ...editingSponsor,
              logo_url: editingSponsor.logo_url || '',
              website: editingSponsor.website || '',
              category: editingSponsor.category as 'Hauptsponsor' | 'Premium Partner' | 'Partner' | 'Förderer',
              description: editingSponsor.description || ''
            } : undefined}
            sponsorId={editingSponsor?.id}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingSponsor(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingSponsor}
        onOpenChange={() => setDeletingSponsor(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sponsor löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie den Sponsor "{deletingSponsor?.name}" wirklich löschen?
              Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}