import {
  differenceInDays,
  differenceInHours,
  isValid,
  parseISO,
} from "date-fns";

const formatTimestamp = (timestamp: string | Date) => {
  if (!timestamp) return "";

  // Parse string timestamps to Date
  const date = typeof timestamp === "string" ? parseISO(timestamp) : timestamp;
  if (!isValid(date)) return "";

  const now = new Date();
  const diffHours = differenceInHours(now, date);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = differenceInDays(now, date);
  return `${diffDays}d ago`;
};

export default formatTimestamp;
