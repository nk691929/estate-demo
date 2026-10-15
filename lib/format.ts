import type { AreaUnit, PropertyPurpose } from "@/features/properties/types";

function trimDecimals(value: number): string {
  return Number(value.toFixed(2)).toString();
}

export function formatPrice(
  price: number,
  purpose: PropertyPurpose = "sale"
): string {
  let text: string;

  if (price >= 10_000_000) {
    text = `${trimDecimals(price / 10_000_000)} Crore`;
  } else if (price >= 100_000) {
    text = `${trimDecimals(price / 100_000)} Lakh`;
  } else {
    text = price.toLocaleString("en-PK");
  }

  return purpose === "rent" ? `PKR ${text} / month` : `PKR ${text}`;
}

const unitLabels: Record<AreaUnit, string> = {
  marla: "Marla",
  kanal: "Kanal",
  sqft: "sqft",
};

export function formatSize(size: number, unit: AreaUnit): string {
  return `${size.toLocaleString("en-PK")} ${unitLabels[unit]}`;
}