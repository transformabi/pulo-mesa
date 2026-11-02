import { useEffect, useMemo, useState, type ReactNode } from "react";
import { buildDossier, EMPTY_FICHA, plainDossier } from "@/lib/pulo/engine";
import { findCountry, searchCountries } from "@/lib/pulo/catalog";
import { formatBrl, formatPct } from "@/lib/pulo/money";
import type { Ancestry, Currency, Ficha, Passport, WorkMode } from "@/lib/pulo/types";

const KEY = "pulo-ficha-v1";

const field =
  "h-12 w-full border border-line bg-paper px-3 text-ink outline-none focus-visible:border-ink";

const MODES: { id: WorkMode; label: string; hint: string }[] = [
  { id: "remoto", label: "Home office", hint: "Cliente fora do destino" },
  { id: "presencial", label: "Presencial", hint: "Trabalhar no país" },
  { id: "hibrido", label: "Híbrido", hint: "Os dois, com regra" },
];

const PASSPORTS: { id: Passport; label: string }[] = [
  { id: "valido", label: "Tenho, válido" },
  { id: "curto", label: "Vence em menos de 6 meses" },
  { id: "sem", label: "Não tenho" },
];

const ANCESTRIES: { id: Ancestry; label: string }[] = [
  { id: "nenhuma", label: "Nenhuma" },
  { id: "italia", label: "Italiana" },
  { id: "portugal", label: "Portuguesa" },
  { id: "espanha", label: "Espanhola" },
  { id: "alemanha", label: "Alemã" },
];

const CURRENCIES: Currency[] = ["BRL", "USD", "EUR"];

