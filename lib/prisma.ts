import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const mockStore: Record<string, any[]> = {
  openMuWeb_News: [
    {
      id: "00000000-0000-4000-8000-000000000001",
      title: "เปิดให้บริการเซิร์ฟเวอร์ Mu Origisns S6E3 อย่างเป็นทางการ",
      body: "เซิร์ฟเวอร์ Mu Origisns S6E3 พร้อมเปิดให้บริการแล้ววันนี้! สมัครสมาชิก ดาวน์โหลดตัวเกมตัวเต็ม และเข้าร่วมการผจญภัยบนทวีป MU ได้ทันที อัตราคูณค่าประสบการณ์ x100 อัตราดรอปไอเทมยอดเยี่ยม (Excellent) 50% ในรูปแบบ Play2Win สมดุลทุกสายอาชีพ",
      author: "Admin",
      creationDate: new Date("2026-10-20T12:00:00Z"),
    },
    {
      id: "00000000-0000-4000-8000-000000000002",
      title: "ตารางการลงทะเบียนและศึกชิงปราสาท Castle Siege",
      body: "หัวหน้ากิลด์สามารถลงทะเบียนและส่งมอบ Sign of Lord สำหรับศึกชิงปราสาท Valley of Loren ที่กำลังจะมาถึงได้แล้ว รวบรวมพันธมิตรของคุณ ป้องกันห้องบัลลังก์ และชิงสิทธิ์เข้าใช้งาน Lord Mix พร้อมเกียรติยศสูงสุดประจำเซิร์ฟเวอร์",
      author: "Admin",
      creationDate: new Date("2026-10-18T15:30:00Z"),
    },
    {
      id: "00000000-0000-4000-8000-000000000003",
      title: "อัปเดตสมดุลปราสาทเลือด (Blood Castle) และลานปีศาจ (Devil Square)",
      body: "ปรับความหนาแน่นของมอนสเตอร์และอัตราดรอปเพชร Jewel of Bless ใน Blood Castle ชั้น 7 และ Devil Square ชั้น 6 เพื่อให้คุ้มค่ากับการเล่นเป็นปาร์ตี้มากยิ่งขึ้น โบนัสค่าประสบการณ์ปาร์ตี้เพิ่มขึ้นสูงสุดถึง 50% เมื่อครบปาร์ตี้ 5 คน",
      author: "Admin",
      creationDate: new Date("2026-10-15T09:00:00Z"),
    },
  ],
  guild: [
    { Name: "Olympus", Score: 1250 },
    { Name: "Titans", Score: 980 },
    { Name: "Valkyrie", Score: 740 },
    { Name: "Aethelgard", Score: 615 },
    { Name: "Vanguard", Score: 490 },
  ],
  guildMember: [
    { Status: 2, Character: { Name: "Aetherius" }, Guild: { Name: "Olympus" } },
    { Status: 1, Character: { Name: "BladeMaster" }, Guild: { Name: "Olympus" } },
    { Status: 0, Character: { Name: "GrandWizard" }, Guild: { Name: "Olympus" } },
    { Status: 2, Character: { Name: "Sovereign" }, Guild: { Name: "Titans" } },
    { Status: 0, Character: { Name: "IronFist" }, Guild: { Name: "Titans" } },
    { Status: 2, Character: { Name: "Sylvanas" }, Guild: { Name: "Valkyrie" } },
    { Status: 0, Character: { Name: "Freya" }, Guild: { Name: "Valkyrie" } },
    { Status: 2, Character: { Name: "ArcaneSM" }, Guild: { Name: "Aethelgard" } },
    { Status: 2, Character: { Name: "Valerius" }, Guild: { Name: "Vanguard" } },
  ],
  account: [],
  character: [],
  statAttribute: [],
  itemStorage: [],
};

const mockTopCharacters = [
  {
    Name: "Aetherius",
    CharacterClassId: "00000040-0007-0000-0000-000000000000",
    CurrentMapId: "00000300-0000-0000-0000-000000000000",
    resets: 45,
    lvl: 400,
    masterlvl: 200,
    PlayerKillCount: 142,
  },
  {
    Name: "Sovereign",
    CharacterClassId: "00000040-0011-0000-0000-000000000000",
    CurrentMapId: "00000300-0002-0000-0000-000000000000",
    resets: 42,
    lvl: 400,
    masterlvl: 185,
    PlayerKillCount: 98,
  },
  {
    Name: "ArcaneSM",
    CharacterClassId: "00000040-0003-0000-0000-000000000000",
    CurrentMapId: "00000300-0007-0000-0000-000000000000",
    resets: 39,
    lvl: 398,
    masterlvl: 160,
    PlayerKillCount: 76,
  },
  {
    Name: "Sylvanas",
    CharacterClassId: "00000040-000b-0000-0000-000000000000",
    CurrentMapId: "00000300-0003-0000-0000-000000000000",
    resets: 36,
    lvl: 392,
    masterlvl: 140,
    PlayerKillCount: 54,
  },
  {
    Name: "Valerius",
    CharacterClassId: "00000040-000d-0000-0000-000000000000",
    CurrentMapId: "00000300-0008-0000-0000-000000000000",
    resets: 31,
    lvl: 385,
    masterlvl: 120,
    PlayerKillCount: 41,
  },
];

