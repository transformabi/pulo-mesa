import type { Country, VisaSpec } from "@/lib/pulo/types";

function v(spec: VisaSpec): VisaSpec {
  return spec;
}

const MERC_STEPS = [
  "Entre com o passaporte (brasileiro, neste destino, costuma entrar sem visto) e vá você mesmo à migração.",
  "Peça a residência do acordo. Não contrate o despachante que aborda na porta.",
  "Com o protocolo, tire o documento local. A temporária em geral deixa trabalhar. A permanente vem depois, perto de dois anos.",
];

function mercosur(countryName: string, note: string): VisaSpec {
  return v({
    id: `mercosul-${countryName}`,
    name: "Residência pelo acordo do Mercosul",
    kind: "residencia",
    qualify: "none",
    blurb: `Brasileiro pede residência temporária em ${countryName} pelo acordo, sem oferta de emprego e sem piso de renda de nômade. Dá para seguir em home office e também trabalhar no país.`,
    income: null,
    savings: null,
    statementMonths: 0,
    agencyBrl: 9000,
    consularBrl: 0,
    cardBrl: 380,
    receive: "USD",
    receiveWhy:
      "A rota não exige moeda. Receber em dólar ou euro só importa se você quiser guardar valor. Para o protocolo, extrato em real serve.",
    allowsRemote: true,
    allowsLocalWork: true,
    needsBirth: true,
    needsApostille: false,
    needsTranslation: false,
    insurance: "none",
    residenceNote:
      "Temporária pelo acordo, com caminho para permanente. Não é visto de turismo esticado.",
    steps: MERC_STEPS,
    trap: note,
    sourceNote:
      "Acordo de Residência do Mercosul e adesões de associados. Taxa local muda por posto. Balcão de out/2026.",
  });
}

const PT: VisaSpec = v({
  id: "pt-d8",
  name: "Visto de residência para nômade digital (D8)",
  kind: "residencia",
  qualify: "income",
  blurb:
    "Você protocola renda de fora de Portugal. O formulário é do Estado. A agência revende a lista.",
  income: { amount: 3680, currency: "EUR" },
  savings: null,
  statementMonths: 3,
  agencyBrl: 18000,
  consularBrl: 666,
  cardBrl: 963,
  receive: "EUR",
  receiveWhy:
    "O piso é em euro (4 × salário mínimo de € 920 em 2026 = € 3.680 de média nos últimos 3 meses). Receber em euro evita briga de câmbio. Dólar aceitam se o extrato for legível. Real sozinho gera exigência.",
  allowsRemote: true,
  allowsLocalWork: false,
  needsBirth: false,
  needsApostille: true,
  needsTranslation: false,
  insurance: "pb4",
  residenceNote:
    "O visto nacional deixa entrar e pedir autorização de residência na AIMA. Cidadania é outra lei, outro prazo, outro balcão.",
  steps: [
    "Feche contrato com cliente de fora de Portugal e junte a média de 3 meses em € 3.680 ou mais.",
    "Antecedentes da PF com menos de 90 dias e apostila. Documento em português, em regra, não leva tradução.",
    "Peça o PB4 no INSS antes de comprar seguro. Leve reserva de alojamento. NIF dá para tirar sem escritório.",
    "Protocole na VFS, taxa do visto nacional paga no ato. Pasta incompleta não se completa depois.",
    "Na chegada, AIMA, para o cartão. A taxa do cartão é do Estado.",
  ],
  trap: "D8 morre se o trabalho for para empresa portuguesa ou se você for presencial no destino. Turismo não vira D8 dentro do país.",
  sourceNote:
    "Piso de 4 salários mínimos portugueses. Mínimo de € 920 em 2026. Taxa de visto e AIMA em faixa de balcão, out/2026.",
});

const ES: VisaSpec = v({
  id: "es-tele",
  name: "Autorização de teletrabalho internacional",
  kind: "residencia",
  qualify: "income",
  blurb:
    "Renda de fora da Espanha, com diploma ou 3 anos no ofício. Para brasileiro, a residência legal é o caminho curto de nacionalidade ibero-americana — se a lei seguir como está na data do pedido.",
  income: { amount: 2849, currency: "EUR" },
  savings: null,
  statementMonths: 3,
  agencyBrl: 15000,
  consularBrl: 484,
  cardBrl: 700,
  receive: "EUR",
  receiveWhy:
    "O piso é lido em euro (cerca de 200% do salário mínimo espanhol na conta de 12 meses, € 2.849 em 2026). Faturar em euro é o caminho limpo.",
  allowsRemote: true,
  allowsLocalWork: false,
  needsBirth: false,
  needsApostille: true,
  needsTranslation: true,
  insurance: "private",
  residenceNote:
    "É residência, não carimbo de estadia. Nacionalidade para ibero-americanos tem regra própria e prazo mais curto que o geral. Confirme no código vigente. Não conte prazo de turismo.",
  steps: [
    "Prove vínculo com cliente ou empregador de fora da Espanha e média mensal de € 2.849.",
    "Se não tiver diploma, junte 3 anos de ofício com contrato, imposto ou carta de clientes.",
    "Antecedentes da PF, apostila, tradução juramentada para espanhol. A apostila vem antes.",
    "Seguro saúde autorizado na Espanha, sem coparticipação e sem carência. Não é o do cartão de crédito.",
    "Protocole no consulado da sua jurisdição, ou na UGE se já estiver em situação regular. Não 'converta' turismo no balcão errado.",
  ],
  trap: "Menos de 3 anos e sem diploma trava o pedido. Cliente espanhol no grosso da renda também trava.",
  sourceNote:
    "Ley 28/2022 e SMI 2026. Faixa de € 2.849/mês. Consulados ainda citam tabela antiga. Confira o da sua jurisdição.",
});

