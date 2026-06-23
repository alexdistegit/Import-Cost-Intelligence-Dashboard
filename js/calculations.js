/* ═══════════════════════════════════════════════════════════════
   Calculation Engine — Import Cost Intelligence Dashboard
   All import cost formulas, including ICMS "por dentro".
   Pure functions: input → computed results.
   ═══════════════════════════════════════════════════════════════ */

const CalcEngine = (() => {
  'use strict';

  /**
   * Computes all derived values from a given state object.
   * @param {Object} s — Current application state
   * @returns {Object} — All calculated values
   */
  function compute(s) {
    const qty   = Math.max(s.quantidade || 0, 0);
    const cambio = Math.max(s.taxaCambio || 0, 0);
    const ctrs   = Math.max(s.containers || 0, 0);

    // ═══ 1. CUSTOS INTERNACIONAIS ═══
    const fobTotal   = (s.fobUnitario || 0) * qty;
    const freteTotal = (s.freteUnitario || 0) * qty;
    const seguro     = s.seguro || 0;

    const cifUSD = fobTotal + freteTotal + seguro;
    const cifBRL = cifUSD * cambio;

    // ═══ 2. TRIBUTOS ═══
    const rateII     = (s.aliquotaII || 0) / 100;
    const rateIPI    = (s.aliquotaIPI || 0) / 100;
    const ratePIS    = (s.aliquotaPIS || 0) / 100;
    const rateCOFINS = (s.aliquotaCOFINS || 0) / 100;
    const rateICMS   = (s.aliquotaICMS || 0) / 100;

    const ii     = cifBRL * rateII;
    const ipi    = (cifBRL + ii) * rateIPI;
    const pis    = cifBRL * ratePIS;
    const cofins = cifBRL * rateCOFINS;

    // Taxas fixas
    const afrmm       = (s.modal === 'Marítimo' || s.modal === 'Maritimo') ? (freteTotal * cambio * 0.08) : 0;
    const siscomex    = s.siscomex || 0;
    const despachante = s.despachante || 0;

    // ═══ 3. ICMS "POR DENTRO" ═══
    // Base de cálculo do ICMS inclui o próprio ICMS (cálculo por dentro)
    // Base = (CIF_BRL + II + IPI + PIS + COFINS + AFRMM + SISCOMEX + Despachante) / (1 - aliq_ICMS)
    // ICMS = Base × alíquota
    const somaTributosSemICMS = ii + ipi + pis + cofins + afrmm + siscomex + despachante;
    const valorParaBaseICMS   = cifBRL + somaTributosSemICMS;

    let baseICMS = 0;
    let icms = 0;

    if (rateICMS > 0 && rateICMS < 1) {
      baseICMS = valorParaBaseICMS / (1 - rateICMS);
      icms = baseICMS * rateICMS;
    }

    // ═══ 4. TOTAL DE TRIBUTOS E TAXAS ═══
    const totalTributos = ii + ipi + pis + cofins + icms + afrmm + siscomex + despachante;

    // ═══ 5. CUSTOS OPERACIONAIS ═══
    const armazenagem  = s.armazenagem || 0;
    const adValorem    = s.adValorem || 0;
    const blFee        = s.blFee || 0;
    const outrosCustos = s.outrosCustos || 0;

    // Custos multiplicados por containers
    const vistoriaTotal   = (s.vistoria || 0) * ctrs;
    const remocaoTotal    = (s.remocao || 0) * ctrs;
    const handlingTotal   = (s.handling || 0) * ctrs;
    const thcTotal        = (s.thc || 0) * ctrs;
    const transporteTotal = (s.transporte || 0) * ctrs;
    const desovaTotal     = (s.desova || 0) * ctrs;

    const totalOperacional = armazenagem + adValorem + vistoriaTotal + remocaoTotal
      + handlingTotal + blFee + thcTotal + transporteTotal + desovaTotal + outrosCustos;

    // ═══ 6. RESUMO ═══
    const totalMercadoria = cifBRL;
    const totalGeral      = totalMercadoria + totalTributos + totalOperacional;
    const custoTonelada   = qty > 0 ? totalGeral / qty : 0;

    // Percentuais de participação
    const pctMercadoria  = totalGeral > 0 ? (totalMercadoria / totalGeral) * 100 : 0;
    const pctTributos    = totalGeral > 0 ? (totalTributos / totalGeral) * 100 : 0;
    const pctOperacional = totalGeral > 0 ? (totalOperacional / totalGeral) * 100 : 0;

    // ═══ 7. TOP INDIVIDUAL COSTS (for bar chart) ═══
    const individualCosts = [
      { label: 'ICMS',         value: icms },
      { label: 'Imp. Importação (II)', value: ii },
      { label: 'COFINS',       value: cofins },
      { label: 'IPI',          value: ipi },
      { label: 'PIS',          value: pis },
      { label: 'AFRMM',        value: afrmm },
      { label: 'Transporte',   value: transporteTotal },
      { label: 'THC Terminal', value: thcTotal },
      { label: 'Desova',       value: desovaTotal },
      { label: 'Handling',     value: handlingTotal },
      { label: 'Armazenagem',  value: armazenagem },
      { label: 'Despachante',  value: despachante },
      { label: 'Vistoria',     value: vistoriaTotal },
      { label: 'Ad Valorem',   value: adValorem },
      { label: 'Remoção',      value: remocaoTotal },
      { label: 'BL Fee',       value: blFee },
      { label: 'SISCOMEX',     value: siscomex },
      { label: 'Outros Custos',value: outrosCustos },
    ].filter(c => c.value > 0)
     .sort((a, b) => b.value - a.value)
     .slice(0, 10);

    return {
      // Internacionais
      fobTotal,
      freteTotal,
      cifUSD,
      cifBRL,

      // Tributos
      ii, ipi, pis, cofins,
      baseICMS, icms,
      afrmm, siscomex, despachante,
      totalTributos,

      // Operacionais (totais)
      vistoriaTotal, remocaoTotal, handlingTotal,
      thcTotal, transporteTotal, desovaTotal,
      totalOperacional,

      // Resumo
      totalMercadoria,
      totalGeral,
      custoTonelada,
      pctMercadoria,
      pctTributos,
      pctOperacional,

      // Chart data
      individualCosts,
      compositionData: [
        { label: 'Mercadoria (CIF R$)', value: totalMercadoria },
        { label: 'Tributos e Taxas',     value: totalTributos },
        { label: 'Custos Operacionais',  value: totalOperacional },
      ],
    };
  }

  return { compute };
})();
