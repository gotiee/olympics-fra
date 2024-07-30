export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function firstLetterToUpperCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getDateFromString(date: string): Date {
  const [day, month, year] = date.split("/");
  return new Date(`${year}-${month}-${day}`);
}

export function cleanChannelName(channel: string): string {
  const tmp = channel.replace(/[^a-zA-Z0-9]/g, " ").toLowerCase();
  return tmp.charAt(0).toUpperCase() + tmp.slice(1);
}
