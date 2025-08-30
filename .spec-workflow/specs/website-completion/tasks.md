# Tasks Document

## Phase 1: Data Integration & Core Fixes

- [ ] 1. Fix sponsors data integration in src/components/HomePage.tsx
  - File: src/components/HomePage.tsx
  - Update query to use 'category' instead of 'level'
  - Fix filter logic for sponsor categories
  - Purpose: Resolve current 500 error on homepage
  - _Leverage: existing Supabase client setup_
  - _Requirements: 1.1_

- [ ] 2. Upload missing images to Supabase Storage
  - File: public/images/* → Supabase Storage
  - Create buckets for news, teams, sponsors
  - Upload all referenced images from database
  - Purpose: Display correct images on website
  - _Leverage: existing Supabase Storage setup_
  - _Requirements: 1.2_

- [ ] 3. Fix date formatting in news and matches
  - Files: src/components/NewsCarousel.tsx, src/components/GameCards.tsx
  - Implement proper date parsing and formatting
  - Add German locale support for dates
  - Purpose: Display dates correctly in German format
  - _Leverage: existing date utilities_
  - _Requirements: 1.3_

## Phase 2: Forms & Communication

- [ ] 4. Implement newsletter subscription in src/components/Footer.tsx
  - File: src/components/Footer.tsx
  - Connect form to Supabase newsletter_subscribers table
  - Add success/error feedback
  - Purpose: Enable newsletter signups
  - _Leverage: existing Supabase client_
  - _Requirements: 2.1_

- [ ] 5. Create contact form API route
  - File: src/app/api/contact/route.ts (new)
  - Implement email sending with Resend or similar
  - Add validation and rate limiting
  - Purpose: Enable contact form functionality
  - _Leverage: Next.js API routes pattern_
  - _Requirements: 2.2_

- [ ] 6. Connect contact form to API
  - File: src/components/ContactPageClient.tsx
  - Wire up form submission to API route
  - Add loading states and feedback
  - Purpose: Make contact form functional
  - _Leverage: existing form components_
  - _Requirements: 2.3_

## Phase 3: Authentication & Authorization

- [ ] 7. Set up Supabase Auth configuration
  - File: src/lib/supabase/auth.ts (new)
  - Configure auth providers and settings
  - Create auth helper functions
  - Purpose: Enable user authentication
  - _Leverage: Supabase Auth SDK_
  - _Requirements: 3.1_

- [ ] 8. Create auth middleware for admin routes
  - File: src/middleware.ts
  - Protect /admin/* routes
  - Implement role-based access control
  - Purpose: Secure admin area
  - _Leverage: Next.js middleware_
  - _Requirements: 3.2_

- [ ] 9. Build login page component
  - File: src/app/admin/login/page.tsx (new)
  - Create login form with email/password
  - Add forgot password flow
  - Purpose: Allow admin users to authenticate
  - _Leverage: existing form patterns_
  - _Requirements: 3.3_

## Phase 4: Admin Dashboard Core

- [ ] 10. Create AdminLayout component
  - File: src/components/admin/AdminLayout.tsx (new)
  - Build sidebar navigation
  - Add user menu and logout
  - Purpose: Provide consistent admin interface
  - _Leverage: existing PageLayout patterns_
  - _Requirements: 3.4, 4.1_

- [ ] 11. Build DataTable component
  - File: src/components/admin/DataTable.tsx (new)
  - Implement sorting, filtering, pagination
  - Add bulk actions support
  - Purpose: Reusable table for all entities
  - _Leverage: existing table patterns_
  - _Requirements: 4.2_

- [ ] 12. Create FormBuilder component
  - File: src/components/admin/FormBuilder.tsx (new)
  - Dynamic form generation from schema
  - Add validation with zod
  - Purpose: Consistent form handling
  - _Leverage: react-hook-form_
  - _Requirements: 4.3_

## Phase 5: News Management

- [ ] 13. Install and configure TipTap editor
  - File: src/components/admin/RichTextEditor.tsx (new)
  - Set up WYSIWYG editor with toolbar
  - Configure image handling
  - Purpose: Rich text editing for content
  - _Leverage: TipTap React_
  - _Requirements: 4.4_

- [ ] 14. Create news management page
  - File: src/app/admin/news/page.tsx (new)
  - List all news with DataTable
  - Add create/edit/delete actions
  - Purpose: News article management
  - _Leverage: DataTable component_
  - _Requirements: 4.5_

- [ ] 15. Build news editor form
  - File: src/app/admin/news/[id]/page.tsx (new)
  - Integrate RichTextEditor
  - Add image upload functionality
  - Purpose: Create and edit news articles
  - _Leverage: FormBuilder, RichTextEditor_
  - _Requirements: 4.6_

## Phase 6: Match Management

- [ ] 16. Create match management page
  - File: src/app/admin/matches/page.tsx (new)
  - Display upcoming and past matches
  - Add quick result entry
  - Purpose: Manage match schedule
  - _Leverage: DataTable component_
  - _Requirements: 5.1_

- [ ] 17. Build match editor with lineup
  - File: src/app/admin/matches/[id]/page.tsx (new)
  - Match details form
  - Player selection for lineups
  - Purpose: Complete match management
  - _Leverage: FormBuilder component_
  - _Requirements: 5.2_

- [ ] 18. Implement automatic table calculation
  - File: src/lib/utils/tableCalculation.ts (new)
  - Calculate standings from match results
  - Update league_standings table
  - Purpose: Automatic league table updates
  - _Leverage: existing database schema_
  - _Requirements: 5.3_

## Phase 7: Team & Player Management

- [ ] 19. Create team management interface
  - File: src/app/admin/teams/page.tsx (new)
  - List all teams with details
  - Edit team information
  - Purpose: Manage club teams
  - _Leverage: DataTable component_
  - _Requirements: 6.1_

- [ ] 20. Build player management system
  - File: src/app/admin/players/page.tsx (new)
  - Player CRUD operations
  - Photo upload support
  - Purpose: Manage player rosters
  - _Leverage: DataTable, ImageUploader_
  - _Requirements: 6.2_

- [ ] 21. Create squad builder interface
  - File: src/components/admin/SquadBuilder.tsx (new)
  - Drag-and-drop player assignment
  - Formation visualization
  - Purpose: Easy squad management
  - _Leverage: existing player data_
  - _Requirements: 6.3_

## Phase 8: Sponsor & Media Management

- [ ] 22. Build sponsor management page
  - File: src/app/admin/sponsors/page.tsx (new)
  - Sponsor CRUD with categories
  - Logo upload and optimization
  - Purpose: Manage club sponsors
  - _Leverage: DataTable, ImageUploader_
  - _Requirements: 7.1_

- [ ] 23. Create image uploader component
  - File: src/components/admin/ImageUploader.tsx (new)
  - Drag-and-drop interface
  - Automatic optimization
  - Purpose: Consistent image handling
  - _Leverage: Supabase Storage_
  - _Requirements: 7.2_

- [ ] 24. Build media library interface
  - File: src/app/admin/media/page.tsx (new)
  - Browse all uploaded images
  - Organize by categories
  - Purpose: Central media management
  - _Leverage: Supabase Storage SDK_
  - _Requirements: 7.3_

## Phase 9: Testing & Documentation

- [ ] 25. Write unit tests for admin components
  - Files: src/components/admin/*.test.tsx
  - Test DataTable, FormBuilder, RichTextEditor
  - Mock Supabase client
  - Purpose: Ensure component reliability
  - _Leverage: Jest, React Testing Library_
  - _Testing Strategy: Unit_

- [ ] 26. Create E2E tests for critical flows
  - Files: tests/e2e/admin/*.spec.ts
  - Test complete news creation flow
  - Test match result entry
  - Purpose: Verify user workflows
  - _Leverage: Playwright_
  - _Testing Strategy: E2E_

- [ ] 27. Write admin user documentation
  - File: docs/ADMIN_GUIDE.md (new)
  - Step-by-step guides with screenshots
  - FAQ section
  - Purpose: Enable self-service for editors
  - _Leverage: Markdown_
  - _Requirements: All_