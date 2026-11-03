/** Read the public, read-only Apps Script catalog via JSONP. */
export const fetchCatalogFromAppsScript = (endpointUrl, timeoutMs = 8000) => {
  if (!endpointUrl) return Promise.reject(new Error('Catalog API URL is not configured.'));

  return new Promise((resolve, reject) => {
    const callbackName = `__bssCatalog_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement('script');
    const url = new URL(endpointUrl);
    url.searchParams.set('action', 'catalog');
    url.searchParams.set('callback', callbackName);

    let settled = false;
    const cleanup = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      delete window[callbackName];
      script.remove();
    };
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error('Catalog request timed out.'));
    }, timeoutMs);

    window[callbackName] = (payload) => {
      cleanup();
      if (!payload || payload.ok !== true || !Array.isArray(payload.products)) {
        reject(new Error(payload?.error || 'Catalog response was invalid.'));
        return;
      }
      resolve(payload.products);
    };

    script.async = true;
    script.src = url.toString();
    script.onerror = () => {
      cleanup();
      reject(new Error('Could not load the catalog service.'));
    };
    document.head.appendChild(script);
  });
};
