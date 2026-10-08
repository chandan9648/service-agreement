/**
 * ConvertAPI DOCX -> PDF conversion.
 *
 * SERVER-SIDE ONLY.
 *
 * This module reads CONVERTAPI_API_TOKEN from the server
 * environment and must never be imported from a Client
 * Component or any browser bundle.
 *
 * The token is deliberately read from a non-NEXT_PUBLIC_
 * environment variable so Next.js never inlines it into
 * client JavaScript.
 *
 * Required environment variable:
 *
 * CONVERTAPI_API_TOKEN=your-convertapi-production-token
 *
 * The token is never logged, never placed in the request URL
 * or query string, and never returned in an API response.
 */

/**
 * ConvertAPI v2 DOCX -> PDF endpoint.
 */
const CONVERTAPI_ENDPOINT =
  "https://v2.convertapi.com/convert/docx/to/pdf";

/**
 * Time budget for the ConvertAPI conversion request.
 */
const CONVERTAPI_CONVERSION_TIMEOUT = 60_000;

/**
 * Time budget for downloading the produced PDF.
 */
const CONVERTAPI_DOWNLOAD_TIMEOUT = 60_000;

const DOCX_CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/**
 * Shape of the ConvertAPI JSON response.
 *
 * With StoreFile=true each entry carries a "Url" that has to be
 * downloaded. Without it, ConvertAPI inlines the PDF as base64
 * in "FileData". Both shapes are handled.
 */
type ConvertApiFile = {
  FileName?: string;
  FileExt?: string;
  FileSize?: number;
  FileId?: string;
  Url?: string;
  FileData?: string;
};

type ConvertApiResponse = {
  Files?: ConvertApiFile[];
  Message?: string;
  Code?: number;
};

/**
 * Read and validate the ConvertAPI token.
 *
 * The token itself is never included in the thrown message.
 */
function getConvertApiToken(): string {
  const token = process.env.CONVERTAPI_API_TOKEN?.trim();

  if (!token) {
    throw new Error(
      "PDF conversion is not configured. " +
        "Please set CONVERTAPI_API_TOKEN in the server environment " +
        "(Netlify: Site configuration -> Environment variables).",
    );
  }

  return token;
}

/**
 * Strip anything that could leak the token out of a message
 * that is about to be logged or surfaced.
 *
 * This is a defensive second line of protection: the token is
 * never written anywhere on purpose, but a third-party error
 * body could echo a header back.
 */
function redactToken(text: string): string {
  const token = process.env.CONVERTAPI_API_TOKEN?.trim();

  if (!token) {
    return text;
  }

  return text.split(token).join("***");
}

/**
 * Validate that a buffer really is a PDF.
 *
 * A valid PDF starts with:
 * %PDF-
 */
function assertValidPdf(pdfBuffer: Buffer, source: string): void {
  if (pdfBuffer.length === 0) {
    throw new Error(
      `ConvertAPI returned an empty PDF (${source}).`,
    );
  }

  const signature = pdfBuffer.subarray(0, 5).toString();

  if (signature !== "%PDF-") {
    throw new Error(
      `ConvertAPI did not return a valid PDF (${source}).`,
    );
  }
}

/**
 * Download the produced PDF from the StoreFile=true URL.
 */
