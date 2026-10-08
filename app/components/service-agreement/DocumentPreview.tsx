"use client";

import type { ReactNode } from "react";

import type { ServiceAgreementData } from "@/app/types/service-agreement";

interface DocumentPreviewProps {
  data: ServiceAgreementData;
  pdfUrl: string | null;
  isGenerating?: boolean;
  isDownloaded?: boolean;
  onBackToEdit: () => void;
  onConfirmAndDownload: () => void;
}

interface ReviewField {
  key: string;
  label: string;
  value: string;
  format?: "date" | "time";
}

interface ReviewSection {
  number: string;
  title: string;
  fields: ReviewField[];
}

interface PreviewFieldProps {
  label: string;
  value: string;
  emphasis?: "default" | "strong" | "total";
}

interface SectionProps {
  number: string;
  title: string;
  description?: string;
  children: ReactNode;
}

function formatDate(value: string): string {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-");

  if (year && month && day) {
    return `${day}/${month}/${year}`;
  }

  return value;
}

function formatTime(value: string): string {
  if (!value) {
    return "";
  }

  const [hours, minutes] = value.split(":");

  if (!hours || !minutes) {
    return value;
  }

  const hourNumber = Number(hours);

  if (Number.isNaN(hourNumber)) {
    return value;
  }

  const period = hourNumber >= 12 ? "PM" : "AM";
  const hour12 = hourNumber % 12 || 12;

  return `${String(hour12).padStart(2, "0")}:${minutes} ${period}`;
}

function displayValue(value: string): string {
  return value?.trim() || "—";
}

function getFieldValue(field: ReviewField): string {
  if (field.format === "date") {
    return formatDate(field.value);
  }

  if (field.format === "time") {
    return formatTime(field.value);
  }

  return field.value;
}

function PreviewField({
  label,
  value,
  emphasis = "default",
}: PreviewFieldProps) {
  const display = displayValue(value);

  const valueClassName =
    emphasis === "total"
      ? "text-lg font-bold text-emerald-700"
      : emphasis === "strong"
        ? "text-sm font-semibold text-gray-950"
        : "text-sm font-medium text-gray-900";

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 transition-colors hover:border-gray-300 hover:bg-gray-100">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">
        {label}
      </p>

      <p className={`break-words ${valueClassName}`}>{display}</p>
    </div>
  );
}

function PreviewSection({
  number,
  title,
  description,
  children,
}: SectionProps) {
  return (
    <section className="border-t border-gray-200 pt-6">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
          {number}
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>

          {description ? (
            <p className="mt-0.5 text-xs text-gray-500">{description}</p>
          ) : null}
        </div>
      </div>

      {children}
    </section>
  );
}

