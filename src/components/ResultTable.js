import { Storage } from '../lib/storage';
import { Icons } from '../assets/icons';

export const ResultTable = {
  render() {
    const logs = Storage.getLogs();
    
    return `
      <div class="animate-view">
        <div class="flex-between" style="margin-bottom: 2.5rem;">
          <div>
            <h2 class="title-font" style="font-size: 1.875rem;">Data Analytics</h2>
            <p class="text-secondary">Enterprise-grade tracking of global payroll cycles</p>
          </div>
          <div style="display: flex; gap: 1rem;">
            <button class="btn btn-primary" onclick="app.exportToCSV()">
              ${Icons.Logs} Export Dataset (CSV)
            </button>
            <button class="btn btn-outline" style="color: var(--danger);" onclick="app.clearLogs()">
              ${Icons.Trash} Purge Analytics
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="glass" style="padding: 1.5rem; margin-bottom: 2rem; background: rgba(15, 23, 42, 0.4); display: flex; gap: 1.5rem; align-items: center; border-radius: var(--radius-md);">
          <div style="flex: 1; position: relative;">
            <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); opacity: 0.5;">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input type="text" id="table-search" placeholder="Search by Employee ID, Region, or Status..." style="width: 100%; padding-left: 3rem;" oninput="ResultTable.filterTable()">
          </div>
          <div style="display: flex; align-items: center; gap: 1rem;">
             <span class="text-secondary" style="font-size: 0.8rem; font-weight: 600;">REGION:</span>
             <select id="region-filter" style="width: 160px;" onchange="ResultTable.filterTable()">
                <option value="all">ALL REGIONS</option>
                <option value="INDIA">INDIA (Standard)</option>
                <option value="US">USA (Federal)</option>
                <option value="UK">UK (PAYE)</option>
             </select>
          </div>
        </div>

        <div class="glass" style="overflow: hidden; border-radius: var(--radius-md);">
          <div style="overflow-x: auto;">
            <table id="analytics-table" style="width: 100%; border-collapse: separate; border-spacing: 0;">
              <thead>
                <tr style="background: rgba(255, 255, 255, 0.03);">
                  <th style="border-bottom: 1px solid var(--border);">RUN TIMESTAMP</th>
                  <th style="border-bottom: 1px solid var(--border);">EMPLOYEE ID</th>
                  <th style="border-bottom: 1px solid var(--border);">REGION</th>
                  <th style="border-bottom: 1px solid var(--border);">BASE SALARY</th>
                  <th style="border-bottom: 1px solid var(--border);">NET DISBURSEMENT</th>
                  <th style="border-bottom: 1px solid var(--border); text-align: center;">STATUS</th>
                </tr>
              </thead>
              <tbody id="table-body">
                ${this.renderRows(logs)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>
        .table-row td {
           border-top: none;
           border-bottom: 1px solid var(--border);
           background: transparent;
        }
        .table-row:hover td {
           background: rgba(37, 99, 235, 0.04);
        }
        .table-row:last-child td {
           border-bottom: none;
        }
      </style>
    `;
  },

  renderRows(logs) {
    if (logs.length === 0) {
      return `<tr><td colspan="6" style="padding: 5rem; text-align: center; color: var(--text-secondary);">
        <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;">📊</div>
        No analytics data available for this cycle.
      </td></tr>`;
    }

    return logs.map(log => {
      const state = log.finalState || {};
      const success = log.success;
      
      return `
        <tr class="table-row" data-region="${state.region || ''}">
          <td style="padding: 1.25rem 1.5rem; opacity: 0.5; font-family: monospace; font-size: 0.8rem;">${log.timestamp}</td>
          <td style="padding: 1.25rem 1.5rem; font-weight: 600; color: var(--text-primary);">${state.employee_id || 'UNKNOWN'}</td>
          <td style="padding: 1.25rem 1.5rem;">
            <span style="font-family: monospace; letter-spacing: 1px; font-weight: 700; font-size: 0.75rem; color: var(--primary);">${state.region || 'GLOBAL'}</span>
          </td>
          <td style="padding: 1.25rem 1.5rem; color: var(--text-secondary);">$${Number(state.salary || 0).toLocaleString()}</td>
          <td style="padding: 1.25rem 1.5rem; color: var(--accent); font-weight: 700; font-size: 1rem;">$${Number(state.net_pay || 0).toLocaleString()}</td>
          <td style="padding: 1.25rem 1.5rem; text-align: center;">
            <div class="status-pill ${success ? 'status-success' : 'status-error'}" style="min-width: 100px; justify-content: center;">
              ${success ? 'Active' : 'Halted'}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  filterTable() {
    const query = document.getElementById('table-search').value.toLowerCase();
    const region = document.getElementById('region-filter').value;
    const rows = document.querySelectorAll('.table-row');

    rows.forEach(row => {
      const text = row.innerText.toLowerCase();
      const rowRegion = row.getAttribute('data-region') || '';
      
      const matchesSearch = text.includes(query);
      const matchesRegion = region === 'all' || rowRegion.toUpperCase() === region.toUpperCase();
      
      row.style.display = (matchesSearch && matchesRegion) ? 'table-row' : 'none';
    });
  }
};

window.ResultTable = ResultTable;
