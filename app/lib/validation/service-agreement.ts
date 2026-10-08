import type { ServiceAgreementData } from "@/app/types/service-agreement";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

function isValidDate(value: string): boolean {
  if (!value) {
    return false;
  }

  const date = new Date(`${value}T00:00:00`);

  return !Number.isNaN(date.getTime());
}

function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

function isValidAmount(value: string): boolean {
  if (!value.trim()) {
    return false;
  }

  const amount = Number(value);

  return Number.isFinite(amount) && amount >= 0;
}

export function validateServiceAgreement(
  data: ServiceAgreementData,
): ValidationResult {
  const errors: string[] = [];

  // =========================
  // AGREEMENT
  // =========================

  if (!data.agreementNumber.trim()) {
    errors.push("Agreement Number is required.");
  }

  // =========================
  // CUSTOMER DETAILS
  // =========================

  if (!data.customerName.trim()) {
    errors.push("Customer Name is required.");
  }

  if (!data.customerAge.trim()) {
    errors.push("Customer Age is required.");
  } else {
    const age = Number(data.customerAge);

    if (!Number.isFinite(age) || age < 18 || age > 120) {
      errors.push("Customer Age must be between 18 and 120.");
    }
  }

  if (!data.customerDateOfBirth.trim()) {
    errors.push("Customer Date of Birth is required.");
  } else if (!isValidDate(data.customerDateOfBirth)) {
    errors.push("Customer Date of Birth is invalid.");
  }

  if (!/^\d{4}$/.test(data.customerAadharLastFour)) {
    errors.push("Aadhaar Last 4 Digits must contain exactly 4 digits.");
  }

  if (!data.fullAddressCustomer.trim()) {
    errors.push("Full Residential Address is required.");
  }

  if (!data.customerPhone.trim()) {
    errors.push("Customer Mobile Number is required.");
  } else if (!/^[6-9]\d{9}$/.test(data.customerPhone.trim())) {
    errors.push(
      "Customer Mobile Number must be a valid 10-digit Indian mobile number.",
    );
  }

  if (!data.customerMail.trim()) {
    errors.push("Customer Email Address is required.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customerMail.trim())) {
    errors.push("Customer Email Address is invalid.");
  }

  if (!data.customerPlace.trim()) {
    errors.push("Customer Place is required.");
  }

  if (!data.customerDate.trim()) {
    errors.push("Customer Date is required.");
  } else if (!isValidDate(data.customerDate)) {
    errors.push("Customer Date is invalid.");
  }

  // =========================
  // PAYER DETAILS
  // =========================

  /*
   * payerName is the single logical payer-name
   * input used for both:
   *
   * {Name}
   * {PayerName}
   *
   * Relationship is optional only when no payer
   * information is supplied.
   */

  if (data.payerName.trim() && !data.relationship.trim()) {
    errors.push("Relationship is required when Payer Name is provided.");
  }

  if (!data.payerName.trim() && data.relationship.trim()) {
    errors.push("Payer Name is required when Relationship is provided.");
  }

  // =========================
  // PLAN DETAILS
  // =========================

  if (!data.planName.trim()) {
    errors.push("Plan Name is required.");
  }

  if (!data.planNumber.trim()) {
    errors.push("Plan Number is required.");
  }

  if (!data.issueDate.trim()) {
    errors.push("Issue Date is required.");
  } else if (!isValidDate(data.issueDate)) {
    errors.push("Issue Date is invalid.");
  }

  if (!data.validityDate.trim()) {
    errors.push("Validity Date is required.");
  } else if (!isValidDate(data.validityDate)) {
    errors.push("Validity Date is invalid.");
  }

  if (
    data.issueDate &&
    data.validityDate &&
    isValidDate(data.issueDate) &&
    isValidDate(data.validityDate)
  ) {
    const issueDate = new Date(`${data.issueDate}T00:00:00`);

    const validityDate = new Date(`${data.validityDate}T00:00:00`);

    if (validityDate < issueDate) {
      errors.push("Validity Date cannot be earlier than Issue Date.");
    }
  }

  if (!isValidAmount(data.feesWithoutTax)) {
    errors.push("Fees Without Tax must be a valid amount.");
  }

  if (!isValidAmount(data.tax)) {
    errors.push("Tax must be a valid amount.");
  }

  if (!isValidAmount(data.totalPayable)) {
    errors.push("Total Payable must be a valid amount.");
  }

  // =========================
  // PAYMENT DETAILS
  // =========================

  if (!data.utr.trim()) {
    errors.push("Payment Reference / UTR is required.");
  }

  if (!data.paymentDate.trim()) {
    errors.push("Payment Date is required.");
  } else if (!isValidDate(data.paymentDate)) {
    errors.push("Payment Date is invalid.");
  }

  if (!data.paymentTime.trim()) {
    errors.push("Payment Time is required.");
  } else if (!isValidTime(data.paymentTime)) {
    errors.push("Payment Time is invalid.");
  }

  if (!data.paymentMode.trim()) {
    errors.push("Payment Mode is required.");
  }

  if (!data.payee.trim()) {
    errors.push("Payee is required.");
  }

  // =========================
  // VERIFICATION / AGENT
  // =========================

  if (!data.language.trim()) {
    errors.push("Language of Explanation is required.");
  }

  if (!data.agentName.trim()) {
    errors.push("Agent / Authorized Representative is required.");
  }

  if (!data.callDate.trim()) {
    errors.push("Verification Call Date is required.");
  } else if (!isValidDate(data.callDate)) {
    errors.push("Verification Call Date is invalid.");
  }

  if (!data.callTime.trim()) {
    errors.push("Verification Call Time is required.");
  } else if (!isValidTime(data.callTime)) {
    errors.push("Verification Call Time is invalid.");
  }

  if (!data.verifierName.trim()) {
    errors.push("Verifier Name is required.");
  }

  // =========================
  // ACCEPTANCE
  // =========================

  if (!data.acceptanceDate.trim()) {
    errors.push("Acceptance Date is required.");
  } else if (!isValidDate(data.acceptanceDate)) {
    errors.push("Acceptance Date is invalid.");
  }

  if (!data.acceptanceTime.trim()) {
    errors.push("Acceptance Time is required.");
  } else if (!isValidTime(data.acceptanceTime)) {
    errors.push("Acceptance Time is invalid.");
  }

  // =========================
  // DOCUMENT DELIVERY
  // =========================

  if (data.documentSent !== "Yes" && data.documentSent !== "No") {
    errors.push("Documents Sent must be either Yes or No.");
  }

  if (!data.typeOfSendingPlatform.trim()) {
    errors.push("Type of Sending Platform is required.");
  }

  if (!data.sentDate.trim()) {
    errors.push("Document Sent Date is required.");
  } else if (!isValidDate(data.sentDate)) {
    errors.push("Document Sent Date is invalid.");
  }

  if (!data.sentTime.trim()) {
    errors.push("Document Sent Time is required.");
  } else if (!isValidTime(data.sentTime)) {
    errors.push("Document Sent Time is invalid.");
  }

  // =========================
  // WITNESS DETAILS
  // =========================

  /*
   * Witnesses apply only to Part B (physical execution).
   *
   * They are therefore optional, and are validated for
   * format only when a value has been supplied.
   */

  const witnesses = [
    {
      label: "Witness 1",
      mobile: data.witness1Mobile,
      date: data.witness1Date,
    },
    {
      label: "Witness 2",
      mobile: data.witness2Mobile,
      date: data.witness2Date,
    },
  ];

  for (const witness of witnesses) {
    if (
      witness.mobile.trim() &&
      !/^[6-9]\d{9}$/.test(witness.mobile.trim())
    ) {
      errors.push(
        `${witness.label} Mobile Number must be a valid 10-digit Indian mobile number.`,
      );
    }

    if (witness.date.trim() && !isValidDate(witness.date)) {
      errors.push(`${witness.label} Date is invalid.`);
    }
  }

  // =========================
  // EXECUTION
  // =========================

  if (!data.effectiveDate.trim()) {
    errors.push("Effective Date is required.");
  } else if (!isValidDate(data.effectiveDate)) {
    errors.push("Effective Date is invalid.");
  }

  if (!data.executionDate.trim()) {
    errors.push("Execution / Signing Date is required.");
  } else if (!isValidDate(data.executionDate)) {
    errors.push("Execution / Signing Date is invalid.");
  }

  if (!data.executionTime.trim()) {
    errors.push("Execution / Signing Time is required.");
  } else if (!isValidTime(data.executionTime)) {
    errors.push("Execution / Signing Time is invalid.");
  }

  if (data.executionAmPm !== "AM" && data.executionAmPm !== "PM") {
    errors.push("Execution AM/PM must be either AM or PM.");
  }

  // =========================
  // CURRENT DATE
  // =========================

  if (!data.currentDate.trim()) {
    errors.push("Current / Document Date is required.");
  } else if (!isValidDate(data.currentDate)) {
    errors.push("Current / Document Date is invalid.");
  }

  return {
    isValid: errors.length === 0,

    errors,
  };
}
