/* ═══════════════════════════════════════════════════════════════
   UI Renderer — Import Cost Intelligence Dashboard
   DOM updates, number formatting, KPI rendering, form binding.
   ═══════════════════════════════════════════════════════════════ */

const Renderer = (() => {
  'use strict';

  /* ── Number formatting ── */
  const fmtBRL = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const fmtUSD = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const fmtPct = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const fmtInt = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  function formatBRL(v) { return fmtBRL.format(v || 0); }
  function formatUSD(v) { return fmtUSD.format(v || 0); }
  function formatPct(v) { return fmtPct.format(v || 0); }

  /** Safe DOM element getter */
  function $(id) {
    return document.getElementById(id);
  }

  /** Set text content with optional flash animation */
  function setText(id, text, flash = false) {
    const el = $(id);
    if (!el) return;
    if (el.textContent !== text) {
      el.textContent = text;
      if (flash) {
        el.classList.remove('value-flash');
        void el.offsetWidth; // force reflow
        el.classList.add('value-flash');
      }
    }
  }

  /** Set input value (for restore) */
  function setInput(id, value) {
    const el = $(id);
    if (!el) return;
    el.value = value;
  }

  /* ═══ POPULATE FORM INPUTS FROM STATE ═══ */
  function populateInputs(state) {
    const fieldMap = AppState.getFieldMap();
    for (const [inputId, config] of Object.entries(fieldMap)) {
      const el = $(inputId);
      if (!el) continue;
      const val = state[config.key];
      if (config.type === 'number') {
        el.value = val;
      } else {
        el.value = val || '';
      }
    }
  }

  /* ═══ UPDATE KPI CARDS ═══ */
  function updateKPIs(calc) {
    setText('kpi-val-cif-usd', formatUSD(calc.cifUSD), true);
    setText('kpi-val-cif-brl', formatBRL(calc.cifBRL), true);
    setText('kpi-val-taxes', formatBRL(calc.totalTributos), true);
    setText('kpi-val-operational', formatBRL(calc.totalOperacional), true);
    setText('kpi-val-total', formatBRL(calc.totalGeral), true);
    setText('kpi-val-per-ton', formatBRL(calc.custoTonelada), true);
  }

  /* ═══ UPDATE CALCULATED FIELDS ═══ */
  function updateCalculatedFields(calc) {
    // Custos Internacionais
    setText('calc-cif-usd', formatUSD(calc.cifUSD));
    setText('calc-cif-brl', formatBRL(calc.cifBRL));

    // Tributos
    setText('calc-ii', formatBRL(calc.ii));
    setText('calc-ipi', formatBRL(calc.ipi));
    setText('calc-pis', formatBRL(calc.pis));
    setText('calc-cofins', formatBRL(calc.cofins));
    setText('calc-icms', formatBRL(calc.icms));
    setText('calc-base-icms', formatBRL(calc.baseICMS));
    setText('calc-total-taxes', formatBRL(calc.totalTributos));

    // Atualiza o campo AFRMM com o valor calculado
    const afrmmInput = $('inp-afrmm');
    if (afrmmInput) {
      afrmmInput.value = calc.afrmm.toFixed(2);
    }

    // Operacionais
    setText('calc-total-operational', formatBRL(calc.totalOperacional));

    // Resumo
    setText('sum-mercadoria', formatBRL(calc.totalMercadoria));
    setText('sum-tributos', formatBRL(calc.totalTributos));
    setText('sum-operacional', formatBRL(calc.totalOperacional));
    setText('sum-total', formatBRL(calc.totalGeral));
    setText('sum-per-ton', formatBRL(calc.custoTonelada));

    setText('sum-pct-mercadoria', formatPct(calc.pctMercadoria) + '%');
    setText('sum-pct-tributos', formatPct(calc.pctTributos) + '%');
    setText('sum-pct-operacional', formatPct(calc.pctOperacional) + '%');
  }

  /* ═══ FULL RENDER CYCLE ═══ */
  function render(state) {
    const calc = CalcEngine.compute(state);
    updateKPIs(calc);
    updateCalculatedFields(calc);
    return calc;
  }

  return {
    populateInputs,
    render,
    formatBRL,
    formatUSD,
    formatPct,
    $,
  };
})();
