type JwtPayload = Record<string, unknown>;

function readCookie(name: string) {
  if (typeof document === 'undefined') {
    return undefined;
  }

  return document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split('=')
    .slice(1)
    .join('=');
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const binary = window.atob(paddedBase64);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

function decodeJwtPayload(token: string): JwtPayload | null {
  const payload = token.split('.')[1];

  if (!payload || typeof window === 'undefined') {
    return null;
  }

  try {
    const decodedPayload = JSON.parse(decodeBase64Url(payload)) as unknown;
    return decodedPayload && typeof decodedPayload === 'object' && !Array.isArray(decodedPayload)
      ? (decodedPayload as JwtPayload)
      : null;
  } catch {
    return null;
  }
}

export function createInitials(fullName: string) {
  const words = fullName.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return 'U';
  }

  return words
    .slice(0, 2)
    .map((word) => Array.from(word)[0])
    .filter(Boolean)
    .join('')
    .toUpperCase();
}

export function getAuthTokenInitials() {
  const encodedToken = readCookie('auth-token');
  const token = encodedToken ? decodeURIComponent(encodedToken) : undefined;
  const payload = token ? decodeJwtPayload(token) : null;
  const fullName = payload?.full_name ?? payload?.name;

  return typeof fullName === 'string' && fullName.trim() ? createInitials(fullName) : 'U';
}

export function getFallbackInitials() {
  return 'U';
}

export function subscribeAuthTokenInitials() {
  return () => undefined;
}
