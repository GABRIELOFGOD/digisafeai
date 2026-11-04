const nigeriaDateTimeFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Africa/Lagos",
  timeZoneName: "short",
});

export function formatNigeriaDateTime(value: Date | string) {
  return nigeriaDateTimeFormatter.format(new Date(value));
}
