import { definePlugin, IconsModule, Field, DialogButton } from '@steambrew/client';
import { log } from './services/logger';
import {
  initUIMode,
  getCurrentConfig,
  registerModeChangeListener,
  onModeChange,
} from './ui/uiMode';
import { setupObserver, resetState } from './injection/observer';
import { exposeDebugTools } from './debug/tools';
import { clearCache, getCacheStats } from './services/cache';

const { useState } = (window as any).SP_REACT;

async function init(): Promise<void> {
  log('Initializing HLTB plugin...');

  try {
    const { mode, document } = await initUIMode();
    const config = getCurrentConfig();

    log('Mode:', config.modeName);
    log('Using selectors:', {
      headerImage: config.headerImageSelector,
      fallbackImage: config.fallbackImageSelector,
      container: config.containerSelector,
    });

    await setupObserver(document, config);
    exposeDebugTools(document);

    registerModeChangeListener();

    onModeChange(async (newMode, newDoc) => {
      log('Reinitializing for mode change...');
      resetState();
      const newConfig = getCurrentConfig();
      await setupObserver(newDoc, newConfig);
      exposeDebugTools(newDoc);
      log('Reinitialized for', newConfig.modeName, 'mode');
    });
  } catch (e) {
    log('Failed to initialize:', e);
  }
}

const SettingsContent = () => {
  const [message, setMessage] = useState('');

  const onCacheStats = () => {
    const stats = getCacheStats();
    if (stats.count === 0) {
      setMessage('Cache is empty');
    } else {
      const age = stats.oldestTimestamp
        ? Math.round((Date.now() - stats.oldestTimestamp) / (1000 * 60 * 60 * 24))
        : 0;
      setMessage(`${stats.count} games cached, oldest is ${age} days old`);
    }
  };

  const onClearCache = () => {
    clearCache();
    setMessage('Cache cleared');
  };

  return (
    <>
      <Field label="Cache Statistics" bottomSeparator="standard">
        <DialogButton onClick={onCacheStats} style={{ padding: '8px 16px' }}>View Stats</DialogButton>
      </Field>
      <Field label="Clear Cache" bottomSeparator="standard">
        <DialogButton onClick={onClearCache} style={{ padding: '8px 16px' }}>Clear</DialogButton>
      </Field>
      {message && <Field description={message} />}
    </>
  );
};

export default definePlugin(() => {
  init();
  return {
    title: 'HLTB for Steam',
    icon: <IconsModule.Settings />,
    content: <SettingsContent />,
  };
});
