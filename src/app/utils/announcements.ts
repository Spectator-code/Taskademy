import { Announcement } from "../types/api";

const ANNOUNCEMENTS_STORAGE_KEY = "announcements";

export function getStoredAnnouncements(): Announcement[] {
  const raw = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
  const parsed: Announcement[] = raw ? JSON.parse(raw) : [];
  return pruneExpiredAnnouncements(parsed, false);
}

export function saveAnnouncements(announcements: Announcement[]): Announcement[] {
  const cleaned = pruneExpiredAnnouncements(announcements, false);
  localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(cleaned));
  return cleaned;
}

export function pruneExpiredAnnouncements(
  announcements: Announcement[],
  persist = true,
): Announcement[] {
  const now = Date.now();
  const active = announcements.filter((announcement) => {
    if (!announcement.expires_at) {
      return true;
    }

    return new Date(announcement.expires_at).getTime() > now;
  });

  if (persist) {
    localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(active));
  }

  return active;
}

export function formatAnnouncementTimeRemaining(expiresAt?: string): string {
  if (!expiresAt) {
    return "No expiry";
  }

  const diffMs = new Date(expiresAt).getTime() - Date.now();

  if (diffMs <= 0) {
    return "Expired";
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h left`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s left`;
  }

  return `${seconds}s left`;
}

export const announcementDurations = [
  { value: "3600", label: "1 Hour" },
  { value: "21600", label: "6 Hours" },
  { value: "86400", label: "1 Day" },
  { value: "259200", label: "3 Days" },
  { value: "604800", label: "7 Days" },
] as const;
