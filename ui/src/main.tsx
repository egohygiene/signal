import './index.css';
import './i18n';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/App.tsx';
import { logger } from './logging';

async function enableMocking(): Promise<void> {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
}

function renderApp(): void {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error("Root element '#root' not found in the document. Ensure index.html contains a <div id=\"root\">.");
  }

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

enableMocking()
  .then(renderApp)
  .catch((error: unknown) => {
    logger.error(error, 'MSW failed to initialize. Rendering app without mocking.');
    renderApp();
  });
