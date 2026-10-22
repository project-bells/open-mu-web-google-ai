import fs from "fs";
import path from "path";
import dotenv from "dotenv";

export interface ServerSpecItem {
  id: string;
  labelTh: string;
  labelEn: string;
  valueTh: string;
  valueEn: string;
}

export interface MenuItemConfig {
  id: string;
  labelTh: string;
  labelEn: string;
  href: string;
  enabled: boolean;
}

export interface CharacterFeatureSettings {
  pk: {
    enabled: boolean;
    zenCost: number;
  };
  reset: {
    enabled: boolean;
    zenCost: number;
    requiredLevel: number;
    maxReset: number;
  };
  relevel: {
    enabled: boolean;
    zenCost: number;
    targetLevel: number;
  };
  addStats: {
    enabled: boolean;
  };
  resetStats: {
    enabled: boolean;
    zenCost: number;
  };
}

export interface NewsItemConfig {
  id: string;
  title: string;
  body: string;
  author: string;
  creationDate: string;
}

export interface SiteConfig {
  downloads: {
    NEXT_PUBLIC_DISCORD_LINK: string;
    NEXT_PUBLIC_GOODLE_DRIVE_LINK: string;
    NEXT_PUBLIC_MEDIAFIRE_LINK: string;
    NEXT_PUBLIC_MEGA_LINK: string;
  };
  serverInfo: {
    serverName: string;
    taglineTh: string;
    taglineEn: string;
    heroDescriptionTh: string;
    heroDescriptionEn: string;
    facebookUrl: string;
    telegramUrl: string;
    playOnlineEnabled: boolean;
    specs: ServerSpecItem[];
    play2WinTitleTh: string;
    play2WinTitleEn: string;
    play2WinBodyTh: string;
    play2WinBodyEn: string;
    introTitleTh: string;
    introTitleEn: string;
    introBodyTh: string;
    introBodyEn: string;
  };
  menus: MenuItemConfig[];
  characterSettings: CharacterFeatureSettings;
  news: NewsItemConfig[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const CONFIG_FILE = path.join(DATA_DIR, "site-config.json");
const ENV_PROD_FILE = path.join(process.cwd(), ".env.production");

function cleanEnvValue(val?: string): string {
  if (!val) return "";
  const trimmed = val.trim().replace(/^["']+|["']+$/g, "").trim();
  return trimmed === ">" ? "" : trimmed;
}

export function readEnvProduction(): Record<string, string> {
  try {
    if (fs.existsSync(ENV_PROD_FILE)) {
      const content = fs.readFileSync(ENV_PROD_FILE, "utf8");
      return dotenv.parse(content);
    }
  } catch (e) {
    console.error("Failed to read .env.production:", e);
  }
  return {};
}

export function getAdminPassword(): string {
  const prodEnv = readEnvProduction();
  const fromProdFile = cleanEnvValue(prodEnv.ADMIN_PASSWORD);
  if (fromProdFile) return fromProdFile;
  const fromProcess = cleanEnvValue(process.env.ADMIN_PASSWORD);
  if (fromProcess) return fromProcess;
  return "admin1234";
}

export function updateEnvProductionLinks(downloads: SiteConfig["downloads"]) {
  try {
    let existingLines: string[] = [];
    if (fs.existsSync(ENV_PROD_FILE)) {
      existingLines = fs.readFileSync(ENV_PROD_FILE, "utf8").split(/\r?\n/);
    }

    const keysToUpdate: Record<string, string> = {
      NEXT_PUBLIC_DISCORD_LINK: downloads.NEXT_PUBLIC_DISCORD_LINK || "",
      NEXT_PUBLIC_GOODLE_DRIVE_LINK: downloads.NEXT_PUBLIC_GOODLE_DRIVE_LINK || "",
      NEXT_PUBLIC_MEDIAFIRE_LINK: downloads.NEXT_PUBLIC_MEDIAFIRE_LINK || "",
      NEXT_PUBLIC_MEGA_LINK: downloads.NEXT_PUBLIC_MEGA_LINK || "",
    };

    const seenKeys = new Set<string>();
    const updatedLines = existingLines.map((line) => {
      const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=/);
      if (match && match[1] in keysToUpdate) {
        const key = match[1];
        seenKeys.add(key);
        return `${key}="${keysToUpdate[key]}"`;
      }
      return line;
    });

    for (const [key, val] of Object.entries(keysToUpdate)) {
      if (!seenKeys.has(key)) {
        updatedLines.push(`${key}="${val}"`);
      }
    }

    // Ensure ADMIN_PASSWORD is present in .env.production
    const hasAdminPass = updatedLines.some((l) => /^\s*ADMIN_PASSWORD\s*=/.test(l));
    if (!hasAdminPass) {
      updatedLines.push(`ADMIN_PASSWORD="${getAdminPassword()}"`);
    }

    const finalContent = updatedLines.filter((l, idx, arr) => !(l === "" && idx === arr.length - 1)).join("\n") + "\n";
    fs.writeFileSync(ENV_PROD_FILE, finalContent, "utf8");
  } catch (e) {
    console.error("Failed to update .env.production:", e);
  }
}

export function getDefaultSiteConfig(): SiteConfig {
  const prodEnv = readEnvProduction();

  const discordLink = cleanEnvValue(
    prodEnv.NEXT_PUBLIC_DISCORD_LINK ?? process.env.NEXT_PUBLIC_DISCORD_LINK
  );
  const gdLink = cleanEnvValue(
    prodEnv.NEXT_PUBLIC_GOODLE_DRIVE_LINK ?? process.env.NEXT_PUBLIC_GOODLE_DRIVE_LINK
  );
  const mfLink = cleanEnvValue(
    prodEnv.NEXT_PUBLIC_MEDIAFIRE_LINK ??
      process.env.NEXT_PUBLIC_MEDIAFIRE_LINK ??
      "https://www.mediafire.com/file/y0cu54tjwrp1ppl/MuOrigins-Client.rar/file"
  );
  const megaLink = cleanEnvValue(
    prodEnv.NEXT_PUBLIC_MEGA_LINK ??
      process.env.NEXT_PUBLIC_MEGA_LINK ??
      "https://mega.nz/file/zlBEhYLB#MgmpfUPV02ylIy_S_oIbMaXa77uwa6dwke4SFaQAB2Q"
  );

  return {
    downloads: {
      NEXT_PUBLIC_DISCORD_LINK: discordLink,
      NEXT_PUBLIC_GOODLE_DRIVE_LINK: gdLink,
      NEXT_PUBLIC_MEDIAFIRE_LINK: mfLink,
      NEXT_PUBLIC_MEGA_LINK: megaLink,
    },
    serverInfo: {
      serverName: "Mu Origisns S6E3",
      taglineTh: "Season 6 Episode 3 · คูณประสบการณ์ x100 · แนว Play-to-Win",
      taglineEn: "Season 6 Episode 3 · x100 Experience · Play-to-Win",
      heroDescriptionTh:
        "สร้างตัวละครสุดแกร่ง พิชิตปราสาทเลือด (Blood Castle) และศึกชิงปราสาท (Castle Siege) พร้อมก้าวสู่อันดับสูงสุดแห่งทวีป MU ในเซิร์ฟเวอร์สุดคลาสสิกที่สมดุล",
      heroDescriptionEn:
        "Forge your character, conquer Blood Castle and Castle Siege, and climb the realm rankings in a balanced classic MMORPG experience.",
      facebookUrl: "https://www.facebook.com/profile.php?id=61595685382415",
      telegramUrl: "https://t.me/muorigins6e3",
      playOnlineEnabled: true,
      specs: [
        {
          id: "version",
          labelTh: "เวอร์ชันเซิร์ฟเวอร์",
          labelEn: "Server Version",
          valueTh: "Season 6 Episode 3",
          valueEn: "Season 6 Episode 3",
        },
        {
          id: "exp",
          labelTh: "อัตราคูณค่าประสบการณ์ (EXP)",
          labelEn: "Experience Rate",
          valueTh: "x100",
          valueEn: "x100",
        },
        {
          id: "drop_exc",
          labelTh: "อัตราดรอปไอเทมยอดเยี่ยม (Excellent)",
          labelEn: "Drop Rate Excellent",
          valueTh: "50%",
          valueEn: "50%",
        },
        {
          id: "drop_zen",
          labelTh: "อัตราดรอปเงิน (Zen)",
          labelEn: "Drop Rate Zen",
          valueTh: "70%",
          valueEn: "70%",
        },
        {
          id: "party_exp",
          labelTh: "โบนัส EXP ปาร์ตี้",
          labelEn: "Party Bonus Exp",
          valueTh: "25% · 30% · 50%",
          valueEn: "25% · 30% · 50%",
        },
        {
          id: "elf_buff",
          labelTh: "บัฟทหารเอลฟ์ (Elf Soldier)",
          labelEn: "Elf Soldier Buff",
          valueTh: "ถึงเลเวล 250 และ 1 รีเซ็ต",
          valueEn: "Up to Level 250 & 1 Reset",
        },
        {
          id: "conn_limit",
          labelTh: "จำกัดการเชื่อมต่อ",
          labelEn: "Connection Limit",
          valueTh: "สูงสุด 2 จอ ต่อ IP/HWID",
          valueEn: "Max 2 Accounts per IP/HWID",
        },
        {
          id: "npc_shop",
          labelTh: "ร้านค้า NPC",
          labelEn: "NPC Shops",
          valueTh: "ปรับแต่งสมดุลสายคลาสสิก",
          valueEn: "Configured for Low-Exp Progression",
        },
      ],
      play2WinTitleTh: "แนวทางเซิร์ฟเวอร์ Play2Win",
      play2WinTitleEn: "Play2Win Philosophy",
      play2WinBodyTh:
        "ไม่มีระบบ Web-Shop ขายไอเทมเทพ ไม่มี Cash-Shop เอาเปรียบผู้เล่น มีเพียงระบบ VIP (ไม่มีเซิร์ฟแยก) และเครดิตสำหรับฟีเจอร์เสริมเท่านั้น อุปกรณ์และไอเทมทุกชิ้นหาได้จากการล่าบอส กิจกรรมบุกเมือง และการแลกเปลี่ยนภายในเกมอย่างเท่าเทียม",
      play2WinBodyEn:
        "No Web-Shop, no Cash-Shop, only VIP System (without VIP Server) & Web-Credits for Premium Modules. Every piece of gear is earned through boss hunts, invasions, and in-game trading.",
      introTitleTh: "แนะนำโลกแห่ง Mu Origisns S6E3",
      introTitleEn: "MU Introduction",
      introBodyTh:
        "MU Online เป็นเกมแนว 3D MMORPG แฟนตาซีระดับตำนานจากเกาหลี ที่มีฉากหลังอยู่บนทวีป MU อันกว้างใหญ่ ผู้เล่นสามารถเลือกสายอาชีพ ค้นหาชุดเกราะและปีกสุดอลังการ พร้อมร่วมต่อสู้ในสงครามกิลด์สุดยิ่งใหญ่ในรูปแบบคลาสสิก Season 6 Episode 3",
      introBodyEn:
        "MU Online, produced by Webzen Inc, is a full 3D MMORPG and one of the leading fantasy online role-playing games developed in Korea. Set across the legendary Continent of MU, it established the foundational design of classic 3D isometric action RPGs.",
    },
    menus: [
      { id: "home", labelTh: "หน้าแรก", labelEn: "Home", href: "/", enabled: true },
      { id: "info", labelTh: "ข้อมูลเซิร์ฟเวอร์", labelEn: "Server Info", href: "/info", enabled: true },
      { id: "ranking", labelTh: "จัดอันดับ", labelEn: "Rankings", href: "/ranking", enabled: true },
      { id: "download", labelTh: "ดาวน์โหลด", labelEn: "Download", href: "/download", enabled: true },
      { id: "register", labelTh: "สมัครสมาชิก", labelEn: "Register", href: "/register", enabled: true },
    ],
    characterSettings: {
      pk: {
        enabled: true,
        zenCost: Number(process.env.NEXT_PUBLIC_ZEN_TO_PKCLEAR || 1000000),
      },
      reset: {
        enabled: true,
        zenCost: Number(process.env.NEXT_PUBLIC_ZEN_TO_RESET || 5000000),
        requiredLevel: Number(process.env.LVL_TO_RESET || 400),
        maxReset: Number(process.env.MAX_RESET || 100),
      },
      relevel: {
        enabled: true,
        zenCost: 2000000,
        targetLevel: 400,
      },
      addStats: {
        enabled: true,
      },
      resetStats: {
        enabled: true,
        zenCost: Number(process.env.NEXT_PUBLIC_ZEN_TO_RESET_STATS || 3000000),
      },
    },
    news: [
      {
        id: "00000000-0000-4000-8000-000000000001",
        title: "เปิดให้บริการเซิร์ฟเวอร์ Mu Origisns S6E3 อย่างเป็นทางการ",
        body: "เซิร์ฟเวอร์ Mu Origisns S6E3 พร้อมเปิดให้บริการแล้ววันนี้! สมัครสมาชิก ดาวน์โหลดตัวเกมตัวเต็ม และเข้าร่วมการผจญภัยบนทวีป MU ได้ทันที อัตราคูณค่าประสบการณ์ x100 อัตราดรอปไอเทมยอดเยี่ยม (Excellent) 50% ในรูปแบบ Play2Win สมดุลทุกสายอาชีพ",
        author: "Admin",
        creationDate: "2026-10-20T12:00:00.000Z",
      },
      {
        id: "00000000-0000-4000-8000-000000000002",
        title: "ตารางการลงทะเบียนและศึกชิงปราสาท Castle Siege",
        body: "หัวหน้ากิลด์สามารถลงทะเบียนและส่งมอบ Sign of Lord สำหรับศึกชิงปราสาท Valley of Loren ที่กำลังจะมาถึงได้แล้ว รวบรวมพันธมิตรของคุณ ป้องกันห้องบัลลังก์ และชิงสิทธิ์เข้าใช้งาน Lord Mix พร้อมเกียรติยศสูงสุดประจำเซิร์ฟเวอร์",
        author: "Admin",
        creationDate: "2026-10-18T15:30:00.000Z",
      },
      {
        id: "00000000-0000-4000-8000-000000000003",
        title: "อัปเดตสมดุลปราสาทเลือด (Blood Castle) และลานปีศาจ (Devil Square)",
        body: "ปรับความหนาแน่นของมอนสเตอร์และอัตราดรอปเพชร Jewel of Bless ใน Blood Castle ชั้น 7 และ Devil Square ชั้น 6 เพื่อให้คุ้มค่ากับการเล่นเป็นปาร์ตี้มากยิ่งขึ้น โบนัสค่าประสบการณ์ปาร์ตี้เพิ่มขึ้นสูงสุดถึง 50% เมื่อครบปาร์ตี้ 5 คน",
        author: "Admin",
        creationDate: "2026-10-15T09:00:00.000Z",
      },
    ],
  };
}

export function getSiteConfig(): SiteConfig {
  const defaults = getDefaultSiteConfig();
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, "utf8");
      const parsed = JSON.parse(raw) as Partial<SiteConfig>;
      // Always merge .env.production links if they were edited directly in .env.production
      const prodEnv = readEnvProduction();
      const mergedDownloads = {
        NEXT_PUBLIC_DISCORD_LINK:
          parsed.downloads?.NEXT_PUBLIC_DISCORD_LINK ??
          cleanEnvValue(prodEnv.NEXT_PUBLIC_DISCORD_LINK) ??
          defaults.downloads.NEXT_PUBLIC_DISCORD_LINK,
        NEXT_PUBLIC_GOODLE_DRIVE_LINK:
          parsed.downloads?.NEXT_PUBLIC_GOODLE_DRIVE_LINK ??
          cleanEnvValue(prodEnv.NEXT_PUBLIC_GOODLE_DRIVE_LINK) ??
          defaults.downloads.NEXT_PUBLIC_GOODLE_DRIVE_LINK,
        NEXT_PUBLIC_MEDIAFIRE_LINK:
          parsed.downloads?.NEXT_PUBLIC_MEDIAFIRE_LINK ??
          cleanEnvValue(prodEnv.NEXT_PUBLIC_MEDIAFIRE_LINK) ??
          defaults.downloads.NEXT_PUBLIC_MEDIAFIRE_LINK,
        NEXT_PUBLIC_MEGA_LINK:
          parsed.downloads?.NEXT_PUBLIC_MEGA_LINK ??
          cleanEnvValue(prodEnv.NEXT_PUBLIC_MEGA_LINK) ??
          defaults.downloads.NEXT_PUBLIC_MEGA_LINK,
      };

      return {
        downloads: mergedDownloads,
        serverInfo: {
          ...defaults.serverInfo,
          ...(parsed.serverInfo || {}),
          specs: parsed.serverInfo?.specs || defaults.serverInfo.specs,
        },
        menus: parsed.menus || defaults.menus,
        characterSettings: {
          pk: { ...defaults.characterSettings.pk, ...(parsed.characterSettings?.pk || {}) },
          reset: { ...defaults.characterSettings.reset, ...(parsed.characterSettings?.reset || {}) },
          relevel: { ...defaults.characterSettings.relevel, ...(parsed.characterSettings?.relevel || {}) },
          addStats: { ...defaults.characterSettings.addStats, ...(parsed.characterSettings?.addStats || {}) },
          resetStats: {
            ...defaults.characterSettings.resetStats,
            ...(parsed.characterSettings?.resetStats || {}),
          },
        },
        news: Array.isArray(parsed.news) ? parsed.news : defaults.news,
      };
    }
  } catch (e) {
    console.error("Error reading site-config.json:", e);
  }
  return defaults;
}

