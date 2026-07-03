import { cspAdditions } from "@/lib/security/csp.generated";

export function buildContentSecurityPolicy(nonce: string, isDev: boolean): string {
  const scriptSrc = isDev
    ? ["'self'", "'unsafe-eval'", "'unsafe-inline'", ...cspAdditions.scriptSrc]
    : ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", ...cspAdditions.scriptSrc];

  const connectSrc = isDev
    ? ["'self'", "ws:", "http:", ...cspAdditions.connectSrc]
    : ["'self'", ...cspAdditions.connectSrc];

  const frameSrc =
    cspAdditions.frameSrc.length > 0 ? ["'self'", ...cspAdditions.frameSrc] : ["'none'"];

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": scriptSrc,
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:", "https:", ...cspAdditions.imgSrc],
    "font-src": ["'self'", "data:"],
    "connect-src": connectSrc,
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "frame-src": frameSrc,
    "worker-src": ["'self'", "blob:"],
    "manifest-src": ["'self'"],
  };

  const policy = Object.entries(directives)
    .map(([directive, values]) => `${directive} ${values.join(" ")}`)
    .join("; ");

  return isDev ? policy : `${policy}; upgrade-insecure-requests`;
}
