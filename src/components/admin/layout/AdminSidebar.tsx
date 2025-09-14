'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  IconDashboard,
  IconNews,
  IconTournament,
  IconUsers,
  IconUsersGroup,
  IconMail,
  IconCoin,
  IconSettings,
  IconChevronLeft,
  IconChevronRight,
  IconLogout
} from '@tabler/icons-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: IconDashboard,
  },
  {
    title: 'Nachrichten',
    href: '/admin/news',
    icon: IconNews,
  },
  {
    title: 'Spiele',
    href: '/admin/matches',
    icon: IconTournament,
  },
  {
    title: 'Teams',
    href: '/admin/teams',
    icon: IconUsersGroup,
  },
  {
    title: 'Mitglieder',
    href: '/admin/members',
    icon: IconUsers,
  },
  {
    title: 'Newsletter',
    href: '/admin/newsletter',
    icon: IconMail,
  },
  {
    title: 'Sponsoren',
    href: '/admin/sponsors',
    icon: IconCoin,
  },
  {
    title: 'Einstellungen',
    href: '/admin/settings',
    icon: IconSettings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success('Erfolgreich abgemeldet');
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Fehler beim Abmelden');
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Admin Panel
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {collapsed ? (
            <IconChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <IconChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                    collapsed && 'justify-center'
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="ml-3 text-sm font-medium">{item.title}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={cn(
            'w-full flex items-center px-3 py-2 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Abmelden' : undefined}
        >
          <IconLogout className="w-5 h-5 flex-shrink-0" />
          {!collapsed && (
            <span className="ml-3 text-sm font-medium">
              {isLoggingOut ? 'Abmelden...' : 'Abmelden'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}