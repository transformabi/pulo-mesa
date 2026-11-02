export type Currency = "BRL" | "USD" | "EUR";
export type WorkMode = "remoto" | "presencial" | "hibrido";
export type Passport = "valido" | "curto" | "sem";
export type Ancestry = "nenhuma" | "italia" | "portugal" | "espanha" | "alemanha";
export type VisaKind = "residencia" | "estadia" | "cidadania" | "sem-atalho";
export type Qualify = "income" | "savings" | "either" | "none";

export interface Money {
  amount: number;
  currency: Currency;
}

export interface VisaSpec {
  id: string;
  name: string;
  kind: VisaKind;
  qualify: Qualify;
  blurb: string;
  income: Money | null;
  savings: Money | null;
  statementMonths: number;
  agencyBrl: number;
  consularBrl: number;
  cardBrl: number;
  receive: Currency;
  receiveWhy: string;
  allowsRemote: boolean;
  allowsLocalWork: boolean;
  needsBirth: boolean;
  needsApostille: boolean;
  needsTranslation: boolean;
  insurance: "none" | "private" | "pb4";
  residenceNote: string;
  steps: string[];
  trap: string;
  sourceNote: string;
}

export interface WhGate {
  min: number;
  max: number;
  route: VisaSpec;
}

export interface Country {
  id: string;
  name: string;
  region: string;
  aliases?: string[];
  routes: VisaSpec[];
  wh?: WhGate;
}

export interface Ficha {
  passport: Passport;
  countryId: string;
  savings: string;
  savingsCurrency: Currency;
  profession: string;
  years: string;
  rate: string;
  rateCurrency: Currency;
  workMode: WorkMode;
  age: string;
  ancestry: Ancestry;
  fxUsd: string;
  fxEur: string;
}

export interface DocLine {
  id: string;
  name: string;
  where: string;
  days: string;
  costBrl: number;
  costLabel: string;
  pulo: string;
  optional?: boolean;
}

export interface RouteScore {
  country: Country;
  visa: VisaSpec;
  cut: number | null;
  servicesMonth: number | null;
}

export interface Dossier {
  country: Country;
  visa: VisaSpec;
  workFit: "ok" | "ruim";
  fitNote: string;
  servicesMonth: number | null;
  servicesMonthLabel: string;
  servicesReserve: number | null;
  servicesReserveLabel: string;
  incomeLabel: string;
  reserveLabel: string;
  haveLabel: string;
  rateLabel: string;
  receive: Currency;
  receiveWhy: string;
  lines: DocLine[];
  paperBrl: number;
  paperLeverBrl: number | null;
  leverLabel: string | null;
  agencyBrl: number;
  cut: number | null;
  cutLever: number | null;
  stamp: string;
  stampSub: string;
  warnings: string[];
  steps: string[];
  alternatives: RouteScore[];
  ninety: RouteScore[];
  ancestryCard: null | {
    title: string;
    body: string;
    cut: number | null;
    paperBrl: number;
    agencyBrl: number;
    promoted: boolean;
  };
}
