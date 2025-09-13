import { createIcon } from '../utils/icons.js';
import { formatTime } from '../utils/helpers.js';

export class Header {
  constructor() {
    this.currentTime = new Date();
  }

  render(container) {
    container.innerHTML = `
      <header class="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <div class="h-8 w-8 text-blue-400" id="bot-icon"></div>
                <h1 class="text-xl font-bold text-white">TradingBot Pro</h1>
              </div>
              <div class="hidden sm:flex items-center space-x-2 text-gray-400">
                <div class="h-4 w-4" id="trending-icon"></div>
                <span class="text-sm">v2.1.0</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-400" id="current-time">
                ${formatTime(this.currentTime)}
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span class="text-sm text-green-400">Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    `;

    // Add icons
    const botIcon = createIcon('bot', 'h-8 w-8 text-blue-400');
    const trendingIcon = createIcon('trendingUp', 'h-4 w-4');
    
    container.querySelector('#bot-icon').appendChild(botIcon);
    container.querySelector('#trending-icon').appendChild(trendingIcon);
  }

  updateTime(time) {
    this.currentTime = time;
    const timeElement = document.querySelector('#current-time');
    if (timeElement) {
      timeElement.textContent = formatTime(time);
    }
  }
}