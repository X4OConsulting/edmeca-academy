import { NextResponse } from "next/server";
import { readFile, access } from "fs/promises";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const DATA_PATH = join(DATA_DIR, "dashboard_data.json");

export async function GET() {
  try {
    await access(DATA_PATH);
    const content = await readFile(DATA_PATH, "utf-8");
    const data = JSON.parse(content);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "No dashboard data available. Please refresh from a financial model first." },
      { status: 404 }
    );
  }
}
