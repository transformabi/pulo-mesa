import {
  ancestryUnlocks,
  ancestryVisa,
  COUNTRIES,
  findCountry,
  suggestId,
} from "@/lib/pulo/catalog";
import { buildPaper, cutOf } from "@/lib/pulo/documents";
import { formatBrl, formatMoney, formatPct, parseAmount, servicesFor, toBrl } from "@/lib/pulo/money";
import type {
  Dossier,
  Ficha,
  RouteScore,
  VisaSpec,
  WorkMode,
} from "@/lib/pulo/types";

const EMPTY: Ficha = {
  passport: "valido",
  countryId: "",
  savings: "",
  savingsCurrency: "BRL",
  profession: "",
  years: "",
  rate: "",
  rateCurrency: "BRL",
  workMode: "remoto",
  age: "",
  ancestry: "nenhuma",
  fxUsd: "5.45",
  fxEur: "6.05",
};

export const EMPTY_FICHA: Ficha = EMPTY;

function fits(visa: VisaSpec, mode: WorkMode): boolean {
  if (visa.kind === "sem-atalho" || visa.kind === "cidadania") return true;
  if (mode === "remoto") return visa.allowsRemote;
  if (mode === "presencial") return visa.allowsLocalWork;
  return visa.allowsRemote || visa.allowsLocalWork;
}

function numbers(ficha: Ficha) {
  const fxUsd = parseAmount(ficha.fxUsd);
  const fxEur = parseAmount(ficha.fxEur);
  const usd = Number.isFinite(fxUsd) && fxUsd > 0 ? fxUsd : 5.45;
  const eur = Number.isFinite(fxEur) && fxEur > 0 ? fxEur : 6.05;
  const savings = parseAmount(ficha.savings);
  const rate = parseAmount(ficha.rate);
  const years = parseAmount(ficha.years);
  const age = parseAmount(ficha.age);
  const savingsBrl =
    Number.isFinite(savings) && savings > 0
      ? toBrl({ amount: savings, currency: ficha.savingsCurrency }, usd, eur)
      : 0;
  const rateBrl =
    Number.isFinite(rate) && rate > 0
      ? toBrl({ amount: rate, currency: ficha.rateCurrency }, usd, eur)
      : 0;
  return {
    usd,
    eur,
    savingsBrl,
    rateBrl,
    years: Number.isFinite(years) ? years : 0,
    age: Number.isFinite(age) ? age : null,
  };
}

function serviceMath(visa: VisaSpec, ficha: Ficha) {
  const { usd, eur, savingsBrl, rateBrl } = numbers(ficha);
  const incomeBrl = visa.income ? toBrl(visa.income, usd, eur) : 0;
  const savingsNeedBrl = visa.savings ? toBrl(visa.savings, usd, eur) : 0;
  const servicesMonth =
    visa.qualify === "income" || visa.qualify === "either"
      ? servicesFor(incomeBrl, rateBrl)
      : visa.qualify === "none" || visa.qualify === "savings"
        ? 0
        : null;

  let reserveGap = 0;
  if (visa.qualify === "savings" || visa.qualify === "either") {
    reserveGap = Math.max(0, savingsNeedBrl - savingsBrl);
  }
  const servicesReserve =
    visa.qualify === "savings" || visa.qualify === "either"
      ? servicesFor(reserveGap, rateBrl)
      : 0;

  return { incomeBrl, savingsNeedBrl, servicesMonth, servicesReserve, reserveGap, savingsBrl, rateBrl };
}

function scoreTuple(visa: VisaSpec, ficha: Ficha): number[] {
  const paper = buildPaper(visa, ficha);
  const cut = cutOf(visa.agencyBrl, paper.totalBrl) ?? 0;
  const math = serviceMath(visa, ficha);
  const kind = visa.kind === "residencia" ? 0 : visa.kind === "cidadania" ? 0 : visa.kind === "estadia" ? 1 : 2;
  const funded = math.reserveGap > 0 ? 1 : 0;
  const load = math.servicesMonth == null ? 50 : math.servicesMonth;
  return [kind, funded, load, -cut];
}

