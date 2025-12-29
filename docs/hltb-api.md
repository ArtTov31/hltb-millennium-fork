# HLTB API

HLTB does not provide a public API. The implementation is reverse-engineered from their website and may change without notice.

## Reference Implementations

- Python API: https://github.com/ScrappyCocco/HowLongToBeat-PythonAPI
- Decky plugin: https://github.com/morwy/hltb-for-deck

Our Lua implementation in `backend/hltb.lua` follows these references.

## Key Points

### Search Endpoint

The search URL is dynamically extracted from HLTB's JavaScript bundles. Fallback: `https://howlongtobeat.com/api/search`

### Authentication

Requests require a token from `/api/search/init`. Cached for 5 minutes.

### Search Results

The search response includes completion times directly:
- `comp_main` - Main story (seconds)
- `comp_plus` - Main + extras (seconds)
- `comp_100` - Completionist (seconds)
- `game_id` - HLTB game ID
- `game_name` - Game title

Note: `profile_steam` (Steam App ID) is only available via the game detail endpoint, not search results.

### Game Matching

Priority order:
1. Exact name match (free - uses search results)
2. Levenshtein distance (free - uses search results)
3. Steam ID verification (requires additional HTTP call per candidate)
