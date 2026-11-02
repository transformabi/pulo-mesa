import type { Currency, Money } from "@/lib/pulo/types";

export const FX_DEFAULT = { USD: 5.45, EUR: 6.05 };

export function parseAmount(raw: string): number {
  const t = raw.trim();
  if (!t) return Number.NaN;
  if (t.includes(",")) {
    const n = Number(t.replace(/\./g, "").replace(",", ".").replace(/\s/g, ""));
    return n;
  }
  return Number(t.replace(/\s/g, ""));
}

export function fxRate(currency: Currency, fxUsd: number, fxEur: number): number {
  if (currency === "USD") return fxUsd > 0 ? fxUsd : FX_DEFAULT.USD;
  if (currency === "EUR") return fxEur > 0 ? fxEur : FX_DEFAULT.EUR;
  return 1;
}

export function toBrl(money: Money, fxUsd: number, fxEur: number): number {
  return money.amount * fxRate(money.currency, fxUsd, fxEur);
}

export function formatMoney(amount: number, currency: Currency): string {
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    maximumFractionDigits: amount >= 100 ? 0 : 2,
  }).format(amount);
}

export function formatBrl(amount: number): string {
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatPct(cut: number | null): string {
  if (cut == null || !Number.isFinite(cut)) return "—";
  return `${Math.round(cut * 100)}%`;
}

export function servicesFor(targetBrl: number, rateBrl: number): number | null {
  if (!Number.isFinite(targetBrl) || targetBrl <= 0) return 0;
  if (!Number.isFinite(rateBrl) || rateBrl <= 0) return null;
  return Math.ceil(targetBrl / rateBrl);
}

export const CURRENCY_LABEL: Record<Currency, string> = {
  BRL: "Real",
  USD: "Dólar",
  EUR: "Euro",
};