function getReviewSections(data: ServiceAgreementData): ReviewSection[] {
  return [
    {
      number: "01",
      title: "Agreement & Customer",
      fields: [
        {
          key: "agreementNumber",
          label: "Agreement Number",
          value: data.agreementNumber,
        },
        {
          key: "customerName",
          label: "Customer Name",
          value: data.customerName,
        },
        {
          key: "customerAge",
          label: "Customer Age",
          value: data.customerAge,
        },
        {
          key: "customerDateOfBirth",
          label: "Date of Birth",
          value: data.customerDateOfBirth,
          format: "date",
        },
        {
          key: "customerAadharLastFour",
          label: "Aadhaar Last 4 Digits",
          value: data.customerAadharLastFour,
        },
        {
          key: "fullAddressCustomer",
          label: "Full Residential Address",
          value: data.fullAddressCustomer,
        },
        {
          key: "customerPhone",
          label: "Customer Phone",
          value: data.customerPhone,
        },
        {
          key: "customerMail",
          label: "Customer Email",
          value: data.customerMail,
        },
        {
          key: "customerPlace",
          label: "Customer Place",
          value: data.customerPlace,
        },
        {
          key: "customerDate",
          label: "Customer Date",
          value: data.customerDate,
          format: "date",
        },
      ],
    },
    {
      number: "02",
      title: "Payer Details",
      fields: [
        {
          key: "payerName",
          label: "Payer Name",
          value: data.payerName,
        },
        {
          key: "relationship",
          label: "Relationship",
          value: data.relationship,
        },
      ],
    },
    {
      number: "03",
      title: "Plan Details",
      fields: [
        {
          key: "planName",
          label: "Plan Name",
          value: data.planName,
        },
        {
          key: "planNumber",
          label: "Plan Number",
          value: data.planNumber,
        },
        {
          key: "issueDate",
          label: "Issue Date",
          value: data.issueDate,
          format: "date",
        },
        {
          key: "validityDate",
          label: "Validity Date",
          value: data.validityDate,
          format: "date",
        },
        {
          key: "feesWithoutTax",
          label: "Fees Without Tax",
          value: data.feesWithoutTax,
        },
        {
          key: "tax",
          label: "Tax",
          value: data.tax,
        },
        {
          key: "totalPayable",
          label: "Total Payable",
          value: data.totalPayable,
        },
      ],
    },
    {
      number: "04",
      title: "Payment Details",
      fields: [
        {
          key: "utr",
          label: "Payment Reference / UTR",
          value: data.utr,
        },
        {
          key: "paymentDate",
          label: "Payment Date",
          value: data.paymentDate,
          format: "date",
        },
        {
          key: "paymentTime",
          label: "Payment Time",
          value: data.paymentTime,
          format: "time",
        },
        {
          key: "paymentMode",
          label: "Payment Mode",
          value: data.paymentMode,
        },
        {
          key: "payee",
          label: "Payee",
          value: data.payee,
        },
      ],
    },
    {
      number: "05",
      title: "Verification & Agent",
      fields: [
        {
          key: "language",
          label: "Language",
          value: data.language,
        },
        {
          key: "agentName",
          label: "Agent Name",
          value: data.agentName,
        },
        {
          key: "callDate",
          label: "Call Date",
          value: data.callDate,
          format: "date",
        },
        {
          key: "callTime",
          label: "Call Time",
          value: data.callTime,
          format: "time",
        },
        {
          key: "verifierName",
          label: "Verifier Name",
          value: data.verifierName,
        },
      ],
    },
    {
      number: "06",
      title: "Acceptance",
      fields: [
        {
          key: "acceptanceDate",
          label: "Acceptance Date",
          value: data.acceptanceDate,
          format: "date",
        },
        {
          key: "acceptanceTime",
          label: "Acceptance Time",
          value: data.acceptanceTime,
          format: "time",
        },
      ],
    },
    {
      number: "07",
      title: "Document Delivery",
      fields: [
        {
          key: "documentSent",
          label: "Documents Sent",
          value: data.documentSent,
        },
        {
          key: "sentDate",
          label: "Sent Date",
          value: data.sentDate,
          format: "date",
        },
        {
          key: "sentTime",
          label: "Sent Time",
          value: data.sentTime,
          format: "time",
        },
        {
          key: "typeOfSendingPlatform",
          label: "Sending Platform",
          value: data.typeOfSendingPlatform,
        },
      ],
    },
    {
      number: "08",
      title: "Witness Details",
      fields: [
        {
          key: "witness1Name",
          label: "Witness 1 Name",
          value: data.witness1Name,
        },
        {
          key: "witness1Address",
          label: "Witness 1 Address",
          value: data.witness1Address,
        },
        {
          key: "witness1Mobile",
          label: "Witness 1 Mobile",
          value: data.witness1Mobile,
        },
        {
          key: "witness1Date",
          label: "Witness 1 Date",
          value: data.witness1Date,
          format: "date",
        },
        {
          key: "witness2Name",
          label: "Witness 2 Name",
          value: data.witness2Name,
        },
        {
          key: "witness2Address",
          label: "Witness 2 Address",
          value: data.witness2Address,
        },
        {
          key: "witness2Mobile",
          label: "Witness 2 Mobile",
          value: data.witness2Mobile,
        },
        {
          key: "witness2Date",
          label: "Witness 2 Date",
          value: data.witness2Date,
          format: "date",
        },
      ],
    },
    {
      number: "09",
      title: "Execution Details",
      fields: [
        {
          key: "effectiveDate",
          label: "Effective Date",
          value: data.effectiveDate,
          format: "date",
        },
        {
          key: "executionDate",
          label: "Execution Date",
          value: data.executionDate,
          format: "date",
        },
        {
          key: "executionTime",
          label: "Execution Time",
          value: data.executionTime,
          format: "time",
        },
        {
          key: "executionAmPm",
          label: "AM / PM",
          value: data.executionAmPm,
        },
        {
          key: "currentDate",
          label: "Current / Document Date",
          value: data.currentDate,
          format: "date",
        },
      ],
    },
  ];
}

