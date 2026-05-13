export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-GH", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-GH", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function timeAgo(date: string | Date): string {
  const now = Date.now();
  const d = new Date(date).getTime();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}
