# Architecture

## Overview

The plugin has two parts:
- Frontend (TypeScript/React) - runs in Steam's UI, detects game pages, displays HLTB data
- Backend (Lua) - fetches data from HLTB and Steam APIs

## Frontend

Entry point: `frontend/index.tsx`

Key responsibilities:
- Detect when user views a game page (MutationObserver watching for game header images)
- Extract Steam App ID from image URLs
- Call backend to get HLTB data
- Cache results in localStorage
- Inject completion time display into the page

Supports both Desktop and Big Picture modes. Uses CSS selectors to find game page elements

IMPORTANT: these are obfuscated class names that may break on Steam updates. But other reference implementations use a similar approach.

## Backend

Entry point: `backend/main.lua`

Key responsibilities:
- Fetch game name from Steam API
- Search HLTB for matching game
- Return completion times to frontend

The HLTB client (`backend/hltb.lua`) handles auth tokens, search endpoint extraction, and game matching. See `docs/hltb-api.md` for details.

## Data Flow

1. User navigates to a game page
2. Frontend detects game header image, extracts App ID
3. Check localStorage cache - if fresh, display cached data
4. Otherwise, call backend with App ID
5. Backend gets game name from Steam, searches HLTB, returns best match
6. Frontend caches result and displays completion times

## Key Design Decisions

- Backend handles all HLTB requests (avoids CORS, enables complex matching logic)
- MutationObserver for SPA navigation detection (Steam doesn't trigger page loads)
- localStorage for caching (simple, synchronous, sufficient for small payloads)
- Stale-while-revalidate caching (show cached data immediately, refresh in background)
- Levenshtein distance for fuzzy game name matching
