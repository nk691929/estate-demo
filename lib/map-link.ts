export type Coordinates = { lat: number; lng: number };

const NUMBER = "(-?\\d{1,3}\\.\\d+)";

const patterns = [
  new RegExp(`!3d${NUMBER}!4d${NUMBER}`),
  new RegExp(`@${NUMBER},\\s*${NUMBER}`),
  new RegExp(
    `[?&](?:q|ll|query|center|destination)=${NUMBER}(?:,|%2C)\\s*${NUMBER}`,
    "i"
  ),
  new RegExp(`^\\s*${NUMBER}\\s*,\\s*${NUMBER}\\s*$`),
];

export function extractCoordinates(text: string): Coordinates | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;

    const lat = Number(match[1]);
    const lng = Number(match[2]);

    if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
  }

  return null;
}