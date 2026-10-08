import { randomUUID } from "crypto";

import { execFile } from "child_process";

import { promisify } from "util";

import fs from "fs/promises";

import os from "os";

import path from "path";

import { pathToFileURL } from "url";



import PizZip from "pizzip";

import Docxtemplater from "docxtemplater";



import type { ServiceAgreementData } from "@/app/types/service-agreement";

import { validateServiceAgreement } from "@/app/lib/validation/service-agreement";



export const runtime = "nodejs";



const execFileAsync = promisify(execFile);



const LIBREOFFICE_VERSION_TIMEOUT = 10_000;

const LIBREOFFICE_CONVERSION_TIMEOUT = 60_000;



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

 * Format date from YYYY-MM-DD to DD/MM/YYYY

 */

function formatDate(value: string): string {

  if (!value) return "";



  const date = new Date(`${value}T00:00:00`);



  if (Number.isNaN(date.getTime())) {

    return value;

  }



  const day = String(date.getDate()).padStart(2, "0");

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const year = date.getFullYear();



  return `${day}/${month}/${year}`;

}



/**

 * Format time

 */

function formatTime(value: string): string {

  if (!value) return "";



  const [hours, minutes] = value.split(":");



  if (!hours || !minutes) {

    return value;

  }



  return `${hours}:${minutes}`;

}



/**

 * Build data object used by Docxtemplater.

 *

 * Keep all existing template placeholder names here.

 */

function buildTemplateData(

  data: ServiceAgreementData,

): Record<string, string> {

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



    EffectiveDate: formatDate(data.effectiveDate),



    Date: formatDate(data.executionDate),

    Time: formatTime(data.executionTime),

    "AM/PM": data.executionAmPm,



    CurrentDate: formatDate(data.currentDate),

  };

}



/**

 * Generate DOCX from the master template.

 */

async function generateDocx(

  data: ServiceAgreementData,

  outputPath: string,

): Promise<void> {

  const templatePath = path.join(

    process.cwd(),

    "templates",

    "Service Agreement V10.docx",

  );



  console.log(

    "[Service Agreement] Master DOCX:",

    templatePath,

  );



  /**

   * Verify master template exists.

   */

  try {

    await fs.access(templatePath);

  } catch {

    throw new Error(

      `Master DOCX template was not found at: ${templatePath}`,

    );

  }



  console.log(

    "[Service Agreement] Reading master DOCX...",

  );



  const templateBuffer = await fs.readFile(templatePath);



  console.log(

    "[Service Agreement] Master DOCX size:",

    templateBuffer.length,

    "bytes",

  );



  /**

   * Load DOCX into PizZip.

   */

  const zip = new PizZip(templateBuffer);



  /**

   * Initialize Docxtemplater.

   */

  const document = new Docxtemplater(zip, {

    paragraphLoop: true,

    linebreaks: true,

  });



  console.log(

    "[Service Agreement] Rendering DOCX placeholders...",

  );



  /**

   * Replace template placeholders.

   */

  document.render(buildTemplateData(data));



  console.log(

    "[Service Agreement] DOCX placeholders rendered.",

  );



  /**

   * Generate output DOCX buffer.

   */

  const outputBuffer = document.getZip().generate({

    type: "nodebuffer",

    compression: "DEFLATE",

  });



  /**

   * Save generated DOCX.

   */

  await fs.writeFile(outputPath, outputBuffer);



  console.log(

    "[Service Agreement] Generated DOCX:",

    outputPath,

  );



  console.log(

    "[Service Agreement] Generated DOCX size:",

    outputBuffer.length,

    "bytes",

  );

}



/**

 * Resolve LibreOffice executable path.

 *

 * Windows:

 * C:\Program Files\LibreOffice\program\soffice.exe

 *

 * This can also be overridden with LIBREOFFICE_PATH.

 */

