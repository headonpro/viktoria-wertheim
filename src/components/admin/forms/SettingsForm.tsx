'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { toast } from 'sonner';

interface SettingsFormProps {
  type: 'general' | 'email' | 'security';
}

export default function SettingsForm({ type }: SettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate save
    setTimeout(() => {
      toast.success('Einstellungen gespeichert', {
        description: 'Die Änderungen wurden erfolgreich übernommen.',
      });
      setIsSaving(false);
    }, 1000);
  };

  if (type === 'general') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="club-name">Vereinsname</Label>
            <Input
              id="club-name"
              defaultValue="SV Viktoria Wertheim e.V."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="founded">Gründungsjahr</Label>
            <Input
              id="founded"
              defaultValue="1921"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Textarea
            id="address"
            defaultValue="Sportplatz Wertheim&#10;97877 Wertheim"
            rows={3}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+49 ..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              defaultValue="info@sv-viktoria-wertheim.de"
            />
          </div>
        </div>

        <Button type="submit" disabled={isSaving}>
          <IconDeviceFloppy className="h-4 w-4 mr-2" />
          {isSaving ? 'Wird gespeichert...' : 'Speichern'}
        </Button>
      </form>
    );
  }

  if (type === 'email') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="smtp-host">SMTP Server</Label>
            <Input
              id="smtp-host"
              defaultValue="smtp.gmail.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-port">Port</Label>
            <Input
              id="smtp-port"
              type="number"
              defaultValue="587"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="smtp-user">Benutzername</Label>
            <Input
              id="smtp-user"
              type="email"
              placeholder="email@gmail.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtp-pass">Passwort</Label>
            <Input
              id="smtp-pass"
              type="password"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="smtp-tls" defaultChecked />
          <Label htmlFor="smtp-tls">TLS/STARTTLS verwenden</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="from-email">Absender-Adresse</Label>
          <Input
            id="from-email"
            type="email"
            defaultValue="noreply@sv-viktoria-wertheim.de"
          />
        </div>

        <Button type="submit" disabled={isSaving}>
          <IconDeviceFloppy className="h-4 w-4 mr-2" />
          {isSaving ? 'Wird gespeichert...' : 'Speichern'}
        </Button>
      </form>
    );
  }

  return null;
}