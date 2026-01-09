# Blog Dashboard

**Internal read-only operational dashboard for static blog factory.**

## Core Purpose

Provide a single UI that shows the operational state of each blog across:
- Internal factory assets
- External platforms
- Presentation surfaces

This dashboard tracks status and links out to tools — **it does not perform actions itself**.

---

## Non-Negotiable Constraints

```
┌─────────────────────────────────────────────────────────────────┐
│  Assets describe reality. They do not cause it.                 │
│  This system tracks state. It does not enforce it.              │
└─────────────────────────────────────────────────────────────────┘
```

### What This System Does NOT Do

- ❌ No CMS functionality
- ❌ No content editing
- ❌ No publishing or deployment
- ❌ No writing to blog-builder, designer repos, or production sites
- ❌ No runtime dependency for public blogs

### What This System Does

- ✅ Read-only ingestion of metadata
- ✅ Display operational status
- ✅ Link to external tools (one-click navigation)
- ✅ Safe to shut down without affecting production

---

## Guiding Rule

> **If this dashboard disappears, all blogs must continue to generate, deploy, and function normally.**

---

## Canonical Data

- **Source of truth:** `data/blogs.json`
- **Schema version:** Defined in the JSON file
- **Storage philosophy:** JSON is canonical, SQL mirrors JSON (never replaces it)

The dashboard reads from JSON. If you need SQL for query speed, treat it as a cache.

---

## Data Model

### Blog
| Field | Type | Description |
|-------|------|-------------|
| id | string | Stable identifier (use domain) |
| displayName | string | Human-friendly name |
| domain | string | Canonical domain |
| status | enum | `active`, `paused`, `archived` |
| notes | string | Freeform human memory |
| assets | Asset[] | All tracked assets |

### Asset
| Field | Type | Description |
|-------|------|-------------|
| assetId | string | Unique ID within blog |
| type | enum | Asset type (github_repo, lovable_project, etc.) |
| category | enum | `internal`, `external`, `distribution` |
| importance | enum | `critical`, `important`, `optional` |
| status | enum | `not_created`, `created`, `connected`, `verified`, `error`, `skipped` |
| label | string | Human-readable name |
| url | string? | Link to the asset |
| externalId | string? | Platform-specific ID |
| notes | string? | Explanation or decision log |
| evidence | Evidence[] | Proof of status |

### Asset Status

| Status | Meaning |
|--------|---------|
| `not_created` | Asset does not exist yet |
| `created` | Asset exists but not connected |
| `connected` | Asset is connected to the system |
| `verified` | Asset is verified working |
| `error` | Asset has an error/issue |
| `skipped` | **Intentionally skipped (first-class state)** |

> **Important:** `skipped` is a deliberate decision, not a failure.

---

## Health Calculation (Derived, Never Stored)

Health is calculated at runtime from asset status:

- 🔴 **Risk**: Any critical asset in `error` or `not_created`
- 🟡 **Incomplete**: No critical missing, some important missing
- 🟢 **Healthy**: All critical + important satisfied

Health is **never** manually set or stored.

---

## Project Structure

```
blog-dashboard/
├── data/
│   └── blogs.json          # Canonical data source
├── docs/                   # Documentation
├── scripts/                # Utility scripts
├── src/
│   ├── schema.ts          # Type definitions & health logic
│   ├── storage/           # Data loading
│   │   └── useBlogsData.ts
│   ├── ui/
│   │   ├── components/
│   │   │   ├── AssetCard.tsx
│   │   │   ├── HealthSummary.tsx
│   │   │   └── StatusBadge.tsx
│   │   └── pages/
│   │       ├── BlogList.tsx
│   │       └── BlogDetail.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Running the Dashboard

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The dashboard runs on `http://localhost:3100`.

---

## Adding a New Blog

Edit `data/blogs.json`:

```json
{
  "id": "yourdomain.blog",
  "displayName": "Your Blog Name",
  "domain": "yourdomain.blog",
  "status": "active",
  "notes": "Purpose of this blog",
  "assets": [
    {
      "assetId": "github-designer-repo",
      "type": "github_repo",
      "category": "internal",
      "importance": "critical",
      "status": "not_created",
      "label": "Designer Repo",
      "evidence": []
    }
    // ... more assets
  ]
}
```

---

## Code Guardrails

These assertions must remain true:

```typescript
// This UI may describe system state.
// It must never be required to change system state.

// If this page is deleted, blogs must still function.

// No button here may mutate upstream truth.
```

If a PR violates these, it fails review.

---

## What Does NOT Belong Here

If the tool suggests any of these, reject immediately:

- "Publish"
- "Deploy"
- "Edit content"
- "Sync back"
- "Auto-create accounts"
- "Fix SEO"
- Any automation toggles

These are scope violations.

---

## Tech Stack

- React 18
- React Router
- Vite
- TypeScript
- Plain CSS (no frameworks)

Deliberately boring. Explicitly simple.

---

## Future Extensions (Safe to Add)

- Blog registry ingestion (read-only)
- Asset registry from external APIs (read-only)
- Capability status checks (read-only)
- SQL cache for query speed (mirrors JSON)

---

## License

Internal use only.