export function saveSiteConfig(partial: Partial<SiteConfig>): SiteConfig {
  const current = getSiteConfig();
  const nextConfig: SiteConfig = {
    downloads: partial.downloads ? { ...current.downloads, ...partial.downloads } : current.downloads,
    serverInfo: partial.serverInfo ? { ...current.serverInfo, ...partial.serverInfo } : current.serverInfo,
    menus: partial.menus ? partial.menus : current.menus,
    characterSettings: partial.characterSettings
      ? {
          pk: { ...current.characterSettings.pk, ...(partial.characterSettings.pk || {}) },
          reset: { ...current.characterSettings.reset, ...(partial.characterSettings.reset || {}) },
          relevel: { ...current.characterSettings.relevel, ...(partial.characterSettings.relevel || {}) },
          addStats: { ...current.characterSettings.addStats, ...(partial.characterSettings.addStats || {}) },
          resetStats: {
            ...current.characterSettings.resetStats,
            ...(partial.characterSettings.resetStats || {}),
          },
        }
      : current.characterSettings,
    news: partial.news ? partial.news : current.news,
  };

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(nextConfig, null, 2), "utf8");
    if (partial.downloads) {
      updateEnvProductionLinks(nextConfig.downloads);
    }
  } catch (e) {
    console.error("Error saving site-config.json:", e);
  }

  return nextConfig;
}