const DE: VisaSpec = v({
  id: "de-chance",
  name: "Chancenkarte (cartão de oportunidade)",
  kind: "residencia",
  qualify: "savings",
  blurb:
    "Não é nômade. É permissão para ir procurar emprego qualificado, com conta bloqueada no lugar de salário. O pulo é não pagar consultoria de pontos: a tabela é pública.",
  income: null,
  savings: { amount: 13100, currency: "EUR" },
  statementMonths: 3,
  agencyBrl: 14000,
  consularBrl: 750,
  cardBrl: 600,
  receive: "EUR",
  receiveWhy:
    "A conta bloqueada é em euro. Enquanto você procura emprego, cliente brasileiro não substitui esse saldo.",
  allowsRemote: false,
  allowsLocalWork: true,
  needsBirth: false,
  needsApostille: true,
  needsTranslation: true,
  insurance: "private",
  residenceNote:
    "É residência de procura. Vira residência de trabalho quando o contrato aparece. Sozinha, não é aposentadoria no país.",
  steps: [
    "Confira se o diploma ou a experiência entra na pontuação publicada. Não pague 'análise' antes de ler a tabela.",
    "Abra a conta bloqueada no valor do ano (faixa de € 13.100). O banco faz isso sem agência de visto.",
    "Antecedentes, apostila, tradução. Seguro saúde do período.",
    "Protocole no consulado alemão. Na Alemanha, procure emprego de verdade. Cliente remoto no Brasil não é o visto.",
  ],
  trap: "Quem trabalha só em home office para o Brasil não usa esta ficha. Troque de modo ou de país.",
  sourceNote: "Chancenkarte, valor de subsistência em faixa de 2026. Confirme o bloqueio do ano no consulado.",
});

const FR_WH: VisaSpec = v({
  id: "fr-wh",
  name: "Visto de férias-trabalho (Programme Vacances-Travail)",
  kind: "estadia",
  qualify: "savings",
  blurb:
    "Entre 18 e 30 anos, um ano na França para trabalhar e conhecer. Não é residência permanente. É o jeito barato de entrar no mercado sem empregador prévio.",
  income: null,
  savings: { amount: 2500, currency: "EUR" },
  statementMonths: 3,
  agencyBrl: 6000,
  consularBrl: 600,
  cardBrl: 0,
  receive: "EUR",
  receiveWhy: "A prova de meios é em euro. No país, salário local vem em euro.",
  allowsRemote: true,
  allowsLocalWork: true,
  needsBirth: false,
  needsApostille: true,
  needsTranslation: true,
  insurance: "private",
  residenceNote:
    "Um ano, com teto de idade. Não conte como atalho de cidadania. Se a ideia é ficar, você precisa de outro visto depois.",
  steps: [
    "Confira se o edital do ano ainda tem vaga para brasileiro e se a sua idade entra.",
    "Junte a prova de meios, passagem ou reserva, seguro e antecedentes apostilados.",
    "Protocole no consulado francês. Não compre pacote de 'garantia de vaga'.",
  ],
  trap: "Acabou a idade ou a cota, acabou o pulo. Não existe 'WH atrasado' por despachante.",
  sourceNote: "Acordo de férias-trabalho França–Brasil. Cota e taxa mudam por edital.",
});

const IT_NOM: VisaSpec = v({
  id: "it-nom",
  name: "Visto para nômade digital",
  kind: "residencia",
  qualify: "income",
  blurb:
    "Itália passou a ter visto de trabalho remoto com piso anual. Dá residência. Não confunda com cidadania de avô, que é outra ficha e, quando cabe, é maior.",
  income: { amount: 2333, currency: "EUR" },
  savings: null,
  statementMonths: 6,
  agencyBrl: 16000,
  consularBrl: 700,
  cardBrl: 500,
  receive: "EUR",
  receiveWhy: "O piso publicado gira em torno de € 28 mil ao ano. Euro no extrato é o que o consulado lê sem tradução de cotação.",
  allowsRemote: true,
  allowsLocalWork: false,
  needsBirth: false,
  needsApostille: true,
  needsTranslation: true,
  insurance: "private",
  residenceNote: "Residência ligada ao trabalho remoto. Cidadania italiana por sangue, se existir, é melhor e está na ficha de ascendência.",
  steps: [
    "Contrato com cliente de fora e renda na faixa de € 28 mil ao ano.",
    "Seguro saúde, alojamento, antecedentes apostilados e traduzidos.",
    "Protocole no consulado italiano da jurisdição. Não use a fila da cidadania para este visto, são senhas diferentes.",
  ],
  trap: "Fila de cidadania não protocola nômade, e nômade não reconhece avô.",
  sourceNote: "Visto italiano para nômades, piso anual em faixa pública. Confirme o decreto vigente no consulado.",
});

const MX: VisaSpec = v({
  id: "mx-temp",
  name: "Residente temporal por solvência",
  kind: "residencia",
  qualify: "either",
  blurb:
    "Ou renda mensal, ou saldo parado. Você escolhe o que já tem. Vira permanente depois de anos de temporal, não no primeiro carimbo.",
  income: { amount: 2700, currency: "USD" },
  savings: { amount: 45000, currency: "USD" },
  statementMonths: 6,
  agencyBrl: 12000,
  consularBrl: 280,
  cardBrl: 550,
  receive: "USD",
  receiveWhy:
    "Consulado mexicano lê dólar. Real exige conversão e costuma gerar pendência. Receba em dólar se esta for a rota.",
  allowsRemote: true,
  allowsLocalWork: false,
  needsBirth: false,
  needsApostille: true,
  needsTranslation: true,
  insurance: "none",
  residenceNote:
    "Temporal por solvência econômica. Permanente em geral após 4 anos. Não autoriza, por si, emprego mexicano.",
  steps: [
    "Escolha um caminho: média mensal na faixa de US$ 2.700 ou saldo na faixa de US$ 45.000. O posto publica a tabela do ano.",
    "Extratos em PDF, apostila no que for documento público, tradução se pedirem espanhol.",
    "Protocole no consulado mexicano. A canje da residência é no México, no INM, no prazo do visto.",
  ],
  trap: "Cada consulado usa múltiplo de UMA diferente. Não viaje para 'regularizar' turismo. O pedido nasce no consulado.",
  sourceNote: "Residencia temporal por solvencia. Faixas de out/2026, variam por consulado.",
});

const CR_RENT: VisaSpec = v({
  id: "cr-rent",
  name: "Residência de rentista",
  kind: "residencia",
  qualify: "income",
  blurb:
    "Renda estável de fora, na faixa de US$ 2.500 por mês, por dois anos. Isso é residência. O visto de nômade da Costa Rica é estadia e não é esta ficha.",
  income: { amount: 2500, currency: "USD" },
  savings: null,
  statementMonths: 12,
  agencyBrl: 11000,
  consularBrl: 350,
  cardBrl: 400,
  receive: "USD",
  receiveWhy: "O piso de rentista é em dólar. Receber em dólar é o protocolo.",
  allowsRemote: true,
  allowsLocalWork: false,
  needsBirth: true,
  needsApostille: true,
  needsTranslation: true,
  insurance: "private",
  residenceNote: "Caminho de residência. O visto de nômade local é mais curto e, em regra, não conta igual para permanente.",
  steps: [
    "Mostre renda estável de fora na faixa de US$ 2.500/mês.",
    "Certidão, antecedentes, apostila, tradução, seguro.",
    "Protocole na migração ou no consulado, conforme o posto pedir na data. Leia o site do órgão, não o do despachante.",
  ],
  trap: "Nômade digital da Costa Rica não substitui rentista se o seu objetivo é residência.",
  sourceNote: "Categoria rentista, faixa clássica de US$ 2.500/mês. Confirme a lei de estrangeiros vigente.",
});