function createMockModel(modelName: string) {
  const getList = () => {
    if (!mockStore[modelName]) mockStore[modelName] = [];
    return mockStore[modelName];
  };
  return {
    findMany: async ({ where }: any = {}) => {
      const list = getList();
      if (!where) return list;
      if (modelName === "guildMember" && where?.Guild?.Name) {
        return list.filter((item) => item?.Guild?.Name === where.Guild.Name);
      }
      if (modelName === "character" && where?.Name?.in) {
        const names: string[] = Array.isArray(where.Name.in) ? where.Name.in : [];
        return list.filter((item) => names.includes(item.Name));
      }
      return list;
    },
    findFirst: async ({ where }: any = {}) => {
      const list = getList();
      if (!where) return list[0] ?? null;
      return (
        list.find((item) =>
          Object.entries(where).every(([k, v]) => item[k] === v)
        ) ?? null
      );
    },
    findUnique: async ({ where }: any = {}) => {
      const list = getList();
      if (!where) return list[0] ?? null;
      return (
        list.find((item) =>
          Object.entries(where).every(([k, v]) => item[k] === v)
        ) ?? null
      );
    },
    create: async ({ data }: any = {}) => {
      const list = getList();
      const record = {
        id: "00000000-0000-4000-8000-" + String(Date.now()).slice(-12).padStart(12, "0"),
        creationDate: new Date(),
        ...data,
      };
      list.unshift(record);
      return record;
    },
    update: async ({ data }: any = {}) => data ?? {},
    updateMany: async ({ data }: any = {}) => ({ count: 1, ...data }),
    delete: async ({ where }: any = {}) => {
      const list = getList();
      if (where?.id) {
        mockStore[modelName] = list.filter((item) => item.id !== where.id);
      }
      return {};
    },
    count: async () => 0,
  };
}

let dbConnectionFailed = false;

function createSafePrisma(): PrismaClient {
  let rawClient: any = null;
  const dbUrl = process.env.DATABASE_URL?.trim() || "";
  // Skip default placeholder localhost:5432/openmu with testz password if not configured
  const isDefaultPlaceholder = dbUrl === "postgresql://postgres:testz@localhost:5432/openmu";
  if (dbUrl !== "" && !isDefaultPlaceholder) {
    try {
      rawClient = globalForPrisma.prisma || new PrismaClient();
      if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = rawClient;
    } catch {
      rawClient = null;
    }
  }

  return new Proxy({} as PrismaClient, {
    get(_, prop: string) {
      if (prop === "then") return undefined;
      if (prop === "$queryRaw" || prop === "$executeRaw") {
        return async (...args: any[]) => {
          if (rawClient && !dbConnectionFailed) {
            try {
              return await rawClient[prop](...args);
            } catch {
              dbConnectionFailed = true;
            }
          }
          const queryText = Array.isArray(args[0]) ? args[0].join(" ") : String(args[0] || "");
          if (queryText.includes("WHERE a.\"LoginName\"")) {
            return [];
          }
          if (queryText.includes("ORDER BY resets DESC") || queryText.includes("PlayerKillCount")) {
            return mockTopCharacters;
          }
          return [];
        };
      }
      if (prop === "$transaction") {
        return async (ops: any) => {
          if (rawClient && !dbConnectionFailed) {
            try {
              return await rawClient.$transaction(ops);
            } catch {
              dbConnectionFailed = true;
              return Array.isArray(ops) ? Promise.all(ops) : [];
            }
          }
          return Array.isArray(ops) ? Promise.all(ops) : [];
        };
      }
      if (prop === "$connect" || prop === "$disconnect") {
        return async () => {};
      }

      const mockModel = createMockModel(prop);
      if (!rawClient || !rawClient[prop] || dbConnectionFailed) {
        return mockModel;
      }

      return new Proxy(mockModel, {
        get(target: any, method: string) {
          return async (...args: any[]) => {
            if (dbConnectionFailed) {
              return target[method] ? await target[method](...args) : null;
            }
            try {
              return await rawClient[prop][method](...args);
            } catch {
              dbConnectionFailed = true;
              return target[method] ? await target[method](...args) : null;
            }
          };
        },
      });
    },
  });
}

export const prisma = createSafePrisma();