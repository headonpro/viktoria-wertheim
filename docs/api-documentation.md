# API Dokumentation - SV Viktoria Wertheim

Diese Dokumentation beschreibt die REST API für die SV Viktoria Wertheim Website.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://viktoria.headon.pro/api`

## Authentication

Für Admin-Operationen ist ein `X-Admin-Password` Header erforderlich:

```
X-Admin-Password: <ADMIN_PASSWORD>
```

## Rate Limiting

Alle Endpoints haben Rate Limits:
- Standard: 60 Anfragen/Minute
- Admin: 20 Anfragen/Minute
- Contact Form: 3 Anfragen/Minute

## Response Format

Alle API-Antworten folgen diesem Format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2025-09-05T00:00:00.000Z",
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Name ist erforderlich",
    "details": { ... }
  },
  "meta": {
    "timestamp": "2025-09-05T00:00:00.000Z"
  }
}
```

## Error Codes

| Code | HTTP Status | Beschreibung |
|------|-------------|--------------|
| `VALIDATION_ERROR` | 400 | Eingabedaten sind ungültig |
| `UNAUTHORIZED` | 401 | Nicht autorisiert |
| `FORBIDDEN` | 403 | Zugriff verweigert |
| `NOT_FOUND` | 404 | Ressource nicht gefunden |
| `ALREADY_EXISTS` | 409 | Ressource existiert bereits |
| `RATE_LIMITED` | 429 | Zu viele Anfragen |
| `INTERNAL_ERROR` | 500 | Serverfehler |
| `DATABASE_ERROR` | 503 | Datenbankfehler |

---

# Teams API

## GET /api/teams

Alle aktiven Teams abrufen.

**Query Parameters:**
- `page` (optional): Seitenzahl (Standard: 1)
- `limit` (optional): Anzahl pro Seite (Standard: 20, Max: 100)
- `category` (optional): Filter nach Kategorie
- `sortBy` (optional): Sortierfeld (Standard: `created_at`)
- `sortOrder` (optional): `asc` oder `desc` (Standard: `desc`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "1. Mannschaft",
      "short_name": "1. Herren",
      "category": "Herren",
      "league": "Kreisliga A",
      "logo_url": "https://...",
      "founded_year": 2000,
      "description": "Unsere erste Mannschaft...",
      "is_active": true,
      "created_at": "2025-09-05T00:00:00.000Z",
      "updated_at": "2025-09-05T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 3
  }
}
```

## POST /api/teams

Neues Team erstellen (Admin only).

**Headers:**
```
X-Admin-Password: <ADMIN_PASSWORD>
```

**Body:**
```json
{
  "name": "1. Mannschaft",
  "short_name": "1. Herren",
  "category": "Herren",
  "league": "Kreisliga A",
  "logo_url": "https://...",
  "founded_year": 2000,
  "description": "Unsere erste Mannschaft..."
}
```

## GET /api/teams/{id}

Team nach ID abrufen.

**Response:** Team-Objekt (siehe GET /api/teams)

## PUT /api/teams/{id}

Team aktualisieren (Admin only).

**Body:** Partial Team-Objekt mit zu ändernden Feldern.

## DELETE /api/teams/{id}

Team deaktivieren (Admin only). Soft Delete - Team wird als `is_active: false` markiert.

## GET /api/teams/{id}/stats

Team-Statistiken abrufen.

**Response:**
```json
{
  "success": true,
  "data": {
    "playerCount": 25,
    "matchesPlayed": 10,
    "matchesUpcoming": 3
  }
}
```

---

# News API

## GET /api/news

Veröffentlichte News-Artikel abrufen.

**Query Parameters:**
- `page`, `limit`, `sortBy`, `sortOrder`: Wie bei Teams
- `category` (optional): Filter nach Kategorie
- `search` (optional): Suchbegriff in Titel/Inhalt
- `featured=true`: Nur hervorgehobene Artikel
- `latest=true`: Neueste Artikel für Homepage

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Großer Sieg gegen...",
      "content": "Vollständiger Artikel...",
      "summary": "Kurze Zusammenfassung...",
      "author": "Max Mustermann",
      "image_url": "https://...",
      "published_at": "2025-09-05T00:00:00.000Z",
      "is_published": true,
      "is_featured": false,
      "category": "Spielbericht",
      "tags": ["1. Mannschaft", "Sieg"],
      "views": 150,
      "created_at": "2025-09-05T00:00:00.000Z",
      "updated_at": "2025-09-05T00:00:00.000Z"
    }
  ]
}
```

## POST /api/news

News-Artikel erstellen (Admin only).

**Body:**
```json
{
  "title": "Titel des Artikels",
  "content": "Vollständiger Inhalt...",
  "summary": "Kurze Zusammenfassung",
  "author": "Autor Name",
  "image_url": "https://...",
  "category": "Kategorie",
  "tags": ["Tag1", "Tag2"],
  "is_featured": false
}
```

## GET /api/news/{id}

News-Artikel nach ID abrufen.

## PUT /api/news/{id}

News-Artikel aktualisieren (Admin only).

## DELETE /api/news/{id}

News-Artikel löschen (Admin only).

## POST /api/news/{id}/publish

News-Artikel veröffentlichen (Admin only).

## DELETE /api/news/{id}/publish

News-Artikel zurückziehen (Admin only).

## POST /api/news/{id}/view

Aufrufzähler erhöhen. Wird automatisch beim Lesen eines Artikels aufgerufen.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Aufrufe wurden erhöht"
  }
}
```

