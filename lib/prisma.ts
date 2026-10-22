import { PrismaClient } from "@prisma/client";
import { getSiteConfig, saveSiteConfig } from "./siteConfig";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  mockAccountChars: any[];
};

const defaultAccountCharacters = [
  {
    name: "AdminDK",
    characterClassId: "00000040-0007-0000-0000-000000000000",
    levelUpPoints: 1500,
    masterLevelUpPoints: 50,
    resets: 12,
    lvl: 400,
    masterlvl: 120,
    strength: 3500,
    agility: 2800,
    vitality: 2000,
    energy: 1500,
    leadership: 0,
  },
  {
    name: "AdminDL",
    characterClassId: "00000040-0011-0000-0000-000000000000",
    levelUpPoints: 2000,
    masterLevelUpPoints: 80,
    resets: 8,
    lvl: 400,
    masterlvl: 95,
    strength: 2500,
    agility: 2200,
    vitality: 1800,
    energy: 1500,
    leadership: 2000,
  },
];

export function getMockAccountCharacters() {
  if (!globalForPrisma.mockAccountChars) {
    globalForPrisma.mockAccountChars = defaultAccountCharacters.map((c) => ({ ...c }));
  }
  return globalForPrisma.mockAccountChars;
}

const mockStore: Record<string, any[]> = {
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
    if (modelName === "openMuWeb_News") {
      return getSiteConfig().news.map((n) => ({
        ...n,
        creationDate: new Date(n.creationDate),
      }));
    }
    if (!mockStore[modelName]) mockStore[modelName] = [];
    return mockStore[modelName];
  };
  return {
    findMany: async ({ where, skip, take }: any = {}) => {
      let list = getList();
      if (where) {
        if (modelName === "guildMember" && where?.Guild?.Name) {
          list = list.filter((item) => item?.Guild?.Name === where.Guild.Name);
        }
        if (modelName === "character" && where?.Name?.in) {
          const names: string[] = Array.isArray(where.Name.in) ? where.Name.in : [];
          list = list.filter((item) => names.includes(item.Name));
        }
      }
      if (typeof skip === "number" && skip > 0) {
        list = list.slice(skip);
      }
      if (typeof take === "number" && take > 0) {
        list = list.slice(0, take);
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
      const record = {
        id: "00000000-0000-4000-8000-" + String(Date.now()).slice(-12).padStart(12, "0"),
        creationDate: new Date(),
        ...data,
      };
      if (modelName === "openMuWeb_News") {
        const currentNews = getSiteConfig().news;
        saveSiteConfig({
          news: [
            {
              id: record.id,
              title: record.title,
              body: record.body,
              author: record.author || "Admin",
              creationDate: new Date().toISOString(),
            },
            ...currentNews,
          ],
        });
        return record;
      }
      const list = getList();
      list.unshift(record);
      return record;
    },
    update: async ({ where, data }: any = {}) => {
      if (modelName === "openMuWeb_News" && where?.id) {
        const currentNews = getSiteConfig().news.map((item) =>
          item.id === where.id ? { ...item, ...data } : item
        );
        saveSiteConfig({ news: currentNews });
      }
      return data ?? {};
    },
    updateMany: async ({ data }: any = {}) => ({ count: 1, ...data }),
    delete: async ({ where }: any = {}) => {
      if (modelName === "openMuWeb_News" && where?.id) {
        const currentNews = getSiteConfig().news.filter((item) => item.id !== where.id);
        saveSiteConfig({ news: currentNews });
        return {};
      }
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
            return getMockAccountCharacters();
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