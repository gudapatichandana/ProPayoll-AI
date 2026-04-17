import { Storage } from '../lib/storage';
import { Icons } from '../assets/icons';

export const ConfigManager = {
  render() {
    return `
      <div id="config-modal" class="animate-fade" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; display: none;">
        <div class="glass" style="width: 500px; padding: 2.5rem; border: 1px solid var(--primary);">
          <div class="flex-between" style="margin-bottom: 2rem;">
            <h3>Configuration Manager</h3>
            <button class="btn btn-outline" style="border: none;" onclick="ConfigManager.toggle()">✕</button>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div class="glass" style="padding: 1.5rem; background: rgba(0,0,0,0.2);">
              <h4 style="margin-bottom: 0.5rem;">Export Rules</h4>
              <p class="text-secondary" style="font-size: 0.8rem; margin-bottom: 1rem;">Download all global payroll logic as a portability JSON file.</p>
              <button class="btn btn-primary" style="width: 100%; justify-content: center;" onclick="ConfigManager.exportJSON()">
                Download config.json
              </button>
            </div>

            <div class="glass" style="padding: 1.5rem; background: rgba(0,0,0,0.2);">
              <h4 style="margin-bottom: 0.5rem;">Import Logic</h4>
              <p class="text-secondary" style="font-size: 0.8rem; margin-bottom: 1rem;">Upload a JSON file to instantly apply new regional compliance rules.</p>
              <input type="file" id="import-input" style="display: none;" onchange="ConfigManager.importJSON(event)">
              <button class="btn btn-outline" style="width: 100%; justify-content: center;" onclick="document.getElementById('import-input').click()">
                Select JSON File
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  toggle() {
    const modal = document.getElementById('config-modal');
    modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
  },

  exportJSON() {
    const workflows = Storage.getWorkflows();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workflows, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "propayroll_config.json");
    dlAnchorElem.click();
    app.showToast('Config exported successfully!');
  },

  importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workflows = JSON.parse(e.target.result);
        if (Array.isArray(workflows)) {
          Storage.saveWorkflows(workflows);
          app.showToast('Import successful! Refreshing...');
          setTimeout(() => location.reload(), 1500);
        } else {
          throw new Error('Invalid JSON format. Expected an array of workflows.');
        }
      } catch (err) {
        alert('Error importing config: ' + err.message);
      }
    };
    reader.readAsText(file);
  }
};

window.ConfigManager = ConfigManager;
