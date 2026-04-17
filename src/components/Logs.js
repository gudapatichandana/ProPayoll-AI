import { Storage } from '../lib/storage';
import { Icons } from '../assets/icons';

export const Logs = {
  render() {
    const logs = Storage.getLogs();
    
    return `
      <div class="glass animate-fade" style="padding: 2rem;">
        <div class="flex-between" style="margin-bottom: 2rem;">
          <h3>Execution History</h3>
          <button class="btn btn-outline" style="font-size: 0.8rem;" onclick="app.clearLogs()">
            ${Icons.Trash} Clear Logs
          </button>
        </div>

        ${logs.length === 0 ? `
          <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
            <p>No execution logs found. Run a workflow to see logs here.</p>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${logs.map(log => `
              <div class="glass" style="padding: 1.25rem; background: rgba(15, 23, 42, 0.3); border-color: rgba(255, 255, 255, 0.05);">
                <div class="flex-between">
                  <span style="font-family: monospace; font-size: 0.8rem; color: var(--accent);">${log.timestamp}</span>
                  <span class="tag" style="background: ${log.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}; color: ${log.success ? 'var(--accent)' : 'var(--danger)'};">
                    ${log.success ? 'SUCCESS' : 'FAILED'}
                  </span>
                </div>
                <div style="margin-top: 1rem; font-size: 0.9rem; font-family: 'Inter', sans-serif;">
                  ${log.logs.map(line => `
                    <div style="margin-bottom: 0.25rem; color: ${line.includes('[SUCCESS]') ? 'var(--accent)' : (line.includes('[SKIPPED]') ? 'var(--text-secondary)' : 'var(--text-primary)')};">
                      ${line}
                    </div>
                  `).join('')}
                </div>
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px dotted var(--border); font-size: 0.8rem;">
                  <span class="text-secondary">Final State:</span>
                  <code style="background: rgba(0,0,0,0.3); padding: 0.2rem 0.4rem; border-radius: 4px; color: #f472b6;">
                    ${JSON.stringify(log.finalState)}
                  </code>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }
};
