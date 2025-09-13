/**
 * API Service for Trading Bot Dashboard
 * Configure your API endpoints and handle data fetching here
 */

class ApiService {
  constructor() {
    // Configure your base API URL here
    this.baseURL = 'https://api.example.com'; // Replace with your actual API URL
    this.apiKey = ''; // Add your API key if needed
    
    // Default headers for all requests
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      // Add authorization header if needed
      // 'Authorization': `Bearer ${this.apiKey}`
    };
  }

  /**
   * Generic fetch method with error handling
   */
  async fetchData(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: { ...this.defaultHeaders, ...options.headers },
        ...options
      };

      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Get trading bot metrics
   */
  async getMetrics() {
    // Return mock data directly
    return this.getMockMetrics();
  }

  /**
   * Get portfolio data
   */
  async getPortfolio() {
    return this.getMockPortfolio();
  }

  /**
   * Get trading history
   */
  async getTradingHistory(limit = 50) {
    return this.getMockTradingHistory();
  }

  /**
   * Get performance chart data
   */
  async getPerformanceData(timeframe = '1D') {
    return this.getMockPerformanceData(timeframe);
  }

  /**
   * Get bot status
   */
  async getBotStatus() {
    return { status: 'running', uptime: '2h 34m', lastUpdate: new Date() };
  }

  /**
   * Update bot status (start/stop/pause)
   */
  async updateBotStatus(status) {
    // Return mock successful status change
    return { status, timestamp: new Date() };
  }

  /**
   * Update bot settings
   */
  async updateBotSettings(settings) {
    // Return mock successful settings update
    return { success: true, settings };
  }

  // Mock data methods for development/fallback
  getMockMetrics() {
    return {
      totalProfit: 12847.32 + (Math.random() - 0.5) * 100,
      todayProfit: 423.18 + (Math.random() - 0.5) * 50,
      winRate: 68.4 + (Math.random() - 0.5) * 5,
      activePositions: 7,
      successfulTrades: 142,
      riskLevel: 2.8
    };
  }

  getMockPortfolio() {
    return {
      totalValue: 45234.67,
      todayChange: 1247.32,
      totalReturn: 18.3,
      positions: [
        { symbol: 'AAPL', quantity: 50, currentPrice: 173.25, change: 2.45, changePercent: 1.43 },
        { symbol: 'GOOGL', quantity: 25, currentPrice: 138.92, change: -1.23, changePercent: -0.88 },
        { symbol: 'TSLA', quantity: 30, currentPrice: 248.17, change: 5.67, changePercent: 2.34 },
        { symbol: 'MSFT', quantity: 40, currentPrice: 384.52, change: 3.21, changePercent: 0.84 },
        { symbol: 'AMZN', quantity: 20, currentPrice: 147.83, change: -0.92, changePercent: -0.62 }
      ]
    };
  }

  getMockTradingHistory() {
    return [
      {
        id: '1',
        symbol: 'AAPL',
        type: 'BUY',
        quantity: 100,
        price: 173.25,
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        profit: 145.30,
        status: 'completed'
      },
      {
        id: '2',
        symbol: 'GOOGL',
        type: 'SELL',
        quantity: 50,
        price: 138.92,
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        profit: -23.45,
        status: 'completed'
      },
      {
        id: '3',
        symbol: 'TSLA',
        type: 'BUY',
        quantity: 75,
        price: 248.17,
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        status: 'pending'
      },
      {
        id: '4',
        symbol: 'MSFT',
        type: 'BUY',
        quantity: 60,
        price: 384.52,
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        profit: 89.12,
        status: 'completed'
      },
      {
        id: '5',
        symbol: 'AMZN',
        type: 'SELL',
        quantity: 40,
        price: 147.83,
        timestamp: new Date(Date.now() - 1000 * 60 * 75),
        status: 'failed'
      }
    ];
  }

  getMockPerformanceData(timeframe) {
    const dataPoints = timeframe === '1D' ? 24 : timeframe === '7D' ? 7 : timeframe === '1M' ? 30 : 90;
    const baseValue = 10000;
    const data = [];
    
    for (let i = 0; i < dataPoints; i++) {
      const trend = i * 50 + baseValue;
      const volatility = (Math.random() - 0.5) * 200;
      data.push(Math.max(0, trend + volatility));
    }
    
    return { data, timeframe };
  }
}

// Export singleton instance
export const apiService = new ApiService();