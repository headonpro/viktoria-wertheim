'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
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
  IconDots,
  IconEdit,
  IconTrash,
  IconEye,
  IconEyeOff,
  IconExternalLink,
  IconGripVertical,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

export interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  category: string | null;
  description: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface SponsorCardProps {
  sponsor: Sponsor;
  onEdit: (sponsor: Sponsor) => void;
  onDelete: (sponsor: Sponsor) => void;
  onToggleActive: (sponsor: Sponsor) => void;
  isDragging?: boolean;
}

const categoryConfig = {
  'Hauptsponsor': {
    badge: 'default' as const,
    label: 'Hauptsponsor',
    priority: 1,
  },
  'Premium Partner': {
    badge: 'destructive' as const,
    label: 'Premium Partner',
    priority: 2,
  },
  'Partner': {
    badge: 'secondary' as const,
    label: 'Partner',
    priority: 3,
  },
  'Förderer': {
    badge: 'outline' as const,
    label: 'Förderer',
    priority: 4,
  },
};

export default function SponsorCard({
  sponsor,
  onEdit,
  onDelete,
  onToggleActive,
  isDragging = false,
}: SponsorCardProps) {
  const [imageError, setImageError] = useState(false);
  const categoryInfo = sponsor.category ? categoryConfig[sponsor.category as keyof typeof categoryConfig] : null;

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all',
        isDragging && 'opacity-50 scale-95',
        !sponsor.is_active && 'opacity-60'
      )}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 left-2 cursor-move opacity-50 hover:opacity-100 transition-opacity">
        <IconGripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Dropdown Menu */}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <IconDots className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(sponsor)}>
              <IconEdit className="mr-2 h-4 w-4" />
              Bearbeiten
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleActive(sponsor)}>
              {sponsor.is_active ? (
                <>
                  <IconEyeOff className="mr-2 h-4 w-4" />
                  Deaktivieren
                </>
              ) : (
                <>
                  <IconEye className="mr-2 h-4 w-4" />
                  Aktivieren
                </>
              )}
            </DropdownMenuItem>
            {sponsor.website && (
              <DropdownMenuItem asChild>
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <IconExternalLink className="mr-2 h-4 w-4" />
                  Website besuchen
                </a>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(sponsor)}
              className="text-red-600"
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Löschen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardHeader className="pb-3">
        {categoryInfo && (
          <Badge variant={categoryInfo.badge} className="mb-2 w-fit">
            {categoryInfo.label}
          </Badge>
        )}
        <div className="font-semibold text-lg truncate pr-8">
          {sponsor.name}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Logo Display */}
        <div className="relative w-full h-32 bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
          {sponsor.logo_url && !imageError ? (
            <img
              src={sponsor.logo_url}
              alt={`${sponsor.name} Logo`}
              className="max-w-full max-h-full object-contain p-2"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="text-center text-muted-foreground">
              <div className="text-3xl font-bold mb-1">
                {sponsor.name.charAt(0)}
              </div>
              <div className="text-xs">Kein Logo</div>
            </div>
          )}
        </div>

        {/* Description */}
        {sponsor.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {sponsor.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <Badge variant={sponsor.is_active ? 'default' : 'secondary'} className="text-xs">
            {sponsor.is_active ? 'Aktiv' : 'Inaktiv'}
          </Badge>
          {sponsor.website && (
            <a
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Website
              <IconExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}