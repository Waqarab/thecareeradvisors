/**
 * Valid: +919876543210, +919999999999, +14155552671, +442071234567
 * Invalid: 1234567890, 0987654321, 9876543210, 5432154321, 1234512345, 0000000000, +91555555555, 5555555555, 1111111111
 */
export function isValidPhone(raw: string): boolean {
  // 1. Base format:
  if (!/^\+?[0-9]{7,15}$/.test(raw)) {
    return false;
  }

  // 2. Digits-only extraction:
  const d = raw.startsWith("+") ? raw.slice(1) : raw;

  // 3. Reject all-same-digit:
  if (/^(\d)\1+$/.test(d)) {
    return false;
  }

  // 4. Reject repeated short blocks:
  if (/^(.{1,5})\1+$/.test(d)) {
    return false;
  }

  // 5. Reject ascending/descending monotonic runs:
  const asc = "01234567890123456789";
  const desc = "98765432109876543210";
  if (asc.includes(d) || desc.includes(d)) {
    return false;
  }

  // 6. India-specific first-digit check:
  const isIndiaWithPrefix = raw.startsWith("+91");
  const isIndiaLocal = !raw.startsWith("+") && d.length === 10;
  
  if (isIndiaWithPrefix || isIndiaLocal) {
    const local = isIndiaWithPrefix ? raw.slice(3) : raw;
    if (!/^[6-9][0-9]{9}$/.test(local)) {
      return false;
    }
  }

  // 7. Pass all checks
  return true;
}