const TH: VisaSpec = v({
  id: "th-dtv",
  name: "Destination Thailand Visa (DTV)",
  kind: "estadia",
  qualify: "savings",
  blurb:
    "Cinco anos de múltiplas entradas, 180 dias por vez, com saldo na faixa de 500 mil baht. É estadia longa. Não é residência permanente e não é cidadania.",
  income: null,
  savings: { amount: 15000, currency: "USD" },
  statementMonths: 3,
  agencyBrl: 7000,
  consularBrl: 1600,
  cardBrl: 0,
  receive: "USD",
  receiveWhy: "O saldo é conferido em conta, muitas vezes lido em dólar ou baht. Dólar passa mais limpo que real.",
  allowsRemote: true,
  allowsLocalWork: false,
  needsBirth: false,
  needsApostille: false,
  needsTranslation: false,
  insurance: "none",
  residenceNote: "Não conta como residência permanente. Se a meta é residir de verdade, este carimbo não é o pulo.",
  steps: [
    "Junte saldo na faixa de US$ 15.000 (500 mil baht) e prova de trabalho remoto ou atividade elegível.",
    "Protocole no consulado tailandês ou no canal oficial do DTV. Desconfie de 'agente garantido'.",
    "Cada entrada tem prazo. Não fique além dele esperando que vire residência. Não vira.",
  ],
  trap: "Agência vende DTV como mudança de país. É visto de estadia. Trabalho local continua proibido.",
  sourceNote: "DTV, saldo de 500 mil baht e taxa consular em faixa. Regras de 2024–2026, confira o consulado.",
});

const JP: VisaSpec = v({
  id: "jp-nom",
  name: "Visto de nômade digital (6 meses)",
  kind: "estadia",
  qualify: "income",
  blurb:
    "Meio ano, renda alta (faixa de 10 milhões de ienes ao ano) e seguro. Não prorroga para residência. O pulo aqui é saber que não há pulo de residência.",
  income: { amount: 5500, currency: "USD" },
  savings: null,
  statementMonths: 12,
  agencyBrl: 8000,
  consularBrl: 200,
  cardBrl: 0,
  receive: "USD",
  receiveWhy: "A renda mínima é alta e o consulado aceita comprovação em moeda forte. Dólar ou euro.",
  allowsRemote: true,
  allowsLocalWork: false,
  needsBirth: false,
  needsApostille: false,
  needsTranslation: false,
  insurance: "private",
  residenceNote: "Não leva a residência permanente. Trabalho local pede visto de engenheiro ou equivalente, com patrocinador.",
  steps: [
    "Confira o piso anual no site da imigração japonesa antes de apostilar qualquer coisa.",
    "Se a renda não chega, não compre a pasta. O visto não abre exceção por despachante.",
    "Se a meta é morar, procure empregador japonês. Este carimbo não é ponte.",
  ],
  trap: "Seis meses não são residência. Quem promete 'depois a gente converte' está vendendo outra coisa.",
  sourceNote: "Digital nomad visa do Japão, 6 meses, renda anual elevada. Sem conversão automática.",
});

const MY: VisaSpec = v({
  id: "my-rantau",
  name: "DE Rantau (nômade / profissional digital)",
  kind: "residencia",
  qualify: "income",
  blurb:
    "Programa da Malásia para atividade digital, com renda mínima anual em dólar. Serve para home office. Presencial local é outro visto.",
  income: { amount: 2000, currency: "USD" },
  savings: null,
  statementMonths: 3,
  agencyBrl: 9000,
  consularBrl: 500,
  cardBrl: 400,
  receive: "USD",
  receiveWhy: "A renda do programa é publicada em dólar (faixa de US$ 24 mil ao ano). Receba em dólar.",
  allowsRemote: true,
  allowsLocalWork: false,
  needsBirth: false,
  needsApostille: true,
  needsTranslation: false,
  insurance: "private",
  residenceNote:
    "Autorização de permanência do programa, renovável enquanto a renda existir. Não é atalho de cidadania.",
  steps: [
    "Confira se o seu ofício entra na lista digital do programa.",
    "Mostre renda na faixa de US$ 2.000/mês vinda de fora.",
    "Protocole no canal oficial. Não pague 'aprovação expressa' em rede social.",
  ],
  trap: "Ofício que não é digital toma recusa. O programa não é residência genérica.",
  sourceNote: "DE Rantau, faixa de renda em dólar. Confirme a lista de atividades no site oficial.",
});

const AE: VisaSpec = v({
  id: "ae-remote",
  name: "Visto de trabalho remoto dos Emirados",
  kind: "estadia",
  qualify: "income",
  blurb:
    "Um ano, renda na faixa de US$ 3.500/mês, custo de vida alto. Não é o pulo de 90% nem caminho barato de cidadania. Existe, e é caro viver.",
  income: { amount: 3500, currency: "USD" },
  savings: null,
  statementMonths: 3,
  agencyBrl: 8000,
  consularBrl: 2200,
  cardBrl: 0,
  receive: "USD",
  receiveWhy: "O piso é em dólar. Dirham ajuda depois, na vida local. Para o visto, dólar.",
  allowsRemote: true,
  allowsLocalWork: false,
  needsBirth: false,
  needsApostille: true,
  needsTranslation: false,
  insurance: "private",
  residenceNote: "Residência de prazo curto, renovável se a renda continuar. Cidadania não entra nesta conversa.",
  steps: [
    "Renda de fora na faixa de US$ 3.500/mês, seguro e antecedentes.",
    "Pedido no canal do governo ou do centro oficial. Escritório de 'visto garantido' come o corte.",
  ],
  trap: "O papel até pode sair barato perto de uma agência. O aluguel não. Não confunda os dois.",
  sourceNote: "Remote work visa dos EAU, faixa de US$ 3.500/mês. Taxas e seguro variam por emirado.",
});

