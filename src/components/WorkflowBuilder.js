import { Storage } from '../lib/storage';
import { Icons } from '../assets/icons';

export const WorkflowBuilder = {
  steps: [{
    condition: { field: '', operator: '==', value: '' },
    action: { type: 'set_variable', params: {} }
  }],

  render() {
    return `
      <div class="glass animate-fade" style="padding: 2rem; max-width: 900px; margin: 0 auto;">
        <div class="flex-between" style="margin-bottom: 2rem;">
          <h3>Workflow Pipeline Builder</h3>
          <div class="tag tag-if">v2.0 Advanced</div>
        </div>
        
        <form id="workflow-form" style="display: flex; flex-direction: column; gap: 2.5rem;">
          <!-- Basic Info -->
          <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <label class="text-secondary" style="font-weight: 600; font-size: 0.8rem; text-transform: uppercase;">Name</label>
              <input type="text" id="w-name" placeholder="Workflow Name" required>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <label class="text-secondary" style="font-weight: 600; font-size: 0.8rem; text-transform: uppercase;">Description</label>
              <input type="text" id="w-desc" placeholder="Brief description">
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem; grid-column: 1/-1;">
              <input type="checkbox" id="w-stop-on-failure" style="width: auto;">
              <label for="w-stop-on-failure" style="font-size: 0.9rem; cursor: pointer;">Stop workflow execution if a step fails (Match All Logic)</label>
            </div>
          </div>

          <!-- Steps Container -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div class="flex-between">
              <label class="text-secondary" style="font-weight: 600; font-size: 0.8rem; text-transform: uppercase;">Execution Pipeline</label>
              <button type="button" class="btn btn-outline" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;" id="btn-add-step">
                ${Icons.Plus} Add Step
              </button>
            </div>
            
            <div id="steps-list" style="display: flex; flex-direction: column; gap: 2rem;">
              <!-- Dynamic Steps Injected Here -->
            </div>
          </div>

          <div style="display: flex; gap: 1rem; margin-top: 2rem; border-top: 1px solid var(--border); padding-top: 2rem;">
            <button type="submit" class="btn btn-primary" style="flex: 1; justify-content: center;">
              Save Advanced Workflow
            </button>
            <button type="button" class="btn btn-outline" onclick="app.setView('dashboard')">Cancel</button>
          </div>
        </form>
      </div>
    `;
  },

  renderSteps() {
    const list = document.getElementById('steps-list');
    list.innerHTML = this.steps.map((step, idx) => `
      <div class="step-block glass animate-fade" style="background: rgba(15, 23, 42, 0.4);">
        <div class="flex-between" style="margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="background: var(--primary); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800;">${idx + 1}</div>
            <span class="tag tag-if">Step Logic</span>
          </div>
          ${this.steps.length > 1 ? `
            <button type="button" class="btn btn-outline" style="padding: 0.25rem; color: var(--danger); border: none;" onclick="WorkflowBuilder.removeStep(${idx})">
              ${Icons.Trash}
            </button>
          ` : ''}
        </div>

        <!-- Condition -->
        <div style="display: grid; grid-template-columns: 1fr 100px 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <input type="text" placeholder="Field" value="${step.condition.field}" onchange="WorkflowBuilder.updateStep(${idx}, 'condition.field', this.value)" required>
          <select onchange="WorkflowBuilder.updateStep(${idx}, 'condition.operator', this.value)">
            <option value="==" ${step.condition.operator === '==' ? 'selected' : ''}>==</option>
            <option value="!=" ${step.condition.operator === '!=' ? 'selected' : ''}>!=</option>
            <option value=">" ${step.condition.operator === '>' ? 'selected' : ''}>></option>
            <option value="<" ${step.condition.operator === '<' ? 'selected' : ''}><</option>
            <option value="contains" ${step.condition.operator === 'contains' ? 'selected' : ''}>contains</option>
            <option value="matches" ${step.condition.operator === 'matches' ? 'selected' : ''}>regex</option>
          </select>
          <input type="text" placeholder="Value (or {{var}})" value="${step.condition.value}" onchange="WorkflowBuilder.updateStep(${idx}, 'condition.value', this.value)" required>
        </div>

        <div class="tag tag-then" style="margin-bottom: 1rem;">Action Outcome</div>
        
        <!-- Action -->
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <select style="width: 100%;" onchange="WorkflowBuilder.updateStep(${idx}, 'action.type', this.value)">
            <option value="calculate_tax_india" ${step.action.type === 'calculate_tax_india' ? 'selected' : ''}>India: Calculate Tax (TDS/PF)</option>
            <option value="calculate_tax_us" ${step.action.type === 'calculate_tax_us' ? 'selected' : ''}>USA: Calculate Tax (Federal/FICA)</option>
            <option value="calculate_tax_uk" ${step.action.type === 'calculate_tax_uk' ? 'selected' : ''}>UK: Calculate Tax (PAYE/NI)</option>
            <option value="apply_bonus" ${step.action.type === 'apply_bonus' ? 'selected' : ''}>Apply Performance Bonus</option>
            <option value="overtime_logic" ${step.action.type === 'overtime_logic' ? 'selected' : ''}>Calculate Overtime (1.5x)</option>
            <option value="set_variable" ${step.action.type === 'set_variable' ? 'selected' : ''}>Set System Variable</option>
          </select>

          <!-- Dynamic Action Params -->
          <div id="params-${idx}" class="grid" style="grid-template-columns: 1fr 1fr; gap: 1rem; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px;">
            ${this.renderActionParams(idx, step.action.type)}
          </div>
        </div>
      </div>
    `).join('');
  },

  renderActionParams(idx, type) {
    const step = this.steps[idx];
    switch (type) {
      case 'webhook':
        return `
          <div style="grid-column: 1/-1;">
            <label style="font-size: 0.75rem; color: var(--text-secondary);">WEBHOOK URL</label>
            <input type="url" placeholder="https://api.example.com/hook" style="width: 100%;" value="${step.action.params.url || ''}" onchange="WorkflowBuilder.updateStep(${idx}, 'action.params.url', this.value)" required>
          </div>
        `;
      case 'transform':
        return `
          <div>
            <label style="font-size: 0.75rem; color: var(--text-secondary);">FIELD</label>
            <input type="text" placeholder="Field name" value="${step.action.params.field || ''}" onchange="WorkflowBuilder.updateStep(${idx}, 'action.params.field', this.value)" required>
          </div>
          <div>
            <label style="font-size: 0.75rem; color: var(--text-secondary);">METHOD</label>
            <select onchange="WorkflowBuilder.updateStep(${idx}, 'action.params.method', this.value)">
              <option value="uppercase">UPPERCASE</option>
              <option value="lowercase">lowercase</option>
              <option value="trim">Trim whitespace</option>
            </select>
          </div>
        `;
      case 'calculate':
        return `
          <div>
             <label style="font-size: 0.75rem; color: var(--text-secondary);">BASE FIELD</label>
             <input type="text" placeholder="price" value="${step.action.params.field || ''}" onchange="WorkflowBuilder.updateStep(${idx}, 'action.params.field', this.value)" required>
          </div>
          <div>
             <label style="font-size: 0.75rem; color: var(--text-secondary);">MULTIPLY BY (OR {{VAR}})</label>
             <input type="text" placeholder="1.2 or {{tax_rate}}" value="${step.action.params.factor || ''}" onchange="WorkflowBuilder.updateStep(${idx}, 'action.params.factor', this.value)" required>
          </div>
        `;
      default: // set_variable
        return `
          <div>
            <label style="font-size: 0.75rem; color: var(--text-secondary);">KEY</label>
            <input type="text" placeholder="status" value="${step.action.params.key || ''}" onchange="WorkflowBuilder.updateStep(${idx}, 'action.params.key', this.value)" required>
          </div>
          <div>
            <label style="font-size: 0.75rem; color: var(--text-secondary);">VALUE</label>
            <input type="text" placeholder="active" value="${step.action.params.value || ''}" onchange="WorkflowBuilder.updateStep(${idx}, 'action.params.value', this.value)" required>
          </div>
        `;
    }
  },

  initListeners() {
    this.steps = [{ condition: { field: '', operator: '==', value: '' }, action: { type: 'set_variable', params: {} } }];
    this.renderSteps();

    document.getElementById('btn-add-step').onclick = () => {
      this.steps.push({ condition: { field: '', operator: '==', value: '' }, action: { type: 'set_variable', params: {} } });
      this.renderSteps();
    };

    const form = document.getElementById('workflow-form');
    form.onsubmit = (e) => {
      e.preventDefault();
      const workflow = {
        name: document.getElementById('w-name').value,
        description: document.getElementById('w-desc').value,
        stopOnFailure: document.getElementById('w-stop-on-failure').checked,
        steps: this.steps
      };
      Storage.addWorkflow(workflow);
      app.showToast('Advanced workflow saved!');
      app.setView('dashboard');
    };
  },

  updateStep(idx, path, value) {
    const parts = path.split('.');
    let target = this.steps[idx];
    for (let i = 0; i < parts.length - 1; i++) {
        target = target[parts[i]];
    }
    target[parts[parts.length - 1]] = value;
    
    // If type changed, re-render to update dynamic params
    if (path === 'action.type') {
        this.renderSteps();
    }
  },

  removeStep(idx) {
    this.steps.splice(idx, 1);
    this.renderSteps();
  }
};

// Expose to window for event handlers
window.WorkflowBuilder = WorkflowBuilder;
