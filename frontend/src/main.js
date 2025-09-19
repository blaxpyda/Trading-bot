import './style.css';
import { Dashboard } from './components/Dashboard';
import { apiService } from './services/api';

// initialise the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  const dashboard = new Dashboard();
  dashboard.render(app);
})


// Fetch and update Binance server status every 300ms
document.addEventListener('DOMContentLoaded', () => {
  const binanceStatus = document.getElementById('binance-status');
  const pulse = binanceStatus.querySelector('div');
  const statusText = binanceStatus.querySelector('span');

  // Function to update the UI based on status
  const updateStatusUI = (status) => {
    const isUp = status === 'UP';
    pulse.className = `w-2 h-2 ${isUp ? 'bg-green-400' : 'bg-red-400'} rounded-full animate-pulse`;
    statusText.className = `text-sm ${isUp ? 'text-green-400' : 'text-red-400'}`;
    statusText.textContent = isUp ? 'Live' : status === 'MAINTENANCE' ? 'Maintenance' : 'Unknown';
  };

  // Function to fetch and update status
  const fetchStatus = async () => {
    try {
      const data = await apiService.getBinanceServerStatus();
      updateStatusUI(data.status);
    } catch (error) {
      console.error('Error fetching Binance server status:', error);
      updateStatusUI('UNKNOWN');
    }
    statusText.textContent = 'Going Live in...';
  };

  // Initial fetch
  fetchStatus();

  // Fetch status every 300ms
  setInterval(fetchStatus, 300);
});