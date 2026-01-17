--[[
    Steam API Helpers for Lua

    Standalone module for game metadata queries.
    Modified to use SteamHunters API to bypass Steam Store region locks.
    Requires: http, json modules

    Usage:
        local steam = require("steam")
        local name, err = steam.get_game_name(1234)
]]

local http = require("http")
local json = require("json")

local M = {}

M.API_URL = "https://steamhunters.com/api/apps/"
M.TIMEOUT = 15

-- Headers required by SteamHunters to accept the request
-- Mimics a standard browser request to avoid 403 errors
local HEADERS = {
    ["Accept"] = "application/json",
    ["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.142.86 Safari/537.36",
    ["X-Requested-With"] = "Steam"
}

-- Get game details from SteamHunters API
-- This source is used instead of the Store API to support region-locked games
function M.get_app_details(app_id)
    if not app_id then
        return nil, "app_id is nil"
    end
    
    local url = M.API_URL .. app_id

    local response, err = http.get(url, { 
        timeout = M.TIMEOUT,
        headers = HEADERS
    })

    if not response then
        return nil, "Request failed: " .. (err or "unknown")
    end

    if response.status ~= 200 then
        return nil, "HTTP " .. response.status
    end

    local success, data = pcall(json.decode, response.body)
    if not success or not data then
        return nil, "Invalid JSON response"
    end

    -- SteamHunters returns the game object directly (e.g., { "id": ..., "name": ... })
    -- No need to unwrap "app_data.success" like in the official Store API
    return data, nil
end

-- Get just the game name
function M.get_game_name(app_id)
    local details, err = M.get_app_details(app_id)
    if not details then
        return nil, err
    end
    
    if not details.name then
        return nil, "Name field missing in response"
    end

    return details.name, nil
end

return M