export function Desk() {
  const [ficha, setFicha] = useState<Ficha>(EMPTY_FICHA);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fxOpen, setFxOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Ficha>;
        setFicha({ ...EMPTY_FICHA, ...parsed });
        const country = parsed.countryId ? findCountry(parsed.countryId) : undefined;
        if (country) setQuery(country.name);
      }
    } catch {
      /* ficha nova */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(ficha));
  }, [ficha, ready]);

  const dossier = useMemo(() => buildDossier(ficha), [ficha]);
  const hits = useMemo(() => searchCountries(query).slice(0, 8), [query]);

  function patch(partial: Partial<Ficha>) {
    setFicha((prev) => ({ ...prev, ...partial }));
  }

  function pickCountry(id: string) {
    const country = findCountry(id);
    if (!country) return;
    patch({ countryId: id });
    setQuery(country.name);
    setOpen(false);
  }

  async function copy() {
    if (!dossier) return;
    try {
      await navigator.clipboard.writeText(plainDossier(ficha, dossier));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="bg-ink text-cream">
        <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-3 px-4 py-4">
          <div>
            <p className="font-serif text-2xl leading-none tracking-tight">PULO</p>
            <p className="mt-1 text-sm text-cream">Mesa de saída · protocolo direto</p>
          </div>
          <p className="text-right text-xs uppercase tracking-widest text-cream">Balcão · out/2026</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <p className="text-xs uppercase tracking-widest text-signal">O pulo</p>
        <h1 className="mt-2 max-w-xl text-4xl leading-tight text-ink">
          A agência vende o formulário que o consulado publica.
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          Você paga cartório e taxa. O honorário sai. O corte passa de 90% quando o papel oficial é
          uma fração do pacote — acordo do Mercosul, e cidadania se a cadeia de certidões existe. No
          resto, a mesa mostra o percentual real. Não é parecer de advogado.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <section className="sheet border border-line bg-paper px-4 py-5 lg:sticky lg:top-4 lg:col-span-5 lg:self-start">
            <h2 className="text-2xl">Ficha</h2>
            <p className="mt-1 text-sm text-muted">Tudo o que o balcão precisa para montar o dossiê.</p>

            <Field label="Passaporte">
              <div className="grid gap-2">
                {PASSPORTS.map((item) => (
                  <Choice
                    key={item.id}
                    pressed={ficha.passport === item.id}
                    onClick={() => patch({ passport: item.id })}
                    label={item.label}
                  />
                ))}
              </div>
            </Field>

            <Field label="País">
              <div
                className="relative"
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
                }}
              >
                <input
                  className={field}
                  value={query}
                  placeholder="Qualquer país"
                  aria-label="País de destino"
                  autoComplete="off"
                  onFocus={() => setOpen(true)}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setOpen(true);
                    if (findCountry(ficha.countryId)?.name !== event.target.value) {
                      patch({ countryId: "" });
                    }
                  }}
                />
                {open && (
                  <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-auto border border-line bg-paper">
                    {hits.length === 0 && (
                      <li>
                        {query.trim().length > 1 ? (
                          <button
                            type="button"
                            className="min-h-11 w-full px-3 py-2 text-left hover:bg-cream"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => {
                              const name = query.trim();
                              patch({ countryId: `outro:${name}` });
                              setQuery(name);
                              setOpen(false);
                            }}
                          >
                            <span className="block font-medium">Usar “{query.trim()}” mesmo assim</span>
                            <span className="block text-sm text-muted">
                              Sem ficha pronta. A mesa diz se existe atalho.
                            </span>
                          </button>
                        ) : (
                          <p className="px-3 py-3 text-sm text-muted">
                            Fora do índice. Turismo não vira residência em lugar nenhum.
                          </p>
                        )}
                      </li>
                    )}
                    {hits.map((country) => (
                      <li key={country.id}>
                        <button
                          type="button"
                          className="flex min-h-11 w-full items-baseline justify-between gap-3 px-3 py-2 text-left hover:bg-cream"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => pickCountry(country.id)}
                        >
                          <span>{country.name}</span>
                          <span className="text-xs text-muted">{country.region}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Field>

            <Field label="Quanto você tem guardado">
              <div className="flex gap-2">
                <input
                  className={field}
                  inputMode="decimal"
                  value={ficha.savings}
                  placeholder="0"
                  aria-label="Valor guardado"
                  onChange={(event) => patch({ savings: event.target.value })}
                />
                <CurrencySwitch
                  value={ficha.savingsCurrency}
                  onChange={(savingsCurrency) => patch({ savingsCurrency })}
                />
              </div>
            </Field>

            <Field label="Ofício e tempo">
              <div className="grid grid-cols-3 gap-2">
                <input
                  className={`${field} col-span-2`}
                  value={ficha.profession}
                  placeholder="Design, código, cozinha…"
                  aria-label="Profissão"
                  onChange={(event) => patch({ profession: event.target.value })}
                />
                <input
                  className={field}
                  inputMode="numeric"
                  value={ficha.years}
                  placeholder="Anos"
                  aria-label="Anos de experiência"
                  onChange={(event) => patch({ years: event.target.value })}
                />
              </div>
            </Field>

            <Field label="Quanto você cobra por serviço">
              <div className="flex gap-2">
                <input
                  className={field}
                  inputMode="decimal"
                  value={ficha.rate}
                  placeholder="Preço de um serviço fechado"
                  aria-label="Preço por serviço"
                  onChange={(event) => patch({ rate: event.target.value })}
                />
                <CurrencySwitch
                  value={ficha.rateCurrency}
                  onChange={(rateCurrency) => patch({ rateCurrency })}
                />
              </div>
              <p className="mt-2 text-sm text-muted">
                Não é salário. É o preço de um trabalho entregue. A mesa divide a meta por esse número.
              </p>
            </Field>

            <Field label="Onde o trabalho acontece">
              <div className="grid gap-2">
                {MODES.map((mode) => (
                  <Choice
                    key={mode.id}
                    pressed={ficha.workMode === mode.id}
                    onClick={() => patch({ workMode: mode.id })}
                    label={mode.label}
                    hint={mode.hint}
                  />
                ))}
              </div>
            </Field>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Field label="Idade">
                <input
                  className={field}
                  inputMode="numeric"
                  value={ficha.age}
                  placeholder="Opcional"
                  aria-label="Idade"
                  onChange={(event) => patch({ age: event.target.value })}
                />
              </Field>
              <Field label="Ascendência">
                <select
                  className={field}
                  value={ficha.ancestry}
                  aria-label="Ascendência"
                  onChange={(event) => patch({ ancestry: event.target.value as Ancestry })}
                >
                  {ANCESTRIES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <button
              type="button"
              className="no-print mt-4 text-sm text-muted underline decoration-line underline-offset-4"
              onClick={() => setFxOpen((value) => !value)}
            >
              {fxOpen ? "Fechar câmbio" : "Ajustar câmbio do consulado"}
            </button>
            {fxOpen && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <label className="text-sm text-muted">
                  Dólar em reais
                  <input
                    className={`${field} mt-1`}
                    inputMode="decimal"
                    value={ficha.fxUsd}
                    onChange={(event) => patch({ fxUsd: event.target.value })}
                  />
                </label>
                <label className="text-sm text-muted">
                  Euro em reais
                  <input
                    className={`${field} mt-1`}
                    inputMode="decimal"
                    value={ficha.fxEur}
                    onChange={(event) => patch({ fxEur: event.target.value })}
                  />
                </label>
              </div>
            )}
            <p className="mt-3 text-xs text-muted">Câmbio de balcão 30/10/2026, se você não alterar.</p>
          </section>

          <section className="lg:col-span-7">
            {!dossier && (
              <div>
                <h2 className="text-2xl">Três portas que fecham 90%</h2>
                <p className="mt-2 text-sm text-muted">
                  Escolha um país na ficha, ou comece por uma porta que já corta o honorário.
                </p>
                <div className="mt-4 grid gap-3">
                  <Teaser
                    kicker="Residência · sem piso de renda"
                    title="Argentina, Uruguai, Paraguai"
                    body="Acordo do Mercosul. Você protocola. O despachante é o honorário inteiro."
                    onClick={() => pickCountry("argentina")}
                  />
                  <Teaser
                    kicker="Residência · renda em euro"
                    title="Espanha, teletrabalho"
                    body="Para brasileiro, a residência legal é o caminho curto de nacionalidade. O papel não chega a 90% do pacote. A vida, se a renda fecha, pode valer mais."
                    onClick={() => pickCountry("espanha")}
                  />
                  <Teaser
                    kicker="O pulo dentro do pulo"
                    title="Portugal e o PB4"
                    body="O D8 pede € 3.680 por mês. O seguro anual é o que derruba o corte. O certificado PB4 do INSS é de graça. Se o posto aceitar, o pacote passa de 90%."
                    onClick={() => pickCountry("portugal")}
                  />
                </div>
              </div>
            )}

            {dossier && (
              <article className="border border-line bg-paper p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted">{dossier.country.region}</p>
                    <h2 className="mt-1 text-3xl">{dossier.country.name}</h2>
                  </div>
                  <div className="seal grid h-24 w-24 shrink-0 place-items-center rounded-full text-center" aria-hidden>
                    <span>
                      <span className="block font-serif text-xs leading-tight tracking-widest">{dossier.stamp}</span>
                      <span className="mt-1 block text-xs uppercase tracking-widest">{dossier.stampSub}</span>
                    </span>
                  </div>
                </div>
                <p className="mt-3 font-serif text-xl leading-snug">{dossier.visa.name}</p>

                <p className="mt-4 text-pretty">{dossier.visa.blurb}</p>
                <p className="mt-2 text-sm text-muted">{dossier.fitNote}</p>

                {dossier.warnings.length > 0 && (
                  <ul className="mt-4 grid gap-2">
                    {dossier.warnings.map((warning) => (
                      <li key={warning} className="border border-line bg-cream px-3 py-2 text-sm">
                        {warning}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <Stat
                    kicker="Serviços por mês"
                    value={dossier.servicesMonth == null ? "—" : String(dossier.servicesMonth)}
                    note={dossier.servicesMonthLabel}
                  />
                  <Stat
                    kicker="Serviços da reserva"
                    value={dossier.servicesReserve == null ? "—" : String(dossier.servicesReserve)}
                    note={dossier.servicesReserveLabel}
                  />
                  <Stat
                    kicker="Corte do pacote"
                    value={formatPct(dossier.cut)}
                    note={
                      dossier.agencyBrl
                        ? `Honorário típico ${formatBrl(dossier.agencyBrl)} some. Papel: ${formatBrl(dossier.paperBrl)}.`
                        : "Não há honorário para cortar. Não pague quem inventa a rota."
                    }
                  />
                </div>

                {dossier.visa.qualify === "either" && (
                  <p className="mt-3 text-sm text-muted">
                    Este visto fecha por um dos dois: a renda mensal ou o saldo. Se a reserva já cobre, os
                    serviços do mês são só o outro caminho.
                  </p>
                )}

                <dl className="mt-5 grid gap-3 border-t border-line pt-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-muted">Renda que o visto pede</dt>
                    <dd className="font-medium tabular-nums">{dossier.incomeLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Reserva que o visto pede</dt>
                    <dd className="font-medium tabular-nums">{dossier.reserveLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Você tem guardado</dt>
                    <dd className="font-medium tabular-nums">{dossier.haveLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Seu serviço, em reais de balcão</dt>
                    <dd className="font-medium tabular-nums">{dossier.rateLabel}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-muted">Moeda para receber</dt>
                    <dd className="font-medium">
                      {dossier.receive === "BRL" ? "Real" : dossier.receive === "USD" ? "Dólar" : "Euro"}
                    </dd>
                    <dd className="mt-1 text-muted">{dossier.receiveWhy}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-muted">O que este visto vira</dt>
                    <dd>{dossier.visa.residenceNote}</dd>
                  </div>
                </dl>

                {dossier.paperLeverBrl != null && dossier.leverLabel && (
                  <p className="mt-4 border border-stamp bg-cream px-3 py-3 text-sm">
                    Com o PB4, o papel fica em {formatBrl(dossier.paperBrl)} e o corte em{" "}
                    {formatPct(dossier.cut)}. {dossier.leverLabel}: papel {formatBrl(dossier.paperLeverBrl)}, corte{" "}
                    {formatPct(dossier.cutLever)}. O pulo é não comprar o seguro antes de ouvir o posto.
                  </p>
                )}

                <h3 className="mt-6 text-2xl">Papéis e o que cada um custa</h3>
                <p className="mt-1 text-sm text-muted">
                  Faixa de balcão no Brasil, out/2026. Passagem não entra. Agência também não compra passagem.
                </p>
                <div className="mt-3 divide-y divide-line border-y border-line">
                  {dossier.lines.map((line) => (
                    <div key={line.id} className="grid gap-1 py-3 sm:grid-cols-[1fr_auto] sm:gap-4">
                      <div>
                        <p className="font-medium">
                          {line.name}
                          {line.optional ? " · se pedirem" : ""}
                        </p>
                        <p className="text-sm text-muted">
                          {line.where} · {line.days}
                        </p>
                        <p className="mt-1 text-sm">{line.pulo}</p>
                      </div>
                      <p className="font-medium tabular-nums sm:text-right">{line.costLabel}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 flex items-baseline justify-between font-medium tabular-nums">
                  <span>Papel que entra na conta</span>
                  <span>{formatBrl(dossier.paperBrl)}</span>
                </p>

                <h3 className="mt-6 text-2xl">Como protocolar</h3>
                <ol className="mt-3 grid gap-3">
                  {dossier.steps.map((step, index) => (
                    <li key={step} className="grid grid-cols-[2rem_1fr] gap-2">
                      <span className="font-serif text-xl text-signal tabular-nums">{index + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-sm">{dossier.visa.trap}</p>

                {dossier.ancestryCard && (
                  <div className="mt-5 border border-line bg-cream p-4">
                    <p className="text-xs uppercase tracking-widest text-signal">
                      {dossier.ancestryCard.promoted ? "Ficha da frente" : "Atalho maior, se a cadeia existir"}
                    </p>
                    <h3 className="mt-1 text-xl">{dossier.ancestryCard.title}</h3>
                    <p className="mt-2 text-sm">{dossier.ancestryCard.body}</p>
                    <p className="mt-2 text-sm tabular-nums text-muted">
                      Papel {formatBrl(dossier.ancestryCard.paperBrl)} · agência{" "}
                      {formatBrl(dossier.ancestryCard.agencyBrl)} · corte {formatPct(dossier.ancestryCard.cut)}
                    </p>
                  </div>
                )}

                {dossier.ninety.length > 0 && (dossier.cut == null || dossier.cut < 0.9) && (
                  <div className="mt-5">
                    <h3 className="text-xl">Onde esta mesma ficha corta 90%</h3>
                    <div className="mt-3 grid gap-2">
                      {dossier.ninety.map((item) => (
                        <button
                          key={item.country.id}
                          type="button"
                          className="flex min-h-11 items-center justify-between gap-3 border border-line px-3 py-2 text-left hover:bg-cream"
                          onClick={() => pickCountry(item.country.id)}
                        >
                          <span>
                            {item.country.name}
                            <span className="mt-0.5 block text-sm text-muted">{item.visa.name}</span>
                          </span>
                          <span className="tabular-nums text-stamp">{formatPct(item.cut)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {dossier.alternatives.length > 0 && (
                  <div className="mt-5">
                    <h3 className="text-xl">Outra porta</h3>
                    <ul className="mt-2 grid gap-2">
                      {dossier.alternatives.map((item) => (
                        <li key={`${item.country.id}-${item.visa.id}`}>
                          <button
                            type="button"
                            className="w-full min-h-11 border border-line px-3 py-2 text-left hover:bg-cream"
                            onClick={() => pickCountry(item.country.id)}
                          >
                            <span className="font-medium">{item.country.name}</span>
                            <span className="mt-0.5 block text-sm text-muted">
                              {item.visa.name} · corte {formatPct(item.cut)}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="no-print mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="h-12 bg-signal px-4 font-medium text-ink"
                    onClick={() => void copy()}
                  >
                    {copied ? "Dossiê copiado" : "Copiar dossiê"}
                  </button>
                  <button
                    type="button"
                    className="h-12 border border-ink px-4 font-medium"
                    onClick={() => window.print()}
                  >
                    Imprimir
                  </button>
                </div>

                <p className="mt-5 text-xs text-muted">{dossier.visa.sourceNote}</p>
                <p className="mt-2 text-xs text-muted">
                  Referência de balcão, não é aconselhamento jurídico nem migratório. Confira o site do
                  consulado antes de pagar taxa. Documento falso, casamento de fachada e turismo para morar
                  não são pulo: são recusa. Residência migratória também não é residência fiscal.
                </p>
              </article>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-sm font-medium">{label}</p>
      {children}
    </div>
  );
}

function Choice({
  pressed,
  onClick,
  label,
  hint,
}: {
  pressed: boolean;
  onClick: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`min-h-11 border px-3 py-2 text-left ${pressed ? "border-ink bg-ink text-cream" : "border-line bg-paper text-ink"}`}
    >
      <span className="block font-medium">{label}</span>
      {hint && <span className={`block text-sm ${pressed ? "text-cream" : "text-muted"}`}>{hint}</span>}
    </button>
  );
}

function CurrencySwitch({
  value,
  onChange,
}: {
  value: Currency;
  onChange: (currency: Currency) => void;
}) {
  return (
    <div className="flex shrink-0">
      {CURRENCIES.map((currency) => (
        <button
          key={currency}
          type="button"
          aria-pressed={value === currency}
          className={`h-12 min-w-11 px-2 text-xs ${value === currency ? "bg-ink text-cream" : "border border-line bg-paper text-muted"}`}
          onClick={() => onChange(currency)}
        >
          {currency}
        </button>
      ))}
    </div>
  );
}

function Stat({ kicker, value, note }: { kicker: string; value: string; note: string }) {
  return (
    <div className="border border-line bg-cream p-3">
      <p className="text-xs uppercase tracking-widest text-muted">{kicker}</p>
      <p className="mt-1 font-serif text-4xl tabular-nums leading-none">{value}</p>
      <p className="mt-2 text-sm text-muted">{note}</p>
    </div>
  );
}

function Teaser({
  kicker,
  title,
  body,
  onClick,
}: {
  kicker: string;
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="border border-line bg-paper p-4 text-left hover:bg-cream">
      <p className="text-xs uppercase tracking-widest text-signal">{kicker}</p>
      <p className="mt-1 font-serif text-2xl">{title}</p>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </button>
  );
}
