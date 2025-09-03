# Datenbank-Duplikate Bereinigungsstrategie

## 🔍 Analyse-Ergebnis

### **Lokale Datenbank (Development)**
- ✅ **Keine kritischen Duplikate** in Haupttabellen
- Moderate Duplikate in `league_standings` (2-3 Einträge pro Team)
- **Total Records**: 
  - league_standings: 93 Einträge
  - matches: 22 Einträge
  - teams: 3 Einträge

### **VPS Datenbank (Production)**
- ❌ **Massive Duplikate** gefunden!
- **Total Records**:
  - league_standings: 372 Einträge (4x mehr als lokal!)
  - matches: 88 Einträge (4x mehr als lokal!)
  - teams: 9 Einträge (3x mehr als lokal!)

### **Duplikate-Details (VPS)**
1. **league_standings**: Jedes Team hat 8-12 Duplikate!
   - TSV Kreuzwertheim: 12 Duplikate
   - SV Viktoria Wertheim: 12 Duplikate
   
2. **teams**: Viktoria Teams 3x dupliziert
   - SV Viktoria Wertheim: 3 Einträge
   - SV Viktoria Wertheim II: 3 Einträge
   - SpG Vikt. Wertheim 3/Grünenwört: 3 Einträge

3. **matches**: Jedes Spiel 4x dupliziert!
   - Alle Matches existieren 4-fach

## 🎯 Ursachenanalyse

**Wahrscheinliche Ursache**: Mehrfache Datenimports ohne vorheriges Löschen
- Beim Deployment wurden Daten mehrfach importiert
- Keine UNIQUE Constraints auf kritischen Feldern
- Fehlende Duplikat-Prüfung beim Import

## 📋 Bereinigungsstrategie nach Best Practice

### **Phase 1: Backup erstellen** 🔒
```bash
# Vollständiges Backup der Production DB
docker exec supabase-db pg_dump -U postgres -d postgres > backup_before_cleanup_$(date +%Y%m%d_%H%M%S).sql
```

### **Phase 2: Duplikate identifizieren und markieren** 🏷️

#### Strategie: Keep-First-Delete-Rest
- Behalte jeweils den **ältesten Eintrag** (niedrigste ID oder früheste created_at)
- Lösche alle neueren Duplikate

### **Phase 3: Bereinigung durchführen** 🧹

#### 3.1 Teams bereinigen
```sql
-- Identifiziere und lösche duplizierten Teams (behalte älteste)
WITH duplicates AS (
  SELECT id,
         name,
         ROW_NUMBER() OVER (PARTITION BY name ORDER BY id) as rn
  FROM public.teams
)
DELETE FROM public.teams
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);
```

#### 3.2 League Standings bereinigen
```sql
-- Lösche Duplikate in league_standings
WITH duplicates AS (
  SELECT id,
         team_name,
         ROW_NUMBER() OVER (PARTITION BY team_name ORDER BY id) as rn
  FROM public.league_standings
)
DELETE FROM public.league_standings
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);
```

#### 3.3 Matches bereinigen
```sql
-- Lösche duplizierte Matches
WITH duplicates AS (
  SELECT id,
         home_team,
         away_team,
         match_date,
         ROW_NUMBER() OVER (PARTITION BY home_team, away_team, match_date ORDER BY id) as rn
  FROM public.matches
)
DELETE FROM public.matches
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);
```

### **Phase 4: Constraints hinzufügen** 🔐

Verhindere zukünftige Duplikate durch UNIQUE Constraints:

```sql
-- Teams: Eindeutiger Name
ALTER TABLE public.teams 
ADD CONSTRAINT teams_name_unique UNIQUE (name);

-- League Standings: Ein Eintrag pro Team
ALTER TABLE public.league_standings 
ADD CONSTRAINT league_standings_team_unique UNIQUE (team_name);

-- Matches: Keine doppelten Spiele
ALTER TABLE public.matches 
ADD CONSTRAINT matches_unique UNIQUE (home_team, away_team, match_date);
```

### **Phase 5: Import-Prozess verbessern** 🚀

1. **UPSERT statt INSERT** verwenden:
```sql
INSERT INTO teams (name, ...) 
VALUES ('SV Viktoria Wertheim', ...)
ON CONFLICT (name) DO UPDATE 
SET updated_at = NOW();
```

2. **Transaktionale Imports**:
```sql
BEGIN;
TRUNCATE TABLE league_standings CASCADE;
INSERT INTO league_standings ...;
COMMIT;
```

## 🛠️ Implementierung

### **Option A: Manuell (Empfohlen für Production)**
1. Backup erstellen
2. SQL-Scripts einzeln in Transaktion ausführen
3. Verifizieren nach jedem Schritt
4. Bei Fehler: Rollback

### **Option B: Automatisiertes Script**
```bash
#!/bin/bash
# cleanup-duplicates.sh

# 1. Backup
docker exec supabase-db pg_dump -U postgres > backup_$(date +%Y%m%d).sql

# 2. Bereinigung
docker exec supabase-db psql -U postgres << EOF
BEGIN;

-- Teams bereinigen
WITH duplicates AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY name ORDER BY id) as rn
  FROM public.teams
)
DELETE FROM public.teams WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

-- League standings bereinigen  
WITH duplicates AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY team_name ORDER BY id) as rn
  FROM public.league_standings
)
DELETE FROM public.league_standings WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

-- Matches bereinigen
WITH duplicates AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY home_team, away_team, match_date ORDER BY id) as rn
  FROM public.matches
)
DELETE FROM public.matches WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

COMMIT;
EOF

echo "Cleanup completed!"
```

## ⚠️ Wichtige Hinweise

1. **IMMER Backup vor Bereinigung!**
2. **Teste erst auf Development-Umgebung**
3. **Foreign Key Constraints beachten** (CASCADE-Effekte)
4. **Monitoring nach Bereinigung** (App-Funktionalität prüfen)
5. **Dokumentiere alle Änderungen**

## 📊 Erwartetes Ergebnis

Nach Bereinigung sollten wir haben:
- `teams`: ~3 Einträge (statt 9)
- `league_standings`: ~35 Einträge (statt 372)
- `matches`: ~22 Einträge (statt 88)

## 🔄 Präventivmaßnahmen

1. **CI/CD Pipeline anpassen**: Keine Daten-Imports bei Deployment
2. **Daten-Migration separat**: Eigenes Script für Datenmigrationen
3. **Idempotente Imports**: Immer UPSERT verwenden
4. **Monitoring**: Regelmäßige Duplikat-Checks
5. **Unique Constraints**: Auf DB-Ebene sicherstellen