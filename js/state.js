/* ═══════════════════════════════════════════════════════════════
   State Management — Import Cost Intelligence Dashboard
   Holds all application state and default scenario data.
   ═══════════════════════════════════════════════════════════════ */

const AppState = (() => {
  'use strict';

  /* ── Default scenario: realistic Brazilian import operation ── */
  const DEFAULT_SCENARIO = Object.freeze({
    // ── Dados da Operação ──
    importador: 'Indústria Modelo Ltda',
    produto: 'Polietileno de Alta Densidade (PEAD)',
    ncm: '3901.20.29',
    quantidade: 500,
    unidade: 'tons',
    porto: 'Santos/SP',
    modal: 'Marítimo',
    incoterm: 'FOB',
    taxaCambio: 5.75,

    // ── Custos Internacionais ──
    fobUnitario: 1200.00,
    freteUnitario: 85.00,
    seguro: 3500.00,

    // ── Alíquotas de Tributos (%) ──
    aliquotaII: 14.00,
    aliquotaIPI: 5.00,
    aliquotaPIS: 2.10,
    aliquotaCOFINS: 9.65,
    aliquotaICMS: 18.00,

    // ── Taxas fixas (R$) ──
    afrmm: 14_072.50,
    siscomex: 214.50,
    despachante: 3_500.00,

    // ── Custos Operacionais ──
    containers: 20,
    armazenagem: 4_500.00,
    adValorem: 2_800.00,
    vistoria: 350.00,
    remocao: 280.00,
    handling: 450.00,
    blFee: 650.00,
    thc: 1_200.00,
    transporte: 2_800.00,
    desova: 850.00,
    outrosCustos: 1_500.00,
  });

  /* ── Tooltip descriptions for tax fields ── */
  const TOOLTIPS = Object.freeze({
    cif: 'Cost, Insurance & Freight — Valor total da mercadoria incluindo frete e seguro no porto de destino.',
    ii: 'Imposto de Importação — Tributo federal incidente sobre o valor CIF em R$. Alíquota definida pela TEC (Tarifa Externa Comum).',
    ipi: 'Imposto sobre Produtos Industrializados — Incide sobre o valor CIF + II. Alíquota varia conforme classificação NCM.',
    pis: 'PIS-Importação — Contribuição social incidente sobre o valor aduaneiro (CIF em R$).',
    cofins: 'COFINS-Importação — Contribuição social incidente sobre o valor aduaneiro (CIF em R$).',
    icms: 'ICMS — Imposto estadual calculado "por dentro", ou seja, sobre uma base que já inclui o próprio ICMS (base = valor / (1 − alíquota)).',
    afrmm: 'Adicional ao Frete para Renovação da Marinha Mercante — Taxa de 8% sobre o frete marítimo internacional.',
    siscomex: 'Taxa de Utilização do SISCOMEX — Valor fixo cobrado por declaração de importação (DI).',
    despachante: 'Honorários do Despachante Aduaneiro — Valor do serviço de desembaraço aduaneiro.',
    ncm: 'Nomenclatura Comum do Mercosul — Código de 8 dígitos que classifica o produto e determina alíquotas.',
    incoterm: 'Termo internacional de comércio (ICC) que define responsabilidades entre comprador e vendedor.',
  });

  /* ── Field metadata: maps field IDs to state keys and types ── */
  const FIELD_MAP = Object.freeze({
    // Dados da Operação
    'inp-importador':  { key: 'importador',    type: 'text' },
    'inp-produto':     { key: 'produto',       type: 'text' },
    'inp-ncm':         { key: 'ncm',           type: 'text' },
    'inp-quantidade':  { key: 'quantidade',    type: 'number' },
    'inp-unidade':     { key: 'unidade',       type: 'text' },
    'inp-porto':       { key: 'porto',         type: 'text' },
    'inp-modal':       { key: 'modal',         type: 'select' },
    'inp-incoterm':    { key: 'incoterm',      type: 'select' },
    'inp-cambio':      { key: 'taxaCambio',    type: 'number' },

    // Custos Internacionais
    'inp-fob':         { key: 'fobUnitario',   type: 'number' },
    'inp-frete':       { key: 'freteUnitario', type: 'number' },
    'inp-seguro':      { key: 'seguro',        type: 'number' },

    // Alíquotas
    'inp-ii-rate':     { key: 'aliquotaII',    type: 'number' },
    'inp-ipi-rate':    { key: 'aliquotaIPI',   type: 'number' },
    'inp-pis-rate':    { key: 'aliquotaPIS',   type: 'number' },
    'inp-cofins-rate': { key: 'aliquotaCOFINS',type: 'number' },
    'inp-icms-rate':   { key: 'aliquotaICMS',  type: 'number' },

    // Taxas fixas
    'inp-afrmm':       { key: 'afrmm',         type: 'number' },
    'inp-siscomex':    { key: 'siscomex',       type: 'number' },
    'inp-despachante': { key: 'despachante',    type: 'number' },

    // Custos Operacionais
    'inp-containers':  { key: 'containers',    type: 'number' },
    'inp-armazenagem': { key: 'armazenagem',   type: 'number' },
    'inp-advalorem':   { key: 'adValorem',     type: 'number' },
    'inp-vistoria':    { key: 'vistoria',      type: 'number' },
    'inp-remocao':     { key: 'remocao',       type: 'number' },
    'inp-handling':    { key: 'handling',       type: 'number' },
    'inp-blfee':       { key: 'blFee',         type: 'number' },
    'inp-thc':         { key: 'thc',           type: 'number' },
    'inp-transporte':  { key: 'transporte',    type: 'number' },
    'inp-desova':      { key: 'desova',        type: 'number' },
    'inp-outros':      { key: 'outrosCustos',  type: 'number' },
  });

  /* ── Live state (persisted copy of defaults) ── */
  const STORAGE_KEY = 'import-dashboard-state';
  let _state = { ...DEFAULT_SCENARIO };

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      _state = { ...DEFAULT_SCENARIO, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Erro ao carregar do localStorage:', e);
  }

  /* ── Public API ── */
  return {
    /** Returns a shallow copy of current state */
    get() {
      return { ..._state };
    },

    /** Updates a single field in state and persists it */
    set(key, value) {
      if (key in _state) {
        _state[key] = value;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(_state));
        } catch (e) {
          console.error('Erro ao salvar no localStorage:', e);
        }
      }
    },

    /** Resets state to defaults and clears storage */
    reset() {
      _state = { ...DEFAULT_SCENARIO };
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error('Erro ao limpar localStorage:', e);
      }
    },

    /** Returns the default scenario (frozen) */
    getDefaults() {
      return DEFAULT_SCENARIO;
    },

    /** Returns the field mapping config */
    getFieldMap() {
      return FIELD_MAP;
    },

    /** Returns tooltip text for a given key */
    getTooltip(key) {
      return TOOLTIPS[key] || '';
    },

    /** Returns all tooltips */
    getTooltips() {
      return TOOLTIPS;
    },
  };
})();
