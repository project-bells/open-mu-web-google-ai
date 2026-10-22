"use client"

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import type {
  SiteConfig,
  ServerSpecItem,
  MenuItemConfig,
  CharacterFeatureSettings,
  NewsItemConfig,
} from "@/lib/siteConfig";
import {
  Newspaper,
  Download,
  Server,
  Menu,
  Users,
  Plus,
  Trash2,
  Save,
  Edit3,
  Check,
  X,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

type AdminTab = "news" | "downloads" | "server" | "menus" | "characters";

export default function AdminDashboard({
  initialConfig,
  isAuthorizedServer,
  initialTab,
}: {
  initialConfig: SiteConfig;
  isAuthorizedServer: boolean;
  initialTab?: AdminTab;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryTab = searchParams?.get("tab") as AdminTab | null;

  const [activeTab, setActiveTab] = useState<AdminTab>(
    queryTab || initialTab || "news"
  );
  const [isAuthorized, setIsAuthorized] = useState(isAuthorizedServer);
  const [saving, setSaving] = useState(false);

  // State for each section
  const [newsList, setNewsList] = useState<NewsItemConfig[]>(initialConfig.news || []);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newAuthor, setNewAuthor] = useState("Admin");
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const [downloads, setDownloads] = useState<SiteConfig["downloads"]>(
    initialConfig.downloads
  );
  const [serverInfo, setServerInfo] = useState<SiteConfig["serverInfo"]>(
    initialConfig.serverInfo
  );
  const [menus, setMenus] = useState<MenuItemConfig[]>(initialConfig.menus);
  const [charSettings, setCharSettings] = useState<CharacterFeatureSettings>(
    initialConfig.characterSettings
  );

  useEffect(() => {
    if (queryTab && ["news", "downloads", "server", "menus", "characters"].includes(queryTab)) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (isAuthorizedServer || role === "GAME_MASTER") {
      setIsAuthorized(true);
    }
  }, [isAuthorizedServer]);

  async function savePartialConfig(partial: Partial<SiteConfig>, successMsg: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partial),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(successMsg || data.message);
        if (data.config) {
          setDownloads(data.config.downloads);
          setServerInfo(data.config.serverInfo);
          setMenus(data.config.menus);
          setCharSettings(data.config.characterSettings);
          setNewsList(data.config.news);
        }
        window.dispatchEvent(new Event("site-config-updated"));
        router.refresh();
      } else {
        toast.error(data.message || "เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch {
      toast.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setSaving(false);
    }
  }

  // News handlers
  async function handleAddNews(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) {
      toast.error("กรุณากรอกหัวข้อและเนื้อหาข่าวสารให้ครบถ้วน");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          body: newBody.trim(),
          author: newAuthor.trim() || "Admin",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("เพิ่มประกาศข่าวสารเรียบร้อยแล้ว");
        setNewTitle("");
        setNewBody("");
        const refreshRes = await fetch("/api/settings", { cache: "no-store" });
        if (refreshRes.ok) {
          const fresh = await refreshRes.json();
          setNewsList(fresh.news || []);
        }
        router.refresh();
      } else {
        toast.error(data.message || "ไม่สามารถเพิ่มข่าวสารได้");
      }
    } finally {
      setSaving(false);
    }
  }

  function startEditNews(item: NewsItemConfig) {
    setEditingNewsId(item.id);
    setEditTitle(item.title);
    setEditBody(item.body);
  }

  async function handleSaveEditNews(id: string) {
    if (!editTitle.trim() || !editBody.trim()) {
      toast.error("กรุณากรอกหัวข้อและเนื้อหาให้ครบถ้วน");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle.trim(), body: editBody.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "แก้ไขข่าวสารสำเร็จ");
        setNewsList((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, title: editTitle.trim(), body: editBody.trim() } : n
          )
        );
        setEditingNewsId(null);
        router.refresh();
      } else {
        toast.error(data.message || "เกิดข้อผิดพลาด");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteNews(id: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "ลบข่าวสารเรียบร้อยแล้ว");
        setNewsList((prev) => prev.filter((n) => n.id !== id));
        router.refresh();
      } else {
        toast.error(data.message || "ไม่สามารถลบข่าวสารได้");
      }
    } finally {
      setSaving(false);
    }
  }

  // Server Spec helpers
  function addServerSpec() {
    const newSpec: ServerSpecItem = {
      id: "spec_" + Date.now(),
      labelTh: "หัวข้อข้อมูลใหม่",
      labelEn: "New Specification",
      valueTh: "รายละเอียด",
      valueEn: "Value",
    };
    setServerInfo((prev) => ({
      ...prev,
      specs: [...prev.specs, newSpec],
    }));
  }

  function updateServerSpec(index: number, field: keyof ServerSpecItem, value: string) {
    setServerInfo((prev) => {
      const nextSpecs = [...prev.specs];
      nextSpecs[index] = { ...nextSpecs[index], [field]: value };
      return { ...prev, specs: nextSpecs };
    });
  }

  function removeServerSpec(index: number) {
    setServerInfo((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  }

  // Menu helpers
  function addMenuItem() {
    const newMenu: MenuItemConfig = {
      id: "menu_" + Date.now(),
      labelTh: "เมนูใหม่",
      labelEn: "New Menu",
      href: "/",
      enabled: true,
    };
    setMenus((prev) => [...prev, newMenu]);
  }

  function updateMenuItem(index: number, field: keyof MenuItemConfig, value: any) {
    setMenus((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function removeMenuItem(index: number) {
    setMenus((prev) => prev.filter((_, i) => i !== index));
  }

  if (!isAuthorized) {
    return (
      <div className="rounded-xl bg-slate-950/80 border border-amber-500/30 p-8 flex flex-col items-center text-center gap-4">
        <ShieldAlert className="w-12 h-12 text-amber-400" />
        <h1 className="font-display text-2xl font-bold text-slate-100">
          เฉพาะผู้ดูแลระบบ (Admin Only)
        </h1>
        <p className="text-sm text-slate-300 max-w-md leading-relaxed">
          กรุณาเข้าสู่ระบบผ่านกล่อง <strong className="text-amber-400">&ldquo;เข้าสู่ระบบบัญชี&rdquo;</strong> ด้านบน
          โดยใช้ชื่อผู้ใช้ <code className="px-2 py-0.5 rounded bg-slate-900 text-amber-300">admin</code> และรหัสผ่านที่ตั้งค่าไว้ในไฟล์{" "}
          <code className="px-2 py-0.5 rounded bg-slate-900 text-amber-300">.env.production</code> (ตัวแปร{" "}
          <code className="px-2 py-0.5 rounded bg-slate-900 text-amber-300">ADMIN_PASSWORD</code>)
        </p>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: "news", label: "จัดการข่าวสาร", icon: <Newspaper className="w-4 h-4" /> },
    { id: "downloads", label: "ลิงก์ดาวน์โหลด", icon: <Download className="w-4 h-4" /> },
    { id: "server", label: "ข้อมูลเซิร์ฟเวอร์", icon: <Server className="w-4 h-4" /> },
    { id: "menus", label: "จัดการเมนู", icon: <Menu className="w-4 h-4" /> },
    {
      id: "characters",
      label: "ตั้งค่าตัวละคร (PK / RESET / Relevel)",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-amber-400 tracking-wide">
            ระบบจัดการแอดมิน (Admin Management System)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            จัดการข่าวสาร ลิงก์ดาวน์โหลด ข้อมูลเซิร์ฟเวอร์ เมนูเว็บไซต์ และเปิด/ปิดระบบจัดการตัวละคร (PK, RESET, Relevel)
          </p>
        </div>
        <Link
          href="/characters"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300 transition-colors self-start sm:self-auto shrink-0"
        >
          <span>ดูหน้าจัดการตัวละคร</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-4">
        {tabs.map((t) => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                active
                  ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/15"
                  : "bg-slate-950/70 hover:bg-slate-900 text-slate-300 border border-slate-800"
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: NEWS MANAGEMENT */}
      {activeTab === "news" && (
        <div className="flex flex-col gap-6">
          <form
            onSubmit={handleAddNews}
            className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-6 flex flex-col gap-4"
          >
            <h2 className="font-display text-lg font-bold text-slate-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              <span>เพิ่มประกาศข่าวสารใหม่</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  หัวข้อข่าวสาร (Title)
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="กรอกหัวข้อประกาศข่าวสาร..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  ชื่อผู้โพสต์ (Author)
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Admin"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                เนื้อหาข่าวสาร (Content)
              </label>
              <textarea
                rows={5}
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="เขียนรายละเอียดประกาศข่าวสาร..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>โพสต์ประกาศข่าวสาร</span>
            </button>
          </form>

          <div className="flex flex-col gap-4">
            <h3 className="font-display text-base font-bold text-slate-200">
              รายการข่าวสารทั้งหมด ({newsList.length} รายการ)
            </h3>

            {newsList.length === 0 && (
              <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-6 text-center text-sm text-slate-400">
                ยังไม่มีประกาศข่าวสาร
              </div>
            )}

            {newsList.map((item) => {
              const isEditing = editingNewsId === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-5 flex flex-col gap-3"
                >
                  {isEditing ? (
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-amber-500/50 text-sm font-bold text-slate-100 focus:outline-none"
                      />
                      <textarea
                        rows={4}
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-amber-500/50 text-sm text-slate-200 focus:outline-none"
                      />
                      <div className="flex items-center gap-2 self-end">
                        <button
                          type="button"
                          onClick={() => setEditingNewsId(null)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>ยกเลิก</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEditNews(item.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>บันทึกการแก้ไข</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-xs text-amber-400 font-medium">
                            {item.author} ·{" "}
                            {new Date(item.creationDate).toLocaleDateString("th-TH", {
                              timeZone: "UTC",
                            })}
                          </span>
                          <h4 className="font-display text-base font-bold text-slate-100 mt-0.5">
                            {item.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditNews(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>แก้ไข</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteNews(item.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-xs font-bold text-red-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>ลบ</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                        {item.body}
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: DOWNLOAD LINKS MANAGEMENT */}
      {activeTab === "downloads" && (
        <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-100">
                จัดการลิงก์ดาวน์โหลดตัวเกม (Client Download Links)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                ซิงค์ข้อมูลกับไฟล์ <code className="text-amber-400">.env.production</code> และหน้าดาวน์โหลดโดยอัตโนมัติ (หากเว้นว่างจะซ่อนปุ่มลิงก์นั้น)
              </p>
            </div>
            <Link
              href="/download"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 shrink-0"
            >
              <span>ดูหน้าดาวน์โหลด</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ลิงก์ MediaFire (NEXT_PUBLIC_MEDIAFIRE_LINK)
              </label>
              <input
                type="text"
                value={downloads.NEXT_PUBLIC_MEDIAFIRE_LINK}
                onChange={(e) =>
                  setDownloads({ ...downloads, NEXT_PUBLIC_MEDIAFIRE_LINK: e.target.value })
                }
                placeholder="https://www.mediafire.com/file/..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ลิงก์ MEGA (NEXT_PUBLIC_MEGA_LINK)
              </label>
              <input
                type="text"
                value={downloads.NEXT_PUBLIC_MEGA_LINK}
                onChange={(e) =>
                  setDownloads({ ...downloads, NEXT_PUBLIC_MEGA_LINK: e.target.value })
                }
                placeholder="https://mega.nz/file/..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ลิงก์ Google Drive (NEXT_PUBLIC_GOODLE_DRIVE_LINK)
              </label>
              <input
                type="text"
                value={downloads.NEXT_PUBLIC_GOODLE_DRIVE_LINK}
                onChange={(e) =>
                  setDownloads({ ...downloads, NEXT_PUBLIC_GOODLE_DRIVE_LINK: e.target.value })
                }
                placeholder="https://drive.google.com/..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ลิงก์ Discord (NEXT_PUBLIC_DISCORD_LINK)
              </label>
              <input
                type="text"
                value={downloads.NEXT_PUBLIC_DISCORD_LINK}
                onChange={(e) =>
                  setDownloads({ ...downloads, NEXT_PUBLIC_DISCORD_LINK: e.target.value })
                }
                placeholder="https://discord.gg/..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              savePartialConfig(
                { downloads },
                "บันทึกลิงก์ดาวน์โหลดและอัปเดต .env.production เรียบร้อยแล้ว"
              )
            }
            className="self-start inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกลิงก์ดาวน์โหลด</span>
          </button>
        </div>
      )}

      {/* TAB 3: SERVER INFO MANAGEMENT */}
      {activeTab === "server" && (
        <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-100">
                จัดการข้อมูลเซิร์ฟเวอร์ (Server Information)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                ตั้งค่าชื่อเซิร์ฟเวอร์ อัตราคูณ รายละเอียดสเปกเซิร์ฟเวอร์ และลิงก์โซเชียลมีเดีย
              </p>
            </div>
            <Link
              href="/info"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 shrink-0"
            >
              <span>ดูหน้าข้อมูลเซิร์ฟเวอร์</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ชื่อเซิร์ฟเวอร์ (Server Name)
              </label>
              <input
                type="text"
                value={serverInfo.serverName}
                onChange={(e) =>
                  setServerInfo({ ...serverInfo, serverName: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ข้อความไฮไลท์ด้านบน (Tagline ภาษาไทย)
              </label>
              <input
                type="text"
                value={serverInfo.taglineTh}
                onChange={(e) =>
                  setServerInfo({ ...serverInfo, taglineTh: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                คำอธิบายหน้าแรก (Hero Description)
              </label>
              <textarea
                rows={2}
                value={serverInfo.heroDescriptionTh}
                onChange={(e) =>
                  setServerInfo({ ...serverInfo, heroDescriptionTh: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ลิงก์ Facebook Page
              </label>
              <input
                type="text"
                value={serverInfo.facebookUrl}
                onChange={(e) =>
                  setServerInfo({ ...serverInfo, facebookUrl: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ลิงก์ Telegram
              </label>
              <input
                type="text"
                value={serverInfo.telegramUrl}
                onChange={(e) =>
                  setServerInfo({ ...serverInfo, telegramUrl: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100 font-mono"
              />
            </div>
          </div>

          {/* Specs Table Editor */}
          <div className="border-t border-slate-800 pt-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-amber-400">
                ตารางอัตราคูณและสเปกเซิร์ฟเวอร์ (แสดงในหน้าข้อมูลเซิร์ฟเวอร์)
              </h3>
              <button
                type="button"
                onClick={addServerSpec}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มแถวข้อมูล</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {serverInfo.specs.map((spec, index) => (
                <div
                  key={spec.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center p-3 rounded-lg bg-slate-900/90 border border-slate-800"
                >
                  <div className="sm:col-span-5">
                    <label className="block text-[11px] text-slate-400 mb-1">
                      หัวข้อ (เช่น อัตราคูณค่าประสบการณ์ EXP)
                    </label>
                    <input
                      type="text"
                      value={spec.labelTh}
                      onChange={(e) => {
                        updateServerSpec(index, "labelTh", e.target.value);
                        updateServerSpec(index, "labelEn", e.target.value);
                      }}
                      className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-slate-100"
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] text-slate-400 mb-1">
                      ค่าข้อมูล (เช่น x100, 50%)
                    </label>
                    <input
                      type="text"
                      value={spec.valueTh}
                      onChange={(e) => {
                        updateServerSpec(index, "valueTh", e.target.value);
                        updateServerSpec(index, "valueEn", e.target.value);
                      }}
                      className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs font-mono font-bold text-amber-400"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => removeServerSpec(index)}
                      className="p-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300"
                      title="ลบแถวนี้"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Play2Win & Intro */}
          <div className="border-t border-slate-800 pt-5 grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                รายละเอียดแนวทางเซิร์ฟเวอร์ (Play2Win Description)
              </label>
              <textarea
                rows={3}
                value={serverInfo.play2WinBodyTh}
                onChange={(e) =>
                  setServerInfo({ ...serverInfo, play2WinBodyTh: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                บทนำแนะนำเซิร์ฟเวอร์ (Server Introduction)
              </label>
              <textarea
                rows={3}
                value={serverInfo.introBodyTh}
                onChange={(e) =>
                  setServerInfo({ ...serverInfo, introBodyTh: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              savePartialConfig({ serverInfo }, "บันทึกข้อมูลเซิร์ฟเวอร์เรียบร้อยแล้ว")
            }
            className="self-start inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกข้อมูลเซิร์ฟเวอร์</span>
          </button>
        </div>
      )}

      {/* TAB 4: MENU MANAGEMENT */}
      {activeTab === "menus" && (
        <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-100">
                จัดการเมนูเว็บไซต์ (Navigation Menu Management)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                แก้ไขชื่อเมนู ลิงก์ปลายทาง หรือเปิด/ปิดการแสดงผลเมนูบนแถบด้านบนของเว็บไซต์
              </p>
            </div>
            <button
              type="button"
              onClick={addMenuItem}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มเมนูใหม่</span>
            </button>
          </div>

          {/* Play Online Button Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-emerald-400">
                ปุ่ม Play Online (หน้าแบนเนอร์หลัก)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                เปิดหรือปิดการแสดงปุ่ม Play Online สีเขียวบนส่วนหัวของเว็บไซต์
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setServerInfo((prev) => ({
                  ...prev,
                  playOnlineEnabled: !prev.playOnlineEnabled,
                }))
              }
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                serverInfo.playOnlineEnabled
                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                  : "bg-slate-800 border border-slate-700 text-slate-400"
              }`}
            >
              {serverInfo.playOnlineEnabled ? (
                <>
                  <Eye className="w-4 h-4" />
                  <span>แสดงผล (เปิดใช้งาน)</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>ซ่อนไว้ (ปิดใช้งาน)</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {menus.map((menu, index) => (
              <div
                key={menu.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-4 rounded-xl bg-slate-900/90 border border-slate-800"
              >
                <div className="sm:col-span-4">
                  <label className="block text-[11px] text-slate-400 mb-1">
                    ชื่อเมนู (ภาษาไทย)
                  </label>
                  <input
                    type="text"
                    value={menu.labelTh}
                    onChange={(e) => updateMenuItem(index, "labelTh", e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-slate-100"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] text-slate-400 mb-1">
                    ลิงก์ URL (เช่น /info, /download)
                  </label>
                  <input
                    type="text"
                    value={menu.href}
                    onChange={(e) => updateMenuItem(index, "href", e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs font-mono text-amber-400"
                  />
                </div>

                <div className="sm:col-span-3 flex items-center justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => updateMenuItem(index, "enabled", !menu.enabled)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      menu.enabled
                        ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                        : "bg-slate-800 border border-slate-700 text-slate-400"
                    }`}
                  >
                    {menu.enabled ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>แสดงเมนู</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>ซ่อนเมนู</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="sm:col-span-1 flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => removeMenuItem(index)}
                    className="p-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300"
                    title="ลบเมนู"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              savePartialConfig(
                { menus, serverInfo },
                "บันทึกการตั้งค่าเมนูเรียบร้อยแล้ว"
              )
            }
            className="self-start inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกการตั้งค่าเมนู</span>
          </button>
        </div>
      )}

      {/* TAB 5: CHARACTER MANAGEMENT SETTINGS (PK / RESET / RELEVEL) */}
      {activeTab === "characters" && (
        <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-100">
                ตั้งค่าจัดการตัวละคร (เปิด/ปิด PK · RESET · Relevel)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                หาก <strong className="text-emerald-400">เปิดใช้งาน</strong> ปุ่มจะแสดงในหน้าจัดการตัวละครและกดใช้งานได้ทันที · หาก{" "}
                <strong className="text-rose-400">ปิดใช้งาน</strong> ปุ่มจะถูกซ่อนมองไม่เห็นและไม่สามารถเรียกใช้งานได้
              </p>
            </div>
            <Link
              href="/characters"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold text-amber-300 shrink-0"
            >
              <span>ทดสอบหน้าจัดการตัวละคร</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* 1. PK CLEAR */}
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-display text-base font-bold text-slate-100">
                      1. ระบบล้างหัวแดง (PK Clear)
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        charSettings.pk.enabled
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {charSettings.pk.enabled
                        ? "เปิดใช้งาน (แสดงปุ่ม)"
                        : "ปิดใช้งาน (ซ่อนปุ่ม)"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    อนุญาตให้ผู้เล่นล้างสถานะฆาตกร (PK) ของตัวละครผ่านหน้าเว็บไซต์
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCharSettings((prev) => ({
                      ...prev,
                      pk: { ...prev.pk, enabled: !prev.pk.enabled },
                    }))
                  }
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    charSettings.pk.enabled
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                      : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {charSettings.pk.enabled ? (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>เปิดใช้งานอยู่ (คลิกเพื่อปิด/ซ่อน)</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span>ปิดและซ่อนอยู่ (คลิกเพื่อเปิด)</span>
                    </>
                  )}
                </button>
              </div>

              {charSettings.pk.enabled && (
                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      ค่าธรรมเนียม Zen ในการล้าง PK (Zen Cost)
                    </label>
                    <input
                      type="number"
                      value={charSettings.pk.zenCost}
                      onChange={(e) =>
                        setCharSettings((prev) => ({
                          ...prev,
                          pk: { ...prev.pk, zenCost: Number(e.target.value) },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-amber-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. RESET */}
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-display text-base font-bold text-slate-100">
                      2. ระบบรีเซ็ตเลเวลตัวละคร (Character RESET)
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        charSettings.reset.enabled
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {charSettings.reset.enabled
                        ? "เปิดใช้งาน (แสดงปุ่ม)"
                        : "ปิดใช้งาน (ซ่อนปุ่ม)"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    อนุญาตให้ผู้เล่นรีเซ็ตเลเวลตัวละครเมื่อเก็บเลเวลถึงระดับที่กำหนด
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCharSettings((prev) => ({
                      ...prev,
                      reset: { ...prev.reset, enabled: !prev.reset.enabled },
                    }))
                  }
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    charSettings.reset.enabled
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                      : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {charSettings.reset.enabled ? (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>เปิดใช้งานอยู่ (คลิกเพื่อปิด/ซ่อน)</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span>ปิดและซ่อนอยู่ (คลิกเพื่อเปิด)</span>
                    </>
                  )}
                </button>
              </div>

              {charSettings.reset.enabled && (
                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      เลเวลขั้นต่ำในการรีเซ็ต (Required Level)
                    </label>
                    <input
                      type="number"
                      value={charSettings.reset.requiredLevel}
                      onChange={(e) =>
                        setCharSettings((prev) => ({
                          ...prev,
                          reset: {
                            ...prev.reset,
                            requiredLevel: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      ค่าธรรมเนียม Zen (Zen Cost)
                    </label>
                    <input
                      type="number"
                      value={charSettings.reset.zenCost}
                      onChange={(e) =>
                        setCharSettings((prev) => ({
                          ...prev,
                          reset: { ...prev.reset, zenCost: Number(e.target.value) },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      จำนวนรีเซ็ตสูงสุด (Max Resets)
                    </label>
                    <input
                      type="number"
                      value={charSettings.reset.maxReset}
                      onChange={(e) =>
                        setCharSettings((prev) => ({
                          ...prev,
                          reset: { ...prev.reset, maxReset: Number(e.target.value) },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-amber-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 3. RELEVEL */}
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-display text-base font-bold text-slate-100">
                      3. ระบบรีเลเวล (Relevel)
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        charSettings.relevel.enabled
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {charSettings.relevel.enabled
                        ? "เปิดใช้งาน (แสดงปุ่ม)"
                        : "ปิดใช้งาน (ซ่อนปุ่ม)"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    ระบบปรับระดับเลเวลตัวละคร (Relevel) ในหน้าจัดการตัวละคร
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCharSettings((prev) => ({
                      ...prev,
                      relevel: { ...prev.relevel, enabled: !prev.relevel.enabled },
                    }))
                  }
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    charSettings.relevel.enabled
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                      : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {charSettings.relevel.enabled ? (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>เปิดใช้งานอยู่ (คลิกเพื่อปิด/ซ่อน)</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span>ปิดและซ่อนอยู่ (คลิกเพื่อเปิด)</span>
                    </>
                  )}
                </button>
              </div>

              {charSettings.relevel.enabled && (
                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      เลเวลเป้าหมาย (Target Level)
                    </label>
                    <input
                      type="number"
                      value={charSettings.relevel.targetLevel}
                      onChange={(e) =>
                        setCharSettings((prev) => ({
                          ...prev,
                          relevel: {
                            ...prev.relevel,
                            targetLevel: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      ค่าธรรมเนียม Zen (Zen Cost)
                    </label>
                    <input
                      type="number"
                      value={charSettings.relevel.zenCost}
                      onChange={(e) =>
                        setCharSettings((prev) => ({
                          ...prev,
                          relevel: {
                            ...prev.relevel,
                            zenCost: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-amber-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 4. ADD STATS & RESET STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">
                    4. ระบบอัพสเตตัส (Add Stats)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {charSettings.addStats.enabled ? "แสดงปุ่มอัพสเตตัส" : "ซ่อนปุ่มอัพสเตตัส"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCharSettings((prev) => ({
                      ...prev,
                      addStats: { enabled: !prev.addStats.enabled },
                    }))
                  }
                  className={`px-4 py-2 rounded-lg text-xs font-bold ${
                    charSettings.addStats.enabled
                      ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                      : "bg-slate-800 border border-slate-700 text-slate-400"
                  }`}
                >
                  {charSettings.addStats.enabled ? "เปิดใช้งาน" : "ปิด/ซ่อน"}
                </button>
              </div>

              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">
                    5. ระบบรีเซ็ตสเตตัส (Reset Stats)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {charSettings.resetStats.enabled
                      ? "แสดงปุ่มรีเซ็ตสเตตัส"
                      : "ซ่อนปุ่มรีเซ็ตสเตตัส"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCharSettings((prev) => ({
                      ...prev,
                      resetStats: {
                        ...prev.resetStats,
                        enabled: !prev.resetStats.enabled,
                      },
                    }))
                  }
                  className={`px-4 py-2 rounded-lg text-xs font-bold ${
                    charSettings.resetStats.enabled
                      ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                      : "bg-slate-800 border border-slate-700 text-slate-400"
                  }`}
                >
                  {charSettings.resetStats.enabled ? "เปิดใช้งาน" : "ปิด/ซ่อน"}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              savePartialConfig(
                { characterSettings: charSettings },
                "บันทึกการตั้งค่าจัดการตัวละคร (PK / RESET / Relevel) เรียบร้อยแล้ว"
              )
            }
            className="self-start inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกการตั้งค่าตัวละคร</span>
          </button>
        </div>
      )}
    </div>
  );
}
