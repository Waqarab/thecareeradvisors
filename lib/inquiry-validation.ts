import { isValidPhone } from "./phone-utils";

export type ValidatedInquiry = {
  name: string;
  email: string;
  phone: string;
  neetScore: string;
  countries: string[];
  message: string;
  isUnder18: "Yes" | "No";
  guardianName?: string;
  guardianPhone?: string;
  agreeToTerms: boolean;
  consentMarketing: boolean;
  source: string;
  formLocation: string;
};

export function validateInquiry(body: unknown): { ok: true; data: ValidatedInquiry } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request payload." };
  }

  const raw = body as Record<string, unknown>;
  const allowedKeys = new Set([
    "name", "email", "phone", "neetScore", "countries", "message",
    "isUnder18", "guardianName", "guardianPhone", "agreeToTerms",
    "consentMarketing", "source", "formLocation"
  ]);

  for (const key of Object.keys(raw)) {
    if (!allowedKeys.has(key)) {
      return { ok: false, error: `Unknown field provided: ${key}` };
    }
  }

  const strip = (val: unknown) => (typeof val === "string" ? val.trim() : val);

  // Valid names:
  //   "Rahul Kumar"
  //   "A. P. J. Abdul Kalam"
  //   "Anne-Marie"
  //   "O'Brien"
  //   "  John   Doe  "   → trimmed to "John Doe"
  //
  // Invalid names:
  //   "Rahul123"          (digits)
  //   "=cmd|calc"         (starts with =)
  //   "<script>"          (angle brackets)
  //   "John@Doe"          (email symbol)
  //   "John_Doe"          (underscore)
  //   "  "                (whitespace only)
  //   "J"                 (too short)
  //   "A".repeat(101)     (too long)
  const name = typeof raw.name === "string" ? raw.name.trim().replace(/\s+/g, " ") : raw.name;
  if (
    typeof name !== "string" ||
    name.length < 2 ||
    name.length > 100 ||
    !/^[A-Za-z][A-Za-z\s\.\-']*$/.test(name)
  ) {
    return { ok: false, error: "Please enter a valid name (letters, spaces, and '. - ' only)." };
  }

  const email = strip(raw.email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof email !== "string" || email.length < 5 || email.length > 100 || !emailRegex.test(email)) {
    return { ok: false, error: "A valid email address is required." };
  }

  const phone = strip(raw.phone);
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  if (typeof phone !== "string" || !phoneRegex.test(phone)) {
    return { ok: false, error: "Please enter a valid phone number." };
  }
  if (!isValidPhone(phone)) {
    return { ok: false, error: "This phone number looks invalid. Please check and try again." };
  }

  const neetScore = strip(raw.neetScore);
  if (typeof neetScore !== "string" || neetScore.length > 50) {
    return { ok: false, error: "NEET Score must not exceed 50 characters." };
  }

  const countries = raw.countries;
  if (!Array.isArray(countries) || countries.length < 1 || countries.length > 20) {
    return { ok: false, error: "You must select between 1 and 20 preferred countries." };
  }
  const strippedCountries: string[] = [];
  for (const c of countries) {
    const sc = strip(c);
    if (typeof sc !== "string" || sc.length < 1 || sc.length > 50) {
      return { ok: false, error: "Each preferred country must be between 1 and 50 characters." };
    }
    strippedCountries.push(sc);
  }

  const message = strip(raw.message);
  if (typeof message !== "string" || message.length > 2000) {
    return { ok: false, error: "Message must not exceed 2000 characters." };
  }

  const isUnder18 = strip(raw.isUnder18);
  if (isUnder18 !== "Yes" && isUnder18 !== "No") {
    return { ok: false, error: "Please indicate whether you are under 18." };
  }

  let guardianName: string | undefined = undefined;
  let guardianPhone: string | undefined = undefined;

  if (isUnder18 === "Yes") {
    guardianName = strip(raw.guardianName) as string | undefined;
    if (typeof guardianName !== "string" || guardianName.length < 2 || guardianName.length > 100) {
      return { ok: false, error: "Guardian Name must be between 2 and 100 characters." };
    }
    guardianPhone = strip(raw.guardianPhone) as string | undefined;
    if (typeof guardianPhone !== "string" || !phoneRegex.test(guardianPhone)) {
      return { ok: false, error: "Please enter a valid phone number." };
    }
    if (!isValidPhone(guardianPhone)) {
      return { ok: false, error: "This phone number looks invalid. Please check and try again." };
    }
  }

  const agreeToTerms = raw.agreeToTerms;
  if (agreeToTerms !== true) {
    return { ok: false, error: "You must agree to the Terms & Privacy Policy." };
  }

  const consentMarketing = raw.consentMarketing;
  if (typeof consentMarketing !== "boolean") {
    return { ok: false, error: "Marketing consent must be a boolean." };
  }

  const source = strip(raw.source);
  if (typeof source !== "string" || source.length < 1 || source.length > 100) {
    return { ok: false, error: "Invalid traffic source." };
  }

  const formLocation = strip(raw.formLocation);
  if (typeof formLocation !== "string" || formLocation.length < 1 || formLocation.length > 100) {
    return { ok: false, error: "Invalid form location." };
  }

  const data: ValidatedInquiry = {
    name,
    email,
    phone,
    neetScore,
    countries: strippedCountries,
    message,
    isUnder18,
    agreeToTerms,
    consentMarketing,
    source,
    formLocation,
  };

  if (isUnder18 === "Yes") {
    data.guardianName = guardianName;
    data.guardianPhone = guardianPhone;
  }

  return { ok: true, data };
}
