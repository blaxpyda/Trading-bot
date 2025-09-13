import './style.css';
import { Dashboard } from './components/Dashboard';

// initialise the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  const dashboard = new Dashboard();
  dashboard.render(app);
})