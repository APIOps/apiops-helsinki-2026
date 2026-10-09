type EventDates = {
  status: string;
  year: string;
  startDate: string;
  endDate: string;
};

export function getToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Helsinki",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function isPastEvent(event: EventDates, today = getToday()) {
  return event.status === "Past event" || Boolean(event.year && event.endDate < today);
}

export function getCurrentEvents<T extends EventDates>(events: T[], today = getToday()) {
  return events.map((event) => ({
    ...event,
    status: isPastEvent(event, today) ? "Past event" : event.status,
  })).sort((a, b) => a.startDate.localeCompare(b.startDate));
}
