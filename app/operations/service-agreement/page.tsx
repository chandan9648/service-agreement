"use client";

import { useEffect, useMemo, useState } from "react";

import CustomerForm from "@/app/components/service-agreement/CustomerForm";
import PlanForm from "@/app/components/service-agreement/PlanForm";
import PaymentForm from "@/app/components/service-agreement/PaymentForm";
import VerificationForm from "@/app/components/service-agreement/VerificationForm";
import WitnessForm from "@/app/components/service-agreement/WitnessForm";
import DocumentPreview from "@/app/components/service-agreement/DocumentPreview";

import type { ServiceAgreementData } from "@/app/types/service-agreement";
import { validateServiceAgreement } from "@/app/lib/validation/service-agreement";

const initialData: ServiceAgreementData = {
  agreementNumber: "",

  customerName: "",
  customerAge: "",
  customerDateOfBirth: "",
  customerAadharLastFour: "",

  fullAddressCustomer: "",

  customerPhone: "",
  customerMail: "",

  customerPlace: "",
  customerDate: "",

  payerName: "",
  relationship: "",

  planName: "",
  planNumber: "",

  issueDate: "",
  validityDate: "",

  feesWithoutTax: "",
  tax: "",
  totalPayable: "",

  utr: "",
  paymentDate: "",
  paymentTime: "",
  paymentMode: "",
  payee: "",

  language: "",
  agentName: "",

  callDate: "",
  callTime: "",

  verifierName: "",

  acceptanceDate: "",
  acceptanceTime: "",

  documentSent: "",
  sentDate: "",
  sentTime: "",
  typeOfSendingPlatform: "",

  witness1Name: "",
  witness1Address: "",
  witness1Mobile: "",
  witness1Date: "",

  witness2Name: "",
  witness2Address: "",
  witness2Mobile: "",
  witness2Date: "",

  effectiveDate: "",
  executionDate: "",
  executionTime: "",
  executionAmPm: "",

  currentDate: "",
};

function calculateTotal(feesWithoutTax: string, tax: string): string {
  const fees = Number(feesWithoutTax) || 0;
  const taxAmount = Number(tax) || 0;

  if (!fees && !taxAmount) {
    return "";
  }

  return (fees + taxAmount).toFixed(2);
}

