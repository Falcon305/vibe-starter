export function buildContentSecurityPolicy(nonce: string, isDev: boolean): string {
  const scriptSrc = isDev
    ? ["'self'", "'unsafe-eval'", "'unsafe-inline'"]
    : ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'"];

  const connectSrc = isDev ? ["'self'", "ws:", "http:"] : ["'self'"];

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": scriptSrc,
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "font-src": ["'self'", "data:"],
    "connect-src": connectSrc,
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "frame-src": ["'none'"],
    "worker-src": ["'self'", "blob:"],
    "manifest-src": ["'self'"],
  };

  const policy = Object.entries(directives)
    .map(([directive, values]) => `${directive} ${values.join(" ")}`)
    .join("; ");

  return isDev ? policy : `${policy}; upgrade-insecure-requests`;
}
