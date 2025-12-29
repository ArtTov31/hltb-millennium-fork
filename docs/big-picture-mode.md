# Big Picture Mode

Steam has two UI modes that run as separate windows:
- Desktop UI (`SP Desktop_uid0`) - mouse and keyboard
- GamepadUI (`SP GamepadUI_*`) - Big Picture, Steam Deck, controller

Both use React/CEF but have different DOM structures. The DOM selectors we chose work in both modes currently, but if this changes in the future it is an easy fix.

## Current Status

Both modes are supported. The plugin detects the current mode via `SteamClient.UI.GetUIMode()` and uses appropriate selectors for each.

Mode switching (Desktop to Big Picture and back) is handled by re-initializing when the mode changes.

## Testing

Launch Big Picture with dev tools:
```
steam -gamepadui -dev
```

## Known Issues

- Black screen on hibernation wake (Millennium issue #489) - use Windows sleep instead of Big Picture suspend

## Reference

For GamepadUI patterns, see hltb-for-deck: https://github.com/morwy/hltb-for-deck
