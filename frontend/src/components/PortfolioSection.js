import { createIcon } from '../utils/icons.js';
import { formatCurrency, formatPercentage } from '../utils/helpers.js';
import { apiService } from '../services/api.js';

export class PortfolioSection {
  constructor() {
    this.portfolioData = null;
    this.container = null;
  }

  async render(container) {
    this.container = container;
    await this.loadData();
    this.renderPortfolio();
  }

  async loadData() {
    try {
      this.portfolioData = await apiService.getPortfolio();
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      this.portfolioData = apiService.getMockPortfolio();
    }
  }

  async refreshData() {
    await this.loadData();
    this.renderPortfolio();
  }

  renderPortfolio() {
    if (!this.container || !this.portfolioData) return;

    this.container.innerHTML = `
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white">Portfolio</h3>
          <div id="pie-chart-icon"></div>
        </div>

        <div class="mb-6">
          <div class="text-center">
            <p class="text-2xl font-bold text-white">
              ${formatCurrency(this.portfolioData.totalValue)}
            </p>
            <p class="text-sm text-gray-400">Total Portfolio Value</p>
          </div>
        </div>

        <div class="space-y-1">
          <h4 class="text-sm font-medium text-gray-400 mb-3">Current Positions</h4>
          <div class="max-h-64 overflow-y-auto space-y-1">
            ${this.portfolioData.positions.map((position, index) => this.createPositionItem(position, index)).join('')}
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-700">
          <div class="grid grid-cols-2 gap-4 text-center">
            <div>
              <p class="text-lg font-semibold text-green-400">+${formatCurrency(this.portfolioData.todayChange).replace('$', '')}</p>
              <p class="text-xs text-gray-400">Today's Gain</p>
            </div>
            <div>
              <p class="text-lg font-semibold text-green-400">+${this.portfolioData.totalReturn.toFixed(1)}%</p>
              <p class="text-xs text-gray-400">Total Return</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add pie chart icon
    this.container.querySelector('#pie-chart-icon').appendChild(createIcon('pieChart', 'h-5 w-5 text-gray-400'));

    // Add trend icons to position items
    this.portfolioData.positions.forEach((position, index) => {
      const trendIconContainer = this.container.querySelector(`#position-trend-${index}`);
      if (trendIconContainer) {
        const isPositive = position.change >= 0;
        const iconName = isPositive ? 'arrowUpRight' : 'arrowDownRight';
        trendIconContainer.appendChild(createIcon(iconName, 'h-3 w-3'));
      }
    });
  }

  createPositionItem(position, index) {
    const isPositive = position.change >= 0;
    const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
    
    return `
      <div class="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg transition-colors">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <span class="text-xs font-bold text-white">${position.symbol.slice(0, 2)}</span>
          </div>
          <div>
            <p class="text-white font-medium">${position.symbol}</p>
            <p class="text-xs text-gray-400">${position.quantity} shares</p>
          </div>
        </div>
        
        <div class="text-right">
          <p class="text-white font-medium">${formatCurrency(position.currentPrice)}</p>
          <div class="flex items-center space-x-1 ${changeColor}">
            <div id="position-trend-${index}"></div>
            <span class="text-xs">${formatPercentage(position.changePercent).replace('+', '')}</span>
          </div>
        </div>
      </div>
    `;
  }
}