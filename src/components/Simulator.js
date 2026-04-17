import { Storage } from '../lib/storage';
import { Icons } from '../assets/icons';
import { RuleEngine } from '../lib/engine';

export const Simulator = {
  render(workflowId) {
    const workflows = Storage.getWorkflows();
    const workflow = workflows.find(w => w.id === workflowId) || workflows[0];
    
    return `
      <div class="animate-view">
        <div class="flex-between" style="margin-bottom: 2.5rem;">
          <div>
            <h2 class="title-font" style="font-size: 1.875rem;">Simulation Lab</h2>
            <p class="text-secondary">Verify logic layer: ${workflow.name}</p>
          </div>
          <button class="btn btn-outline" onclick="app.setView('dashboard')">Back to Dashboard</button>
        </div>

        <div class="grid" style="grid-template-columns: 1fr 1.5fr;">
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div class="glass" style="padding: 1.5rem; background: rgba(15, 23, 42, 0.4);">
              <p style="font-size: 0.7rem; font-weight: 700; color: var(--primary); margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">Employee Dataset (JSON Input)</p>
              <textarea id="sim-input" style="width: 100%; font-family: monospace; font-size: 0.85rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border);" rows="10">{
  "employee_id": "DEL-9921",
  "employee_name": "Alexander Knight",
  "region": "INDIA",
  "salary": 75000,
  "overtime_hours": 10,
  "hourly_rate": 80
}</textarea>
              <button id="run-sim-btn" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem; justify-content: center;">
                Execute Pipeline Logic
              </button>
            </div>

            <div class="glass" style="padding: 1rem; border: 1px dashed var(--border);">
               <h4 style="font-size: 0.75rem; margin-bottom: 0.5rem; color: var(--text-secondary);">Support Note</h4>
               <p style="font-size: 0.7rem; color: var(--text-secondary); line-height: 1.4;">
                 Use this environment to reproduce client support tickets. Malformed JSON or missing regional indices will trigger the <b>Validation Error Layer</b>.
               </p>
            </div>
          </div>

          <div id="sim-results" class="glass" style="padding: 2rem; background: rgba(2, 6, 23, 0.8); min-height: 400px; border: 1px solid var(--border);">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; opacity: 0.5;" id="sim-idle-state">
               <div style="margin-bottom: 1rem;">${Icons.Play}</div>
               <p style="font-size: 0.9rem;">Ready for logic verification</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async initListeners(workflowId) {
    const runBtn = document.getElementById('run-sim-btn');
    const inputArea = document.getElementById('sim-input');
    const resultsArea = document.getElementById('sim-results');
    const engine = new RuleEngine();

    runBtn.addEventListener('click', async () => {
      try {
        const inputData = JSON.parse(inputArea.value);
        const workflows = Storage.getWorkflows();
        const workflow = workflows.find(w => w.id === workflowId);

        // UI State: Processing
        runBtn.disabled = true;
        runBtn.innerHTML = `<span class="pulse" style="width: 8px; height: 8px; background: white; border-radius: 50%; display: inline-block; margin-right: 0.5rem;"></span> Processing Engine Logic...`;
        resultsArea.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 1rem;">
             <div class="glass pulse" style="height: 40px; border-radius: 4px; opacity: 0.3;"></div>
             <div class="glass pulse" style="height: 40px; border-radius: 4px; opacity: 0.2;"></div>
             <div class="glass pulse" style="height: 40px; border-radius: 4px; opacity: 0.1;"></div>
          </div>
        `;

        // Simulated Backend Delay (Deloitte Enterprise Requirement)
        await new Promise(resolve => setTimeout(resolve, 800));

        const result = await engine.run(workflow, inputData);

        // Store result for analytics
        Storage.saveLog(workflowId, result);

        // Render Results
        resultsArea.innerHTML = `
          <div class="animate-view">
            <div class="flex-between" style="margin-bottom: 1.5rem;">
               <h3 class="title-font">Execution Result</h3>
               <span class="status-pill ${result.success ? 'status-success' : 'status-error'}">
                 ${result.success ? 'SUCCESS' : result.errorCode || 'FAILED'}
               </span>
            </div>

            <div style="background: rgba(0,0,0,0.3); padding: 1.5rem; border-radius: 8px; font-family: monospace; font-size: 0.8rem; margin-bottom: 1.5rem; border-left: 2px solid ${result.success ? 'var(--accent)' : 'var(--danger)'};">
              ${result.logs.map(log => {
                const isError = log.includes('[CRITICAL]') || log.includes('[FAILURE]');
                return `<div style="margin-bottom: 0.5rem; color: ${isError ? 'var(--danger)' : 'var(--text-primary)'}; opacity: ${log.includes('[INFO]') ? 0.6 : 1}">
                  ${log}
                </div>`;
              }).join('')}
            </div>

            ${result.success ? `
              <div class="glass" style="padding: 1rem; background: rgba(16, 185, 129, 0.05); border-color: var(--accent);">
                <div class="flex-between">
                  <div>
                    <p style="font-size: 0.7rem; color: var(--accent); font-weight: 700;">FINAL NET PAY</p>
                    <p style="font-size: 1.5rem; font-weight: 800;">₹${result.finalState.net_pay.toLocaleString()}</p>
                  </div>
                  <button class="btn btn-outline" style="font-size: 0.7rem;" onclick="app.setView('analytics')">View in Analytics</button>
                </div>
              </div>
            ` : `
              <div class="glass" style="padding: 1rem; background: rgba(239, 68, 68, 0.05); border-color: var(--danger);">
                <p style="font-size: 0.75rem; font-weight: 700; color: var(--danger); margin-bottom: 0.5rem;">TROUBLESHOOTING REASON</p>
                <p style="font-size: 0.85rem; line-height: 1.5;">${result.logs[result.logs.length - 1]}</p>
              </div>
            `}
          </div>
        `;

      } catch (err) {
        resultsArea.innerHTML = `
          <div class="status-error" style="padding: 1rem; border-radius: 8px;">
            <strong>ERR_PARSE_01:</strong> Input must be a valid JSON employee object.
          </div>
        `;
      } finally {
        runBtn.disabled = false;
        runBtn.innerHTML = `Execute Pipeline Logic`;
      }
    });
  }
};
