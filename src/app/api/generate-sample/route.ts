import { NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import { join } from "path";

const execFileAsync = promisify(execFile);

export async function POST() {
  try {
    const scriptPath = join(process.cwd(), "scripts", "generate_sample_model.py");
    const { stdout, stderr } = await execFileAsync("python3", [scriptPath], {
      timeout: 30000,
      cwd: process.cwd(),
    });

    const samplePath = join(process.cwd(), "data", "sample_financial_model.xlsx");

    return NextResponse.json({
      success: true,
      path: samplePath,
      output: stdout,
      warnings: stderr || undefined,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate sample model: ${errorMessage}` },
      { status: 500 }
    );
  }
}