function getCompletionStatus(data: ServiceAgreementData) {
  const sections = getReviewSections(data);
  const fields = sections.flatMap((section) => section.fields);

  const completed = fields.filter((field) =>
    Boolean(field.value?.trim()),
  ).length;

  return {
    completed,
    total: fields.length,
    remaining: fields.length - completed,
    isComplete: completed === fields.length,
  };
}

function ReviewStatusPanel({
  data,
}: {
  data: ServiceAgreementData;
}) {
  const sections = getReviewSections(data);
  const status = getCompletionStatus(data);

  const completionPercentage =
    status.total > 0
      ? Math.round((status.completed / status.total) * 100)
      : 0;

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Review Header */}
      <div className="shrink-0 border-b border-gray-200 bg-gradient-to-r from-white to-emerald-50/50 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
              Form Review
            </p>

            <h3 className="mt-1 text-lg font-bold text-gray-950">
              Filled Information
            </h3>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Check what has been filled and what is still remaining.
            </p>
          </div>

          <div
            className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full ${
              status.isComplete
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            <span className="text-sm font-bold">
              {status.completed}/{status.total}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500">
              Completion
            </span>

            <span className="text-[11px] font-bold text-gray-700">
              {completionPercentage}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full transition-all ${
                status.isComplete ? "bg-emerald-600" : "bg-amber-500"
              }`}
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <div className="flex-1 rounded-lg bg-emerald-50 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase text-emerald-600">
              Filled
            </p>

            <p className="mt-0.5 text-sm font-bold text-emerald-800">
              {status.completed}
            </p>
          </div>

          <div className="flex-1 rounded-lg bg-amber-50 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase text-amber-600">
              Remaining
            </p>

            <p className="mt-0.5 text-sm font-bold text-amber-800">
              {status.remaining}
            </p>
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="space-y-5">
          {sections.map((section) => {
            const completedCount = section.fields.filter((field) =>
              Boolean(field.value?.trim()),
            ).length;

            const sectionComplete =
              completedCount === section.fields.length;

            return (
              <div key={section.number}>
                {/* Section title */}
                <div className="mb-2.5 flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        sectionComplete
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {section.number}
                    </span>

                    <h4 className="truncate text-xs font-bold text-gray-900">
                      {section.title}
                    </h4>
                  </div>

                  <span
                    className={`shrink-0 text-[10px] font-semibold ${
                      sectionComplete
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    {completedCount}/{section.fields.length}
                  </span>
                </div>

                {/* Fields */}
                <div className="space-y-1.5">
                  {section.fields.map((field) => {
                    const filled = Boolean(field.value?.trim());
                    const value = getFieldValue(field);

                    return (
                      <div
                        key={field.key}
                        className={`rounded-lg border px-3 py-2.5 ${
                          filled
                            ? "border-emerald-100 bg-emerald-50/50"
                            : "border-amber-100 bg-amber-50/60"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                              filled
                                ? "bg-emerald-600 text-white"
                                : "bg-amber-500 text-white"
                            }`}
                          >
                            {filled ? "✓" : "!"}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                              {field.label}
                            </p>

                            <p
                              className={`mt-0.5 break-words text-xs ${
                                filled
                                  ? "font-medium text-gray-900"
                                  : "font-medium text-amber-700"
                              }`}
                            >
                              {filled ? value : "Not filled"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default function DocumentPreview({
  data,
  pdfUrl,
  isGenerating = false,
  isDownloaded = false,
  onBackToEdit,
  onConfirmAndDownload,
}: DocumentPreviewProps) {
  const status = getCompletionStatus(data);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-white to-emerald-50/40 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                Step 2
              </span>

              <span className="text-xs font-medium text-gray-500">
                Final Review
              </span>
            </div>

            <h2 className="text-xl font-bold text-gray-950 sm:text-2xl">
              Full Agreement Preview
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Review the generated agreement PDF and verify all information
              before downloading the final document.
            </p>
          </div>

          <div className="shrink-0 rounded-xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">
              Agreement Number
            </p>

            <p className="mt-1 text-sm font-bold text-emerald-700">
              {displayValue(data.agreementNumber)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="bg-gray-100/70 p-4 sm:p-5 lg:p-6">
        <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-5">
          {/* LEFT - Actual PDF */}
          <div className="min-w-0">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-950">
                  Generated Agreement PDF
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Actual PDF generated from the master Service Agreement DOCX.
                </p>
              </div>

              {isGenerating ? (
                <div className="inline-flex items-center gap-2 self-start rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-amber-600" />
                  Generating PDF...
                </div>
              ) : pdfUrl ? (
                <div className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <span>✓</span>
                  PDF Ready
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 self-start rounded-full bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600">
                  PDF Not Generated
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
              {isGenerating ? (
                <div className="flex min-h-[700px] flex-col items-center justify-center px-6 text-center">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
                  </div>

                  <h4 className="text-base font-bold text-gray-900">
                    Preparing your Service Agreement
                  </h4>

                  <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                    The master DOCX template is being populated and converted
                    into the final PDF. Please wait.
                  </p>
                </div>
              ) : pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  title="Service Agreement PDF Preview"
                  className="h-[75vh] min-h-[700px] w-full border-0"
                />
              ) : (
                <div className="flex min-h-[700px] flex-col items-center justify-center px-6 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 3H14L19 8V21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5 3 7 3Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M14 3V8H19"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M9 13H15"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />

                      <path
                        d="M9 17H15"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <h4 className="text-base font-bold text-gray-900">
                    PDF preview will appear here
                  </h4>

                  <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                    Generate the agreement to load the actual master-template
                    PDF for review.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - Filled / Remaining Review */}
          <div className="min-w-0 h-[calc(75vh+60px)] min-h-[760px]">
            <div className="sticky top-4 h-full">
              <ReviewStatusPanel data={data} />
            </div>
          </div>
        </div>
      </div>

      {/* Final Review Notice */}
      <div className="border-t border-gray-200 p-5 sm:p-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
              !
            </div>

            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Final Review Before PDF Confirmation
              </h4>

              <p className="mt-1 text-xs leading-5 text-amber-800">
                Please verify the customer, payer, plan, payment, verification,
                acceptance, document delivery and execution information
                carefully. The final PDF is generated from the master Service
                Agreement DOCX template while preserving the template&apos;s
                existing document structure and formatting.
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Review Status
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {status.completed} of {status.total} fields completed
              </p>
            </div>

            <div
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                status.isComplete
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {status.isComplete
                ? "Review Complete"
                : `${status.remaining} Field${
                    status.remaining === 1 ? "" : "s"
                  } Remaining`}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 z-30 border-t border-gray-200 bg-white/95 px-5 py-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {isDownloaded ? (
              <>
                <p className="text-sm font-semibold text-emerald-700">
                  PDF downloaded successfully
                </p>

                <p className="mt-0.5 text-xs text-gray-500">
                  The generated agreement has been downloaded.
                </p>
              </>
            ) : pdfUrl ? (
              <>
                <p className="text-sm font-semibold text-gray-900">
                  Agreement PDF is ready
                </p>

                <p className="mt-0.5 text-xs text-gray-500">
                  Review the PDF and information panel before downloading.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-gray-900">
                  Agreement review
                </p>

                <p className="mt-0.5 text-xs text-gray-500">
                  Generate the PDF to view the actual document.
                </p>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onBackToEdit}
              disabled={isGenerating}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ← Back & Edit
            </button>

            <button
              type="button"
              onClick={onConfirmAndDownload}
              disabled={!pdfUrl || isGenerating}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
              {isDownloaded ? (
                <>
                  <span>✓</span>
                  Downloaded
                </>
              ) : (
                <>
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 3V15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M7 10L12 15L17 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M5 21H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>

                  Confirm & Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}