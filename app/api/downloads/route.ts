import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

export const dynamic = "force-dynamic";

function cleanLink(val?: string): string {
  if (!val) return "";
  const trimmed = val.trim().replace(/^["']+|["']+$/g, "").trim();
  if (trimmed === ">" || trimmed === "") return "";
  return trimmed;
}

export async function GET() {
  let prodEnv: Record<string, string> = {};
  try {
    const envProdPath = path.join(process.cwd(), ".env.production");
    if (fs.existsSync(envProdPath)) {
      const content = fs.readFileSync(envProdPath, "utf8");
      prodEnv = dotenv.parse(content);
    }
  } catch {
    // Fallback to process.env if file read fails
  }

  const discordLink = cleanLink(
    prodEnv.NEXT_PUBLIC_DISCORD_LINK ?? process.env.NEXT_PUBLIC_DISCORD_LINK
  );
  const googleDriveLink = cleanLink(
    prodEnv.NEXT_PUBLIC_GOODLE_DRIVE_LINK ??
      process.env.NEXT_PUBLIC_GOODLE_DRIVE_LINK
  );
  const mediafireLink = cleanLink(
    prodEnv.NEXT_PUBLIC_MEDIAFIRE_LINK ?? process.env.NEXT_PUBLIC_MEDIAFIRE_LINK
  );
  const megaLink = cleanLink(
    prodEnv.NEXT_PUBLIC_MEGA_LINK ?? process.env.NEXT_PUBLIC_MEGA_LINK
  );

  return NextResponse.json({
    NEXT_PUBLIC_DISCORD_LINK: discordLink,
    NEXT_PUBLIC_GOODLE_DRIVE_LINK: googleDriveLink,
    NEXT_PUBLIC_MEDIAFIRE_LINK: mediafireLink,
    NEXT_PUBLIC_MEGA_LINK: megaLink,
  });
}
