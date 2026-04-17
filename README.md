# 🏢 ProPayroll AI | Global Automation Simulator

**ProPayroll AI** is a premium, enterprise-grade payroll automation and compliance orchestration platform. It is designed to simulate complex financial workflows across global jurisdictions, enabling organizations to define, test, and audit payroll logic with a "Support-First" mindset.

![Version](https://img.shields.io/badge/version-1.0.4--premium-emerald)
![License](https://img.shields.io/badge/domain-Global%20FinTech-blue)
![Stack](https://img.shields.io/badge/stack-JS%20|%20Vite%20|%20CSS3-orange)

---

## 🚀 Key Features

### 🌍 Global Compliance Engine
Advanced rule-based logic for multiple regions:
*   **India**: Automated TDS (10%/5% thresholds) and PF (12%) handlers.
*   **USA**: Federal Withholding (22%) and FICA (7.65%) pipelines.
*   **UK**: Specialized PAYE and National Insurance (NI) compliance templates.

### 🛡 Enterprise Security & RBAC
Role-Based Access Control (RBAC) simulation for enterprise security audits:
*   **Super Admin**: Full orchestration and system configuration.
*   **Support Level 1**: Restricted troubleshooting mode for reproducing client issues.
*   **Client Auditor**: Read-only access for compliance verification and data extraction.

### 🔍 Intelligence & Troubleshooting
Built for high-stakes financial environments where errors are costly:
*   **Granular Error Codes**: Identifies failures with specific codes (e.g., `E001: Missing Data`, `E002: Validation Failure`).
*   **Audit Trail**: Timestamped technical logs describing every variable mutation and logic branch.
*   **System Resilience**: Mandatory validation layer prevents processing of malformed employee metadata.

### 📊 Data Analytics & Portability
*   **SQL-Style Grid**: Real-time filtering and search for deep-dive financial analysis.
*   **CSV Connectivity**: Export results directly to Excel for external auditing.
*   **JSON Portability**: Import/Export system-wide configurations as structured JSON (Infrastructure as Code).

---

## 🎨 Premium UX Experience
*   **Aesthetics**: Sleek Dark Mode with Glassmorphism and Mesh Gradients.
*   **Motion**: Smooth asynchronous view transitions and liquid loading states.
*   **Architecture**: Decoupled Logic Engine separated from the View Layer for modular scalability.

---

## 🛠 Tech Stack
*   **Core**: Javascript (ES6+ Module-based)
*   **Build**: Vite 
*   **Styling**: Custom CSS3 Variable System (no external UI libs)
*   **Storage**: Browser Persistence API (LocalStorage)

---

## 🏃 Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Run Locally
Start the development server:
```bash
npm run dev
```

### 3. Build for Production
Generate the production-ready bundle:
```bash
npm run build
```

---

## 💡 Developer Perspective (Interview Focus)
This project was built to demonstrate **Product Thinking** beyond simple coding. It addresses:
1.  **System Reliability**: How the app handles "Bad Data" via the Validation Layer.
2.  **User Personas**: How features are restricted based on Role (RBAC).
3.  **Domain Expertise**: Implementing actual regional tax laws instead of generic arithmetic.

---

**Designed & Developed for High-Level Financial Placements.**