---

# Contact API

## POST /api/contact

Kontaktformular absenden.

**Body:**
```json
{
  "name": "Max Mustermann",
  "email": "max@example.com",
  "subject": "Betreff der Nachricht",
  "message": "Nachrichtentext..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Nachricht erfolgreich gesendet"
  }
}
```

**Verhalten:**
- Sendet E-Mail an `info@viktoria-wertheim.de`
- Sendet Bestätigungs-E-Mail an Absender
- Rate Limit: 3 Nachrichten pro Minute pro IP

---

# Health API

## GET /api/health

System-Status abrufen.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-09-05T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "checks": {
    "app": "ok",
    "database": "ok",
    "supabaseAuth": "ok",
    "memory": "ok",
    "diskSpace": "ok",
    "rateLimit": "ok"
  },
  "metrics": {
    "memoryUsage": {
      "heapUsed": "50 MB",
      "heapTotal": "100 MB",
      "heapUsedPercent": "50%",
      "systemTotal": "8192 MB",
      "systemFree": "4096 MB",
      "systemUsedPercent": "50%"
    },
    "diskSpace": {
      "total": "100 GB",
      "free": "50 GB",
      "usedPercent": "50%"
    },
    "responseTime": 25
  }
}
```

**Status Levels:**
- `healthy`: Alles funktioniert
- `degraded`: Warnungen vorhanden
- `unhealthy`: Kritische Fehler

---

# Validation Rules

## Team
- `name`: 2-100 Zeichen, erforderlich, eindeutig
- `short_name`: 2-10 Zeichen, erforderlich, eindeutig
- `category`: Max 50 Zeichen, erforderlich
- `league`: Max 100 Zeichen
- `description`: Max 500 Zeichen
- `founded_year`: 1800-aktuelles Jahr

## News
- `title`: 5-200 Zeichen, erforderlich, eindeutig
- `content`: Min 50 Zeichen, erforderlich
- `summary`: Max 500 Zeichen
- `author`: Max 100 Zeichen
- `category`: Max 50 Zeichen
- `tags`: Max 10 Tags, je max 50 Zeichen

## Contact
- `name`: 2-100 Zeichen, erforderlich
- `email`: Gültige E-Mail, erforderlich
- `subject`: 5-200 Zeichen, erforderlich
- `message`: 10-2000 Zeichen, erforderlich

## Pagination
- `page`: Min 1
- `limit`: 1-100 (Standard: 20)
- `sortOrder`: `asc` oder `desc`

---

# Examples

## Team erstellen
```bash
curl -X POST \
  http://localhost:3000/api/teams \
  -H 'Content-Type: application/json' \
  -H 'X-Admin-Password: YOUR_PASSWORD' \
  -d '{
    "name": "2. Mannschaft",
    "short_name": "2. Herren",
    "category": "Herren",
    "league": "Kreisliga B"
  }'
```

## News durchsuchen
```bash
curl "http://localhost:3000/api/news?search=sieg&category=spielbericht&limit=10"
```

## Kontakt senden
```bash
curl -X POST \
  http://localhost:3000/api/contact \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Max Mustermann",
    "email": "max@example.com", 
    "subject": "Interesse am Verein",
    "message": "Ich interessiere mich für eine Mitgliedschaft..."
  }'
```

## Service Architecture

### Base Service Pattern
Alle Services erben von `BaseService<T>` und bieten:
- CRUD Operationen
- Pagination
- Filtering
- Error Handling
- Logging

### Service Layer Benefits
1. **Business Logic Separation**: Logik getrennt von API Routes
2. **Type Safety**: Vollständige TypeScript-Typisierung
3. **Validation**: Einheitliche Eingabevalidierung
4. **Error Handling**: Strukturierte Fehlerbehandlung
5. **Logging**: Detailliertes Request/Response Logging
6. **Testability**: Services können isoliert getestet werden

### Middleware Stack
1. **CORS**: Cross-Origin Request Handling
2. **Rate Limiting**: Pro-IP Request Limiting
3. **Authentication**: Admin Password Validation
4. **Validation**: Request Body/Parameter Validation
5. **Error Handling**: Structured Error Responses
6. **Logging**: Request/Response Logging