export default function ServiceAgreementPage() {
  const [data, setData] = useState<ServiceAgreementData>(initialData);

  const [showDocumentPreview, setShowDocumentPreview] = useState(false);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [isDownloaded, setIsDownloaded] = useState(false);

  const totalPayable = useMemo(
    () => calculateTotal(data.feesWithoutTax, data.tax),
    [data.feesWithoutTax, data.tax],
  );

  /*
   * ---------------------------------------------------------
   * CLEANUP PDF OBJECT URL
   * ---------------------------------------------------------
   */

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  /*
   * ---------------------------------------------------------
   * UPDATE FORM DATA
   *
   * Any change after preview invalidates the old PDF.
   * This prevents downloading a PDF generated from old data.
   * ---------------------------------------------------------
   */

  const handleDataChange = (
    fieldOrUpdatedData: keyof ServiceAgreementData | Partial<ServiceAgreementData>,
    value?: string,
  ) => {
    const nextData =
      typeof fieldOrUpdatedData === "string"
        ? {
            ...data,
            [fieldOrUpdatedData]: value ?? "",
          }
        : {
            ...data,
            ...fieldOrUpdatedData,
          };

    setData({
      ...nextData,
      totalPayable: calculateTotal(nextData.feesWithoutTax, nextData.tax),
    });

    setValidationErrors({});
    setErrorMessage("");
    setIsDownloaded(false);

    if (showDocumentPreview) {
      setShowDocumentPreview(false);
    }

    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }

    setPdfBlob(null);
  };

  /*
   * ---------------------------------------------------------
   * VALIDATION
   * ---------------------------------------------------------
   */

  const normalizeValidationErrors = (
    errors: string[],
  ): Record<string, string> =>
    errors.reduce<Record<string, string>>((acc, error, index) => {
      acc[`error_${index}`] = error;
      return acc;
    }, {});

  const validateForm = (): boolean => {
    const validation = validateServiceAgreement(data);

    if (!validation.isValid) {
      setValidationErrors(normalizeValidationErrors(validation.errors));
      setErrorMessage(
        "Please correct the highlighted information before generating the preview.",
      );

      return false;
    }

    setValidationErrors({});
    setErrorMessage("");

    return true;
  };

  /*
   * ---------------------------------------------------------
   * GENERATE REAL PDF FOR PREVIEW
   * ---------------------------------------------------------
   */

  const handlePreviewAgreement = async () => {
    if (isGeneratingPreview) {
      return;
    }

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setIsGeneratingPreview(true);
    setErrorMessage("");
    setIsDownloaded(false);

    try {
      /*
       * Remove any previously generated preview.
       */

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }

      setPdfBlob(null);

      /*
       * Generate the ACTUAL final PDF.
       *
       * This uses the same backend route that generates
       * the final Service Agreement from the master DOCX.
       */

      const response = await fetch("/api/service-agreement/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          totalPayable,
        }),
      });

      const contentType = response.headers.get("content-type") || "";

      if (!response.ok) {
        let message = "Unable to generate the Service Agreement preview.";

        if (contentType.includes("application/json")) {
          try {
            const result = await response.json();

            if (result?.message) {
              message = result.message;
            }

            if (result?.errors) {
              setValidationErrors(result.errors);
            }
          } catch {
            // Keep the default message.
          }
        } else {
          try {
            const text = await response.text();

            if (text.trim()) {
              message = text;
            }
          } catch {
            // Keep the default message.
          }
        }

        throw new Error(message);
      }

      if (!contentType.includes("application/pdf")) {
        throw new Error("The server did not return a PDF file.");
      }

      const blob = await response.blob();

      if (!blob.size) {
        throw new Error("The generated PDF is empty.");
      }

      const objectUrl = URL.createObjectURL(blob);

      setPdfBlob(blob);
      setPdfUrl(objectUrl);
      setShowDocumentPreview(true);
    } catch (error) {
      console.error("[Service Agreement] Preview generation failed:", error);

      setShowDocumentPreview(false);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to generate the Service Agreement preview.",
      );
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * BACK TO EDIT
   * ---------------------------------------------------------
   */

  const handleBackToEdit = () => {
    setShowDocumentPreview(false);
    setIsDownloaded(false);
    setErrorMessage("");

    /*
     * Keep the generated PDF in memory while editing.
     *
     * It will automatically be invalidated as soon as
     * any form field is changed through handleDataChange().
     */
  };

  /*
   * ---------------------------------------------------------
   * FINAL DOWNLOAD
   *
   * IMPORTANT:
   * Do NOT call the API again.
   *
   * The preview PDF is already the final generated PDF.
   * ---------------------------------------------------------
   */

  const handleConfirmAndDownload = () => {
    if (!pdfBlob || !pdfUrl) {
      setErrorMessage(
        "No generated PDF is available. Please generate the preview again.",
      );

      return;
    }

    const safeAgreementNumber =
      data.agreementNumber.replace(/[^a-zA-Z0-9_-]/g, "_").trim() ||
      "service-agreement";

    const downloadUrl = URL.createObjectURL(pdfBlob);

    const anchor = document.createElement("a");

    anchor.href = downloadUrl;
    anchor.download = `${safeAgreementNumber}.pdf`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(downloadUrl);

    setIsDownloaded(true);
  };

  /*
   * ---------------------------------------------------------
   * FORM VIEW
   * ---------------------------------------------------------
   */

  if (!showDocumentPreview) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">
                  Operations
                </p>

                <h1 className="text-2xl font-bold text-gray-950 sm:text-3xl">
                  Service Agreement
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Complete the agreement information and review the actual
                  generated document before downloading.
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                  Current Agreement
                </p>

                <p className="mt-1 text-sm font-bold text-emerald-800">
                  {data.agreementNumber.trim() || "Not assigned"}
                </p>
              </div>
            </div>
          </div>

          {/* Error */}
          {errorMessage ? (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-800">
                {errorMessage}
              </p>
            </div>
          ) : null}

          {/* Form Sections */}
          <div className="space-y-5">
            <CustomerForm data={data} onChange={handleDataChange} />

            <PlanForm data={data} onChange={handleDataChange} />

            <PaymentForm data={data} onChange={handleDataChange} />

            <VerificationForm data={data} onChange={handleDataChange} />

            <WitnessForm data={data} onChange={handleDataChange} />

            {/* Preview Action */}
            <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-950">
                    Ready to Review?
                  </h2>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                    Click Preview Agreement to generate the actual Service
                    Agreement PDF from the master DOCX template. You can then
                    inspect the complete document before downloading it.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handlePreviewAgreement}
                  disabled={isGeneratingPreview}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGeneratingPreview ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Generating Preview...
                    </>
                  ) : (
                    <>
                      <span className="text-base">◉</span>
                      Preview Agreement
                    </>
                  )}
                </button>
              </div>

              {Object.keys(validationErrors).length > 0 ? (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-semibold text-amber-900">
                    Some required information is missing or invalid. Please
                    review the form above.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ---------------------------------------------------------
   * ACTUAL PDF PREVIEW VIEW
   * ---------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-gray-100 px-3 py-4 sm:px-5 sm:py-6">
      <div className="mx-auto max-w-[1500px]">
        <DocumentPreview
          data={data}
          pdfUrl={pdfUrl}
          isGenerating={isGeneratingPreview}
          isDownloaded={isDownloaded}
          onBackToEdit={handleBackToEdit}
          onConfirmAndDownload={handleConfirmAndDownload}
        />

        {errorMessage ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-800">{errorMessage}</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
