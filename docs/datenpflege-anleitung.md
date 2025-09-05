# Datenpflege-Anleitung für SV Viktoria Wertheim

## Übersicht
Die Datenbank ist jetzt vollständig automatisiert. Sie müssen nur noch Spielergebnisse eintragen - alles andere wird automatisch berechnet!

## 🎯 Was Sie eintragen müssen

### Spielergebnisse
Nur diese Daten müssen Sie in Supabase Studio pflegen:

1. **Öffnen Sie die `matches` Tabelle**
2. **Tragen Sie ein neues Spiel ein:**
   - `home_team_id`: Heimmannschaft auswählen
   - `away_team_id`: Auswärtsmannschaft auswählen
   - `match_date`: Datum und Uhrzeit
   - `home_score`: Tore Heimmannschaft
   - `away_score`: Tore Auswärtsmannschaft
   - `status`: auf `'completed'` setzen
   - `season`: '2025/26'
   - `match_type`: 'league' für Ligaspiele

## 🤖 Was automatisch passiert

Sobald Sie ein Spiel mit `status = 'completed'` speichern:

1. **League Standings werden automatisch neu berechnet:**
   - Punkte (3 für Sieg, 1 für Unentschieden)
   - Tabellenposition
   - Tore/Gegentore
   - Tordifferenz
   - Alle Statistiken

2. **Die Tabelle sortiert sich automatisch nach:**
   - Punkten (höchste zuerst)
   - Tordifferenz (bei Punktgleichheit)
   - Geschossenen Toren (bei gleicher Tordifferenz)

## 📊 Datenbankstruktur

### Teams (Stammdaten)
- Enthält alle 34 Teams aus 3 Ligen
- Ändern Sie hier nur bei Vereinswechsel oder neuen Teams etwas

### League Standings (Tabellenstände)
- **Wird automatisch aktualisiert!**
- Nie manuell ändern - wird vom System berechnet
- Zeigt aktuelle Tabellenpositionen und Statistiken

### Matches (Spielergebnisse)
- **Hier tragen Sie neue Ergebnisse ein**
- Das ist die einzige Tabelle, die Sie regelmäßig pflegen müssen

## ✅ Schritt-für-Schritt Anleitung

### Neues Spielergebnis eintragen:

1. **Supabase Studio öffnen:**
   ```
   http://localhost:54323
   ```

2. **Zur `matches` Tabelle navigieren**

3. **"Insert row" klicken**

4. **Pflichtfelder ausfüllen:**
   - home_team_id: Heimteam wählen
   - away_team_id: Auswärtsteam wählen  
   - match_date: Spieltermin
   - home_score: Heimtore
   - away_score: Auswärtstore
   - status: 'completed'
   - season: '2025/26'
   - match_type: 'league'

5. **Speichern** - Die Tabelle wird automatisch aktualisiert!

## 🔍 Kontrolle

### Tabellenstände prüfen:
```sql
-- In Supabase SQL Editor:
SELECT * FROM league_standings_view 
WHERE team_name LIKE '%Viktoria%'
ORDER BY position;
```

### Alle Teams einer Liga anzeigen:
```sql
SELECT * FROM league_standings_view 
WHERE league = 'bfv-Kreisliga Tauberbischofsheim'
ORDER BY position;
```

## ⚠️ Wichtige Hinweise

1. **Nie direkt in `league_standings` schreiben** - wird automatisch berechnet
2. **Teams nicht löschen** - sind mit vielen anderen Tabellen verknüpft
3. **Bei Problemen:** Funktion `recalculate_all_league_standings()` ausführen

## 🆘 Fehlerbehebung

### Tabelle wird nicht aktualisiert:
```sql
-- Manuell neu berechnen:
SELECT update_league_standings_from_matches();
```

### Falsche Positionen:
```sql
-- Alle Standings neu berechnen:
SELECT recalculate_all_league_standings();
```

## 📞 Support
Bei Fragen oder Problemen wenden Sie sich an den Administrator.