const NZ_WH: VisaSpec = v({
  id: "nz-wh",
  name: "Working Holiday",
  kind: "estadia",
  qualify: "savings",
  blurb:
    "18 a 30 anos, cota, prova de meios e um ano de trabalho. Não é residência. É a porta que a Nova Zelândia de fato abre para brasileiro jovem.",
  income: null,
  savings: { amount: 2600, currency: "USD" },
  statementMonths: 3,
  agencyBrl: 5500,
  consularBrl: 1400,
  cardBrl: 0,
  receive: "USD",
  receiveWhy: "A prova de fundos é em moeda forte. Dólar resolve. No país, o salário vem em dólar neozelandês.",
  allowsRemote: true,
  allowsLocalWork: true,
  needsBirth: false,
  needsApostille: false,
  needsTranslation: false,
  insurance: "private",
  residenceNote: "Estadia de trabalho por prazo. Residência permanente é visto de pontos, outro processo, sem atalho de pasta.",
  steps: [
    "Olhe a cota do ano no site de imigração antes de reunir papel.",
    "Passaporte, fundos, passagem de volta ou reserva, seguro, taxa oficial.",
    "Protocole você. A cota não aumenta com honorário.",
  ],
  trap: "Sem cota ou com 31 anos, não há exceção vendida.",
  sourceNote: "Working Holiday Brasil–Nova Zelândia. Idade, cota e fundos conforme o edital do ano.",
});

const KR_WH: VisaSpec = v({
  id: "kr-wh",
  name: "Working Holiday (H-1)",
  kind: "estadia",
  qualify: "savings",
  blurb: "18 a 30 anos, um ano na Coreia do Sul, com direito a trabalhar. Estadia, não residência definitiva.",
  income: null,
  savings: { amount: 3000, currency: "USD" },
  statementMonths: 3,
  agencyBrl: 5000,
  consularBrl: 400,
  cardBrl: 0,
  receive: "USD",
  receiveWhy: "Prova de meios em dólar. Salário local, se vier, é em won.",
  allowsRemote: true,
  allowsLocalWork: true,
  needsBirth: false,
  needsApostille: true,
  needsTranslation: false,
  insurance: "private",
  residenceNote: "Não substitui visto de trabalho patrocinado nem residência permanente.",
  steps: [
    "Confirme idade, cota e lista de documentos no consulado coreano.",
    "Fundos, seguro, antecedentes apostilados, taxa.",
    "Protocole no consulado. Curso de idioma não é obrigatório para 'garantir' nada.",
  ],
  trap: "Pacote de escola de coreano vendido como visto é outro produto.",
  sourceNote: "H-1 Working Holiday, acordo com o Brasil. Edital do ano manda.",
});

const DE_WH: VisaSpec = v({
  id: "de-wh",
  name: "Visto de férias-trabalho",
  kind: "estadia",
  qualify: "savings",
  blurb: "Se a sua idade entra no edital Alemanha–Brasil, é um ano de trabalho sem empregador prévio. Não é a Chancenkarte.",
  income: null,
  savings: { amount: 2000, currency: "EUR" },
  statementMonths: 3,
  agencyBrl: 6000,
  consularBrl: 750,
  cardBrl: 0,
  receive: "EUR",
  receiveWhy: "Meios e vida local em euro.",
  allowsRemote: true,
  allowsLocalWork: true,
  needsBirth: false,
  needsApostille: true,
  needsTranslation: true,
  insurance: "private",
  residenceNote: "Prazo certo. Para ficar, o caminho depois é emprego e outro visto, não uma conversão mágica.",
  steps: [
    "Leia o edital do ano: idade, cota, fundos.",
    "Antecedentes, apostila, tradução, seguro, taxa consular.",
    "Protocole no consulado alemão.",
  ],
  trap: "Não misture este visto com bloqueio de conta da Chancenkarte. São filas diferentes.",
  sourceNote: "Programa de férias-trabalho, quando aberto a brasileiros. Confirme o edital.",
});

function hard(name: string, trap: string): VisaSpec {
  return v({
    id: `hard-${name}`,
    name: "Sem protocolo barato de residência",
    kind: "sem-atalho",
    qualify: "none",
    blurb: `${name} não tem, neste balcão, visto em que brasileiro vire residente só com pasta, saldo ou home office.`,
    income: null,
    savings: null,
    statementMonths: 0,
    agencyBrl: 0,
    consularBrl: 0,
    cardBrl: 0,
    receive: "USD",
    receiveWhy: "Sem rota, moeda não salva o pedido.",
    allowsRemote: false,
    allowsLocalWork: false,
    needsBirth: false,
    needsApostille: false,
    needsTranslation: false,
    insurance: "none",
    residenceNote: "Turismo, visto de visita e 'ficar e ver' não são residência.",
    steps: [
      "Não pague assessoria de residência para um visto que o país não publica.",
      "Não apostile uma pasta inteira antes de ter a categoria certa no site oficial.",
      "Ou há contrato com empregador local, ou família, ou estudo de verdade, ou você troca de país.",
    ],
    trap,
    sourceNote: "Sem programa de nômade ou acordo de residência mapeado para brasileiro. Out/2026.",
  });
}

const GR: VisaSpec = v({
  id: "gr-nom",
  name: "Visto de nômade digital",
  kind: "residencia",
  qualify: "income",
  blurb: "Renda remota de fora, piso na faixa de € 3.500/mês. Dá para residir enquanto a renda se mantém.",
  income: { amount: 3500, currency: "EUR" },
  savings: null,
  statementMonths: 6,
  agencyBrl: 14000,
  consularBrl: 550,
  cardBrl: 500,
  receive: "EUR",
  receiveWhy: "Piso em euro. Receba em euro.",
  allowsRemote: true,
  allowsLocalWork: false,
  needsBirth: false,
  needsApostille: true,
  needsTranslation: true,
  insurance: "private",
  residenceNote: "Residência condicionada à renda remota. Não é trabalho local.",
  steps: [
    "Contrato e extratos na faixa de € 3.500/mês, cliente de fora.",
    "Antecedentes apostilados, tradução, seguro, alojamento.",
    "Protocolo no consulado grego.",
  ],
  trap: "Renda de cliente grego não entra no piso.",
  sourceNote: "Digital nomad visa da Grécia, faixa de € 3.500/mês. Confirme o consulado.",
});

