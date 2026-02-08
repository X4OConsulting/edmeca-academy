import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const DATA_DIR = join(process.cwd(), "data");
const CONFIG_PATH = join(DATA_DIR, "config.json");

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

export async function GET() {
  try {
    await ensureDataDir();
    if (!existsSync(CONFIG_PATH)) {
      return NextResponse.json({ excel_path: null, last_refreshed: null });
    }
    const content = await readFile(CONFIG_PATH, "utf-8");
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json({ excel_path: null, last_refreshed: null });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataDir();
    const body = await request.json();
    const { excel_path } = body;

    if (!excel_path) {
      return NextResponse.json(
        { error: "excel_path is required" },
        { status: 400 }
      );
    }

    const config = {
      excel_path,
      last_refreshed: null,
    };

    await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
    return NextResponse.json(config);
  } catch {
    return NextResponse.json(
      { error: "Failed to save configuration" },
      { status: 500 }
    );
  }
}
