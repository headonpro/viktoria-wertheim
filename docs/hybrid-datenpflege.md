# Hybrid-Datenpflege für SV Viktoria Wertheim

## System-Übersicht
Wir nutzen ein **Hybrid-System**:
- **Viktoria-Spiele**: Vollautomatisch berechnet
- **Andere Teams**: Wöchentliches manuelles Update (5 Minuten Aufwand)

## 📅 Wöchentliche Routine (Montag empfohlen)

### 1. Tabellenstände von fussball.de holen

Öffnen Sie die aktuellen Tabellen:
- [Kreisliga](https://www.fussball.de/spielplan/bfv-kreisliga-tauberbischofsheim-kreis-tauberbischofsheim-kreisliga-herren-saison2526-baden/-/staffel/02TCA7AFN4000004VS5489BUVVJB7B47-G#!/section/table)
- [Kreisklasse A](https://www.fussball.de/spielplan/bfv-kreisklasse-a-tauberbischofsheim-kreis-tauberbischofsheim-kreisklasse-a-herren-saison2526-baden/-/staffel/02TCA7AG5O000004VS5489BUVVJB7B47-G#!/section/table)
- [Kreisklasse B](https://www.fussball.de/spielplan/bfv-kreisklasse-b-tauberbischofsheim-kreis-tauberbischofsheim-kreisklasse-b-herren-saison2526-baden/-/staffel/02TCA7AGC8000004VS5489BUVVJB7B47-G#!/section/table)

### 2. Tabellenstände in Supabase aktualisieren

Öffnen Sie Supabase Studio:
```
http://localhost:54323
```

Gehen Sie zum **SQL Editor** und nutzen Sie diese Funktion:

```sql
-- Beispiel für ein Team-Update
SELECT update_team_standings(
    'TSV Assamstadt',     -- Team Name (exakt wie in DB)
    1,                    -- Platz
    5,                    -- Spiele
    5,                    -- Siege
    0,                    -- Unentschieden
    0,                    -- Niederlagen
    18,                   -- Tore
    3,                    -- Gegentore
    15                    -- Punkte
);
```

### 3. Mehrere Teams gleichzeitig updaten

Für schnelleres Update mehrerer Teams:

```sql
-- Kopieren Sie diese Struktur und passen Sie die Werte an
SELECT update_team_standings('TSV Assamstadt', 1, 5, 5, 0, 0, 18, 3, 15);
SELECT update_team_standings('TuS Großrinderfeld', 2, 5, 4, 1, 0, 22, 4, 13);
SELECT update_team_standings('1.FC Umpfertal', 3, 5, 4, 0, 1, 16, 7, 12);
-- ... weitere Teams
```

## 🎯 Viktoria-Spiele eintragen

### Neues Spielergebnis eintragen:

1. Öffnen Sie die `matches` Tabelle in Supabase
2. Klicken Sie auf "Insert row"
3. Füllen Sie aus:
   - `home_team`: Team-Name (z.B. "SV Viktoria Wertheim")
   - `away_team`: Gegner-Name
   - `home_team_id`: ID aus teams Tabelle
   - `away_team_id`: ID des Gegners
   - `home_score`: Heimtore
   - `away_score`: Auswärtstore
   - `match_date`: Spieltag
   - `status`: 'completed'
   - `season`: '2025/26'

**➡️ Die Viktoria-Tabellenstände werden automatisch neu berechnet!**

## ⚡ Schnell-Befehle

### Alle Viktoria-Teams prüfen:
```sql
SELECT * FROM league_standings_view 
WHERE team_name LIKE '%Viktoria%'
ORDER BY position;
```

### Aktuelle Kreisliga-Tabelle:
```sql
SELECT * FROM league_standings_view 
WHERE league = 'bfv-Kreisliga Tauberbischofsheim'
ORDER BY position;
```

### Letzte Updates prüfen:
```sql
SELECT team_name, position, points, updated_at 
FROM league_standings_view
ORDER BY updated_at DESC
LIMIT 10;
```

## 🔧 Fehlerbehebung

### Falls Viktoria-Punkte falsch sind:
```sql
-- Force-Update für Viktoria Teams
UPDATE matches 
SET status = 'completed' 
WHERE id = (
    SELECT id FROM matches 
    WHERE (home_team LIKE '%Viktoria%' OR away_team LIKE '%Viktoria%')
    ORDER BY match_date DESC 
    LIMIT 1
);
```

### Falls andere Teams nicht aktualisiert werden:
Nutzen Sie die `update_team_standings` Funktion wie oben beschrieben.

## 📊 Vorteile des Hybrid-Systems

✅ **Minimaler Aufwand**: 5 Minuten pro Woche
✅ **Maximale Genauigkeit**: Offizielle Daten von fussball.de
✅ **Automatisierung**: Viktoria-Spiele werden automatisch berechnet
✅ **Flexibilität**: Manuelle Korrekturen jederzeit möglich

## 📝 Checkliste für Datenpfleger

**Wöchentlich (Montag):**
- [ ] fussball.de Tabellen öffnen
- [ ] Andere Teams in Supabase updaten (nicht Viktoria)
- [ ] Prüfen ob alle Positionen stimmen

**Nach Viktoria-Spielen:**
- [ ] Spielergebnis in matches eintragen
- [ ] Status auf 'completed' setzen
- [ ] Automatische Berechnung läuft von selbst

## Support
Bei Fragen oder Problemen wenden Sie sich an den Administrator.