const HR: VisaSpec = v({
  id: "hr-nom",
  name: "Visto de nômade digital",
  kind: "estadia",
  qualify: "income",
  blurb:
    "Renda remota na faixa de € 2.540/mês. Na origem deste visto, a estadia não empilhava para residência permanente. Trate como estadia até o site oficial dizer o contrário.",
  income: { amount: 2540, currency: "EUR" },
  savings: null,
  statementMonths: 6,
  agencyBrl: 10000,
  consularBrl: 500,
  cardBrl: 0,
  receive: "EUR",
  receiveWhy: "Piso em euro.",
  allowsRemote: true,
  allowsLocalWork: false,
  needsBirth: false,
  needsApostille: true,
  needsTranslation: true,
  insurance: "private",
  residenceNote: "Não conte como ponte automática de residência permanente.",
  steps: [
    "Renda de fora na faixa publicada (cerca de € 2.540, atrelada ao salário médio).",
    "Pasta de antecedentes, seguro e contrato.",
    "Não pague quem promete transformar este visto em permanente no escuro.",
  ],
  trap: "Estadia vendida como residência. Leia o prazo máximo antes de mudar a vida.",
  sourceNote: "Visto de nômade da Croácia, piso atrelado a salário médio. Confirme se o ano conta para permanente.",
});

const EE: VisaSpec = v({
  id: "ee-nom",
  name: "Visto de nômade digital",
  kind: "estadia",
  qualify: "income",
  blurb: "Piso alto, na faixa de € 4.500 brutos por mês, prazo curto. Não é o caminho barato de residência europeia.",
  income: { amount: 4500, currency: "EUR" },
  savings: null,
  statementMonths: 6,
  agencyBrl: 9000,
  consularBrl: 500,
  cardBrl: 0,
  receive: "EUR",
  receiveWhy: "O piso estoniano é em euro e é alto. Abaixo disso, nem protocole.",
  allowsRemote: true,
  allowsLocalWork: false,
  needsBirth: false,
  needsApostille: true,
  needsTranslation: false,
  insurance: "private",
  residenceNote: "Estadia de trabalho remoto. Residência de longo prazo pede outra base.",
  steps: [
    "Confira o piso do ano no site da polícia estoniana.",
    "Se a renda não chega, escolha outro país. Assessoria não reduz o piso.",
  ],
  trap: "Piso alto com cara de atalho. Não é atalho.",
  sourceNote: "Digital nomad visa da Estônia, faixa de € 4.500/mês.",
});

const HU: VisaSpec = v({
  id: "hu-white",
  name: "White Card",
  kind: "estadia",
  qualify: "income",
  blurb: "Trabalho remoto para fora da Hungria, renda na faixa de € 3.000/mês. Prazo limitado. Não é residência permanente.",
  income: { amount: 3000, currency: "EUR" },
  savings: null,
  statementMonths: 6,
  agencyBrl: 10000,
  consularBrl: 500,
  cardBrl: 0,
  receive: "EUR",
  receiveWhy: "Renda em euro.",
  allowsRemote: true,
  allowsLocalWork: false,
  needsBirth: false,
  needsApostille: true,
  needsTranslation: true,
  insurance: "private",
  residenceNote: "Não conte como permanente.",
  steps: ["Renda de fora, contrato, seguro, antecedentes.", "Protocolo no consulado. Sem emprego húngaro neste cartão."],
  trap: "White Card não é emprego local nem cidadania.",
  sourceNote: "White Card húngaro, faixa de € 3.000/mês. Confirme o decreto do ano.",
});

const MT: VisaSpec = v({
  id: "mt-nom",
  name: "Nomad Residence Permit",
  kind: "residencia",
  qualify: "income",
  blurb: "Permissão com renda na faixa de € 3.500/mês. Dá para ficar enquanto o programa e a renda existirem. Cidadania é outro mundo.",
  income: { amount: 3500, currency: "EUR" },
  savings: null,
  statementMonths: 3,
  agencyBrl: 14000,
  consularBrl: 600,
  cardBrl: 800,
  receive: "EUR",
  receiveWhy: "Piso em euro.",
  allowsRemote: true,
  allowsLocalWork: false,
  needsBirth: false,
  needsApostille: true,
  needsTranslation: true,
  insurance: "private",
  residenceNote: "Permissão do programa de nômades. Não é atalho de passaporte maltês.",
  steps: ["Renda de fora, antecedentes, seguro, alojamento.", "Pedido no canal oficial da residência."],
  trap: "Passaporte maltês por investimento é outro produto, caríssimo, e não é este balcão.",
  sourceNote: "Malta Nomad Residence Permit, faixa de € 3.500/mês.",
});

const PA: VisaSpec = v({
  id: "pa-remote",
  name: "Visto de trabalhador remoto",
  kind: "estadia",
  qualify: "income",
  blurb:
    "Renda de fora na faixa de US$ 3.000/mês. Estadia de remoto. O visto de nações amigas não é, para brasileiro, um atalho que este balcão assine.",
  income: { amount: 3000, currency: "USD" },
  savings: null,
  statementMonths: 3,
  agencyBrl: 9000,
  consularBrl: 500,
  cardBrl: 0,
  receive: "USD",
  receiveWhy: "Piso em dólar.",
  allowsRemote: true,
  allowsLocalWork: false,
  needsBirth: false,
  needsApostille: true,
  needsTranslation: true,
  insurance: "private",
  residenceNote: "Não trate como permanente. Leia o prazo máximo no site da migração.",
  steps: ["Contrato e extratos em dólar.", "Protocolo oficial. Sem pacote de 'cédula garantida'."],
  trap: "Escritório que mistura remoto com residência permanente está vendendo os dois pelo preço do mais caro.",
  sourceNote: "Remote worker do Panamá, faixa de US$ 3.000/mês ou US$ 36 mil/ano.",
});

