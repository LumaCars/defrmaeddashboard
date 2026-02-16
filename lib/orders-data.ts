export type CardType = "Pro" | "Elite" | "Ultra";
export type PaymentMethod = "Crypto" | "Bank Transfer";

export const cardPrices: Record<CardType, number> = {
  Pro: 1449,
  Elite: 3599,
  Ultra: 14499,
};

export interface CustomerOrder {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  cardType: CardType;
  cardColor: string;
  paymentMethod: PaymentMethod;
  orderDate: string;
  status: "Processing" | "Completed";
}

export const initialOrders: CustomerOrder[] = [];

export function formatEuro(value: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(value);
}

export function formatEuroCompact(value: number): string {
  if (value >= 1000000) return `\u20AC${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `\u20AC${(value / 1000).toFixed(1)}K`;
  return formatEuro(value);
}
