# 🔐 Google OAuth Setup für Viktoria Wertheim

## 📋 Übersicht
Diese Anleitung führt dich durch die Einrichtung der Google One-Click Anmeldung.

## Schritt 1: Google Cloud Console Setup

### 1.1 OAuth2 Credentials erstellen
1. Gehe zu [Google Cloud Console](https://console.cloud.google.com/)
2. Erstelle ein neues Projekt oder wähle ein existierendes
3. Aktiviere die **Google+ API**:
   - Navigiere zu "APIs & Services" → "Library"
   - Suche nach "Google+ API" und aktiviere sie

### 1.2 OAuth 2.0 Client ID erstellen
1. Gehe zu "APIs & Services" → "Credentials"
2. Klicke auf "+ CREATE CREDENTIALS" → "OAuth client ID"
3. Falls noch nicht geschehen, konfiguriere den OAuth consent screen:
   - User Type: External
   - App Name: Viktoria Wertheim
   - Support Email: admin@viktoria-wertheim.de
   - Authorized domains: viktoria.headon.pro
   - Developer contact: webmaster@viktoria-wertheim.de

4. Erstelle OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: Viktoria Wertheim Web
   - Authorized JavaScript origins:
     ```
     https://viktoria.headon.pro
     http://localhost:3000
     https://vbumolcclqrhfqiofvcz.supabase.co
     ```
   - Authorized redirect URIs:
     ```
     https://vbumolcclqrhfqiofvcz.supabase.co/auth/v1/callback
     https://viktoria.headon.pro/auth/callback
     http://localhost:3000/auth/callback
     ```

5. **WICHTIG**: Speichere diese Werte:
   - **Client ID**: `[DEIN_CLIENT_ID]`
   - **Client Secret**: `[DEIN_CLIENT_SECRET]`

## Schritt 2: Supabase Dashboard Konfiguration

### 2.1 Google Provider aktivieren
1. Gehe zu [Supabase Dashboard](https://supabase.com/dashboard/project/vbumolcclqrhfqiofvcz/settings/auth)
2. Navigiere zu **Authentication** → **Providers**
3. Finde **Google** in der Liste
4. Toggle **Enable Google** auf ON
5. Füge ein:
   - **Client ID**: `[DEIN_CLIENT_ID von oben]`
   - **Client Secret**: `[DEIN_CLIENT_SECRET von oben]`
6. **Authorized Client IDs** (optional): Füge die Client ID nochmal hier ein für zusätzliche Sicherheit
7. Klicke **Save**

### 2.2 Auth Settings prüfen
1. Gehe zu **Authentication** → **URL Configuration**
2. Stelle sicher, dass diese URLs korrekt sind:
   - **Site URL**: `https://viktoria.headon.pro`
   - **Redirect URLs**:
     ```
     https://viktoria.headon.pro/auth/callback
     http://localhost:3000/auth/callback
     ```

## Schritt 3: Environment Variables

Füge diese zu deiner `.env` Datei hinzu:
```env
# Google OAuth (optional - nur für erweiterte Features)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=[DEIN_CLIENT_ID]
```

## Schritt 4: Code Implementation

Die Code-Komponenten werden im nächsten Schritt erstellt:
- Google Login Button Component
- Auth Callback Handler
- Updated Login/Signup Pages

## 🔒 Sicherheitshinweise

1. **Client Secret** niemals im Frontend Code verwenden!
2. Stelle sicher, dass alle Redirect URLs in beiden Konsolen identisch sind
3. Für Produktion: Entferne localhost URLs aus den Authorized Origins/Redirects
4. Aktiviere 2FA für dein Google Cloud Konto

## 🧪 Testing

Nach der Einrichtung:
1. Teste zuerst auf localhost:3000
2. Prüfe die Supabase Auth Logs bei Problemen
3. Stelle sicher, dass neue User in der `profiles` Tabelle angelegt werden

## 📝 Checkliste

- [ ] Google Cloud Project erstellt
- [ ] OAuth 2.0 Credentials erstellt
- [ ] Client ID & Secret gespeichert
- [ ] Supabase Google Provider aktiviert
- [ ] Redirect URLs in beiden Konsolen konfiguriert
- [ ] Frontend Code implementiert
- [ ] Testing durchgeführt

---
Erstellt am: 2025-01-16