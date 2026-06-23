/* ═══════════════════════════════════════════════════════════════
   Main Controller — Import Cost Intelligence Dashboard
   Event wiring, theme toggle, CSV export, initialization.
   ═══════════════════════════════════════════════════════════════ */

const App = (() => {
  'use strict';

  /* ═══ THEME ═══ */
  function initTheme() {
    const saved = localStorage.getItem('dashboard-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('dashboard-theme', next);
    ChartManager.refreshTheme();
  }

  /* ═══ RECALCULATE ON INPUT ═══ */
  function handleInputChange(e) {
    const input = e.target;
    const fieldMap = AppState.getFieldMap();
    const config = fieldMap[input.id];
    if (!config) return;

    let value;
    if (config.type === 'number') {
      value = parseFloat(input.value) || 0;
    } else {
      value = input.value;
    }

    AppState.set(config.key, value);
    recalculate();
  }

  function recalculate() {
    const state = AppState.get();
    const calc = Renderer.render(state);
    ChartManager.update(calc);
  }

  /* ═══ RESTORE DEFAULTS ═══ */
  function restoreDefaults() {
    AppState.reset();
    Renderer.populateInputs(AppState.get());
    recalculate();
    showToast('✓ Cenário exemplo restaurado');
  }

  /* ═══ CSV EXPORT ═══ */
  function exportCSV() {
    const s = AppState.get();
    const c = CalcEngine.compute(s);

    const rows = [
      ['IMPORT COST INTELLIGENCE DASHBOARD — EXPORT'],
      ['Data de geração', new Date().toLocaleString('pt-BR')],
      [''],
      ['═══ DADOS DA OPERAÇÃO ═══'],
      ['Importador', s.importador],
      ['Produto', s.produto],
      ['NCM', s.ncm],
      ['Quantidade', s.quantidade, s.unidade],
      ['Porto/Local', s.porto],
      ['Modal', s.modal],
      ['Incoterm', s.incoterm],
      ['Taxa de Câmbio', s.taxaCambio],
      [''],
      ['═══ CUSTOS INTERNACIONAIS ═══'],
      ['FOB Unitário (USD)', s.fobUnitario],
      ['Frete Unitário (USD)', s.freteUnitario],
      ['Seguro (USD)', s.seguro],
      ['CIF Total (USD)', c.cifUSD.toFixed(2)],
      ['CIF Total (R$)', c.cifBRL.toFixed(2)],
      [''],
      ['═══ TRIBUTOS E TAXAS ═══'],
      ['Imposto de Importação (II)', c.ii.toFixed(2), s.aliquotaII + '%'],
      ['IPI', c.ipi.toFixed(2), s.aliquotaIPI + '%'],
      ['PIS-Importação', c.pis.toFixed(2), s.aliquotaPIS + '%'],
      ['COFINS-Importação', c.cofins.toFixed(2), s.aliquotaCOFINS + '%'],
      ['Base ICMS (por dentro)', c.baseICMS.toFixed(2)],
      ['ICMS', c.icms.toFixed(2), s.aliquotaICMS + '%'],
      ['AFRMM', c.afrmm.toFixed(2)],
      ['SISCOMEX', c.siscomex.toFixed(2)],
      ['Despachante', c.despachante.toFixed(2)],
      ['TOTAL TRIBUTOS E TAXAS', c.totalTributos.toFixed(2)],
      [''],
      ['═══ CUSTOS OPERACIONAIS ═══'],
      ['Containers', s.containers],
      ['Armazenagem', s.armazenagem.toFixed(2)],
      ['Ad Valorem', s.adValorem.toFixed(2)],
      ['Posicionamento Vistoria (×' + s.containers + ')', c.vistoriaTotal.toFixed(2)],
      ['Remoção Costado (×' + s.containers + ')', c.remocaoTotal.toFixed(2)],
      ['Handling In/Out (×' + s.containers + ')', c.handlingTotal.toFixed(2)],
      ['BL Fee', s.blFee.toFixed(2)],
      ['THC Terminal (×' + s.containers + ')', c.thcTotal.toFixed(2)],
      ['Transporte (×' + s.containers + ')', c.transporteTotal.toFixed(2)],
      ['Desova (×' + s.containers + ')', c.desovaTotal.toFixed(2)],
      ['Outros Custos', s.outrosCustos.toFixed(2)],
      ['TOTAL OPERACIONAL', c.totalOperacional.toFixed(2)],
      [''],
      ['═══ RESUMO DA OPERAÇÃO ═══'],
      ['Custo da Mercadoria (CIF R$)', c.totalMercadoria.toFixed(2), c.pctMercadoria.toFixed(1) + '%'],
      ['Total Tributos e Taxas', c.totalTributos.toFixed(2), c.pctTributos.toFixed(1) + '%'],
      ['Total Custos Operacionais', c.totalOperacional.toFixed(2), c.pctOperacional.toFixed(1) + '%'],
      ['TOTAL GERAL DA OPERAÇÃO', c.totalGeral.toFixed(2)],
      ['Custo Landed por Tonelada', c.custoTonelada.toFixed(2)],
    ];

    const bom = '\uFEFF';
    const csv = bom + rows.map(r => r.map(cell => {
      const str = String(cell ?? '');
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? '"' + str.replace(/"/g, '""') + '"'
        : str;
    }).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `landed-cost-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('✓ CSV exportado com sucesso');
  }

  /* ═══ TOAST NOTIFICATION ═══ */
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2500);
  }

  /* ═══ BIND EVENTS ═══ */
  function bindEvents() {
    // Theme toggle
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Action buttons
    const restoreBtn = document.getElementById('btn-restore');
    if (restoreBtn) restoreBtn.addEventListener('click', restoreDefaults);

    const exportBtn = document.getElementById('btn-export');
    if (exportBtn) exportBtn.addEventListener('click', exportCSV);

    // All form inputs — delegate from a parent
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
      input.addEventListener('input', handleInputChange);
      input.addEventListener('change', handleInputChange);
    });
  }

  /* ═══ INIT ═══ */
  function init() {
    initTheme();
    Renderer.populateInputs(AppState.get());
    bindEvents();
    recalculate();
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { toggleTheme, restoreDefaults, exportCSV };
})();