function getLibreOfficePath(): string {
  /**
   * Local override.
   *
   * Example:
   * LIBREOFFICE_PATH=C:\Program Files\LibreOffice\program\soffice.com
   */
  if (process.env.LIBREOFFICE_PATH?.trim()) {
    return process.env.LIBREOFFICE_PATH.trim();
  }

  /**
   * Windows local development.
   *
   * We intentionally return "soffice" instead of hard-coding
   * C:\Program Files\... because Windows PATH already resolves
   * the installed executable.
   */
  if (process.platform === "win32") {
    return "soffice";
  }

  /**
   * Linux fallback.
   *
   * This is useful for a Linux server/container where LibreOffice
   * is actually installed.
   */
  if (process.platform === "linux") {
    return "/usr/bin/libreoffice";
  }

  /**
   * macOS fallback.
   */
  if (process.platform === "darwin") {
    return "/Applications/LibreOffice.app/Contents/MacOS/soffice";
  }

  return "soffice";
}

/**
 * Verify LibreOffice executable by checking its version.
 *
 * IMPORTANT:
 * - This is used only when we are doing direct/local LibreOffice
 *   conversion.
 * - Netlify production does not call this function.
 */
async function verifyLibreOffice(
  libreOfficePath: string,
): Promise<void> {
  console.log(
    "[Service Agreement] Checking LibreOffice:",
    libreOfficePath,
  );

  /**
   * If an absolute path was explicitly supplied, verify that file.
   *
   * If the value is simply "soffice", let the operating system
   * resolve it through PATH.
   */
  try {
    if (path.isAbsolute(libreOfficePath)) {
      await fs.access(libreOfficePath);
    }
  } catch {
    throw new Error(
      `LibreOffice executable was not found at: ${libreOfficePath}. ` +
        "Please install LibreOffice or set LIBREOFFICE_PATH correctly.",
    );
  }

  console.log(
    "[Service Agreement] LibreOffice executable found/resolvable.",
  );

  /**
   * Run --version to make sure the executable can actually run.
   */
  try {
    const result = await execFileAsync(
      libreOfficePath,
      ["--version"],
      {
        windowsHide: true,
        timeout: LIBREOFFICE_VERSION_TIMEOUT,
        maxBuffer: 2 * 1024 * 1024,
      },
    );

    const versionOutput =
      result.stdout?.trim() ||
      result.stderr?.trim() ||
      "(version output unavailable)";

    console.log(
      "[Service Agreement] LibreOffice version:",
      versionOutput,
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `LibreOffice was found but could not be executed: ${error.message}`,
      );
    }

    throw new Error(
      "LibreOffice was found but could not be executed.",
    );
  }
}

/**
 * Convert DOCX to PDF through an external LibreOffice-based
 * conversion service.
 *
 * This is the production path for Netlify.
 *
 * Required environment variable:
 *
 * PDF_CONVERTER_URL=https://your-converter.example.com/forms/libreoffice/convert
 *
 * Optional:
 *
 * PDF_CONVERTER_API_KEY=your-secret
 *
 * The converter must accept multipart/form-data with a "files"
 * field and return the generated PDF as the response body.
 *
 * A self-hosted Gotenberg instance is a good fit for this because
 * LibreOffice runs inside the converter container rather than
 * inside the Netlify function.
 */