export const COUNTRIES: Country[] = [
  {
    id: "argentina",
    name: "Argentina",
    region: "América do Sul",
    aliases: ["arg"],
    routes: [mercosur("Argentina", "Despachante na fronteira não faz parte do acordo. A migração faz.")],
  },
  {
    id: "uruguai",
    name: "Uruguai",
    region: "América do Sul",
    aliases: ["uruguay"],
    routes: [
      mercosur(
        "Uruguai",
        "Rentista é categoria para quem não usa o acordo. Brasileiro usa o acordo. Não pague os dois.",
      ),
    ],
  },
  {
    id: "paraguai",
    name: "Paraguai",
    region: "América do Sul",
    aliases: ["paraguay"],
    routes: [
      mercosur(
        "Paraguai",
        "Faça na Dirección General de Migraciones. Escritório de shopping que 'inclusui cédula e RUC' cobra o honorário que este balcão corta.",
      ),
    ],
  },
  {
    id: "chile",
    name: "Chile",
    region: "América do Sul",
    aliases: [],
    routes: [mercosur("Chile", "Associado ao acordo. Confirme o posto: a prática muda mais que a lei.")],
  },
  {
    id: "bolivia",
    name: "Bolívia",
    region: "América do Sul",
    aliases: ["bolivia"],
    routes: [mercosur("Bolívia", "Associado. Leve a certidão mesmo assim. Posto do interior pede o que a capital dispensa.")],
  },
  {
    id: "colombia",
    name: "Colômbia",
    region: "América do Sul",
    aliases: ["colombia"],
    routes: [mercosur("Colômbia", "Associado ao acordo de residência. Não é o visto de nômade, que é outra fila e outro piso.")],
  },
  {
    id: "peru",
    name: "Peru",
    region: "América do Sul",
    aliases: [],
    routes: [mercosur("Peru", "Associado. Cuidado com 'tramitador' na porta da migraciones.")],
  },
  {
    id: "equador",
    name: "Equador",
    region: "América do Sul",
    aliases: ["ecuador"],
    routes: [mercosur("Equador", "Associado. A taxa local é pública. Peça o número do órgão, não o PIX do despachante.")],
  },
  {
    id: "portugal",
    name: "Portugal",
    region: "Europa",
    aliases: ["pt"],
    routes: [PT],
  },
  {
    id: "espanha",
    name: "Espanha",
    region: "Europa",
    aliases: ["spain", "espana", "españa"],
    routes: [ES],
  },
  {
    id: "alemanha",
    name: "Alemanha",
    region: "Europa",
    aliases: ["germany", "deutschland"],
    routes: [DE],
    wh: { min: 18, max: 30, route: DE_WH },
  },
  {
    id: "franca",
    name: "França",
    region: "Europa",
    aliases: ["france", "francia"],
    routes: [
      hard(
        "França",
        "Sem empregador francês, o caminho de brasileiro adulto é o de férias-trabalho, e só até os 30. Visitante não pode trabalhar. Não existe nômade que vire residência nesta ficha.",
      ),
    ],
    wh: { min: 18, max: 30, route: FR_WH },
  },
  {
    id: "italia",
    name: "Itália",
    region: "Europa",
    aliases: ["italy", "italia"],
    routes: [IT_NOM],
  },
  { id: "grecia", name: "Grécia", region: "Europa", aliases: ["greece"], routes: [GR] },
  { id: "croacia", name: "Croácia", region: "Europa", aliases: ["croatia"], routes: [HR] },
  { id: "estonia", name: "Estônia", region: "Europa", aliases: ["estonia"], routes: [EE] },
  { id: "hungria", name: "Hungria", region: "Europa", aliases: ["hungary"], routes: [HU] },
  { id: "malta", name: "Malta", region: "Europa", aliases: [], routes: [MT] },
  {
    id: "mexico",
    name: "México",
    region: "América do Norte",
    aliases: ["mexico"],
    routes: [MX],
  },
  {
    id: "costa-rica",
    name: "Costa Rica",
    region: "América Central",
    aliases: [],
    routes: [CR_RENT],
  },
  { id: "panama", name: "Panamá", region: "América Central", aliases: ["panama"], routes: [PA] },
  {
    id: "estados-unidos",
    name: "Estados Unidos",
    region: "América do Norte",
    aliases: ["eua", "usa", "estados unidos", "united states"],
    routes: [
      hard(
        "Estados Unidos",
        "Não há visto de nômade. B1/B2 não autoriza morar nem trabalhar. Brasil não é país do E-2. O-1 é para trajetória fora da curva, com prova, não com agência de Instagram. Quem vende 'residência com turismo' está vendendo ilegalidade. Este balcão não faz isso.",
      ),
    ],
  },
  {
    id: "canada",
    name: "Canadá",
    region: "América do Norte",
    aliases: ["canada"],
    routes: [
      hard(
        "Canadá",
        "Express Entry é ponto, não pasta. Brasileiro não entra no Working Holiday (IEC). Estudo de verdade é rota, e custa mensalidade, não honorário de visto. Não existe pulo de 90% aqui.",
      ),
    ],
  },
  {
    id: "australia",
    name: "Austrália",
    region: "Oceania",
    aliases: ["australia"],
    routes: [
      hard(
        "Austrália",
        "Não há Working Holiday para brasileiro. Residência é visto de pontos ou patrocínio. Agência não fabrica ponto.",
      ),
    ],
  },
  {
    id: "nova-zelandia",
    name: "Nova Zelândia",
    region: "Oceania",
    aliases: ["new zealand", "nz", "nova zelandia"],
    routes: [
      hard(
        "Nova Zelândia",
        "Fora da idade do Working Holiday, residência é visto de pontos. Não há nômade que vire residente.",
      ),
    ],
    wh: { min: 18, max: 30, route: NZ_WH },
  },
  {
    id: "coreia-do-sul",
    name: "Coreia do Sul",
    region: "Ásia",
    aliases: ["korea", "coreia", "south korea"],
    routes: [
      hard(
        "Coreia do Sul",
        "Fora do H-1 (férias-trabalho, até 30 anos), trabalho pede patrocinador. Não há residência por saldo de freelancer.",
      ),
    ],
    wh: { min: 18, max: 30, route: KR_WH },
  },
  {
    id: "japao",
    name: "Japão",
    region: "Ásia",
    aliases: ["japan", "japao"],
    routes: [JP],
  },
  {
    id: "tailandia",
    name: "Tailândia",
    region: "Ásia",
    aliases: ["thailand", "tailandia"],
    routes: [TH],
  },
  {
    id: "malasia",
    name: "Malásia",
    region: "Ásia",
    aliases: ["malaysia", "malasia"],
    routes: [MY],
  },
  {
    id: "emirados",
    name: "Emirados Árabes",
    region: "Oriente Médio",
    aliases: ["uae", "dubai", "emirados arabes", "abu dhabi"],
    routes: [AE],
  },
  {
    id: "reino-unido",
    name: "Reino Unido",
    region: "Europa",
    aliases: ["uk", "inglaterra", "england", "britain"],
    routes: [
      hard(
        "Reino Unido",
        "Skilled Worker pede patrocinador com licença. Não há nômade. Ancestral e Global Talent são provas específicas, não formulário genérico.",
      ),
    ],
  },
  {
    id: "paises-baixos",
    name: "Países Baixos",
    region: "Europa",
    aliases: ["holanda", "netherlands", "holland"],
    routes: [
      hard(
        "Países Baixos",
        "O DAFT é para americano, não para brasileiro. Highly skilled migrant pede empregador. Sem isso, não há protocolo barato.",
      ),
    ],
  },
  {
    id: "irlanda",
    name: "Irlanda",
    region: "Europa",
    aliases: ["ireland"],
    routes: [
      hard(
        "Irlanda",
        "Trabalho pede autorização e, em regra, empregador. Não há visto de nômade que vire residência nesta ficha.",
      ),
    ],
  },
  {
    id: "suica",
    name: "Suíça",
    region: "Europa",
    aliases: ["switzerland", "suica"],
    routes: [
      hard(
        "Suíça",
        "Cota, empregador e salário de tabela. Não é destino de pasta barata. Turismo de 90 dias não acumula residência.",
      ),
    ],
  },
  {
    id: "georgia",
    name: "Geórgia",
    region: "Ásia",
    aliases: ["georgia"],
    routes: [
      hard(
        "Geórgia",
        "Estadia sem visto, quando existe para o seu passaporte, não é residência. Não compre 'residência fiscal' achando que é permissão de morar para sempre.",
      ),
    ],
  },
  {
    id: "singapura",
    name: "Singapura",
    region: "Ásia",
    aliases: ["singapore"],
    routes: [
      hard(
        "Singapura",
        "Employment Pass e semelhantes pedem empregador e salário alto. Não há pulo de freelancer com pasta brasileira.",
      ),
    ],
  },
  {
    id: "africa-do-sul",
    name: "África do Sul",
    region: "África",
    aliases: ["south africa", "africa do sul"],
    routes: [
      hard(
        "África do Sul",
        "Visto de trabalho pede oferta. Aposentado e categorias financeiras têm piso próprio e não são baratos. Sem piso publicado que caiba num pulo de 90% para freelancer comum.",
      ),
    ],
  },
  {
    id: "cabo-verde",
    name: "Cabo Verde",
    region: "África",
    aliases: ["cape verde", "cabo verde"],
    routes: [
      hard(
        "Cabo Verde",
        "Língua e CPLP aproximam, mas este balcão não assina um 'acordo que dispensa tudo'. Leia a lei de estrangeiros do ano. Não pague pacote genérico de residência africana.",
      ),
    ],
  },
];

