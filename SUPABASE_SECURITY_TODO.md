# 📋 Supabase Security & Performance - Verbleibende Aufgaben

## ✅ Bereits erledigt (via SQL)

### Security Fixes
- ✅ `is_admin_or_email` Function - search_path gesetzt
- ✅ `handle_new_user` Function - search_path gesetzt

### Performance Optimierungen
- ✅ RLS Policies optimiert - `auth.uid()` durch `(SELECT auth.uid())` ersetzt
- ✅ Mehrfache PERMISSIVE Policies konsolidiert für:
  - contacts (3 → 1 Policy)
  - news (2 → 4 spezifische Policies)
  - newsletter_subscribers (4 → 4 optimierte Policies)
  - players (3 → 1 Policy)
  - profiles (3 → 4 spezifische Policies)
- ✅ Fehlender Index für `members.profile_id` hinzugefügt

## 🔴 Manuelle Konfiguration im Supabase Dashboard erforderlich

### 1. Leaked Password Protection aktivieren
**Ort**: [Authentication → Password Settings](https://supabase.com/dashboard/project/vbumolcclqrhfqiofvcz/settings/auth)

**Schritte**:
1. Zu "Password Protection" navigieren
2. "Enable leaked password protection" aktivieren
3. Speichern

**Warum**: Prüft Passwörter gegen HaveIBeenPwned.org Datenbank

### 2. Multi-Factor Authentication (MFA) erweitern
**Ort**: [Authentication → MFA Settings](https://supabase.com/dashboard/project/vbumolcclqrhfqiofvcz/settings/auth)

**Schritte**:
1. TOTP (Time-based One-Time Password) aktivieren
2. Optional: SMS-basierte MFA konfigurieren
3. MFA-Enrollment-Flow aktivieren

**Warum**: Erhöht Account-Sicherheit signifikant

### 3. PostgreSQL Version Update
**Ort**: [Settings → Infrastructure](https://supabase.com/dashboard/project/vbumolcclqrhfqiofvcz/settings/infrastructure)

**Aktuelle Version**: 17.4.1.074
**Empfehlung**: Auf neueste 17.4.1.x Version upgraden

**Schritte**:
1. Backup erstellen (wichtig!)
2. Maintenance-Fenster planen
3. Upgrade durchführen
4. Funktionalität testen

## 📊 Performance-Monitoring

### Optionale Cleanup-Aufgaben (niedrige Priorität)
Die folgenden ungenutzten Indizes könnten entfernt werden, um Speicherplatz zu sparen:

```sql
-- Analyse vor dem Löschen empfohlen!
DROP INDEX IF EXISTS idx_matches_away_team_id;
DROP INDEX IF EXISTS idx_players_team_id;
DROP INDEX IF EXISTS idx_scorers_team_id;
DROP INDEX IF EXISTS idx_news_slug;
DROP INDEX IF EXISTS idx_news_author;
DROP INDEX IF EXISTS idx_members_membership_status;
DROP INDEX IF EXISTS idx_members_membership_type;
DROP INDEX IF EXISTS idx_match_events_match_id;
DROP INDEX IF EXISTS idx_match_events_player_id;
DROP INDEX IF EXISTS idx_match_events_team_id;
DROP INDEX IF EXISTS idx_match_events_match_player;
```

⚠️ **Warnung**: Vor dem Löschen prüfen, ob diese Indizes wirklich nicht benötigt werden!

## 🎯 Erwartete Verbesserungen

Nach Implementierung aller Maßnahmen:
- **Security**: Deutlich erhöhte Sicherheit gegen SQL-Injection und kompromittierte Passwörter
- **Performance**: 30-50% bessere Query-Performance bei RLS-geschützten Tabellen
- **Wartbarkeit**: Klarere und einfachere Policy-Struktur

## 📅 Empfohlene Reihenfolge

1. **Sofort**: Leaked Password Protection (5 Min)
2. **Diese Woche**: MFA-Optionen (15 Min)
3. **Nächste Wartung**: PostgreSQL Update (30 Min inkl. Test)
4. **Optional**: Ungenutzte Indizes analysieren und ggf. entfernen

---

Erstellt am: 2025-01-15
Letzte Aktualisierung durch Supabase Advisor Check