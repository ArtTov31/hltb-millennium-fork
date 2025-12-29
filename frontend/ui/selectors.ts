import { EUIMode, type UIModeConfig } from '../types';

// Desktop mode selectors
export const DESKTOP_CONFIG: UIModeConfig = {
  mode: EUIMode.Desktop,
  modeName: 'Desktop',
  headerImageSelector: '._3NBxSLAZLbbbnul8KfDFjw._2dzwXkCVAuZGFC-qKgo8XB',
  fallbackImageSelector: 'img.HNbe3eZf6H7dtJ042x1vM[src*="library_hero"]',
  containerSelector: '.NZMJ6g2iVnFsOOp-lDmIP',
  appIdPattern: /\/assets\/(\d+)/,
};

// Big Picture / GamePad mode selectors
// Intentionally duplicated from desktop - kept separate so modes can diverge if Steam
// uses different selectors for Big Picture vs Desktop in the future
export const GAMEPAD_CONFIG: UIModeConfig = {
  mode: EUIMode.GamePad,
  modeName: 'Big Picture',
  headerImageSelector: '._3NBxSLAZLbbbnul8KfDFjw._2dzwXkCVAuZGFC-qKgo8XB',
  fallbackImageSelector: 'img.HNbe3eZf6H7dtJ042x1vM[src*="library_hero"]',
  containerSelector: '.NZMJ6g2iVnFsOOp-lDmIP',
  appIdPattern: /\/assets\/(\d+)/,
};

export function getConfigForMode(mode: EUIMode): UIModeConfig {
  return mode === EUIMode.GamePad ? GAMEPAD_CONFIG : DESKTOP_CONFIG;
}