const INDEX: Array<{ id: string; name: string; region: string; aliases?: string[] }> = [
  { id: "venezuela", name: "Venezuela", region: "América do Sul" },
  { id: "guiana", name: "Guiana", region: "América do Sul" },
  { id: "suriname", name: "Suriname", region: "América do Sul" },
  { id: "cuba", name: "Cuba", region: "América Central" },
  { id: "el-salvador", name: "El Salvador", region: "América Central" },
  { id: "guatemala", name: "Guatemala", region: "América Central" },
  { id: "haiti", name: "Haiti", region: "América Central" },
  { id: "honduras", name: "Honduras", region: "América Central" },
  { id: "nicaragua", name: "Nicarágua", region: "América Central" },
  { id: "republica-dominicana", name: "República Dominicana", region: "América Central", aliases: ["dominicana"] },
  { id: "belize", name: "Belize", region: "América Central" },
  { id: "jamaica", name: "Jamaica", region: "América Central" },
  { id: "austria", name: "Áustria", region: "Europa" },
  { id: "belgica", name: "Bélgica", region: "Europa" },
  { id: "dinamarca", name: "Dinamarca", region: "Europa" },
  { id: "finlandia", name: "Finlândia", region: "Europa" },
  { id: "noruega", name: "Noruega", region: "Europa" },
  { id: "suecia", name: "Suécia", region: "Europa" },
  { id: "polonia", name: "Polônia", region: "Europa" },
  { id: "republica-tcheca", name: "República Tcheca", region: "Europa", aliases: ["tcheca", "chequia"] },
  { id: "romenia", name: "Romênia", region: "Europa" },
  { id: "bulgaria", name: "Bulgária", region: "Europa" },
  { id: "servia", name: "Sérvia", region: "Europa" },
  { id: "ucrania", name: "Ucrânia", region: "Europa" },
  { id: "luxemburgo", name: "Luxemburgo", region: "Europa" },
  { id: "islandia", name: "Islândia", region: "Europa" },
  { id: "china", name: "China", region: "Ásia" },
  { id: "india", name: "Índia", region: "Ásia" },
  { id: "indonesia", name: "Indonésia", region: "Ásia" },
  { id: "vietna", name: "Vietnã", region: "Ásia" },
  { id: "filipinas", name: "Filipinas", region: "Ásia" },
  { id: "taiwan", name: "Taiwan", region: "Ásia" },
  { id: "israel", name: "Israel", region: "Oriente Médio" },
  { id: "catar", name: "Catar", region: "Oriente Médio" },
  { id: "arabia", name: "Arábia Saudita", region: "Oriente Médio", aliases: ["saudi"] },
  { id: "turquia", name: "Turquia", region: "Europa", aliases: ["turkey"] },
  { id: "marrocos", name: "Marrocos", region: "África" },
  { id: "egito", name: "Egito", region: "África" },
  { id: "nigeria", name: "Nigéria", region: "África" },
  { id: "angola", name: "Angola", region: "África" },
  { id: "mocambique", name: "Moçambique", region: "África" },
  { id: "quenia", name: "Quênia", region: "África" },
  { id: "fiji", name: "Fiji", region: "Oceania" },
];

for (const item of INDEX) {
  COUNTRIES.push({
    id: item.id,
    name: item.name,
    region: item.region,
    aliases: item.aliases,
    routes: [
      hard(
        item.name,
        `${item.name} não tem, neste balcão, acordo de residência nem visto de nômade que vire residência para brasileiro. Turismo não acumula prazo.`,
      ),
    ],
  });
}

const EU_IDS = new Set(
  COUNTRIES.filter(
    (c) =>
      c.region === "Europa" &&
      !["reino-unido", "suica", "servia", "ucrania", "turquia", "georgia"].includes(c.id),
  ).map((c) => c.id),
);

export function ancestryUnlocks(ancestry: string, countryId: string): boolean {
  if (ancestry === "nenhuma") return false;
  return EU_IDS.has(countryId);
}

