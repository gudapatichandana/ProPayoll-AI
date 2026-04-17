import './style.css';
import { Icons } from './assets/icons';
import { Dashboard } from './components/Dashboard';
import { WorkflowBuilder } from './components/WorkflowBuilder';
import { Logs } from './components/Logs';
import { ResultTable } from './components/ResultTable';
import { CaseStudies } from './components/CaseStudies';
import { ConfigManager } from './components/ConfigManager';
import { Simulator } from './components/Simulator';
import { Storage } from './lib/storage';

class App {
  constructor() {
    this.currentView = 'dashboard';
    this.currentRole = 'admin'; // admin, support, client
    this.contentArea = document.getElementById('content-area');
    this.viewTitle = document.getElementById('view-title');
    this.viewSubtitle = document.getElementById('view-subtitle');
    
    this.init();
  }

  init() {
    // Inject Icons
    document.getElementById('logo-icon').innerHTML = Icons.Workflow;
    document.getElementById('icon-dashboard').innerHTML = Icons.Dashboard;
    document.getElementById('icon-plus').innerHTML = Icons.Plus;
    document.getElementById('icon-analytics').innerHTML = Icons.Analytics;
    document.getElementById('icon-cases').innerHTML = Icons.Cases;
    document.getElementById('icon-logs').innerHTML = Icons.Logs;
    document.getElementById('icon-plus-header').innerHTML = Icons.Plus;

    document.getElementById('config-manager-container').innerHTML = ConfigManager.render();

    // Navigation Listeners
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-view');
        this.setView(view);
      });
    });

    document.getElementById('btn-create-header').addEventListener('click', () => {
      this.setView('builder');
    });

    // Initial View
    this.setView('dashboard');
  }

  setView(view, params = {}) {
    const mainContent = document.querySelector('.main-content');
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      this.currentView = view;
      
      // Update Navigation Active State
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-view') === view);
      });

      // Update Header
      this.updateHeader(view);

      // Render Content
      let html = '';
      switch (view) {
        case 'dashboard': html = Dashboard.render(); break;
        case 'builder': html = WorkflowBuilder.render(); break;
        case 'logs': html = Logs.render(); break;
        case 'analytics': html = ResultTable.render(); break;
        case 'cases': html = CaseStudies.render(); break;
        case 'simulator': html = Simulator.render(params.id); break;
        default: html = Dashboard.render();
      }

      this.contentArea.innerHTML = html;

      // Post-render initialization
      if (view === 'builder') WorkflowBuilder.initListeners();
      if (view === 'simulator') Simulator.initListeners(params.id);

      // Fade back in
      mainContent.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      mainContent.style.opacity = '1';
      mainContent.style.transform = 'translateY(0)';
    }, 200);
  }

  updateHeader(view) {
    const titles = {
      dashboard: { t: 'Payroll Dashboard', s: 'Monitor global compliance logic' },
      builder: { t: 'Pipeline Builder', s: 'Define regional payroll rules' },
      logs: { t: 'System Logs', s: 'Detailed execution audit trail' },
      analytics: { t: 'Data Analytics', s: 'SQL-style analysis of global results' },
      cases: { t: 'Case Study', s: 'Client Requirement Walkthrough' },
      simulator: { t: 'Simulation Lab', s: 'Verify payroll runs before deployment' }
    };
    
    const { t, s } = titles[view] || titles.dashboard;
    this.viewTitle.innerText = t;
    this.viewSubtitle.innerText = s;

    // Hide/Show header button based on Role
    const canBuild = this.currentRole === 'admin';
    document.getElementById('btn-create-header').style.display = (view === 'dashboard' && canBuild) ? 'flex' : 'none';

    // Update Sidebar Visibility (Hide Build Pipeline for non-admins)
    const navBuilder = document.getElementById('nav-builder');
    if (navBuilder) {
      navBuilder.style.display = canBuild ? 'flex' : 'none';
    }
    
    // Also hide Config Manager for non-admins
    const navConfig = document.getElementById('nav-config');
    if (navConfig) {
      navConfig.style.display = canBuild ? 'flex' : 'none';
    }
  }

  setRole(role) {
    this.currentRole = role;
    this.showToast(`Switched to ${role.toUpperCase()} mode`, 'info');
    this.setView(this.currentView); // Refresh current view permissions
  }

  // Global Actions (called from onclick in templates)
  deleteWorkflow(id) {
    if (confirm('Are you sure you want to delete this workflow?')) {
      Storage.deleteWorkflow(id);
      this.setView('dashboard');
      this.showToast('Workflow deleted.');
    }
  }

  duplicateWorkflow(id) {
    const workflow = Storage.getWorkflows().find(w => w.id === id);
    if (workflow) {
      const newWorkflow = { 
        ...workflow, 
        name: `${workflow.name} (Copy)`,
        id: undefined // Storage will assign new ID
      };
      Storage.addWorkflow(newWorkflow);
      this.setView('dashboard');
      this.showToast('Workflow duplicated.');
    }
  }

  exportToCSV() {
    const logs = Storage.getLogs();
    if (logs.length === 0) return this.showToast('No data to export.');

    const headers = ['Timestamp', 'Employee ID', 'Region', 'Salary', 'Net Pay', 'Status'];
    const rows = logs.map(log => [
      log.timestamp,
      log.finalState?.employee_id || 'N/A',
      log.finalState?.region || 'N/A',
      log.finalState?.salary || 0,
      log.finalState?.net_pay || 0,
      log.success ? 'Success' : 'Failed'
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `payroll_analysis_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.showToast('CSV Exported successfully!');
  }

  runSimulator(id) {
    this.setView('simulator', { id });
  }

  clearLogs() {
    if (confirm('Clear all history?')) {
      Storage.clearLogs();
      this.setView('logs');
      this.showToast('Logs cleared.');
    }
  }

  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'glass animate-view';
    toast.style.padding = '1rem 1.5rem';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '1rem';
    toast.style.background = type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(37, 99, 235, 0.9)';
    toast.style.color = 'white';
    toast.style.marginBottom = '1rem';
    toast.style.border = 'none';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
    toast.style.minWidth = '250px';
    
    toast.innerHTML = `
      <div style="width: 20px; height: 20px;">${type === 'success' ? Icons.Plus : Icons.Logs}</div>
      <div style="font-weight: 600; font-size: 0.9rem;">${message}</div>
    `;
    
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }
}

// Initialize App and expose to window for onclick handlers
window.app = new App();
