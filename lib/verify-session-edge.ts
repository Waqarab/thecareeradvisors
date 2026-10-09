import { jwtVerify, importX509, type JWTPayload } from "jose";

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!FIREBASE_PROJECT_ID) {
  throw new Error(
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set. Cannot verify session cookies."
  );
}

const PUBLIC_KEYS_URL =
  "https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys";

type KeyType = Awaited<ReturnType<typeof importX509>>;

let cachedKeys: Record<string, KeyType> | null = null;
let keysExpiry = 0;

async function fetchKeys(): Promise<Record<string, KeyType>> {
  if (cachedKeys && Date.now() < keysExpiry) {
    return cachedKeys;
  }

  const res = await fetch(PUBLIC_KEYS_URL);
  if (!res.ok) {
    throw new Error("Failed to fetch Firebase session public keys");
  }

  const cacheControl = res.headers.get("cache-control") || "";
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : 3600;

  const pems = await res.json();
  const keys: Record<string, KeyType> = {};

  for (const [kid, pem] of Object.entries(pems)) {
    keys[kid] = await importX509(pem as string, "RS256");
  }

  cachedKeys = keys;
  keysExpiry = Date.now() + maxAge * 1000;

  return keys;
}

export type SessionPayload = JWTPayload & {
  email?: string;
  admin?: boolean;
  user_id?: string;
};

/**
 * Verify a Firebase session cookie using public keys, in-process.
 * Throws on invalid signature, wrong issuer, wrong audience, or expired token.
 *
 * Does NOT check revocation status — the API routes handle that.
 */
export async function verifySessionCookieEdge(
  sessionCookie: string
): Promise<SessionPayload> {
  const getKey = async (protectedHeader: any) => {
    const keys = await fetchKeys();
    const kid = protectedHeader.kid;
    if (!kid || !keys[kid]) {
      // Force refresh if key is not found (key rotation might have happened)
      cachedKeys = null;
      const refreshedKeys = await fetchKeys();
      if (!kid || !refreshedKeys[kid]) {
        throw new Error("Invalid or missing kid in session cookie");
      }
      return refreshedKeys[kid];
    }
    return keys[kid];
  };

  const { payload } = await jwtVerify(sessionCookie, getKey, {
    issuer: `https://session.firebase.google.com/${FIREBASE_PROJECT_ID}`,
    audience: FIREBASE_PROJECT_ID,
  });

  return payload as SessionPayload;
}

export function isAdminPayload(
  payload: SessionPayload,
  superAdminEmail: string | undefined
): boolean {
  if (!payload.email) return false;
  if (payload.admin === true) return true;
  if (superAdminEmail && payload.email === superAdminEmail) return true;
  return false;
}