export function ancestryVisa(ancestry: string): VisaSpec | null {
  if (ancestry === "italia") {
    return v({
      id: "cit-it",
      name: "Cidadania italiana por descendência (via consular)",
      kind: "cidadania",
      qualify: "none",
      blurb:
        "Se a linha está inteira, sem quebra e sem depender de processo judicial, o consulado reconhece. A agência cobra a fila e o checklist. Os dois são públicos.",
      income: null,
      savings: null,
      statementMonths: 0,
      agencyBrl: 24000,
      consularBrl: 200,
      cardBrl: 0,
      receive: "EUR",
      receiveWhy: "Com o passaporte italiano, a moeda da vida na UE é o euro. O reconhecimento em si não pede renda.",
      allowsRemote: true,
      allowsLocalWork: true,
      needsBirth: true,
      needsApostille: true,
      needsTranslation: true,
      insurance: "none",
      residenceNote:
        "Não é visto. É cidadania. Com ela, residir na União Europeia deixa de ser pedido de visto. Fora da UE, você volta a precisar de visto, agora com passaporte italiano.",
      steps: [
        "Monte a linha: seu nascimento, o do genitor italiano, o do avô, casamentos. Inteiro teor, recente.",
        "Apostila em cada certidão brasileira. Tradução juramentada para italiano depois da apostila.",
        "Entre na fila do consulado da sua circunscrição. A senha é de graça. Quem vende 'fila adiantada' está vendendo outra coisa.",
        "Linha materna com nascimento do filho antes de 1948, ou certidão que precisa de retificação, é processo. Processo não é este balcão: aí o advogado deixa de ser opcional.",
      ],
      trap: "Não invente ascendente. Documento falso encerra o processo e pode virar crime. Este pulo só existe se a família existe.",
      sourceNote: "Reconhecimento consular de cidadania italiana jure sanguinis. Via judicial é outro regime.",
    });
  }
  if (ancestry === "portugal") {
    return v({
      id: "cit-pt",
      name: "Nacionalidade portuguesa por descendência",
      kind: "cidadania",
      qualify: "none",
      blurb:
        "Filho de português tem caminho direto no registro civil. Neto tem exigências a mais (ligação efetiva). Os dois se protocolam sem escritório, se a certidão existe.",
      income: null,
      savings: null,
      statementMonths: 0,
      agencyBrl: 18000,
      consularBrl: 300,
      cardBrl: 0,
      receive: "EUR",
      receiveWhy: "Euro, quando você for viver na Europa. O pedido de nacionalidade não pede salário.",
      allowsRemote: true,
      allowsLocalWork: true,
      needsBirth: true,
      needsApostille: true,
      needsTranslation: false,
      insurance: "none",
      residenceNote: "Cidadania, não visto. Neto não é automático: há requisitos de vínculo. Leia o artigo vigente antes de pagar tradução.",
      steps: [
        "Peça a certidão portuguesa do ascendente no civil online ou no arquivo. Sem ela não há pasta.",
        "Certidões brasileiras de inteiro teor, apostila, e o formulário do pedido no sítio do registo.",
        "Filho protocola atribuição. Neto confirma se cumpre a ligação efetiva. Não pague 'garantia de neto'.",
      ],
      trap: "Assessoria não cria avô português. Se a certidão não aparece no arquivo, o produto acabou.",
      sourceNote: "Lei da nacionalidade portuguesa. Filho e neto não são o mesmo pedido.",
    });
  }
  if (ancestry === "espanha") {
    return v({
      id: "cit-es",
      name: "Nacionalidade espanhola por origem",
      kind: "cidadania",
      qualify: "none",
      blurb:
        "Filho de espanhol de origem segue regra ordinária. Neto dependeu de janela legal (memória democrática) que pode estar fechada. Não pague pasta de neto sem o consulado confirmar que ainda recebe.",
      income: null,
      savings: null,
      statementMonths: 0,
      agencyBrl: 16000,
      consularBrl: 300,
      cardBrl: 0,
      receive: "EUR",
      receiveWhy: "Euro na vida europeia. O pedido não é um visto de renda.",
      allowsRemote: true,
      allowsLocalWork: true,
      needsBirth: true,
      needsApostille: true,
      needsTranslation: true,
      insurance: "none",
      residenceNote: "Se sair, é cidadania. Se a janela de neto fechou, neto não é pulo: é recusa.",
      steps: [
        "Confirme no consulado se o seu grau (filho ou neto) ainda tem pedido aberto.",
        "Certidões, apostila, tradução juramentada para espanhol.",
        "Protocole você. 'Lei da memória' vendida em 2026 sem checagem de prazo é produto vencido.",
      ],
      trap: "A janela de netos teve prazo. Fora do prazo, honorário nenhum reabre a lei.",
      sourceNote: "Código civil e Lei de Memória Democrática. Prazo de neto: confirme na data do protocolo.",
    });
  }
  if (ancestry === "alemanha") {
    return v({
      id: "cit-de",
      name: "Cidadania alemã por descendência",
      kind: "cidadania",
      qualify: "none",
      blurb:
        "Só vale se a cadeia passa nas regras de sexo, ano e registro. Não é formulário de fim de semana. Quando a cadeia fecha, o pedido é administrativo e a agência é opcional.",
      income: null,
      savings: null,
      statementMonths: 0,
      agencyBrl: 20000,
      consularBrl: 400,
      cardBrl: 0,
      receive: "EUR",
      receiveWhy: "Euro. O reconhecimento não exige renda de nômade.",
      allowsRemote: true,
      allowsLocalWork: true,
      needsBirth: true,
      needsApostille: true,
      needsTranslation: true,
      insurance: "none",
      residenceNote: "Cidadania, se a cadeia existir. Se não existir, volte para a Chancenkarte ou para outro país.",
      steps: [
        "Reúna a linha com anos de nascimento e de emigração. As regras mudam conforme a data.",
        "Se a cadeia quebra, pare. Não pague apostila em série.",
        "Se fecha, protocole no consulado com tradução juramentada.",
      ],
      trap: "Ascendência alemã 'de sobrenome' não é cadeia. Sem certidão, não há pulo.",
      sourceNote: "Staatsangehörigkeitsgesetz. Casos de gênero e data são decisivos.",
    });
  }
  return null;
}

export function findCountry(id: string): Country | undefined {
  if (id.startsWith("outro:")) {
    const name = id.slice(6).trim() || "Este país";
    return {
      id,
      name,
      region: "Fora do índice",
      routes: [
        hard(
          name,
          `${name} não tem ficha pronta neste balcão. Sem acordo ou visto publicado aqui, turismo não vira residência. Não pague apostila antes de achar a categoria no site oficial.`,
        ),
      ],
    };
  }
  return COUNTRIES.find((c) => c.id === id);
}

export function searchCountries(q: string): Country[] {
  const n = norm(q.trim());
  if (!n) return COUNTRIES;
  return COUNTRIES.filter((c) => {
    if (norm(c.name).includes(n)) return true;
    if (c.aliases?.some((a) => norm(a).includes(n))) return true;
    return false;
  });
}

export function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function suggestId(region: string): string {
  switch (region) {
    case "América do Sul":
      return "argentina";
    case "América Central":
      return "costa-rica";
    case "América do Norte":
      return "mexico";
    case "Europa":
      return "espanha";
    case "Ásia":
      return "tailandia";
    case "Oceania":
      return "nova-zelandia";
    case "Oriente Médio":
      return "emirados";
    default:
      return "argentina";
  }
}
