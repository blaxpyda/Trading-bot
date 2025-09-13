import { createIcon } from '../utils/icons.js';
import { formatCurrency, formatPercentage, createElement } from '../utils/helpers.js';
import { apiService } from '../services/api.js';

export class MetricsGrid {
  constructor() {
    this.metrics = null;
    this.container = null;
  }

  async render(container) {
    this.container = container;
    await this.loadData();
    this.renderGrid();
    
    // Auto-refresh every 5 seconds
    setInterval(() => this.refreshData(), 5000);
  }

  async loadData() {
    try {
      this.metrics = await apiService.getMetrics();
    } catch (error) {
      console.error('Error loading metrics:', error);
      this.metrics = apiService.getMockMetrics();
    }
  }

  async refreshData() {
    await this.loadData();
    this.renderGrid();
  }

  renderGrid() {
    if (!this.container || !this.metrics) return;

    const metricsConfig = [
      {
        title: 'Total Profit',
        value: formatCurrency(this.metrics.totalProfit),
        change: '+12.3%',
        changeType: 'positive',
        icon: 'dollarSign',
        iconColor: 'text-green-400'
      },
      {
        title: "Today's P&L",
        value: formatCurrency(this.metrics.todayProfit),
        change: '+8.7%',
        changeType: 'positive',
        icon: 'trendingUp',
        iconColor: 'text-blue-400'
      },
      {
        title: 'Win Rate',
        value: `${this.metrics.winRate.toFixed(1)}%`,
        change: '+2.1%',
        changeType: 'positive',
        icon: 'target',
        iconColor: 'text-purple-400'
      },
      {
        title: 'Active Positions',
        value: this.metrics.activePositions.toString(),
        change: '±0',
        changeType: 'neutral',
        icon: 'activity',
        iconColor: 'text-yellow-400'
      },
      {
        title: 'Successful Trades',
        value: this.metrics.successfulTrades.toString(),
        change: '+5',
        changeType: 'positive',
        icon: 'trendingUp',
        iconColor: 'text-green-400'
      },
      {
        title: 'Risk Level',
        value: `${this.metrics.riskLevel.toFixed(1)}/5`,
        change: 'Low',
        changeType: 'positive',
        icon: 'alertTriangle',
        iconColor: 'text-orange-400'
      }
    ];

    this.container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${metricsConfig.map(metric => this.createMetricCard(metric)).join('')}
      </div>
    `;

    // Add icons after rendering
    metricsConfig.forEach((metric, index) => {
      const iconContainer = this.container.querySelector(`#metric-icon-${index}`);
      if (iconContainer) {
        const icon = createIcon(metric.icon, `h-6 w-6 ${metric.iconColor}`);
        iconContainer.appendChild(icon);
      }
    });
  }

  createMetricCard(metric) {
    const changeColor = metric.changeType === 'positive' ? 'text-green-400' : 
                       metric.changeType === 'negative' ? 'text-red-400' : 'text-gray-400';
    
    const trendIcon = metric.changeType === 'positive' ? 'trendingUp' : 
                     metric.changeType === 'negative' ? 'trendingDown' : '';

    return `
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div id="metric-icon-${metricsConfig.indexOf(metric)}"></div>
            <div>
              <p class="text-sm font-medium text-gray-400">${metric.title}</p>
              <p class="text-2xl font-bold text-white">${metric.value}</p>
            </div>
          </div>
          <div class="flex items-center space-x-1 ${changeColor}">
            ${trendIcon ? `<div class="trend-icon-${metricsConfig.indexOf(metric)}"></div>` : ''}
            <span class="text-sm font-medium">${metric.change}</span>
          </div>
        </div>
      </div>
    `;
  }
}

// Need to access metricsConfig in createMetricCard, so we'll store it
let metricsConfig = [];