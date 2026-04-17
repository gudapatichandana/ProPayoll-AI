/**
 * ProPayroll Storage & Compliance Templates
 */

const STORAGE_KEYS = {
  WORKFLOWS: 'pp_workflows',
  LOGS: 'pp_analytics'
};

const DEFAULT_WORKFLOWS = [
  {
    id: 'client-case-india',
    name: '[DEMO] Client Scenario: India Tax Threshold',
    description: 'Specialized 10% tax rule for employees earning > ₹40,000. Features dynamic threshold logic.',
    stopOnFailure: false,
    steps: [
      {
        condition: { field: 'region', operator: '==', value: 'INDIA' },
        action: { type: 'calculate_tax_india', params: {} }
      }
    ]
  },
  {
    id: 'troubleshoot-missing',
    name: '[ERROR] Failure Case: Incomplete Data',
    description: 'Designed to demonstrate the ProPayroll Logic Layer validation. Triggers ERR_VAL_MISSING_DATA.',
    stopOnFailure: true,
    steps: [
      {
        condition: { field: 'employee_id', operator: '!=', value: '' },
        action: { type: 'calculate_tax_us', params: {} }
      }
    ]
  },
  {
    id: 'uk-compliance',
    name: 'UK: Master PAYE Pipeline',
    description: 'Standard UK PAYE tax and National Insurance calculations for London client.',
    stopOnFailure: true,
    steps: [
      {
        condition: { field: 'region', operator: '==', value: 'UK' },
        action: { type: 'calculate_tax_uk', params: {} }
      }
    ]
  }
];

export const Storage = {
  getWorkflows() {
    const data = localStorage.getItem(STORAGE_KEYS.WORKFLOWS);
    if (!data) {
      this.saveWorkflows(DEFAULT_WORKFLOWS);
      return DEFAULT_WORKFLOWS;
    }
    return JSON.parse(data);
  },

  saveWorkflows(workflows) {
    localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(workflows));
  },

  addWorkflow(workflow) {
    const workflows = this.getWorkflows();
    workflows.unshift({ ...workflow, id: Date.now().toString() });
    this.saveWorkflows(workflows);
  },

  deleteWorkflow(id) {
    const workflows = this.getWorkflows().filter(w => w.id !== id);
    this.saveWorkflows(workflows);
  },

  getLogs() {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  },

  saveLog(workflowId, result) {
    const logs = this.getLogs();
    logs.unshift({ ...result, workflowId });
    if (logs.length > 100) logs.pop();
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  },

  clearLogs() {
    localStorage.removeItem(STORAGE_KEYS.LOGS);
  }
};
