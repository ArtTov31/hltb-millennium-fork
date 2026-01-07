---
name: add-name-fix
description: Add a Steam-to-HLTB game name mapping. Usage: /add-name-fix <appid>, <name>, or "Steam Name" -> "HLTB Name"
allowed-tools: Read, Edit, WebFetch, WebSearch
---

# Add Name Fix

Adds a game name mapping from Steam to HLTB in `backend/name_fixes.lua`.

## Input Formats

The skill accepts three input formats:

### 1. Steam App ID
```
/add-name-fix 1004640
```

### 2. Steam Game Name
```
/add-name-fix "FINAL FANTASY TACTICS - The Ivalice Chronicles"
```

### 3. Full Mapping
```
/add-name-fix "FINAL FANTASY TACTICS - The Ivalice Chronicles" -> "Final Fantasy Tactics: The Ivalice Chronicles"
```

## Instructions

### If given an App ID (numeric input):
1. Fetch the Steam API to get the game name:
   `https://store.steampowered.com/api/appdetails?appids={APPID}`
2. Extract the name from `response[appid].data.name`
3. Search HLTB for the game (see "Searching HLTB" below)
4. Present both names and ask user to confirm the mapping

### If given a Steam name only:
1. Search HLTB for the game (see "Searching HLTB" below)
2. Present both names and ask user to confirm the mapping

### If given a full mapping (contains ` -> `):
1. Parse the arguments to extract the Steam name and HLTB name
2. Proceed directly to adding the mapping

### Searching HLTB
1. Use WebSearch to find the HLTB page: `{game_name} howlongtobeat`
2. Find the HLTB game page URL in results (format: `howlongtobeat.com/game/{id}`)
3. Note the exact HLTB game name from the search result title
4. Require the user to confirm the mapping is correct; provide the HLTB game page URL

### Adding the mapping:
1. Sanitize the Steam name (see rules below)
2. Read `backend/name_fixes.lua`
3. Add the new mapping before the closing `}`, using the sanitized Steam name as the key
4. Report the mapping that was added

## Sanitization Rules

Apply these transformations to the Steam name to get the lookup key:
- Remove ™ (trademark symbol)
- Remove ® (registered trademark)
- Remove © (copyright symbol)
- Collapse multiple spaces to single space
- Trim leading/trailing whitespace

## Example Workflow

For app ID 1004640:

1. Fetch Steam API: `https://store.steampowered.com/api/appdetails?appids=1004640`
2. Steam name: "FINAL FANTASY TACTICS - The Ivalice Chronicles"
3. WebSearch: "FINAL FANTASY TACTICS howlongtobeat"
4. Find HLTB page: https://howlongtobeat.com/game/169173
5. HLTB name: "Final Fantasy Tactics: The Ivalice Chronicles"
6. User confirms mapping
7. Add to name_fixes.lua: `["FINAL FANTASY TACTICS - The Ivalice Chronicles"] = "Final Fantasy Tactics: The Ivalice Chronicles"`
