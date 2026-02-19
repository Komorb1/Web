export function nowLocalIso16() {
  const d = new Date();
  // shift date so toISOString() outputs local time instead of UTC
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
}
