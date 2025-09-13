import { Header } from './Header.js';
import { MetricsGrid } from './MetricsGrid.js';
import { PortfolioSection } from './PortfolioSection.js';
import { TradingHistory } from './TradingHistory.js';
import { BotControls } from './BotControls.js';
import { PerformanceChart } from './PerformanceChart.js';
import { apiService } from '../services/api.js';

export class Dashboard {
  constructor() {
    this.botStatus = 'running';
    this.currentTime = new Date();
    this.components = {};
    this.updateInterval = null;
    
    this.init();
  }

  init() {
    // Start time updates
    this.updateInterval = setInterval(() => {
      this.currentTime = new Date();
      if (this.components.header) {
        this.components.header.updateTime(this.currentTime);
      }
    }, 1000);
  }

  async render(container) {
    container.innerHTML = `
      <div class="min-h-screen bg-gray-900 text-white">
        <div id="header"></div>
        
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- Left Column - Main Dashboard -->
            <div class="lg:col-span-3 space-y-8">
              <div id="metrics-grid"></div>
              <div id="performance-chart"></div>
              <div id="trading-history"></div>
            </div>
            
            <!-- Right Column - Controls & Portfolio -->
            <div class="space-y-8">
              <div id="bot-controls"></div>
              <div id="portfolio-section"></div>
            </div>
          </div>
        </main>
      </div>
    `;

    // Initialize components
    this.components.header = new Header();
    this.components.metricsGrid = new MetricsGrid();
    this.components.performanceChart = new PerformanceChart();
    this.components.tradingHistory = new TradingHistory();
    this.components.botControls = new BotControls();
    this.components.portfolioSection = new PortfolioSection();

    // Render components
    await this.components.header.render(container.querySelector('#header'));
    await this.components.metricsGrid.render(container.querySelector('#metrics-grid'));
    await this.components.performanceChart.render(container.querySelector('#performance-chart'));
    await this.components.tradingHistory.render(container.querySelector('#trading-history'));
    await this.components.botControls.render(container.querySelector('#bot-controls'));
    await this.components.portfolioSection.render(container.querySelector('#portfolio-section'));

    // Set up bot controls callback
    this.components.botControls.onStatusChange = (status) => {
      this.botStatus = status;
    };

    // Start data refresh cycle
    this.startDataRefresh();
  }

  startDataRefresh() {
    // Refresh data every 30 seconds
    setInterval(async () => {
      try {
        await this.components.metricsGrid.refreshData();
        await this.components.portfolioSection.refreshData();
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    }, 30000);
  }

  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    // Destroy all components
    Object.values(this.components).forEach(component => {
      if (component.destroy) {
        component.destroy();
      }
    });
  }
}