/* ═══════════════════════════════════════════════════════════════
   Chart Manager — Import Cost Intelligence Dashboard
   Chart.js doughnut & bar charts with Distefano palette.
   ═══════════════════════════════════════════════════════════════ */

const ChartManager = (() => {
  'use strict';

  let doughnutChart = null;
  let barChart = null;

  /* ── Colors ── */
  const PALETTE = {
    composition: ['#c9a84c', '#d4564e', '#4a90d9'],
    bar: [
      '#c9a84c', '#d4b96a', '#e0cb8a',
      '#d4564e', '#e07872', '#ea9a95',
      '#4a90d9', '#6ba3e0', '#8db8e8',
      '#3a9e6e',
    ],
  };

  /** Detect current theme for chart text colors */
  function getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      text: isDark ? '#9ba3b8' : '#5a6274',
      textStrong: isDark ? '#e8eaf0' : '#111827',
      grid: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
      bg: isDark ? '#111830' : '#ffffff',
    };
  }

  /** Custom Chart.js defaults */
  function applyDefaults() {
    if (!window.Chart) return;
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.weight = 500;
    Chart.defaults.animation.duration = 600;
    Chart.defaults.animation.easing = 'easeOutQuart';
  }

  /* ═══ DOUGHNUT CHART: Cost Composition ═══ */
  function createDoughnut(canvasId, data) {
    applyDefaults();
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const theme = getThemeColors();

    if (doughnutChart) doughnutChart.destroy();

    doughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: PALETTE.composition,
          borderColor: theme.bg,
          borderWidth: 3,
          hoverBorderWidth: 0,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: theme.text,
              font: { size: 12, weight: 600 },
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 10,
            },
          },
          tooltip: {
            backgroundColor: theme.bg,
            titleColor: theme.textStrong,
            bodyColor: theme.text,
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            titleFont: { weight: 700 },
            callbacks: {
              label: function(ctx) {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0.0';
                return ` ${ctx.label}: R$ ${Renderer.formatBRL(ctx.parsed)} (${pct}%)`;
              },
            },
          },
        },
      },
    });
  }

  /* ═══ BAR CHART: Top Individual Costs ═══ */
  function createBar(canvasId, data) {
    applyDefaults();
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    const theme = getThemeColors();

    if (barChart) barChart.destroy();

    barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: data.map((_, i) => PALETTE.bar[i % PALETTE.bar.length]),
          borderRadius: 4,
          borderSkipped: false,
          barPercentage: 0.7,
          categoryPercentage: 0.85,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: theme.bg,
            titleColor: theme.textStrong,
            bodyColor: theme.text,
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function(ctx) {
                return ` R$ ${Renderer.formatBRL(ctx.parsed.x)}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: theme.grid, drawBorder: false },
            ticks: {
              color: theme.text,
              font: { size: 11 },
              callback: function(v) {
                if (v >= 1_000_000) return 'R$ ' + (v / 1_000_000).toFixed(1) + 'M';
                if (v >= 1_000) return 'R$ ' + (v / 1_000).toFixed(0) + 'k';
                return 'R$ ' + v;
              },
            },
          },
          y: {
            grid: { display: false },
            ticks: {
              color: theme.text,
              font: { size: 11, weight: 600 },
              mirror: false,
            },
          },
        },
      },
    });
  }

  /* ═══ UPDATE BOTH CHARTS ═══ */
  function update(calc) {
    createDoughnut('chart-doughnut', calc.compositionData);
    createBar('chart-bar', calc.individualCosts);
  }

  /* ═══ REFRESH THEME COLORS (after toggle) ═══ */
  function refreshTheme() {
    // Re-render charts to pick up new theme colors
    if (doughnutChart || barChart) {
      const state = AppState.get();
      const calc = CalcEngine.compute(state);
      update(calc);
    }
  }

  return { update, refreshTheme };
})();
