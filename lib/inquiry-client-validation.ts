import { isValidPhone as sharedIsValidPhone } from "./phone-utils";

export const NAME_REGEX = /^[A-Za-z][A-Za-z\s\.\-']*$/;
export const isValidName = (s: string) => {
  const t = s.trim().replace(/\s+/g, ' ');
  return t.length >= 2 && t.length <= 100 && NAME_REGEX.test(t);
};

// Re-using phone logic from phone-utils as it has no Node-only dependencies
export const isValidPhone = (raw: string): boolean => {
  return sharedIsValidPhone(raw);
};
