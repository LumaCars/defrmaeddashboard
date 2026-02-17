export type CardType = "Pro" | "Elite" | "Ultra";

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
  address: string;
  engravedName?: string;
  wantsEngraving: boolean;
  paymentMethod: string;
  orderDate: string;
  status: string;
  priceCents: number;
  message?: string;
}

/** Raw row from Supabase */
export interface DbCardOrder {
  id: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  card_type: string | null;
  card_color: string | null;
  address: string | null;
  wants_engraving: boolean | null;
  engraved_name: string | null;
  payment_method: string | null;
  message: string | null;
  status: string | null;
  price_cents: number | null;
  currency: string | null;
}

function normalizeCardType(raw: string | null): CardType {
  if (!raw) return "Pro";
  const lower = raw.toLowerCase();
  if (lower.includes("ultra")) return "Ultra";
  if (lower.includes("elite")) return "Elite";
  return "Pro";
}

/** Convert a DB row into the dashboard UI model */
export function mapDbOrder(row: DbCardOrder): CustomerOrder {
  const cardType = normalizeCardType(row.card_type);
  return {
    id: row.id,
    customerName: [row.first_name, row.last_name].filter(Boolean).join(" ") || "Unknown",
    email: row.email ?? "",
    phone: row.phone ?? "",
    cardType,
    cardColor: row.card_color ?? "-",
    address: row.address ?? "-",
    engravedName: row.engraved_name ?? undefined,
    wantsEngraving: row.wants_engraving ?? false,
    paymentMethod: row.payment_method ?? "-",
    orderDate: row.created_at ? row.created_at.slice(0, 10) : "",
    status: row.status ?? "new",
    priceCents: row.price_cents ?? 0,
    message: row.message ?? undefined,
  };
}

export const initialOrders: CustomerOrder[] = [];
