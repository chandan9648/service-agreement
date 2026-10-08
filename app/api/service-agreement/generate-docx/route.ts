import fs from "fs/promises";
import path from "path";

import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

import type { ServiceAgreementData } from "@/app/types/service-agreement";
import { validateServiceAgreement } from "@/app/lib/validation/service-agreement";

export const runtime = "nodejs";

function formatDate(value: string): string {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatTime(value: string): string {
  if (!value) {
    return "";
  }

  const [hours, minutes] = value.split(":");

  if (!hours || !minutes) {
    return value;
  }

  return `${hours}:${minutes}`;
}

/*
 * Witness details apply only to Part B (physical execution)
 * and are optional.
 *
 * When a witness field is left empty the original blank rule
 * from the master DOCX is restored, so a printed counterpart
 * still has a line to write on.
 */
function witnessField(value: string, blankRule: string): string {
  return value.trim() || blankRule;
}

/**
 * IMPORTANT:
 * These keys intentionally match the existing DOCX placeholders.
 *
 * Do not rename or remove them.
 *
 * Multiple DOCX placeholders can intentionally point to the
 * same logical form field.
 */
function buildTemplateData(data: ServiceAgreementData): Record<string, string> {
  return {
    AgreementNumber: data.agreementNumber,

    CustomerName: data.customerName,
    CustomerAge: data.customerAge,
    CustomerAadharLastFour: data.customerAadharLastFour,

    FullAdressCustomer: data.fullAddressCustomer,
    FullAddressCustomer: data.fullAddressCustomer,

    CustomerPhone: data.customerPhone,
    CustomerMail: data.customerMail,

    CustomerDateOfBirth: formatDate(data.customerDateOfBirth),

    CustomerPlace: data.customerPlace,
    CustomerDate: formatDate(data.customerDate),

    /*
     * The master template contains both {Name}
     * and {PayerName}.
     *
     * Both intentionally use payerName.
     */
    Name: data.payerName,
    PayerName: data.payerName,

    Relationship: data.relationship,

    PlanName: data.planName,
    PlanNumber: data.planNumber,

    IssueDate: formatDate(data.issueDate),
    ValidityDate: formatDate(data.validityDate),

    FeeswithoutTax: data.feesWithoutTax,
    Tax: data.tax,
    TotalPayable: data.totalPayable,

    UTR: data.utr,
    PaymentDate: formatDate(data.paymentDate),
    PaymentTime: formatTime(data.paymentTime),
    PaymentMode: data.paymentMode,
    Payee: data.payee,

    Language: data.language,
    AgentName: data.agentName,

    CallDate: formatDate(data.callDate),
    CallTime: formatTime(data.callTime),

    VerifierName: data.verifierName,

    AcceptanceDate: formatDate(data.acceptanceDate),
    AcceptanceTime: formatTime(data.acceptanceTime),

    DocumentSent: data.documentSent,

    SentDate: formatDate(data.sentDate),
    SentTime: formatTime(data.sentTime),

    TypeofSendingPlatform: data.typeOfSendingPlatform,

    Witness1Name: witnessField(data.witness1Name, "______"),
    Witness1Address: witnessField(data.witness1Address, "_____"),
    Witness1Mobile: witnessField(data.witness1Mobile, "____"),
    Witness1Date: witnessField(formatDate(data.witness1Date), "__//__"),

    Witness2Name: witnessField(data.witness2Name, "______"),
    Witness2Address: witnessField(data.witness2Address, "_____"),
    Witness2Mobile: witnessField(data.witness2Mobile, "____"),
    Witness2Date: witnessField(formatDate(data.witness2Date), "__//__"),

    /*
     * These names are intentionally kept exactly as they
     * exist in the master DOCX.
     */
    EffectiveDate: formatDate(data.effectiveDate),

    Date: formatDate(data.executionDate),
    Time: formatTime(data.executionTime),
    "AM/PM": data.executionAmPm,

    CurrentDate: formatDate(data.currentDate),
  };
}

async function generateDocx(data: ServiceAgreementData): Promise<Buffer> {
  const templatePath = path.join(
    process.cwd(),
    "templates",
    "Service Agreement V10.docx",
  );

  try {
    await fs.access(templatePath);
  } catch {
    throw new Error(`Master DOCX template was not found at: ${templatePath}`);
  }

  const templateBuffer = await fs.readFile(templatePath);

  const zip = new PizZip(templateBuffer);

  const document = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  const templateData = buildTemplateData(data);

  document.render(templateData);

  return document.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
}

export async function POST(request: Request) {
  try {
    console.log("[Service Agreement] DOCX generation started.");

    const body = (await request.json()) as Partial<ServiceAgreementData>;

    const data = body as ServiceAgreementData;

    /*
     * ---------------------------------------------------------
     * VALIDATION
     * ---------------------------------------------------------
     */

    const validation = validateServiceAgreement(data);

    if (!validation.isValid) {
      console.error(
        "[Service Agreement] DOCX validation failed:",
        validation.errors,
      );

      return Response.json(
        {
          success: false,
          message: "Please correct the following validation errors.",
          errors: validation.errors,
        },
        {
          status: 400,
        },
      );
    }

    /*
     * ---------------------------------------------------------
     * GENERATE DOCX
     * ---------------------------------------------------------
     */

    const docxBuffer = await generateDocx(data);

    if (!docxBuffer || docxBuffer.length === 0) {
      throw new Error("The generated DOCX file is empty.");
    }

    /*
     * ---------------------------------------------------------
     * SAFE FILE NAME
     * ---------------------------------------------------------
     */

    const safeAgreementNumber =
      data.agreementNumber.replace(/[^a-zA-Z0-9_-]/g, "_").trim() ||
      "service-agreement";

    console.log("[Service Agreement] DOCX generated successfully.");

    /*
     * ---------------------------------------------------------
     * IMPORTANT TYPESCRIPT / NEXT.JS FIX
     * ---------------------------------------------------------
     *
     * Buffer<ArrayBufferLike> is not accepted directly as
     * BodyInit by the current Next.js 16 TypeScript types.
     *
     * Uint8Array is a valid BodyInit and preserves the exact
     * generated DOCX bytes.
     */

    const responseBody = new Uint8Array(docxBuffer);

    return new Response(responseBody, {
      status: 200,

      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        "Content-Disposition": `attachment; filename="${safeAgreementNumber}.docx"`,

        "Content-Length": String(responseBody.byteLength),

        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[Service Agreement] DOCX generation error:", error);

    let message = "Unable to generate the Service Agreement DOCX.";

    if (error instanceof Error) {
      message = error.message;
    }

    return Response.json(
      {
        success: false,
        message,
      },
      {
        status: 500,
      },
    );
  }
}
