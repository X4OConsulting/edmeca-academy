import { NextRequest, NextResponse } from "next/server";
import { readFile, access } from "fs/promises";
import { join } from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);
const DATA_DIR = join(process.cwd(), "data");
const CONFIG_PATH = join(DATA_DIR, "config.json");
const SCRIPT_PATH = join(process.cwd(), "scripts", "refresh_data.py");

export async function POST(request: NextRequest) {
  try {
    let excelPath: string | null = null;

    // Check if a path was provided in the request body
    const body = await request.json().catch(() => ({}));
    if (body.excel_path) {
      excelPath = body.excel_path;
    } else {
      // Read from config
      try {
        await access(CONFIG_PATH);
        const config = JSON.parse(await readFile(CONFIG_PATH, "utf-8"));
        excelPath = config.excel_path;
      } catch {
        return NextResponse.json(
          { error: "No financial model configured. Please set the file path first." },
          { status: 400 }
        );
      }
    }

    if (!excelPath) {
      return NextResponse.json(
        { error: "No Excel file path provided" },
        { status: 400 }
      );
    }

    // Run the Python refresh script
    const { stdout, stderr } = await execFileAsync("python3", [SCRIPT_PATH, excelPath], {
      timeout: 60000,
      cwd: process.cwd(),
    });

    return NextResponse.json({
      success: true,
      message: "Dashboard data refreshed successfully",
      output: stdout,
      warnings: stderr || undefined,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to refresh data: ${errorMessage}` },
      { status: 500 }
    );
  }
}