async function downloadPdf(url: string): Promise<Buffer> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, CONVERTAPI_DOWNLOAD_TIMEOUT);

  try {
    console.log(
      "[Service Agreement] Downloading PDF from ConvertAPI...",
    );

    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `PDF download from ConvertAPI failed with HTTP ${response.status}.`,
      );
    }

    const pdfBuffer = Buffer.from(await response.arrayBuffer());

    assertValidPdf(pdfBuffer, "downloaded file");

    return pdfBuffer;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      (error as { name?: string }).name === "AbortError"
    ) {
      throw new Error(
        "Downloading the PDF from ConvertAPI timed out after 60 seconds.",
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Convert a DOCX buffer to a PDF buffer using ConvertAPI.
 *
 * This is the single reusable server-side conversion function.
 * Any API route that needs a ConvertAPI PDF should call this
 * instead of talking to ConvertAPI directly.
 *
 * @param docxBuffer Generated DOCX contents.
 * @param fileName   File name sent to ConvertAPI (used for logs
 *                   and for the name ConvertAPI gives the output).
 * @returns          The produced PDF as a Buffer.
 */
export async function convertDocxToPdfWithConvertApi(
  docxBuffer: Buffer,
  fileName: string,
): Promise<Buffer> {
  /**
   * ------------------------------------------------------------
   * 1. Missing CONVERTAPI_API_TOKEN
   * ------------------------------------------------------------
   */
  const token = getConvertApiToken();

  /**
   * ------------------------------------------------------------
   * 2. Invalid / empty DOCX file
   * ------------------------------------------------------------
   */
  if (!docxBuffer || docxBuffer.length === 0) {
    throw new Error(
      "Generated DOCX is empty and cannot be converted to PDF.",
    );
  }

  /**
   * A DOCX is a ZIP container, so it must start with "PK".
   */
  const docxSignature = docxBuffer.subarray(0, 2).toString();

  if (docxSignature !== "PK") {
    throw new Error(
      "Generated DOCX is not a valid DOCX file and cannot be converted to PDF.",
    );
  }

  console.log("[Service Agreement] ConvertAPI conversion started.", {
    endpoint: CONVERTAPI_ENDPOINT,
    fileName,
    docxSize: docxBuffer.length,
  });

  /**
   * multipart/form-data body.
   *
   * The file field name must be "File".
   *
   * StoreFile=true makes ConvertAPI return a downloadable URL
   * instead of inlining the PDF as base64.
   */
  const formData = new FormData();

  formData.append(
    "File",
    new Blob([new Uint8Array(docxBuffer)], {
      type: DOCX_CONTENT_TYPE,
    }),
    fileName,
  );

  formData.append("StoreFile", "true");

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, CONVERTAPI_CONVERSION_TIMEOUT);

  let payload: ConvertApiResponse;

  try {
    const response = await fetch(CONVERTAPI_ENDPOINT, {
      method: "POST",
      /**
       * The token travels in the Authorization header only.
       * Never in the URL and never in the query string.
       */
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      signal: controller.signal,
      cache: "no-store",
    });

    /**
     * ----------------------------------------------------------
     * 3. ConvertAPI HTTP errors
     * ----------------------------------------------------------
     */
    if (!response.ok) {
      const errorText = await response.text().catch(() => "");

      throw new Error(
        `ConvertAPI returned HTTP ${response.status}. ` +
          redactToken(errorText.slice(0, 500)),
      );
    }

    const rawBody = await response.text();

    /**
     * ----------------------------------------------------------
     * 4. ConvertAPI returning an unexpected response
     * ----------------------------------------------------------
     */
    try {
      payload = JSON.parse(rawBody) as ConvertApiResponse;
    } catch {
      throw new Error(
        "ConvertAPI returned an unexpected (non-JSON) response: " +
          redactToken(rawBody.slice(0, 300)),
      );
    }
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      (error as { name?: string }).name === "AbortError"
    ) {
      throw new Error(
        "ConvertAPI PDF conversion timed out after 60 seconds.",
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }

  const files = Array.isArray(payload.Files) ? payload.Files : [];

  if (files.length === 0) {
    throw new Error(
      "ConvertAPI response did not contain any converted file. " +
        redactToken(payload.Message ?? ""),
    );
  }

  /**
   * Prefer an explicit PDF entry, otherwise fall back to the
   * first returned file.
   */
  const pdfFile =
    files.find((file) => file.FileExt?.toLowerCase() === "pdf") ??
    files[0];

  /**
   * ------------------------------------------------------------
   * 5. PDF download failure
   * 6. Empty / invalid PDF response
   * ------------------------------------------------------------
   */
  let pdfBuffer: Buffer;

  if (pdfFile.Url) {
    pdfBuffer = await downloadPdf(pdfFile.Url);
  } else if (pdfFile.FileData) {
    /**
     * StoreFile was not honoured and the PDF came back inline
     * as base64.
     */
    pdfBuffer = Buffer.from(pdfFile.FileData, "base64");

    assertValidPdf(pdfBuffer, "inline base64 file");
  } else {
    throw new Error(
      "ConvertAPI response contained neither a PDF URL nor PDF data.",
    );
  }

  console.log("[Service Agreement] ConvertAPI conversion finished.", {
    fileName: pdfFile.FileName ?? fileName,
    pdfSize: pdfBuffer.length,
  });

  return pdfBuffer;
}
