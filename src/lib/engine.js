/**
 * ProPayroll Engine v2.0 - Enterprise Logic Layer
 * Features: Granular Error Codes, Advanced Validation, and Support Audit Logs.
 */

export class RuleEngine {
  constructor() {
    this.operators = {
      '==': (a, b) => a == b,
      '!=': (a, b) => a != b,
      '>': (a, b) => Number(a) > Number(b),
      '<': (a, b) => Number(a) < Number(b),
      '>=': (a, b) => Number(a) >= Number(b),
      '<=': (a, b) => Number(a) <= Number(b),
      'contains': (a, b) => String(a).toLowerCase().includes(String(b).toLowerCase()),
    };
    
    this.ERROR_CODES = {
      E001: 'ERR_VAL_MISSING_DATA: Mandatory payroll field is missing.',
      E002: 'ERR_VAL_NEGATIVE_INPUT: Numeric fields cannot be negative.',
      E003: 'ERR_COMPLIANCE_REGION: Region mismatch or unsupported region.',
      E004: 'ERR_RUNTIME_MATH: Calculation error occurred during processing.'
    };
  }

  validate(state) {
    const required = ['salary', 'employee_id', 'region'];
    const missing = required.filter(key => state[key] === undefined || state[key] === '');
    
    if (missing.length > 0) {
      return { 
        valid: false, 
        code: 'E001', 
        message: `${this.ERROR_CODES.E001} Fields: ${missing.join(', ')}` 
      };
    }

    if (Number(state.salary) < 0) {
      return { 
        valid: false, 
        code: 'E002', 
        message: this.ERROR_CODES.E002 
      };
    }

    return { valid: true };
  }

  injectVariables(text, state) {
    if (typeof text !== 'string') return text;
    return text.replace(/\{\{(.*?)\}\}/g, (match, key) => {
      const trimmedKey = key.trim();
      return state[trimmedKey] !== undefined ? state[trimmedKey] : match;
    });
  }

  async executeAction(action, state) {
    const { type, params } = action;
    const newState = { ...state };
    const logs = [];

    try {
      switch (type) {
        case 'calculate_tax_india': {
          const salary = Number(state.salary);
          // Specialized Client Logic: 10% tax if salary > 500,000 (annualized simulator)
          // For monthly demo: 10% if salary > 40,000
          const threshold = 40000;
          const taxRate = salary > threshold ? 0.10 : 0.05;
          
          const tds = salary * taxRate;
          const pf = salary * 0.12;
          
          newState.tds_deduction = tds;
          newState.pf_contribution = pf;
          newState.net_pay = (newState.net_pay || salary) - (tds + pf);
          
          logs.push(`[COMPLIANCE] Region: INDIA. Applied ${taxRate*100}% withholding based on ₹${threshold} threshold.`);
          logs.push(`[AUDIT] Deductions Total: ₹${tds + pf}`);
          break;
        }

        case 'calculate_tax_us': {
          const salary = Number(state.salary);
          const federal = salary * 0.22;
          const fica = salary * 0.0765;
          newState.federal_tax = federal;
          newState.fica_tax = fica;
          newState.net_pay = (newState.net_pay || salary) - (federal + fica);
          logs.push(`[COMPLIANCE] Region: USA. Federal (22%) + FICA (7.65%) applied.`);
          break;
        }

        case 'apply_bonus': {
          const salary = Number(state.salary);
          const percent = Number(params.percentage || 0);
          const bonus = salary * (percent / 100);
          newState.bonus_amount = bonus;
          newState.net_pay = (newState.net_pay || salary) + bonus;
          logs.push(`[ACTION] Bonus calculated at ${percent}%. Added: $${bonus}`);
          break;
        }

        case 'set_variable':
          newState[params.key] = this.injectVariables(params.value, state);
          logs.push(`[SYSTEM] Variable set: ${params.key} = ${newState[params.key]}`);
          break;

        default:
          logs.push(`[WARN] Action type "${type}" not explicitly mapped in this logic layer.`);
      }
    } catch (err) {
      return { 
        error: true, 
        code: 'E004', 
        message: `${this.ERROR_CODES.E004} Details: ${err.message}` 
      };
    }

    return { newState, logs };
  }

  async run(workflow, initialState) {
    let currentState = { ...initialState, net_pay: Number(initialState.salary || 0) };
    const executionLogs = [];
    const timestamp = new Date().toLocaleString();
    
    // 1. Mandatory Validation Layer (Support Scenario)
    const validation = this.validate(currentState);
    if (!validation.valid) {
      executionLogs.push(`[CRITICAL] ${validation.message}`);
      return { success: false, logs: executionLogs, timestamp, finalState: currentState, errorCode: validation.code };
    }

    executionLogs.push(`[INIT] Starting Run: ${workflow.name} for ProPayroll Run`);

    const steps = workflow.steps || [];

    for (const [index, step] of steps.entries()) {
      const { field, operator, value } = step.condition;
      const fieldValue = currentState[field];
      
      const isMet = this.operators[operator](fieldValue, this.injectVariables(String(value), currentState));
      
      if (isMet) {
        const result = await this.executeAction(step.action, currentState);
        
        if (result.error) {
          executionLogs.push(`[FAILURE] Step ${index + 1}: ${result.message}`);
          return { success: false, finalState: currentState, logs: executionLogs, timestamp, errorCode: result.code };
        }
        
        currentState = result.newState;
        executionLogs.push(...result.logs.map(l => `[SUCCESS] ${l}`));
      } else {
        executionLogs.push(`[INFO] Step ${index + 1} skipped: condition not met (${field} ${operator} ${value}).`);
        if (workflow.stopOnFailure) {
          executionLogs.push(`[TERMINATED] Match All requirement failed. Halted at step ${index + 1}.`);
          return { success: false, finalState: currentState, logs: executionLogs, timestamp };
        }
      }
    }

    executionLogs.push(`[FINISH] Logic processing complete for ID: ${currentState.employee_id}`);

    return {
      success: true,
      finalState: currentState,
      logs: executionLogs,
      timestamp
    };
  }
}
