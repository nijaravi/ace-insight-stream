import { Department, KpiData, KpiTableData, Alert } from "@/types/kpi";

export const mockDepartments: Department[] = [
  {
    id: "1",
    name: "Risk Management",
    description: "Managing and monitoring risk indicators",
    icon: "ShieldCheck",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    id: "2", 
    name: "Operations",
    description: "Operational efficiency and process monitoring",
    icon: "Settings",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    id: "3",
    name: "Finance",
    description: "Financial performance and compliance tracking",
    icon: "DollarSign",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    id: "4",
    name: "IT Security",
    description: "Information security and technology risk",
    icon: "Shield",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  }
];

export const mockKpis: KpiData[] = [
  {
    id: "kpi-1",
    name: "Credit Risk Threshold",
    domain: "Risk",
    description: "Monitor credit risk exposure exceeding threshold limits",
    alert_table_name: "credit_risk_alerts",
    default_email_to: ["risk.manager@adib.ae", "compliance@adib.ae"],
    default_email_cc: ["cro@adib.ae"],
    default_subject: "Credit Risk Alert - Threshold Exceeded",
    default_body: "A credit risk threshold has been exceeded. Please review the attached details and take necessary action.",
    default_footer: "This is an automated alert from ADIB Risk Management System.",
    is_favorite: true,
    identifier: "CR001",
    severity_tagging: true,
    owner_department_id: "1",
    icon: "AlertTriangle",
    severity: "High",
    status: "Active",
    is_automation_enabled: true,
    automation_time: "09:00",
    ai_prompt: "Analyze the credit risk data and provide insights on exposure levels and recommended actions.",
    is_active: true,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    id: "kpi-2",
    name: "Liquidity Ratio Monitor",
    domain: "Finance",
    description: "Track bank liquidity ratios against regulatory requirements",
    alert_table_name: "liquidity_alerts", 
    default_email_to: ["treasury@adib.ae", "finance@adib.ae"],
    default_email_cc: ["cfo@adib.ae"],
    default_subject: "Liquidity Ratio Alert",
    default_body: "Bank liquidity ratio has fallen below the required threshold. Immediate attention required.",
    default_footer: "ADIB Treasury Management System",
    is_favorite: false,
    identifier: "LR002",
    severity_tagging: true,
    owner_department_id: "3",
    icon: "TrendingDown",
    severity: "Medium",
    status: "Active",
    is_automation_enabled: true,
    automation_time: "10:30",
    ai_prompt: "Review liquidity position and suggest optimal cash management strategies.",
    is_active: true,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    id: "kpi-3",
    name: "Transaction Volume Anomaly",
    domain: "Operations",
    description: "Detect unusual patterns in daily transaction volumes",
    alert_table_name: "transaction_alerts",
    default_email_to: ["operations@adib.ae", "fraud@adib.ae"],
    default_email_cc: ["head.operations@adib.ae"],
    default_subject: "Transaction Volume Anomaly Detected",
    default_body: "Unusual transaction volume pattern detected. Please investigate for potential fraud or system issues.",
    default_footer: "ADIB Operations Monitoring System",
    is_favorite: true,
    identifier: "TV003",
    severity_tagging: true,
    owner_department_id: "2",
    icon: "Activity",
    severity: "High",
    status: "Active",
    is_automation_enabled: false,
    automation_time: null,
    ai_prompt: "Analyze transaction patterns and identify potential causes for volume anomalies.",
    is_active: true,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    id: "kpi-4",
    name: "Cybersecurity Threat Level",
    domain: "IT Security",
    description: "Monitor cybersecurity threats and system vulnerabilities",
    alert_table_name: "security_alerts",
    default_email_to: ["security@adib.ae", "it@adib.ae"],
    default_email_cc: ["ciso@adib.ae"],
    default_subject: "Cybersecurity Threat Alert",
    default_body: "Elevated cybersecurity threat level detected. Please review security measures and implement necessary controls.",
    default_footer: "ADIB Information Security Team",
    is_favorite: false,
    identifier: "CS004",
    severity_tagging: true,
    owner_department_id: "4",
    icon: "Shield",
    severity: "Critical",
    status: "Active",
    is_automation_enabled: true,
    automation_time: "24/7",
    ai_prompt: "Assess cybersecurity threats and recommend immediate response actions.",
    is_active: true,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    id: "kpi-5",
    name: "Capital Adequacy Ratio",
    domain: "Risk",
    description: "Monitor capital adequacy ratio compliance with Basel III requirements",
    alert_table_name: "capital_alerts",
    default_email_to: ["risk.manager@adib.ae", "finance@adib.ae"],
    default_email_cc: ["ceo@adib.ae"],
    default_subject: "Capital Adequacy Alert",
    default_body: "Capital adequacy ratio requires attention to maintain regulatory compliance.",
    default_footer: "ADIB Risk & Finance Management",
    is_favorite: true,
    identifier: "CAR005",
    severity_tagging: true,
    owner_department_id: "1",
    icon: "PieChart",
    severity: "Medium",
    status: "Active",
    is_automation_enabled: true,
    automation_time: "16:00",
    ai_prompt: "Analyze capital position and recommend strategies to optimize capital adequacy ratio.",
    is_active: true,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  }
];

