# Tasks Document

## ⚠️ WICHTIGER HINWEIS FÜR IMPLEMENTIERUNG

**Supabase läuft in Docker-Containern (NICHT von Supabase CLI verwaltet)**

### Migrations anwenden:
```bash
docker exec -i supabase-db psql -U postgres -d postgres < supabase/migrations/XXX.sql
```

### TypeScript Types generieren (mit Port-Forward):
```bash
# 1. Port-Forward starten
docker run -d --rm --name db-port-forward --network host alpine/socat \
  TCP-LISTEN:54322,fork,reuseaddr \
  TCP:$(docker inspect supabase-db -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}'):5432

# 2. Types generieren
npx supabase gen types typescript \
  --db-url "postgresql://postgres:viktoria-postgres-password@localhost:54322/postgres" \
  --schema public > src/lib/database.types.ts

# 3. Port-Forward stoppen
docker stop db-port-forward
```

**Dokumentation:** Siehe `/home/headon/Documents/supabase-docker-types-generation.md` für vollständige Anleitung

---

## Database Setup Tasks

- [x] 1. ~~Create contacts table migration~~ **[ERLEDIGT]**
  - ~~File: supabase/migrations/003_create_contacts_table.sql~~
  - ~~Define contacts table schema with role, name, email, phone, order fields~~
  - ~~Add RLS policies for public read access~~
  - Purpose: Store contact person information
  - _Requirements: 3.1_
  - **Status: Migration erstellt und angewendet via Docker exec**

- [x] 2. ~~Update sponsors table to include level column~~ **[BEREITS ERLEDIGT]**
  - ~~File: supabase/migrations/004_update_sponsors_level.sql~~
  - ~~Add level column (premium/gold/silver) to sponsors table~~
  - ~~Update existing sponsor records with appropriate levels~~
  - Purpose: Enable sponsor tier categorization
  - _Requirements: 1.1, 2.1_
  - **Hinweis: Bereits implementiert in supabase/migrations/002_add_sponsor_level.sql**

- [x] 3. ~~Generate updated TypeScript types~~ **[ERLEDIGT]**
  - **WICHTIG: Nutze Port-Forward Lösung für Docker-Container!**
  - Commands:
    ```bash
    # 1. Port-Forward starten
    docker run -d --rm --name db-port-forward --network host alpine/socat \
      TCP-LISTEN:54322,fork,reuseaddr \
      TCP:$(docker inspect supabase-db -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}'):5432
    
    # 2. Types generieren (Password: viktoria-postgres-password)
    npx supabase gen types typescript \
      --db-url "postgresql://postgres:viktoria-postgres-password@localhost:54322/postgres" \
      --schema public > src/lib/database.types.ts
    
    # 3. Port-Forward stoppen
    docker stop db-port-forward
    ```
  - Purpose: Ensure type safety for new database structures
  - _Requirements: All_
  - **Hinweis: Siehe /home/headon/Documents/supabase-docker-types-generation.md für Details**

## News Page Integration

- [x] 4. Create NewsPage server component
  - File: src/app/news/page.tsx
  - Convert to async server component
  - Fetch news articles from Supabase using createClient
  - Pass data to NewsPageClient component
  - Purpose: Server-side news data fetching
  - _Leverage: src/lib/supabase/server.ts, src/components/HomePage.tsx pattern_
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 5. Create NewsPageClient component
  - File: src/components/NewsPageClient.tsx
  - Move existing client-side logic from news/page.tsx
  - Accept news array as props instead of using mock data
  - Implement search and filter with real data
  - Purpose: Client-side news interaction
  - _Leverage: existing filter/search logic_
  - _Requirements: 1.1, 1.3, 1.4_

- [x] 6. Update NewsModal for database fields
  - File: src/components/NewsModal.tsx
  - Map database fields (published_at → date, image_url → image)
  - Handle null/undefined fields gracefully
  - Purpose: Display real news content correctly
  - _Leverage: existing NewsModal structure_
  - _Requirements: 1.3_

## Teams Page Integration

- [x] 7. Create TeamsPage server component
  - File: src/app/teams/page.tsx
  - Convert to async server component
  - Fetch teams, players, and matches from Supabase
  - Group players by team_id
  - Purpose: Server-side team data fetching
  - _Leverage: src/lib/supabase/server.ts_
  - _Requirements: 2.1, 2.2_