async function convertDocxToPdfWithExternalService(
  docxPath: string,
  pdfPath: string,
): Promise<void> {
  const converterUrl =
    process.env.PDF_CONVERTER_URL?.trim();

  if (!converterUrl) {
    throw new Error(
      "PDF conversion is not configured for production. " +
        "Please set PDF_CONVERTER_URL in Netlify environment variables.",
    );
  }

  console.log(
    "[Service Agreement] Production PDF converter:",
    converterUrl,
  );

  const docxBuffer = await fs.readFile(docxPath);

  if (docxBuffer.length === 0) {
    throw new Error(
      "Generated DOCX is empty and cannot be converted.",
    );
  }

  const formData = new FormData();

  formData.append(
    "files",
    new Blob(
      [new Uint8Array(docxBuffer)],
      {
        type:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    ),
    path.basename(docxPath),
  );

  const headers: Record<string, string> = {};

  const apiKey =
    process.env.PDF_CONVERTER_API_KEY?.trim();

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, LIBREOFFICE_CONVERSION_TIMEOUT);

  try {
    console.log(
      "[Service Agreement] Sending DOCX to production PDF converter...",
    );

    const response = await fetch(
      converterUrl,
      {
        method: "POST",
        headers,
        body: formData,
        signal: controller.signal,
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const errorText =
        await response.text().catch(() => "");

      throw new Error(
        `Production PDF converter returned HTTP ${response.status}. ` +
          errorText.slice(0, 500),
      );
    }

    const pdfBuffer = Buffer.from(
      await response.arrayBuffer(),
    );

    if (pdfBuffer.length === 0) {
      throw new Error(
        "Production PDF converter returned an empty response.",
      );
    }

    /**
     * Validate the PDF magic header.
     *
     * A valid PDF starts with:
     * %PDF-
     */
    const pdfSignature =
      pdfBuffer.subarray(0, 5).toString();

    if (pdfSignature !== "%PDF-") {
      throw new Error(
        "Production PDF converter did not return a valid PDF.",
      );
    }

    await fs.writeFile(
      pdfPath,
      pdfBuffer,
    );

    console.log(
      "[Service Agreement] Production PDF created successfully.",
      {
        size: pdfBuffer.length,
      },
    );
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      (error as { name?: string }).name ===
        "AbortError"
    ) {
      throw new Error(
        "Production PDF conversion timed out after 60 seconds.",
      );
    }

    if (error instanceof Error) {
      throw new Error(
        `Production PDF conversion failed: ${error.message}`,
      );
    }

    throw new Error(
      "Production PDF conversion failed.",
    );
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Convert generated DOCX to PDF.
 *
 * LOCAL DEVELOPMENT:
 *   DOCX -> Local LibreOffice -> PDF
 *
 * NETLIFY PRODUCTION:
 *   DOCX -> External PDF converter -> PDF
 *
 * The rest of the API does not need to know which provider was used.
 */
async function convertDocxToPdf(
  docxPath: string,
  outputDirectory: string,
): Promise<string> {
  console.log(
    "[Service Agreement] Starting PDF conversion...",
  );

  /**
   * Create the expected PDF path first.
   */
  const docxFileName = path.basename(
    docxPath,
    path.extname(docxPath),
  );

  const pdfPath = path.join(
    outputDirectory,
    `${docxFileName}.pdf`,
  );

  /**
   * Netlify sets NETLIFY=true in its build/runtime environment.
   *
   * We also check whether PDF_CONVERTER_URL is configured so the
   * external provider can be tested locally without pretending
   * that local LibreOffice is the production provider.
   */
  const isNetlify =
    process.env.NETLIFY === "true" ||
    Boolean(process.env.NETLIFY);

  const hasExternalConverter =
    Boolean(process.env.PDF_CONVERTER_URL?.trim());

  /**
   * ------------------------------------------------------------
   * PRODUCTION / EXTERNAL PROVIDER
   * ------------------------------------------------------------
   *
   * IMPORTANT:
   * Never try to access:
   *
   * C:\Program Files\LibreOffice\...
   *
   * from Netlify.
   */
  if (isNetlify || hasExternalConverter) {
    console.log(
      "[Service Agreement] Using external PDF conversion provider.",
    );

    await convertDocxToPdfWithExternalService(
      docxPath,
      pdfPath,
    );

    /**
     * Verify the provider actually created a PDF file.
     */
    try {
      await fs.access(pdfPath);
    } catch {
      throw new Error(
        "External PDF converter completed without creating the expected PDF file.",
      );
    }

    const externalPdfStats =
      await fs.stat(pdfPath);

    if (externalPdfStats.size === 0) {
      throw new Error(
        "External PDF converter created an empty PDF file.",
      );
    }

    return pdfPath;
  }

  /**
   * ------------------------------------------------------------
   * LOCAL / DIRECT LIBREOFFICE PROVIDER
   * ------------------------------------------------------------
   */

  console.log(
    "[Service Agreement] Using local LibreOffice conversion.",
  );

  const libreOfficePath =
    getLibreOfficePath();

  console.log(
    "[Service Agreement] LibreOffice path:",
    libreOfficePath,
  );

  /**
   * Verify LibreOffice exists and is executable.
   */
  await verifyLibreOffice(
    libreOfficePath,
  );

  /**
   * Create isolated LibreOffice user profile.
   *
   * This prevents multiple local requests from fighting over
   * the same LibreOffice profile.
   */
  const profileDirectory =
    path.join(
      outputDirectory,
      "libreoffice-profile",
    );

  await fs.mkdir(
    profileDirectory,
    {
      recursive: true,
    },
  );

  /**
   * Convert filesystem path into file:// URL.
   */
  const profileUrl =
    pathToFileURL(
      profileDirectory,
    ).href;

  console.log(
    "[Service Agreement] LibreOffice profile:",
    profileDirectory,
  );

  console.log(
    "[Service Agreement] Input DOCX:",
    docxPath,
  );

  console.log(
    "[Service Agreement] Output directory:",
    outputDirectory,
  );

  /**
   * LibreOffice command arguments.
   */
  const libreOfficeArguments = [
    "--headless",
    "--nologo",
    "--nodefault",
    "--nofirststartwizard",

    /**
     * Use isolated profile.
     */
    `-env:UserInstallation=${profileUrl}`,

    /**
     * Conversion.
     */
    "--convert-to",
    "pdf",

    /**
     * Destination directory.
     */
    "--outdir",
    outputDirectory,

    /**
     * Input DOCX.
     */
    docxPath,
  ];

  console.log(
    "[Service Agreement] LibreOffice arguments:",
    libreOfficeArguments,
  );

  console.log(
    "[Service Agreement] LibreOffice conversion started...",
  );

  const conversionStart =
    Date.now();

  try {
    /**
     * IMPORTANT:
     *
     * Do NOT use shell: true.
     *
     * execFile directly executes the executable and handles
     * Windows paths safely.
     */
    const result =
      await execFileAsync(
        libreOfficePath,
        libreOfficeArguments,
        {
          windowsHide: true,
          timeout:
            LIBREOFFICE_CONVERSION_TIMEOUT,

          /**
           * Kill process if conversion exceeds timeout.
           */
          killSignal: "SIGKILL",

          /**
           * Prevent stdout/stderr buffer overflow.
           */
          maxBuffer:
            10 * 1024 * 1024,
        },
      );

    const conversionTime =
      Date.now() - conversionStart;

    console.log(
      "[Service Agreement] LibreOffice conversion finished in:",
      `${conversionTime}ms`,
    );

    console.log(
      "[Service Agreement] LibreOffice stdout:",
      result.stdout || "(empty)",
    );

    console.log(
      "[Service Agreement] LibreOffice stderr:",
      result.stderr || "(empty)",
    );
  } catch (error) {
    const conversionTime =
      Date.now() - conversionStart;

    console.error(
      "[Service Agreement] LibreOffice conversion failed after:",
      `${conversionTime}ms`,
    );

    console.error(
      "[Service Agreement] LibreOffice error:",
      error,
    );

    /**
     * Timeout.
     */
    if (
      error &&
      typeof error === "object" &&
      "killed" in error &&
      (error as { killed?: boolean }).killed
    ) {
      throw new Error(
        "LibreOffice PDF conversion timed out after 60 seconds. " +
          "The conversion process was stopped.",
      );
    }

    /**
     * Node child_process error.
     */
    if (error instanceof Error) {
      throw new Error(
        `LibreOffice PDF conversion failed: ${error.message}`,
      );
    }

    throw new Error(
      "LibreOffice PDF conversion failed.",
    );
  }

  /**
   * Verify PDF was actually created.
   */
  console.log(
    "[Service Agreement] Checking generated PDF:",
    pdfPath,
  );

  try {
    await fs.access(pdfPath);
  } catch {
    throw new Error(
      "LibreOffice completed without creating the expected PDF file.",
    );
  }

  /**
   * Check PDF file stats.
   */
  const pdfStats =
    await fs.stat(pdfPath);

  /**
   * Empty PDF protection.
   */
  if (pdfStats.size === 0) {
    throw new Error(
      "LibreOffice created an empty PDF file.",
    );
  }

  console.log(
    "[Service Agreement] PDF created successfully.",
  );

  console.log(
    "[Service Agreement] PDF size:",
    pdfStats.size,
    "bytes",
  );

  return pdfPath;
}

/**
 * POST /api/service-agreement/generate-pdf
 */

export async function POST(request: Request) {

  let temporaryDirectory = "";



  const requestId = randomUUID();

  const requestStart = Date.now();



  console.log(

    "=================================================",

  );



  console.log(

    "[Service Agreement] PDF REQUEST START:",

    requestId,

  );



  console.log(

    "=================================================",

  );



  try {

    /**

     * ------------------------------------------------

     * STEP 0: Read request body

     * ------------------------------------------------

     */

    console.log(

      "[Service Agreement]",

      requestId,

      "Reading request body...",

    );



    const body =

      (await request.json()) as Partial<ServiceAgreementData>;



    const data = body as ServiceAgreementData;



    console.log(

      "[Service Agreement]",

      requestId,

      "Request body received.",

    );



    /**

     * ------------------------------------------------

     * STEP 0.1: Validate form data

     * ------------------------------------------------

     */

    console.log(

      "[Service Agreement]",

      requestId,

      "Validating form data...",

    );



    const validation =

      validateServiceAgreement(data);



    /**

     * Validation failed.

     */

    if (!validation.isValid) {

      console.error(

        "[Service Agreement]",

        requestId,

        "Validation failed:",

        validation.errors,

      );



      return Response.json(

        {

          success: false,

          message:

            "Please correct the following validation errors.",

          errors: validation.errors,

          requestId,

        },

        {

          status: 400,

        },

      );

    }



    console.log(

      "[Service Agreement]",

      requestId,

      "Validation successful.",

    );



    /**

     * ------------------------------------------------

     * STEP 0.2: Create temporary directory

     * ------------------------------------------------

     */

    temporaryDirectory = path.join(

      os.tmpdir(),

      `service-agreement-${requestId}`,

    );



    await fs.mkdir(temporaryDirectory, {

      recursive: true,

    });



    console.log(

      "[Service Agreement]",

      requestId,

      "Temporary directory:",

      temporaryDirectory,

    );



    /**

     * ------------------------------------------------

     * STEP 0.3: Create safe agreement filename

     * ------------------------------------------------

     */

    const safeAgreementNumber =

      data.agreementNumber

        .replace(/[^a-zA-Z0-9_-]/g, "_")

        .trim() || "service-agreement";



    const docxPath = path.join(

      temporaryDirectory,

      `${safeAgreementNumber}.docx`,

    );



    /**

     * ------------------------------------------------

     * STEP 1: Generate DOCX

     * ------------------------------------------------

     */

    const docxStart = Date.now();



    console.log(

      "[Service Agreement]",

      requestId,

      "STEP 1: Generating DOCX...",

    );



    await generateDocx(

      data,

      docxPath,

    );



    console.log(

      "[Service Agreement]",

      requestId,

      "STEP 1 completed in:",

      `${Date.now() - docxStart}ms`,

    );



    /**

     * ------------------------------------------------

     * STEP 2: Convert DOCX to PDF

     * ------------------------------------------------

     */

    const pdfStart = Date.now();



    console.log(

      "[Service Agreement]",

      requestId,

      "STEP 2: Converting DOCX to PDF...",

    );



    const pdfPath =

      await convertDocxToPdf(

        docxPath,

        temporaryDirectory,

      );



    console.log(

      "[Service Agreement]",

      requestId,

      "STEP 2 completed in:",

      `${Date.now() - pdfStart}ms`,

    );



    /**

     * ------------------------------------------------

     * STEP 3: Read generated PDF

     * ------------------------------------------------

     */

    console.log(

      "[Service Agreement]",

      requestId,

      "STEP 3: Reading generated PDF...",

    );



    const pdfBuffer =

      await fs.readFile(pdfPath);



    /**

     * Empty PDF protection.

     */

    if (

      !pdfBuffer ||

      pdfBuffer.length === 0

    ) {

      throw new Error(

        "The generated PDF is empty.",

      );

    }



    console.log(

      "[Service Agreement]",

      requestId,

      "STEP 3 completed.",

    );



    console.log(

      "[Service Agreement]",

      requestId,

      "PDF size:",

      pdfBuffer.length,

      "bytes",

    );



    /**

     * ------------------------------------------------

     * SUCCESS

     * ------------------------------------------------

     */

    const totalTime =

      Date.now() - requestStart;



    console.log(

      "=================================================",

    );



    console.log(

      "[Service Agreement] PDF REQUEST SUCCESS:",

      requestId,

    );



    console.log(

      "[Service Agreement] TOTAL TIME:",

      `${totalTime}ms`,

    );



    console.log(

      "=================================================",

    );



    /**

     * Convert Buffer to Uint8Array for Response.

     */

    const responseBody =

      new Uint8Array(pdfBuffer);



    /**

     * Return PDF directly.

     */

    return new Response(

      responseBody,

      {

        status: 200,



        headers: {

          "Content-Type":

            "application/pdf",



          "Content-Disposition":

            `attachment; filename="${safeAgreementNumber}.pdf"`,



          "Content-Length":

            String(

              responseBody.byteLength,

            ),



          "Cache-Control":

            "no-store",

        },

      },

    );

  } catch (error) {

    /**

     * ------------------------------------------------

     * GLOBAL ERROR HANDLER

     * ------------------------------------------------

     */

    const totalTime =

      Date.now() - requestStart;



    console.error(

      "=================================================",

    );



    console.error(

      "[Service Agreement] PDF REQUEST FAILED:",

      requestId,

    );



    console.error(

      "[Service Agreement] TOTAL TIME:",

      `${totalTime}ms`,

    );



    console.error(

      "[Service Agreement] ERROR:",

      error,

    );



    console.error(

      "=================================================",

    );



    /**

     * Default error message.

     */

    let message =

      "Unable to generate the Service Agreement PDF.";



    /**

     * Use actual error message where available.

     */

    if (error instanceof Error) {

      message = error.message;

    }



    return Response.json(

      {

        success: false,

        message,

        requestId,

      },

      {

        status: 500,

      },

    );

  } finally {

    /**

     * ------------------------------------------------

     * CLEANUP TEMPORARY DIRECTORY

     * ------------------------------------------------

     */

    if (temporaryDirectory) {

      try {

        await fs.rm(

          temporaryDirectory,

          {

            recursive: true,

            force: true,

          },

        );



        console.log(

          "[Service Agreement] Temporary directory cleaned:",

          temporaryDirectory,

        );

      } catch (cleanupError) {

        console.error(

          "[Service Agreement] Temporary directory cleanup failed:",

          cleanupError,

        );

      }

    }

  }

}