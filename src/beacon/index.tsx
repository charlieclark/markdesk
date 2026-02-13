/** @jsxImportSource preact */
import { h, render } from 'preact';
import BeaconApp from './BeaconApp';

// Self-initializing IIFE
(function () {
  const config = (window as any).MarkdeskConfig;
  if (!config || !config.helpCenterUrl) {
    console.warn('Markdesk: Missing MarkdeskConfig.helpCenterUrl');
    return;
  }

  // Inject scoped styles (CSS is injected by the build script)
  // @ts-expect-error — __BEACON_CSS__ is replaced at build time
  const css = typeof __BEACON_CSS__ !== 'undefined' ? __BEACON_CSS__ : '';
  if (css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Create container
  const container = document.createElement('div');
  container.id = 'markdesk-beacon';
  document.body.appendChild(container);

  // Render the Preact app
  render(<BeaconApp config={config} />, container);
})();
