/** Convert a local Iraqi number like 07711911901 to a wa.me URL (+964). */
export function toWaUrl(num: string): string {
  const digits = num.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? "964" + digits.slice(1) : digits;
  return `https://wa.me/${intl}`;
}
