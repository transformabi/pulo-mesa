import { formatBrl } from "@/lib/pulo/money";
import type { DocLine, Ficha, VisaSpec } from "@/lib/pulo/types";

function line(
  partial: Omit<DocLine, "costLabel"> & { costLabel?: string },
): DocLine {
  return {
    ...partial,
    costLabel: partial.costLabel ?? (partial.costBrl <= 0 ? "R$ 0" : formatBrl(partial.costBrl)),
  };
}

export interface Paper {
  lines: DocLine[];
  totalBrl: number;
  totalLeverBrl: number | null;
  leverLabel: string | null;
}

export function buildPaper(visa: VisaSpec, ficha: Ficha): Paper {
  if (visa.kind === "sem-atalho") {
    const lines = [
      line({
        id: "passaporte",
        name: "Passaporte comum",
        where: "Polícia Federal",
        days: "cerca de 6 dias úteis após o atendimento",
        costBrl: ficha.passport === "valido" ? 0 : 257,
        pulo:
          ficha.passport === "valido"
            ? "O seu já serve. Não pague despachante para 'agilizar'."
            : "Taxa oficial R$ 257,25 no PagTesouro. Intermediário não muda a fila.",
      }),
      line({
        id: "nada",
        name: "Pasta de residência",
        where: "Não existe neste destino",
        days: "—",
        costBrl: 0,
        pulo: "Apostilar certidão sem um visto que a peça é dinheiro fora.",
      }),
    ];
    return { lines, totalBrl: sum(lines), totalLeverBrl: null, leverLabel: null };
  }

  const lines: DocLine[] = [];

  lines.push(
    line({
      id: "passaporte",
      name: "Passaporte válido",
      where: "Polícia Federal · gov.br",
      days: ficha.passport === "valido" ? "já emitido" : "cerca de 6 dias úteis",
      costBrl: ficha.passport === "valido" ? 0 : 257,
      pulo:
        ficha.passport === "valido"
          ? "Precisa cobrir a estadia com folga, em geral mais de 6 meses."
          : "Pague só a taxa da PF (R$ 257,25). Urgente soma R$ 77,17. Agência não emite no lugar da PF.",
    }),
  );

  lines.push(
    line({
      id: "fotos",
      name: "Fotos tipo passe",
      where: "Estúdio ou casa com fundo branco",
      days: "no dia",
      costBrl: 40,
      pulo: "O consulado publica a medida. Não compre ensaio.",
    }),
  );

  lines.push(
    line({
      id: "antecedentes",
      name: "Antecedentes criminais federais",
      where: "gov.br · Polícia Federal",
      days: "na hora ou em poucos dias",
      costBrl: 0,
      pulo: "É de graça. Site que cobra R$ 30 só aperta o botão por você.",
    }),
  );

  if (visa.needsBirth || visa.kind === "cidadania") {
    const copies = visa.kind === "cidadania" ? 4 : 1;
    lines.push(
      line({
        id: "nascimento",
        name:
          visa.kind === "cidadania"
            ? "Certidões da linha (inteiro teor, recentes)"
            : "Certidão de nascimento, inteiro teor",
        where: "Cartório do registro civil",
        days: "1 a 15 dias",
        costBrl: 140 * copies,
        pulo: "Peça inteiro teor, não a breve. Breve volta do consulado.",
      }),
    );
  }

  const publicDocs =
    1 + (visa.needsBirth || visa.kind === "cidadania" ? (visa.kind === "cidadania" ? 4 : 1) : 0);

  if (visa.needsApostille) {
    lines.push(
      line({
        id: "apostila",
        name: `Apostila de Haia (${publicDocs} ${publicDocs > 1 ? "atos" : "ato"})`,
        where: "Cartório de notas autorizado",
        days: "mesmo dia a 5 dias",
        costBrl: 150 * publicDocs,
        pulo: "Um ato por documento público. Faça a apostila antes da tradução.",
      }),
    );
  } else if (visa.kind !== "cidadania") {
    lines.push(
      line({
        id: "apostila-fora",
        name: "Apostila de Haia",
        where: "Em geral dispensada neste acordo",
        days: "—",
        costBrl: 0,
        pulo: "Se o posto pedir mesmo assim, são cerca de R$ 150 por ato. Ainda não paga agência.",
        optional: true,
      }),
    );
  }

  if (visa.needsTranslation) {
    lines.push(
      line({
        id: "traducao",
        name: `Tradução juramentada (${publicDocs} ${publicDocs > 1 ? "peças" : "peça"})`,
        where: "Tradutor público da junta comercial",
        days: "2 a 10 dias",
        costBrl: 220 * publicDocs,
        pulo: "Tradução de conhecido não entra. Juramentada, depois da apostila.",
      }),
    );
  }

  if (visa.income || visa.qualify === "savings" || visa.qualify === "either") {
    lines.push(
      line({
        id: "extratos",
        name: `Extratos bancários (${visa.statementMonths || 3} meses)`,
        where: "Seu banco, PDF oficial",
        days: "na hora",
        costBrl: 0,
        pulo: "Print de aplicativo é o que o posto devolve. Peça o PDF com nome e saldo.",
      }),
    );
  }

  if (visa.allowsRemote && visa.kind !== "cidadania" && visa.qualify === "income") {
    lines.push(
      line({
        id: "contrato",
        name: "Contrato de prestação ou carta do cliente",
        where: "Você redige e o cliente assina",
        days: "1 dia",
        costBrl: 0,
        pulo: "Cliente fora do país de destino, valor e moeda por extenso. Sem isso o visto de renda não existe.",
      }),
    );
  }

  if (visa.insurance === "private") {
    lines.push(
      line({
        id: "seguro",
        name: "Seguro saúde com a cobertura do visto",
        where: "Seguradora, online",
        days: "no dia",
        costBrl: 1800,
        pulo: "Cartão de crédito não conta. Compare apólice, não compre o pacote da agência.",
      }),
    );
  }

  if (visa.insurance === "pb4") {
    lines.push(
      line({
        id: "pb4",
        name: "Certificado PB4",
        where: "INSS · acordo Brasil–Portugal",
        days: "dias a semanas",
        costBrl: 0,
        pulo: "De graça. É o pulo que tira o seguro anual da conta, se o posto aceitar nesta leva.",
      }),
    );
    lines.push(
      line({
        id: "seguro-reserva",
        name: "Seguro privado, só se o posto recusar o PB4",
        where: "Seguradora",
        days: "no dia",
        costBrl: 0,
        costLabel: formatBrl(1800),
        optional: true,
        pulo: "Não compre antes de ouvir o consulado. Se entrar, some cerca de R$ 1.800 e o corte cai.",
      }),
    );
  }

  if (visa.consularBrl > 0) {
    lines.push(
      line({
        id: "taxa-visto",
        name: "Taxa consular do visto",
        where: "Consulado ou centro de vistos",
        days: "no protocolo",
        costBrl: visa.consularBrl,
        pulo: "Não é reembolsável. Protocolar incompleto é queimar esta linha.",
      }),
    );
  }

  if (visa.cardBrl > 0) {
    lines.push(
      line({
        id: "taxa-cartao",
        name: "Taxa do documento de residência",
        where: "Imigração, já no destino",
        days: "depois da entrada",
        costBrl: visa.cardBrl,
        pulo: "Paga-se ao Estado, não ao despachante da esquina.",
      }),
    );
  }

  const counted = lines.filter((l) => !l.optional);
  const totalBrl = sum(counted);
  const lever =
    visa.insurance === "pb4"
      ? {
          totalLeverBrl: totalBrl + 1800,
          leverLabel: "Se o posto recusar o PB4 e exigir seguro",
        }
      : { totalLeverBrl: null, leverLabel: null };

  return { lines, totalBrl, ...lever };
}

function sum(lines: DocLine[]): number {
  return lines.reduce((acc, l) => acc + l.costBrl, 0);
}

export function cutOf(agencyBrl: number, paperBrl: number): number | null {
  if (agencyBrl <= 0) return null;
  const total = agencyBrl + paperBrl;
  if (total <= 0) return null;
  return agencyBrl / total;
}
