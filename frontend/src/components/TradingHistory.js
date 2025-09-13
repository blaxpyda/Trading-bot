import { createIcon } from '../utils/icons.js';
import { formatCurrency, formatTime, getStatusColor } from '../utils/helpers.js';
import { apiService } from '../services/api.js';

export class TradingHistory {
  constructor() {
    this.trades = [];
    this.filter = 'all';
    this.container = null;
  }

  async render(container) {
    this.container = container;
    await this.loadData();
    this.renderHistory();
  }

  async loadData() {
    try {
      this.trades = await apiService.getTradingHistory();
    } catch (error) {
      console.error('Error loading trading history:', error);
      this.trades = apiService.getMockTradingHistory();
    }
  }

  renderHistory() {
    if (!this.container) return;

    const filteredTrades = this.trades.filter(trade => 
      this.filter === 'all' || trade.status === this.filter
    );

    this.container.innerHTML = `
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white flex items-center space-x-2">
            <div id="clock-icon"></div>
            <span>Trading History</span>
          </h3>
          
          <div class="flex items-center space-x-3">
            <div id="filter-icon"></div>
            <select id="filter-select" class="bg-gray-700 text-white text-sm rounded px-3 py-1 border border-gray-600">
              <option value="all">All Trades</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-700">
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Asset</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">P&L</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTrades.length > 0 ? 
                filteredTrades.map(trade => this.createTradeRow(trade)).join('') :
                '<tr><td colspan="7" class="text-center py-8 text-gray-400">No trades found for the selected filter.</td></tr>'
              }
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Add icons
    this.container.querySelector('#clock-icon').appendChild(createIcon('clock', 'h-5 w-5'));
    this.container.querySelector('#filter-icon').appendChild(createIcon('filter', 'h-4 w-4 text-gray-400'));

    // Set filter value
    const filterSelect = this.container.querySelector('#filter-select');
    filterSelect.value = this.filter;

    // Add event listeners
    filterSelect.addEventListener('change', (e) => {
      this.filter = e.target.value;
      this.renderHistory();
    });

    // Add trend icons to trade rows
    filteredTrades.forEach((trade, index) => {
      const trendIconContainer = this.container.querySelector(`#trend-icon-${index}`);
      if (trendIconContainer) {
        const iconName = trade.type === 'BUY' ? 'trendingUp' : 'trendingDown';
        const iconColor = trade.type === 'BUY' ? 'h-3 w-3' : 'h-3 w-3';
        trendIconContainer.appendChild(createIcon(iconName, iconColor));
      }
    });
  }

  createTradeRow(trade) {
    const index = this.trades.indexOf(trade);
    const typeColor = trade.type === 'BUY' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10';
    
    return `
      <tr class="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
        <td class="px-4 py-3">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <span class="text-xs font-bold text-white">${trade.symbol.slice(0, 2)}</span>
            </div>
            <span class="font-medium text-white">${trade.symbol}</span>
          </div>
        </td>
        
        <td class="px-4 py-3">
          <span class="inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${typeColor}">
            <div id="trend-icon-${index}"></div>
            <span>${trade.type}</span>
          </span>
        </td>
        
        <td class="px-4 py-3 text-white">${trade.quantity}</td>
        
        <td class="px-4 py-3 text-white">${formatCurrency(trade.price)}</td>
        
        <td class="px-4 py-3 text-gray-400 text-sm">
          ${formatTime(new Date(trade.timestamp))}
        </td>
        
        <td class="px-4 py-3">
          ${trade.profit !== undefined ? 
            `<span class="${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}">
              ${formatCurrency(Math.abs(trade.profit))}
            </span>` : 
            ''
          }
        </td>
        
        <td class="px-4 py-3">
          <span class="inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(trade.status)}">
            ${trade.status}
          </span>
        </td>
      </tr>
    `;
  }
}