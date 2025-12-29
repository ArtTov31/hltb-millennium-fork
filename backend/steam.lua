--[[
    Steam API Helpers for Lua

    Standalone module for Steam store API queries.
    Requires: http, json modules

    Usage:
        local steam = require("steam")
        local name, err = steam.get_game_name(1234)
]]

local http = require("http")
local json = require("json")

local M = {}

M.STORE_API_URL = "https://store.steampowered.com/api/appdetails"
M.TIMEOUT = 10

-- Get game details from Steam API
function M.get_app_details(app_id)
    if not app_id then
        return nil, "app_id is nil"
    end
    local url = M.STORE_API_URL .. "?appids=" .. app_id

    local response, err = http.get(url, { timeout = M.TIMEOUT })

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

    local app_data = data[tostring(app_id)]
    if not app_data or not app_data.success then
        return nil, "App not found"
    end

    return app_data.data, nil
end

-- Get just the game name
function M.get_game_name(app_id)
    local details, err = M.get_app_details(app_id)
    if not details then
        return nil, err
    end
    return details.name, nil
end

return M
