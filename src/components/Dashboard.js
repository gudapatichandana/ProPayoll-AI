import { Storage } from '../lib/storage';
import { Icons } from '../assets/icons';

export const Dashboard = {
  render() {
    const workflows = Storage.getWorkflows();
    const logs = Storage.getLogs();
    
    return `
      <div class="animate-view">
        <div class="flex-between" style="margin-bottom: 2rem;">
          <div>
            <h2 class="title-font" style="font-size: 1.875rem;">Payroll Pipelines</h2>
            <p class="text-secondary">Orchestrate your global compliance logic</p>
          </div>
          <button class="btn btn-primary" onclick="app.setView('builder')">
            ${Icons.Plus} Create New Pipeline
          </button>
        </div>

        <div class="grid">
          ${workflows.length === 0 ? `
            <div class="glass" style="grid-column: 1/-1; padding: 5rem; text-align: center; background: rgba(37, 99, 235, 0.02);">
              <div style="font-size: 4rem; margin-bottom: 1.5rem; opacity: 0.5;">🏢</div>
              <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">No Active Pipelines</h3>
              <p class="text-secondary" style="max-width: 400px; margin: 0 auto 2rem;">Build your first regional payroll logic or import a JSON compliance config to get started.</p>
              <button class="btn btn-outline" onclick="ConfigManager.toggle()">
                ${Icons.Logs} Import JSON Config
              </button>
            </div>
          ` : workflows.map(w => {
            const lastRun = logs.find(l => l.workflowId === w.id);
            const steps = w.steps || w.rules || [];
            const region = steps[0]?.action?.type?.split('_')?.pop()?.toUpperCase() || 'GLOBAL';
            
            return `
              <div class="glass card">
                <div class="flex-between" style="margin-bottom: 1.5rem;">
                  <div style="display: flex; gap: 0.75rem; align-items: center;">
                     <div class="status-pill ${lastRun ? (lastRun.success ? 'status-success' : 'status-error') : 'status-success'}" style="opacity: ${lastRun ? 1 : 0.5}">
                       <span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor; ${lastRun?.success ? 'box-shadow: 0 0 8px var(--accent);' : ''}"></span>
                       ${lastRun ? (lastRun.success ? 'Healthy' : 'Sync Error') : 'Identified'}
                     </div>
                     <span class="tag" style="background: rgba(37, 99, 235, 0.1); color: var(--primary); padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.7rem; font-weight: 700;">${region}</span>
                  </div>
                  <div style="display: flex; gap: 0.5rem;">
                    <button class="btn-icon" onclick="app.runSimulator('${w.id}')" title="Run Simulation">
                      ${Icons.Play}
                    </button>
                    ${window.app.currentRole === 'admin' ? `
                      <button class="btn-icon" onclick="app.duplicateWorkflow('${w.id}')" title="Clone">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      </button>
                    ` : ''}
                  </div>
                </div>

                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem;">${w.name}</h3>
                <p class="text-secondary" style="font-size: 0.9rem; line-height: 1.6; margin-bottom: 2rem; height: 2.8rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                  ${w.description || 'No specialized description provided for this regional logic.'}
                </p>
                
                <div style="background: rgba(0,0,0,0.2); border-radius: var(--radius-md); padding: 1.25rem; border: 1px solid var(--border);">
                  <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                     ${steps.slice(0, 2).map((s, i) => `
                       <div style="display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.8rem;">
                         <div style="color: var(--primary); font-weight: 800; font-size: 0.7rem; padding-top: 2px;">0${i+1}</div>
                         <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                            <span style="color: var(--text-primary); font-weight: 500;">If ${s.condition.field} ${s.condition.operator} ${s.condition.value}</span>
                            <span style="color: var(--text-secondary); font-size: 0.75rem;">Action: ${s.action.type.replace(/_/g, ' ')}</span>
                         </div>
                       </div>
                     `).join('')}
                     ${steps.length > 2 ? `<p style="font-size: 0.7rem; color: var(--primary); font-weight: 700; margin-top: 0.5rem; text-align: center;">+ ${steps.length - 2} ADDITIONAL STEPS</p>` : ''}
                  </div>
                </div>

                <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
                   ${window.app.currentRole === 'admin' ? `
                     <button class="btn-text" style="color: var(--danger); font-size: 0.8rem;" onclick="app.deleteWorkflow('${w.id}')">Delete Pipeline</button>
                   ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <style>
        .btn-icon {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-secondary);
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-icon:hover {
          background: rgba(255,255,255,0.05);
          color: var(--text-primary);
          border-color: var(--text-secondary);
        }
        .btn-text {
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 600;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        .btn-text:hover { opacity: 1; text-decoration: underline; }
      </style>
    `;
  }
};
