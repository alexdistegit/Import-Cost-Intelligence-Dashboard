# 🚢 Import Landed Cost Intelligence Dashboard — Distefano Consultoria

[![Licença](https://img.shields.io/badge/license-MIT-gold.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-CSS3-blue.svg)](index.html)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](js/app.js)
[![Chart.js](https://img.shields.io/badge/Charts-Chart.js_v4-purple.svg)](https://www.chartjs.org/)

> **Executive Web Dashboard for Import Cost Simulation and Brazilian Tax Auditing.**
> Designed for **Distefano Consultoria Internacional**, this tool converts complex supply chain spreadsheets into a premium, interactive web interface.

---

### 🌐 [English Version](#english-readme) | 🇧🇷 [Versão em Português](#versao-em-portugues)

---

<a name="english-readme"></a>

## 🎯 Project Overview

This application simulates the full **Landed Cost** of import shipments arriving in Brazil. It computes all international logistics layers, federal and state taxes (including the complex Brazilian **ICMS "por dentro"** tax-inclusive calculation), and local handling/port terminal operations in real-time.

### 🌟 Key Features
- **Real-Time Recalculation:** Every change in exchange rates, weight, FOB unit price, or tax rates triggers an instant recalculation cascade across all KPIs and charts.
- **Dynamic AFRMM Automation:** Automatically calculates the AFRMM tax (Adicional ao Frete para Renovação da Marinha Mercante) as 8% of the total ocean freight in BRL (only when Maritime modal is selected).
- **Exact ICMS "Por Dentro" (Tax-inclusive) Engine:** Uses standard Brazilian fiscal formulas where the ICMS tax base includes its own value.
- **Data Persistence:** Automatically saves your last input configuration using browser `localStorage`. When you reopen the dashboard, your simulation is preserved. Click **"Restaurar Exemplo"** to reset to the default PEAD scenario.
- **CSV Data Export:** One-click download of the complete itemized cost simulation, formatted as an Excel-ready UTF-8 CSV.
- **Interactive Visualizations (Chart.js):**
  - **Cost Composition:** Doughnut chart separating Merchandise value, Taxes & Duties, and Operational Costs.
  - **Top 10 Individual Costs:** A horizontal bar chart ranking the highest cost components.
- **Aesthetic Premium Design:** High-contrast Dark & Light modes with dynamic transitions, glassmorphism headers, and polished micro-interactions.

---

<a name="versao-em-portugues"></a>

## 🇧🇷 Versão em Português

Esta aplicação simula o custo real nacionalizado (**Landed Cost**) de cargas de importação destinadas ao Brasil. Ela consolida todas as etapas logísticas internacionais, tributos federais e estaduais (incluindo o complexo **cálculo por dentro do ICMS**), taxas aduaneiras e despesas portuárias em tempo real.

### 🌟 Diferenciais do Dashboard
- **Cálculo em Tempo Real:** Qualquer alteração nos campos de câmbio, peso, preço unitário FOB ou alíquotas recalcula instantaneamente os KPIs e gráficos.
- **Automação do AFRMM:** Calcula de forma automatizada a taxa de marinha mercante (8% sobre o frete em reais) apenas quando selecionado o modal Marítimo.
- **Motor Fiscal Preciso (ICMS por dentro):** Implementação fiel da matemática tributária onde o ICMS compõe sua própria base de cálculo.
- **Persistência de Dados:** Salva automaticamente a simulação no navegador via `localStorage`. Se fechar e reabrir a aba, seus dados estarão intactos. Use o botão **"Restaurar Exemplo"** para voltar ao cenário base da planilha.
- **Exportação de Relatório (CSV):** Gera planilha formatada em formato CSV em português com apenas um clique.
- **Gráficos Dinâmicos (Chart.js):**
  - **Composição de Custos:** Visão geral da fatia da mercadoria, impostos e logística.
  - **Top 10 Custos:** Gráfico que destaca visualmente os maiores gargalos financeiros da operação.

---

## 📊 Standard Scenario / Cenário de Exemplo Padrão

The pre-loaded simulation matches a standard high-volume Brazilian chemical import:
- **Product / Produto:** High-Density Polyethylene (PEAD) - NCM 3901.20.29
- **Quantity / Quantidade:** 500 Tons
- **Modal / Logística:** Maritime (20 containers)
- **Exchange Rate / Câmbio:** R$ 5.75 / US$ 1.00
- **Taxes / Alíquotas:** II (14%), IPI (5%), PIS (2.10%), COFINS (9.65%), ICMS (18%)
- **FOB Unit Price / Preço FOB:** USD 1,200.00 / ton

---

## 🛠️ Technology Stack / Tecnologias

- **Core:** Semantic HTML5 & Vanilla ES6 JavaScript (Modulated IIFE pattern).
- **Styling:** CSS3 variables (design tokens), flexbox, grid, animations, and custom theme toggler.
- **Graphs:** Chart.js v4 via CDN.
- **Typography & Icons:** Inter Font & Inline SVG icons.

---

## 📂 Repository Structure / Estrutura de Arquivos

```
Import Cost Intelligence Dashboard/
├── index.html          # Main application UI layout
├── css/
│   └── styles.css      # Design tokens, variables, themes, and layouts
├── js/
│   ├── state.js        # Holds state, default values, and local storage logic
│   ├── calculations.js # Mathematical formulas and fiscal engines
│   ├── renderer.js     # DOM writer, input formatting (BRL/USD/%)
│   ├── charts.js       # Chart.js instances and update scripts
│   └── app.js          # Controller, events setup, and CSV export
├── logo-distefano.png  # Distefano official corporate logo
├── PLANILHA DE CALCULO DE IMPORTAÇÃO.xlsx # Original Excel calculations sheet
├── .gitignore          # Git exclusion rules
└── README.md           # This documentation
```

---

## 🚀 How to Run Locally / Como Executar

No installation or node servers are required. Since this is a pure front-end application:
1. Clone this repository or download files:
   ```bash
   git clone https://github.com/alexdistegit/Import-Cost-Intelligence-Dashboard.git
   ```
2. Double-click `index.html` to open directly in any browser (Chrome, Firefox, Safari, Edge).

---
Developed for **Distefano Consultoria Internacional** by **Antigravity AI**.
🌐 [distefanoconsultoria.com](https://distefanoconsultoria.com/)
