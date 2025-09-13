import { createIcon } from '../utils/icons.js';
import { getStatusColor } from '../utils/helpers.js';
import { apiService } from '../services/api.js';

export class BotControls {
  constructor() {
    this.status = 'running';
    this.isLoading = false;
    this.onStatusChange = null;
    this.container = null;
  }

  async render(container) {
    this.container = container;
    await this.loadBotStatus();
    this.renderControls();
  }

  async loadBotStatus() {
    try {
      const statusData = await apiService.getBotStatus();
      this.status = statusData.status;
    } catch (error) {
      console.error('Error loading bot status:', error);
    }
  }

  renderControls() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white">Bot Controls</h3>
          <button class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors" id="settings-btn">
            <div id="settings-icon"></div>
          </button>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-center p-3 rounded-lg ${getStatusColor(this.status)}" id="status-indicator">
            <div class="flex items-center space-x-2">
              <div id="status-icon">
                ${this.isLoading ? '<div class="w-2 h-2 rounded-full bg-current animate-pulse"></div>' : '<div class="w-2 h-2 rounded-full bg-current animate-pulse"></div>'}
              </div>
              <span class="font-medium capitalize">${this.status}</span>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <button class="control-btn start-btn flex flex-col items-center justify-center p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg transition-colors" 
                    ${this.status === 'running' || this.isLoading ? 'disabled' : ''}>
              <div id="play-icon" class="mb-1"></div>
              <span class="text-xs">Start</span>
            </button>

            <button class="control-btn pause-btn flex flex-col items-center justify-center p-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg transition-colors"
                    ${this.status === 'stopped' || this.isLoading ? 'disabled' : ''}>
              <div id="pause-icon" class="mb-1"></div>
              <span class="text-xs">Pause</span>
            </button>

            <button class="control-btn stop-btn flex flex-col items-center justify-center p-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg transition-colors"
                    ${this.status === 'stopped' || this.isLoading ? 'disabled' : ''}>
              <div id="stop-icon" class="mb-1"></div>
              <span class="text-xs">Stop</span>
            </button>
          </div>

          <div class="pt-4 border-t border-gray-700">
            <h4 class="text-sm font-medium text-gray-400 mb-3">Quick Settings</h4>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-300">Risk Level</span>
                <select class="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600" id="risk-level">
                  <option>Conservative</option>
                  <option>Moderate</option>
                  <option>Aggressive</option>
                </select>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-300">Max Positions</span>
                <input type="number" value="10" class="bg-gray-700 text-white text-sm rounded px-2 py-1 w-16 border border-gray-600" id="max-positions">
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add icons
    this.container.querySelector('#settings-icon').appendChild(createIcon('settings', 'h-5 w-5'));
    this.container.querySelector('#play-icon').appendChild(createIcon('play', 'h-5 w-5'));
    this.container.querySelector('#pause-icon').appendChild(createIcon('pause', 'h-5 w-5'));
    this.container.querySelector('#stop-icon').appendChild(createIcon('square', 'h-5 w-5'));

    // Add event listeners
    this.addEventListeners();
  }

  addEventListeners() {
    const startBtn = this.container.querySelector('.start-btn');
    const pauseBtn = this.container.querySelector('.pause-btn');
    const stopBtn = this.container.querySelector('.stop-btn');

    startBtn?.addEventListener('click', () => this.handleStatusChange('running'));
    pauseBtn?.addEventListener('click', () => this.handleStatusChange('paused'));
    stopBtn?.addEventListener('click', () => this.handleStatusChange('stopped'));

    // Settings change handlers
    const riskLevel = this.container.querySelector('#risk-level');
    const maxPositions = this.container.querySelector('#max-positions');

    riskLevel?.addEventListener('change', (e) => {
      this.updateBotSettings({ riskLevel: e.target.value });
    });

    maxPositions?.addEventListener('change', (e) => {
      this.updateBotSettings({ maxPositions: parseInt(e.target.value) });
    });
  }

  async handleStatusChange(newStatus) {
    if (this.isLoading) return;

    this.isLoading = true;
    this.updateLoadingState();

    try {
      await apiService.updateBotStatus(newStatus);
      this.status = newStatus;
      
      if (this.onStatusChange) {
        this.onStatusChange(newStatus);
      }
    } catch (error) {
      console.error('Error updating bot status:', error);
    } finally {
      this.isLoading = false;
      this.renderControls();
    }
  }

  async updateBotSettings(settings) {
    try {
      await apiService.updateBotSettings(settings);
    } catch (error) {
      console.error('Error updating bot settings:', error);
    }
  }

  updateLoadingState() {
    const statusIcon = this.container.querySelector('#status-icon');
    if (statusIcon && this.isLoading) {
      statusIcon.innerHTML = '';
      statusIcon.appendChild(createIcon('refreshCw', 'h-5 w-5 animate-spin'));
    }
  }
}