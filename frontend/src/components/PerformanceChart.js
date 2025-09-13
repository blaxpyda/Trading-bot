import { createIcon } from '../utils/icons.js';
import { formatCurrency } from '../utils/helpers.js';
import { apiService } from '../services/api.js';

export class PerformanceChart {
  constructor() {
    this.timeframe = '1D';
    this.chartData = [];
    this.container = null;
  }

  async render(container) {
    this.container = container;
    await this.loadData();
    this.renderChart();
  }

  async loadData() {
    try {
      const performanceData = await apiService.getPerformanceData(this.timeframe);
      this.chartData = performanceData.data;
    } catch (error) {
      console.error('Error loading performance data:', error);
      const mockData = apiService.getMockPerformanceData(this.timeframe);
      this.chartData = mockData.data;
    }
  }

  renderChart() {
    if (!this.container || !this.chartData.length) return;

    const maxValue = Math.max(...this.chartData);
    const minValue = Math.min(...this.chartData);
    const range = maxValue - minValue;

    this.container.innerHTML = `
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white flex items-center space-x-2">
            <div id="chart-icon"></div>
            <span>Performance Chart</span>
          </h3>
          
          <div class="flex items-center space-x-1 bg-gray-700 rounded-lg p-1">
            ${['1D', '7D', '1M', '3M'].map(period => `
              <button class="timeframe-btn px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                this.timeframe === period 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-600'
              }" data-timeframe="${period}">
                ${period}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="relative h-64 mb-4">
          <div class="absolute inset-0 flex items-end space-x-1" id="chart-bars">
            ${this.chartData.map((value, index) => {
              const height = ((value - minValue) / range) * 100;
              return `
                <div class="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all duration-300 hover:from-blue-500 hover:to-blue-300 cursor-pointer"
                     style="height: ${Math.max(height, 2)}%"
                     title="${formatCurrency(value)}">
                </div>
              `;
            }).join('')}
          </div>
          
          <!-- Y-axis labels -->
          <div class="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 -ml-16">
            <span>${formatCurrency(maxValue)}</span>
            <span>${formatCurrency((maxValue + minValue) / 2)}</span>
            <span>${formatCurrency(minValue)}</span>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
          <div class="text-center">
            <p class="text-xl font-bold text-green-400">+${formatCurrency(this.chartData[this.chartData.length - 1] - this.chartData[0]).replace('$', '')}</p>
            <p class="text-xs text-gray-400">Period Change</p>
          </div>
          <div class="text-center">
            <p class="text-xl font-bold text-white">${formatCurrency(maxValue)}</p>
            <p class="text-xs text-gray-400">Peak Value</p>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center space-x-1">
              <div id="trending-up-icon"></div>
              <p class="text-xl font-bold text-green-400">12.4%</p>
            </div>
            <p class="text-xs text-gray-400">Growth Rate</p>
          </div>
        </div>
      </div>
    `;

    // Add icons
    this.container.querySelector('#chart-icon').appendChild(createIcon('barChart3', 'h-5 w-5'));
    this.container.querySelector('#trending-up-icon').appendChild(createIcon('trendingUp', 'h-4 w-4 text-green-400'));

    // Add event listeners for timeframe buttons
    this.container.querySelectorAll('.timeframe-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        this.timeframe = e.target.dataset.timeframe;
        await this.loadData();
        this.renderChart();
      });
    });
  }
}