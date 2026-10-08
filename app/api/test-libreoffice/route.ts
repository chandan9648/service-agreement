import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";

const execFileAsync = promisify(execFile);

export async function GET() {
  const libreOfficePath =
    "C:\\Program Files\\LibreOffice\\program\\soffice.exe";

  console.log("=== LIBREOFFICE TEST ===");
  console.log("Checking path:", libreOfficePath);

  try {
    // Check if file exists
    const stats = await fs.stat(libreOfficePath);
    console.log("✅ File exists:", stats.size, "bytes");
  } catch (error) {
    console.error("❌ File does not exist");
    return Response.json(
      { error: "File does not exist", path: libreOfficePath },
      { status: 500 },
    );
  }

  try {
    // Try to run --version
    const result = await execFileAsync(`"${libreOfficePath}"`, ["--version"], {
      shell: true,
      windowsHide: true,
      timeout: 10000,
      maxBuffer: 2 * 1024 * 1024,
    });
    console.log("✅ LibreOffice responded");
    console.log("stdout:", result.stdout);
    console.log("stderr:", result.stderr);

    return Response.json({
      success: true,
      message: "LibreOffice is working!",
      version: result.stdout || result.stderr,
    });
  } catch (error) {
    console.error("❌ Error running LibreOffice:", error);
    return Response.json(
      {
        error: "Failed to run LibreOffice",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
