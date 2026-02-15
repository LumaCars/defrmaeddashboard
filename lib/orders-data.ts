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

export const initialOrders: CustomerOrder[] = [
  { id: "1", customerName: "Alexander Müller", email: "a.mueller@mail.ch", phone: "+41 79 123 4567", cardType: "Ultra", cardColor: "24K Gold Edition", paymentMethod: "Crypto", orderDate: "2026-02-10", status: "Processing" },
  { id: "2", customerName: "Sophie Laurent", email: "sophie.l@mail.fr", phone: "+33 6 12 34 56 78", cardType: "Elite", cardColor: "Matte Black", paymentMethod: "Bank Transfer", orderDate: "2026-02-08", status: "Processing" },
  { id: "3", customerName: "James Whitfield", email: "j.whitfield@mail.uk", phone: "+44 7700 900123", cardType: "Pro", cardColor: "Rainbow", paymentMethod: "Crypto", orderDate: "2026-02-06", status: "Processing" },
  { id: "4", customerName: "Lena Fischer", email: "lena.f@mail.de", phone: "+49 170 1234567", cardType: "Ultra", cardColor: "Brushed Black", paymentMethod: "Bank Transfer", orderDate: "2026-02-05", status: "Processing" },
  { id: "5", customerName: "Marco Rossi", email: "m.rossi@mail.it", phone: "+39 345 678 9012", cardType: "Elite", cardColor: "White", paymentMethod: "Crypto", orderDate: "2026-02-04", status: "Processing" },
  { id: "6", customerName: "Yuki Tanaka", email: "y.tanaka@mail.jp", phone: "+81 90 1234 5678", cardType: "Pro", cardColor: "Stainless Steel", paymentMethod: "Bank Transfer", orderDate: "2026-02-03", status: "Processing" },
  { id: "7", customerName: "Elena Petrova", email: "e.petrova@mail.ae", phone: "+971 50 123 4567", cardType: "Ultra", cardColor: "Glossy Black", paymentMethod: "Crypto", orderDate: "2026-02-09", status: "Processing" },
  { id: "8", customerName: "Carlos Mendez", email: "c.mendez@mail.mx", phone: "+52 55 1234 5678", cardType: "Pro", cardColor: "Blue", paymentMethod: "Bank Transfer", orderDate: "2026-02-07", status: "Processing" },
];

export function formatEuro(value: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(value);
}

export function formatEuroCompact(value: number): string {
  if (value >= 1000000) return `\u20AC${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `\u20AC${(value / 1000).toFixed(1)}K`;
  return formatEuro(value);
}
