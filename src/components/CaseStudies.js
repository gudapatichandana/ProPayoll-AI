import { Icons } from '../assets/icons';

export const CaseStudies = {
  render() {
    return `
      <div class="animate-view">
        <div style="margin-bottom: 2.5rem;">
          <h2 class="title-font" style="font-size: 1.875rem;">Client Case Study</h2>
          <p class="text-secondary">Scenario: Dynamic Taxation Pipeline for High-Earners</p>
        </div>

        <div class="grid" style="grid-template-columns: 1fr 1fr;">
          <!-- Left: Requirement -->
          <div class="glass" style="padding: 2rem;">
            <h4 style="color: var(--primary); margin-bottom: 1rem; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">Requirement</h4>
            <div style="background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 8px; border: 1px dashed var(--primary);">
              <p style="font-style: italic; line-height: 1.6;">
                "Admin wants to automate a 10% tax deduction specifically for employees in the **India** region who earn above **₹40,000** monthly. Employees below this threshold should only be taxed at 5%."
              </p>
            </div>
            
            <h4 style="color: var(--primary); margin-top: 2rem; margin-bottom: 1rem; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">Logic Configuration</h4>
            <div class="glass" style="padding: 1rem; background: rgba(15, 23, 42, 0.8); font-family: monospace; font-size: 0.8rem;">
              <pre style="color: #a5b4fc;">
{
  "condition": {
    "field": "region",
    "operator": "==",
    "value": "INDIA"
  },
  "action": {
    "type": "calculate_tax_india",
    "params": { "threshold": 40000 }
  }
}</pre>
            </div>
          </div>

          <!-- Right: Interactive Execution -->
          <div class="glass" style="padding: 2rem;">
            <h4 style="color: var(--accent); margin-bottom: 1rem; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">Execution Result</h4>
            
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div style="background: rgba(16, 185, 129, 0.05); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--accent);">
                <div class="flex-between" style="margin-bottom: 1rem;">
                   <span style="font-weight: 700;">Employee: Alex (India)</span>
                   <span class="status-pill status-success">Success</span>
                </div>
                <p class="text-secondary" style="font-size: 0.85rem;">Input Salary: ₹75,000</p>
                <p style="color: var(--accent); font-weight: 800; font-size: 1.25rem; margin: 0.5rem 0;">Net Pay: ₹58,500</p>
                <p class="text-secondary" style="font-size: 0.75rem;">Calculation: 75k - (10% Tax + 12% PF)</p>
              </div>

              <div style="background: rgba(239, 68, 68, 0.05); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--danger);">
                <div class="flex-between" style="margin-bottom: 1rem;">
                   <span style="font-weight: 700;">Employee: Blake (Global)</span>
                   <span class="status-pill status-error">Logic Skipped</span>
                </div>
                <p class="text-secondary" style="font-size: 0.85rem;">Input Region: "US"</p>
                <p style="color: var(--text-secondary); font-weight: 800; font-size: 1.25rem; margin: 0.5rem 0;">Net Pay: $65,000</p>
                <p class="text-secondary" style="font-size: 0.75rem;">Reason: Condition (Region == INDIA) failed. Logic layer terminated skip sequence.</p>
              </div>
            </div>

            <button class="btn btn-primary" style="width: 100%; margin-top: 2rem;" onclick="app.setView('builder')">
              Configure Similar Rule
            </button>
          </div>
        </div>
      </div>
    `;
  }
};
