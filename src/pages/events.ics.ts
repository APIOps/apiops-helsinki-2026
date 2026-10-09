import events from "../data/events.json";

export const prerender = true;

function escapeText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function nextDay(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

// iCalendar lines must be folded at 75 UTF-8 bytes, without splitting a character.
function foldLine(line: string) {
  const parts: string[] = [];
  let part = "";
  let bytes = 0;
  for (const char of line) {
    const size = new TextEncoder().encode(char).length;
    if (bytes + size > 75) {
      parts.push(part);
      part = " ";
      bytes = 1;
    }
    part += char;
    bytes += size;
  }
  parts.push(part);
  return parts.join("\r\n");
}

export function GET() {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//APIOps Community//Events//EN",
    "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    ...events.filter((event) => event.year).flatMap((event) => [
      "BEGIN:VEVENT",
      `UID:${event.id}@apiops.info`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${event.startDate.replace(/-/g, "")}`,
      `DTEND;VALUE=DATE:${nextDay(event.endDate)}`,
      `SUMMARY:${escapeText(event.title)}`,
      `LOCATION:${escapeText(event.location)}`,
      `DESCRIPTION:${escapeText(event.description)}`,
      `URL:${new URL(event.learnUrl, "https://www.apiops.info").href}`,
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ];
  return new Response(lines.map(foldLine).join("\r\n") + "\r\n", {
    headers: { "Content-Type": "text/calendar; charset=utf-8" },
  });
}
