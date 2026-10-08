export interface ServiceAgreementData {
  // =========================
  // AGREEMENT
  // =========================

  agreementNumber: string;

  // =========================
  // CUSTOMER DETAILS
  // =========================

  customerName: string;
  customerAge: string;
  customerDateOfBirth: string;
  customerAadharLastFour: string;

  fullAddressCustomer: string;

  customerPhone: string;
  customerMail: string;

  customerPlace: string;
  customerDate: string;

  // =========================
  // PAYER DETAILS
  // =========================

  payerName: string;
  relationship: string;

  // =========================
  // PLAN DETAILS
  // =========================

  planName: string;
  planNumber: string;

  issueDate: string;
  validityDate: string;

  feesWithoutTax: string;
  tax: string;
  totalPayable: string;

  // =========================
  // PAYMENT DETAILS
  // =========================

  utr: string;
  paymentDate: string;
  paymentTime: string;
  paymentMode: string;
  payee: string;

  // =========================
  // VERIFICATION / AGENT
  // =========================

  language: string;
  agentName: string;

  callDate: string;
  callTime: string;

  verifierName: string;

  // =========================
  // ACCEPTANCE
  // =========================

  acceptanceDate: string;
  acceptanceTime: string;

  // =========================
  // DOCUMENT DELIVERY
  // =========================

  documentSent: string;
  sentDate: string;
  sentTime: string;
  typeOfSendingPlatform: string;

  // =========================
  // WITNESS DETAILS (Part B - physical execution only)
  // =========================

  witness1Name: string;
  witness1Address: string;
  witness1Mobile: string;
  witness1Date: string;

  witness2Name: string;
  witness2Address: string;
  witness2Mobile: string;
  witness2Date: string;

  // =========================
  // EXECUTION
  // =========================

  effectiveDate: string;

  executionDate: string;
  executionTime: string;
  executionAmPm: string;

  currentDate: string;
}