function better(a: number[], b: number[]): number {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

function poolFor(countryId: string, ficha: Ficha): VisaSpec[] {
  const country = findCountry(countryId);
  if (!country) return [];
  const { age } = numbers(ficha);
  const list = country.routes.filter((r) => r.kind !== "sem-atalho" && fits(r, ficha.workMode));
  if (country.wh && age != null && age >= country.wh.min && age <= country.wh.max && fits(country.wh.route, ficha.workMode)) {
    list.push(country.wh.route);
  }
  return list;
}

function bestOf(list: VisaSpec[], ficha: Ficha): VisaSpec | null {
  if (!list.length) return null;
  return [...list].sort((a, b) => better(scoreTuple(a, ficha), scoreTuple(b, ficha)))[0];
}

function toScore(countryId: string, visa: VisaSpec, ficha: Ficha): RouteScore {
  const country = findCountry(countryId)!;
  const paper = buildPaper(visa, ficha);
  const math = serviceMath(visa, ficha);
  return {
    country,
    visa,
    cut: cutOf(visa.agencyBrl, paper.totalBrl),
    servicesMonth: math.servicesMonth,
  };
}

function mismatch(countryName: string, mode: WorkMode, closest: VisaSpec | undefined): VisaSpec {
  const modeLabel = mode === "remoto" ? "home office" : mode === "presencial" ? "presencial" : "híbrido";
  const closestName = closest ? closest.name : "nenhuma rota deste país";
  return {
    id: "mismatch",
    name: "Esta rota não aceita o seu modo de trabalho",
    kind: "sem-atalho",
    qualify: "none",
    blurb: `${countryName} até tem caminho (${closestName}), mas ele não combina com ${modeLabel}. Forçar o protocolo é a recusa mais cara, porque a taxa não volta.`,
    income: null,
    savings: null,
    statementMonths: 0,
    agencyBrl: 0,
    consularBrl: 0,
    cardBrl: 0,
    receive: "USD",
    receiveWhy: "Primeiro encaixe o modo de trabalho. Moeda vem depois.",
    allowsRemote: false,
    allowsLocalWork: false,
    needsBirth: false,
    needsApostille: false,
    needsTranslation: false,
    insurance: "none",
    residenceNote: "Sem encaixe, não há residência por esta ficha.",
    steps: [
      mode === "presencial"
        ? "Presencial no destino mata visto de nômade: esse visto exige cliente de fora. Ou você muda para home office, ou escolhe um país do acordo do Mercosul, onde dá para trabalhar localmente."
        : "Home office não usa visto de procura de emprego nem patrocínio local. Ou você aceita trabalhar no país, ou escolhe D8, Espanha ou Mercosul.",
      "Não protocole 'para ver'. Taxa consular recusada não devolve.",
    ],
    trap: "Agência que diz que 'na prática o cônsul deixa' está vendendo a sua taxa.",
    sourceNote: "Incompatibilidade de modalidade, não de documento.",
  };
}

export function buildDossier(ficha: Ficha): Dossier | null {
  const country = findCountry(ficha.countryId);
  if (!country) return null;

  const { years, age, rateBrl } = numbers(ficha);
  const rawRoutes = country.routes.filter((r) => r.kind !== "sem-atalho");
  const pool = poolFor(country.id, ficha);
  const ancestry = ancestryVisa(ficha.ancestry);
  const promoted = Boolean(ancestry && ancestryUnlocks(ficha.ancestry, country.id));

  let visa: VisaSpec;
  let workFit: "ok" | "ruim" = "ok";
  let fitNote = "O modo de trabalho cabe neste visto.";

  if (promoted && ancestry) {
    visa = ancestry;
    fitNote = "A ascendência, se a cadeia de certidões fechar, é residência mais fácil do que qualquer visto deste país.";
  } else if (pool.length) {
    visa = bestOf(pool, ficha)!;
    if (ficha.workMode === "hibrido" && visa.allowsRemote && !visa.allowsLocalWork) {
      fitNote = "Híbrido só passa se o grosso da fatura for de cliente fora do destino.";
    } else if (ficha.workMode === "hibrido" && visa.allowsLocalWork && !visa.allowsRemote) {
      fitNote = "Híbrido aqui significa que você vai trabalhar no país. Cliente só de fora não sustenta esta ficha.";
    }
  } else if (rawRoutes.length) {
    visa = mismatch(country.name, ficha.workMode, rawRoutes[0]);
    workFit = "ruim";
    fitNote = visa.blurb;
  } else {
    visa = country.routes[0];
    workFit = visa.kind === "sem-atalho" ? "ruim" : "ok";
    fitNote = visa.blurb;
  }

  if (!promoted && pool.length === 0 && country.routes.every((r) => r.kind === "sem-atalho") && !(country.wh && age != null && age >= country.wh.min && age <= country.wh.max)) {
    visa = country.routes[0];
    workFit = "ruim";
    fitNote = visa.blurb;
  }

  const paper = buildPaper(visa, ficha);
  const math = serviceMath(visa, ficha);
  const cut = cutOf(visa.agencyBrl, paper.totalBrl);
  const cutLever =
    paper.totalLeverBrl != null ? cutOf(visa.agencyBrl, paper.totalLeverBrl) : null;

  const warnings: string[] = [];
  if (ficha.passport === "sem") {
    warnings.push("Sem passaporte não há protocolo. A Polícia Federal emite. Agência não fura essa fila.");
  } else if (ficha.passport === "curto") {
    warnings.push("Renove antes. Posto recusa passaporte com pouca validade. A taxa oficial já está na tabela.");
  }
  if (country.id === "espanha" && visa.id === "es-tele" && years < 3) {
    warnings.push("Espanha pede diploma ou 3 anos no ofício. Na ficha há menos de 3. Sem diploma, esta rota trava.");
  }
  if (country.id === "malasia" && visa.id === "my-rantau" && ficha.profession.trim() && !/desenvolv|program|design|engenheir|dados|software|market|ux|ui|foto|vídeo|video|editor|analist/i.test(ficha.profession)) {
    warnings.push("DE Rantau é pensado para ofício digital. Se o seu não for, o programa pode recusar.");
  }
  if (math.servicesMonth != null && math.servicesMonth > 20) {
    warnings.push("Com este preço por serviço, a renda do visto pede uma operação que não cabe no mês. Suba o preço ou troque de país.");
  } else if (math.servicesMonth != null && math.servicesMonth > 8) {
    warnings.push("São muitos serviços por mês para um ofício solo. Dá para tentar, mas a conta está apertada.");
  }
  if (!rateBrl && (visa.qualify === "income" || visa.qualify === "either" || visa.qualify === "savings")) {
    warnings.push("Informe quanto você cobra por serviço para o balcão calcular a quantidade.");
  }
  if (visa.kind === "estadia") {
    warnings.push("Este carimbo é estadia, não residência permanente. Não mude a vida contando cidadania em cima dele.");
  }
  if (age == null && country.wh) {
    warnings.push("Informe a idade. Entre 18 e 30 pode existir férias-trabalho, que é outra porta.");
  }
  const hidden = country.routes.filter((r) => r.kind !== "sem-atalho" && !fits(r, ficha.workMode));
  if (hidden.length && visa.id !== hidden[0].id) {
    warnings.push(
      `${hidden[0].name} existe em ${country.name}, mas não combina com este modo de trabalho.`,
    );
  }

  const alternatives: RouteScore[] = [];
  if (promoted && ancestry) {
    const local = bestOf(pool, ficha);
    if (local) alternatives.push(toScore(country.id, local, ficha));
  } else {
    for (const other of pool) {
      if (other.id === visa.id) continue;
      alternatives.push(toScore(country.id, other, ficha));
    }
  }
  if ((cut == null || cut < 0.9) && visa.kind !== "sem-atalho") {
    const sid = suggestId(country.region === "América do Sul" ? "América do Sul" : "América do Sul");
    if (sid !== country.id) {
      const altVisa = bestOf(poolFor(sid, ficha), ficha);
      if (altVisa) alternatives.push(toScore(sid, altVisa, ficha));
    }
  }

  const ninety: RouteScore[] = [];
  for (const c of COUNTRIES) {
    if (c.id === country.id) continue;
    const chosen = bestOf(poolFor(c.id, ficha), ficha);
    if (!chosen || chosen.kind === "sem-atalho" || chosen.kind === "estadia") continue;
    const scored = toScore(c.id, chosen, ficha);
    if (scored.cut != null && scored.cut >= 0.9) ninety.push(scored);
  }
  ninety.sort((a, b) => (b.cut ?? 0) - (a.cut ?? 0));

  let stamp = "PROTOCOLO";
  let stampSub = "direto";
  if (visa.kind === "sem-atalho" || workFit === "ruim") {
    stamp = "SEM ATALHO";
    stampSub = "não force";
  } else if (ficha.passport === "sem") {
    stamp = "PASSAPORTE";
    stampSub = "primeiro";
  } else if (cut != null && cut >= 0.9) {
    stamp = "CORTA 90%";
    stampSub = "do pacote";
  } else if (cut != null) {
    stamp = `CORTA ${formatPct(cut)}`;
    stampSub = "do pacote";
  }

  const incomeLabel = visa.income
    ? `${formatMoney(visa.income.amount, visa.income.currency)} por mês`
    : visa.qualify === "either"
      ? "renda ou saldo"
      : "sem piso de renda";

  const reserveLabel = visa.savings
    ? formatMoney(visa.savings.amount, visa.savings.currency)
    : "sem saldo mínimo publicado";

  const servicesMonthLabel =
    visa.qualify === "none" || visa.kind === "cidadania"
      ? "Esta rota não pede meta de faturamento."
      : visa.qualify === "savings"
        ? "A meta é saldo, não fatura mensal."
        : math.servicesMonth == null
          ? "Falta o preço do serviço."
          : math.servicesMonth === 0
            ? "A renda já não é o obstáculo."
            : "Serviços fechados por mês, todo mês, enquanto o visto exigir essa renda.";

  const servicesReserveLabel =
    visa.qualify === "none" || !visa.savings
      ? "Não há reserva legal separada nesta ficha."
      : math.servicesReserve == null
        ? "Falta o preço do serviço."
        : math.reserveGap <= 0
          ? "A reserva que você já tem cobre o saldo pedido."
          : "Serviços, uma vez, para cobrir o saldo que ainda falta. Não é fatura mensal.";

  let ancestryCard: Dossier["ancestryCard"] = null;
  if (ancestry && !promoted) {
    const aPaper = buildPaper(ancestry, ficha);
    ancestryCard = {
      title: ancestry.name,
      body: ancestry.blurb,
      cut: cutOf(ancestry.agencyBrl, aPaper.totalBrl),
      paperBrl: aPaper.totalBrl,
      agencyBrl: ancestry.agencyBrl,
      promoted: false,
    };
  } else if (ancestry && promoted) {
    const aPaper = buildPaper(ancestry, ficha);
    ancestryCard = {
      title: ancestry.name,
      body: "Esta ficha passou na frente do visto porque, com a cadeia certa, você deixa de pedir residência.",
      cut: cutOf(ancestry.agencyBrl, aPaper.totalBrl),
      paperBrl: aPaper.totalBrl,
      agencyBrl: ancestry.agencyBrl,
      promoted: true,
    };
  }

  return {
    country,
    visa,
    workFit,
    fitNote,
    servicesMonth: visa.qualify === "savings" ? 0 : math.servicesMonth,
    servicesMonthLabel,
    servicesReserve: math.servicesReserve,
    servicesReserveLabel,
    incomeLabel,
    reserveLabel,
    haveLabel: formatBrl(math.savingsBrl),
    rateLabel: math.rateBrl ? formatBrl(math.rateBrl) : "—",
    receive: visa.receive,
    receiveWhy: visa.receiveWhy,
    lines: paper.lines,
    paperBrl: paper.totalBrl,
    paperLeverBrl: paper.totalLeverBrl,
    leverLabel: paper.leverLabel,
    agencyBrl: visa.agencyBrl,
    cut,
    cutLever,
    stamp,
    stampSub,
    warnings,
    steps: visa.steps,
    alternatives: alternatives.slice(0, 3),
    ninety: ninety.slice(0, 4),
    ancestryCard,
  };
}

export function plainDossier(ficha: Ficha, d: Dossier): string {
  const lines = [
    `PULO · ${d.country.name}`,
    d.visa.name,
    d.fitNote,
    "",
    `Ofício: ${ficha.profession || "não informado"} · ${ficha.years || "0"} anos · ${ficha.workMode}`,
    `Renda pedida: ${d.incomeLabel}`,
    `Serviços por mês: ${d.servicesMonth == null ? "—" : d.servicesMonth}`,
    d.servicesMonthLabel,
    `Reserva pedida: ${d.reserveLabel}`,
    `Você tem: ${d.haveLabel}`,
    `Serviços para a reserva: ${d.servicesReserve == null ? "—" : d.servicesReserve}`,
    `Receba em: ${d.receive}`,
    d.receiveWhy,
    "",
    `Papel oficial: ${formatBrl(d.paperBrl)}`,
    `Honorário típico de agência: ${d.agencyBrl ? formatBrl(d.agencyBrl) : "não pague"}`,
    `Corte do pacote: ${formatPct(d.cut)}`,
    "",
    "Documentos:",
    ...d.lines.map((l) => `- ${l.name} · ${l.where} · ${l.costLabel} · ${l.pulo}`),
    "",
    "Passos:",
    ...d.steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    d.visa.trap,
    d.visa.sourceNote,
    "Referência de balcão, não é parecer jurídico. Confira o consulado antes de pagar taxa.",
  ];
  return lines.join("\n");
}