- [x] 8. Create TeamsPageClient component
  - File: src/components/TeamsPageClient.tsx
  - Move existing UI logic from teams/page.tsx
  - Accept teams, players, matches as props
  - Display real roster and statistics
  - Purpose: Client-side team display
  - _Leverage: existing team selector UI_
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 9. Handle youth teams special case
  - File: src/components/TeamsPageClient.tsx (continue from task 8)
  - Create separate display for youth teams
  - Show aggregated youth team information
  - Purpose: Support different team types
  - _Requirements: 2.3_

## Contact Page Integration

- [x] 10. ~~Seed contacts data~~ **[BEREITS IN MIGRATION ENTHALTEN]**
  - ~~File: supabase/seed/contacts.sql~~
  - ~~Insert contact persons into contacts table~~
  - ~~Include general, chairman, sports, youth, treasurer contacts~~
  - Purpose: Populate contact information
  - _Requirements: 3.1_
  - **Hinweis: Seed-Daten sind bereits in Migration 003 enthalten und wurden angewendet**

- [x] 11. Create ContactPage server component
  - File: src/app/kontakt/page.tsx
  - Convert to async server component
  - Fetch contacts from Supabase ordered by 'order_position' field (NOT 'order' - korrekte Spalte!)
  - Pass data to ContactPageClient
  - Purpose: Server-side contact data fetching
  - _Leverage: src/lib/supabase/server.ts_
  - _Requirements: 3.1, 3.2_

- [x] 12. Create ContactPageClient component
  - File: src/components/ContactPageClient.tsx
  - Move existing UI from kontakt/page.tsx
  - Display contacts from props instead of mock data
  - Keep existing form and map functionality
  - Purpose: Client-side contact display
  - _Leverage: existing contact form_
  - _Requirements: 3.1, 3.3_

## Component Updates

- [x] 13. Update LeagueTableModal to fetch from Supabase
  - File: src/components/LeagueTableModal.tsx
  - Add data fetching on modal open
  - Replace getTableData with Supabase query
  - Filter by selected team's league
  - Purpose: Display real league standings
  - _Leverage: league_standings table_
  - _Requirements: 4.1, 4.2_

- [x] 14. Update TeamStatus component
  - File: src/components/TeamStatus.tsx
  - Remove hardcoded teamStats object
  - Accept statistics as props from parent
  - Display real-time team statistics
  - Purpose: Show actual team performance
  - _Requirements: 5.1, 5.2_

- [x] 15. Update NewsCarousel component
  - File: src/components/NewsCarousel.tsx
  - Remove defaultNews fallback array
  - Display empty state when no news available
  - Map database fields correctly
  - Purpose: Remove mock data dependency
  - _Leverage: existing carousel UI_
  - _Requirements: 7.1, 7.2_

## Error Handling

- [x] 16. Add error boundaries to pages
  - Files: All modified page components
  - Wrap data fetching in try-catch blocks
  - Return empty arrays on failure
  - Log errors to console
  - Purpose: Graceful error handling
  - _Requirements: NFR - Reliability_

- [x] 17. Implement loading states
  - Files: All client components
  - Add loading skeletons or spinners
  - Show during data fetching
  - Purpose: Better user experience
  - _Requirements: NFR - Usability_

## Testing Tasks

- [x] 18. Test News page integration
  - Verify news articles load from database
  - Test search and filter functionality
  - Confirm modal displays correct content
  - Purpose: Ensure news feature works
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 19. Test Teams page integration
  - Verify all teams and players load
  - Test team selection updates display
  - Confirm youth teams show correctly
  - Purpose: Ensure teams feature works
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 20. Test Contact page and components
  - Verify contacts display in correct order
  - Test form submission
  - Confirm league table and team status work
  - Purpose: Ensure all components function
  - _Requirements: 3.1, 4.1, 5.1_

## Cleanup Tasks

- [x] 21. Remove all mock data objects
  - Files: All components with mock data
  - Delete mock arrays and objects
  - Remove commented mock data
  - Purpose: Clean codebase
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 22. Update TypeScript types
  - Files: Components using 'any' type
  - Replace with proper Database types
  - Fix any remaining type errors
  - Purpose: Type safety
  - _Requirements: NFR - Code Architecture_