export const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    alert_id: "CR001-240115-001",
    kpi_id: "kpi-1",
    department_id: "1",
    alert_detail: "Credit exposure for Corporate Banking portfolio has exceeded 85% of the approved limit. Current exposure: AED 2.1B vs Limit: AED 2.5B",
    alert_date: "2024-01-15T14:30:00Z",
    severity: "High",
    status: "pending",
    comment: null,
    curated_date: null,
    sent_date: null,
    created_at: "2024-01-15T14:30:00Z"
  },
  {
    id: "alert-2",
    alert_id: "LR002-240115-002",
    kpi_id: "kpi-2",
    department_id: "3",
    alert_detail: "Liquidity Coverage Ratio has dropped to 98.5%, approaching the minimum regulatory requirement of 100%",
    alert_date: "2024-01-15T10:15:00Z",
    severity: "Medium",
    status: "curated",
    comment: "Treasury team has been notified and is taking corrective measures",
    curated_date: "2024-01-15T11:00:00Z",
    sent_date: null,
    created_at: "2024-01-15T10:15:00Z"
  },
  {
    id: "alert-3",
    alert_id: "TV003-240115-003",
    kpi_id: "kpi-3",
    department_id: "2",
    alert_detail: "Daily transaction volume is 45% higher than the 30-day average. Total transactions: 156,789 vs Average: 108,432",
    alert_date: "2024-01-15T16:45:00Z",
    severity: "High",
    status: "sent",
    comment: "Investigated - increase due to end-of-month salary payments and bonus distributions",
    curated_date: "2024-01-15T17:15:00Z",
    sent_date: "2024-01-15T17:30:00Z",
    created_at: "2024-01-15T16:45:00Z"
  },
  {
    id: "alert-4",
    alert_id: "CS004-240115-004",
    kpi_id: "kpi-4",
    department_id: "4",
    alert_detail: "Multiple failed login attempts detected from suspicious IP addresses. 247 failed attempts in the last hour from 15 different IPs",
    alert_date: "2024-01-15T12:20:00Z",
    severity: "Critical",
    status: "sent",
    comment: "Security team has blocked the IP addresses and enhanced monitoring is in place",
    curated_date: "2024-01-15T12:25:00Z",
    sent_date: "2024-01-15T12:30:00Z",
    created_at: "2024-01-15T12:20:00Z"
  },
  {
    id: "alert-5",
    alert_id: "CAR005-240114-001",
    kpi_id: "kpi-5",
    department_id: "1",
    alert_detail: "Capital Adequacy Ratio has decreased to 12.8%, still above minimum requirement but trending downward",
    alert_date: "2024-01-14T16:00:00Z",
    severity: "Medium",
    status: "curated",
    comment: "Finance team is reviewing capital optimization strategies",
    curated_date: "2024-01-14T16:30:00Z",
    sent_date: null,
    created_at: "2024-01-14T16:00:00Z"
  },
  {
    id: "alert-6",
    alert_id: "CR001-240114-002",
    kpi_id: "kpi-1",
    department_id: "1",
    alert_detail: "Retail Banking credit risk concentration in real estate sector has increased to 35% of total portfolio",
    alert_date: "2024-01-14T09:30:00Z",
    severity: "Medium",
    status: "pending",
    comment: null,
    curated_date: null,
    sent_date: null,
    created_at: "2024-01-14T09:30:00Z"
  }
];

// Helper function to generate KPI table data with enriched information
export const generateKpiTableData = (): KpiTableData[] => {
  return mockKpis.map(kpi => {
    const department = mockDepartments.find(d => d.id === kpi.owner_department_id);
    const kpiAlerts = mockAlerts.filter(alert => alert.kpi_id === kpi.id);
    
    // Calculate alerts this month (for demo, using all alerts)
    const currentMonth = new Date().getMonth();
    const alertsThisMonth = kpiAlerts.filter(alert => {
      const alertMonth = new Date(alert.alert_date).getMonth();
      return alertMonth === currentMonth;
    }).length;

    // Get last alert sent date
    const sentAlerts = kpiAlerts.filter(alert => alert.sent_date);
    const lastAlertSent = sentAlerts.length > 0 
      ? sentAlerts.sort((a, b) => new Date(b.sent_date!).getTime() - new Date(a.sent_date!).getTime())[0].sent_date
      : undefined;

    return {
      id: kpi.id,
      name: kpi.name,
      domain: kpi.domain,
      description: kpi.description || '',
      alert_table_name: kpi.alert_table_name,
      default_email_to: kpi.default_email_to,
      default_email_cc: kpi.default_email_cc,
      default_subject: kpi.default_subject,
      default_body: kpi.default_body,
      default_footer: kpi.default_footer,
      ai_prompt: kpi.ai_prompt,
      last_alert_sent: lastAlertSent,
      alerts_this_month: alertsThisMonth,
      is_active: kpi.is_active,
      owner_department_id: kpi.owner_department_id,
      department
    };
  });
};