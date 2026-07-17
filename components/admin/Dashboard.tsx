"use client";

import { useState } from "react";
import type { StoreData, LinkItem } from "@/lib/types";
import { Icon } from "@/components/icons";
import {
  logout,
  saveProfile,
  saveSocials,
  upsertLink,
  deleteLink,
  toggleLink,
  moveLink,
  setTiktokStyle,
} from "@/app/actions";

const ICON_OPTIONS: { value: string; label: string }[] = [
  { value: "whatsapp", label: "واتساب" },
  { value: "tiktok", label: "تيك توك" },
  { value: "facebook", label: "فيسبوك" },
  { value: "instagram", label: "انستغرام" },
  { value: "maps", label: "خريطة" },
  { value: "phone", label: "هاتف" },
  { value: "link", label: "رابط عام" },
];

type Tab = "links" | "profile" | "stats";

function LinkForm({
  link,
  onDone,
}: {
  link?: LinkItem;
  onDone: () => void;
}) {
  return (
    <form action={upsertLink} className="edit-form form-grid" onSubmit={onDone}>
      <input type="hidden" name="id" value={link?.id ?? ""} />
      <div className="field">
        <label>العنوان</label>
        <input
          className="input"
          name="title"
          defaultValue={link?.title ?? ""}
          placeholder="مثال: واتساب — تواصل معنا"
          required
        />
      </div>
      <div className="field">
        <label>الوصف (اختياري)</label>
        <input
          className="input"
          name="subtitle"
          defaultValue={link?.subtitle ?? ""}
          placeholder="مثال: 75 ألف متابع"
        />
      </div>
      <div className="field span-2">
        <label>الرابط</label>
        <input
          className="input"
          dir="ltr"
          name="url"
          defaultValue={link?.url ?? ""}
          placeholder="https://..."
          required
        />
      </div>
      <div className="field">
        <label>الأيقونة</label>
        <select className="input" name="icon" defaultValue={link?.icon ?? "link"}>
          {ICON_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field" style={{ justifyContent: "end" }}>
        <label className="check-row">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={link?.featured ?? false}
          />
          رابط مميز (تمييز ذهبي ✨)
        </label>
      </div>
      <div className="field span-2">
        <label>أرقام واتساب (اختياري)</label>
        <textarea
          className="input"
          name="numbers"
          defaultValue={link?.numbers?.join("\n") ?? ""}
          placeholder={"07711911901\n07751011911"}
        />
        <span className="hint">
          رقم واحد في كل سطر — عند إضافتها تتحول البطاقة إلى قائمة أرقام منسدلة
        </span>
      </div>
      <div className="form-actions span-2">
        <button className="btn-gold" type="submit">
          {link ? "حفظ التعديلات" : "إضافة الرابط"}
        </button>
        <button className="btn-ghost" type="button" onClick={onDone}>
          إلغاء
        </button>
      </div>
    </form>
  );
}

export default function Dashboard({ store }: { store: StoreData }) {
  const [tab, setTab] = useState<Tab>("links");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const totalClicks = store.links.reduce((sum, l) => sum + l.clicks, 0);
  const activeCount = store.links.filter((l) => l.enabled).length;
  const ranked = [...store.links].sort((a, b) => b.clicks - a.clicks);
  const maxClicks = Math.max(1, ...store.links.map((l) => l.clicks));

  return (
    <div className="admin-shell">
      <div className="aurora" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <header className="admin-top">
        <div className="brand">
          <div className="auth-mono small">فدك</div>
          <div>
            <h1>لوحة التحكم</h1>
            <p>
              {store.profile.name} — {store.profile.handle}
            </p>
          </div>
        </div>
        <div className="top-actions">
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <Icon name="external" />
            عرض الصفحة
          </a>
          <form action={logout}>
            <button className="btn-ghost danger" type="submit">
              <Icon name="logout" />
              تسجيل الخروج
            </button>
          </form>
        </div>
      </header>

      <div className="stat-row">
        <div className="stat-tile">
          <span className="stat-icon">
            <Icon name="eye" />
          </span>
          <div>
            <div className="stat-num">{store.stats.views.toLocaleString("en")}</div>
            <div className="stat-label">زيارة للصفحة</div>
          </div>
        </div>
        <div className="stat-tile">
          <span className="stat-icon">
            <Icon name="trend" />
          </span>
          <div>
            <div className="stat-num">{totalClicks.toLocaleString("en")}</div>
            <div className="stat-label">نقرة على الروابط</div>
          </div>
        </div>
        <div className="stat-tile">
          <span className="stat-icon">
            <Icon name="link" />
          </span>
          <div>
            <div className="stat-num">
              {activeCount}/{store.links.length}
            </div>
            <div className="stat-label">روابط مفعّلة</div>
          </div>
        </div>
      </div>

      <nav className="tabs" aria-label="أقسام لوحة التحكم">
        <button
          className={`tab-btn ${tab === "links" ? "active" : ""}`}
          onClick={() => setTab("links")}
        >
          الروابط
        </button>
        <button
          className={`tab-btn ${tab === "profile" ? "active" : ""}`}
          onClick={() => setTab("profile")}
        >
          الملف والحسابات
        </button>
        <button
          className={`tab-btn ${tab === "stats" ? "active" : ""}`}
          onClick={() => setTab("stats")}
        >
          الإحصائيات
        </button>
      </nav>

      <div className="admin-grid">
        <section className="panel">
          {tab === "links" && (
            <>
              <div className="card-box">
                <h2>
                  <Icon name="tiktok" />
                  طريقة عرض حسابات تيك توك
                </h2>
                <form action={setTiktokStyle} className="tabs" style={{ marginBottom: 0 }}>
                  <button
                    className={`tab-btn ${
                      store.settings.tiktokStyle === "separate" ? "active" : ""
                    }`}
                    name="style"
                    value="separate"
                    type="submit"
                  >
                    بطاقات منفصلة
                  </button>
                  <button
                    className={`tab-btn ${
                      store.settings.tiktokStyle === "dropdown" ? "active" : ""
                    }`}
                    name="style"
                    value="dropdown"
                    type="submit"
                  >
                    قائمة منسدلة واحدة
                  </button>
                </form>
              </div>

              <div className="card-box">
                <h2>
                  <Icon name="plus" />
                  إضافة رابط جديد
                </h2>
                {showAdd ? (
                  <LinkForm onDone={() => setShowAdd(false)} />
                ) : (
                  <button className="btn-gold" onClick={() => setShowAdd(true)}>
                    + رابط جديد
                  </button>
                )}
              </div>

              <div className="card-box">
                <h2>
                  <Icon name="link" />
                  روابط الصفحة ({store.links.length})
                </h2>
                <div className="links-list">
                  {store.links.length === 0 && (
                    <p className="empty-note">لا توجد روابط بعد — أضف أول رابط من الأعلى</p>
                  )}
                  {store.links.map((l, i) => (
                    <div key={l.id} className={`link-item ${l.enabled ? "" : "off"}`}>
                      <div className="link-row">
                        <span className={`chip sm chip-${l.icon}`}>
                          <Icon name={l.icon} />
                        </span>
                        <div className="row-main">
                          <span className="row-title">
                            {l.title}
                            {l.featured ? <span className="row-star">★ مميز</span> : null}
                          </span>
                          <span className="row-url">{l.url}</span>
                        </div>
                        <span className="clicks-badge">{l.clicks} نقرة</span>
                        <div className="row-actions">
                          <form action={moveLink} className="move-form">
                            <input type="hidden" name="id" value={l.id} />
                            <button
                              className="icon-btn"
                              name="dir"
                              value="up"
                              disabled={i === 0}
                              aria-label="تحريك لأعلى"
                            >
                              <Icon name="up" />
                            </button>
                            <button
                              className="icon-btn"
                              name="dir"
                              value="down"
                              disabled={i === store.links.length - 1}
                              aria-label="تحريك لأسفل"
                            >
                              <Icon name="down" />
                            </button>
                          </form>
                          <form action={toggleLink}>
                            <input type="hidden" name="id" value={l.id} />
                            <button
                              className={`switch ${l.enabled ? "on" : ""}`}
                              type="submit"
                              aria-label={l.enabled ? "تعطيل الرابط" : "تفعيل الرابط"}
                            >
                              <span className="knob" />
                            </button>
                          </form>
                          <button
                            className="icon-btn"
                            onClick={() =>
                              setEditingId(editingId === l.id ? null : l.id)
                            }
                            aria-label="تعديل"
                          >
                            <Icon name={editingId === l.id ? "x" : "edit"} />
                          </button>
                          <form
                            action={deleteLink}
                            onSubmit={(e) => {
                              if (!confirm(`حذف "${l.title}"؟`)) e.preventDefault();
                            }}
                          >
                            <input type="hidden" name="id" value={l.id} />
                            <button className="icon-btn danger" aria-label="حذف">
                              <Icon name="trash" />
                            </button>
                          </form>
                        </div>
                      </div>
                      {editingId === l.id && (
                        <LinkForm link={l} onDone={() => setEditingId(null)} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === "profile" && (
            <>
              <div className="card-box">
                <h2>
                  <Icon name="edit" />
                  الملف الشخصي
                </h2>
                <form action={saveProfile} className="form-grid">
                  <div className="field">
                    <label>اسم المتجر</label>
                    <input
                      className="input"
                      name="name"
                      defaultValue={store.profile.name}
                      required
                    />
                  </div>
                  <div className="field">
                    <label>المعرّف (بالإنجليزية)</label>
                    <input
                      className="input"
                      dir="ltr"
                      name="handle"
                      defaultValue={store.profile.handle}
                    />
                  </div>
                  <div className="field span-2">
                    <label>الوصف</label>
                    <input
                      className="input"
                      name="tagline"
                      defaultValue={store.profile.tagline}
                    />
                  </div>
                  <div className="field">
                    <label>الموقع</label>
                    <input
                      className="input"
                      name="location"
                      defaultValue={store.profile.location}
                    />
                  </div>
                  <div className="field">
                    <label>رابط صورة الملف (اختياري)</label>
                    <input
                      className="input"
                      dir="ltr"
                      name="avatarUrl"
                      defaultValue={store.profile.avatarUrl}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="form-actions span-2">
                    <button className="btn-gold" type="submit">
                      حفظ الملف الشخصي
                    </button>
                  </div>
                </form>
              </div>

              <div className="card-box">
                <h2>
                  <Icon name="share" />
                  أيقونات التواصل (أعلى الصفحة)
                </h2>
                <form action={saveSocials} className="form-grid">
                  {(
                    [
                      ["whatsapp", "واتساب"],
                      ["tiktok", "تيك توك"],
                      ["facebook", "فيسبوك"],
                      ["instagram", "انستغرام"],
                      ["maps", "الخريطة"],
                    ] as const
                  ).map(([key, label]) => (
                    <div className="field span-2" key={key}>
                      <label>{label}</label>
                      <input
                        className="input"
                        dir="ltr"
                        name={key}
                        defaultValue={store.socials[key]}
                        placeholder="https://... (اتركه فارغاً للإخفاء)"
                      />
                    </div>
                  ))}
                  <div className="form-actions span-2">
                    <button className="btn-gold" type="submit">
                      حفظ الحسابات
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

          {tab === "stats" && (
            <div className="card-box">
              <h2>
                <Icon name="trend" />
                أداء الروابط
              </h2>
              {totalClicks === 0 ? (
                <p className="empty-note">
                  لا توجد نقرات بعد — شارك صفحتك وستظهر الإحصائيات هنا
                </p>
              ) : (
                <div className="bar-list">
                  {ranked.map((l) => (
                    <div className="bar-row" key={l.id}>
                      <div className="bar-top">
                        <span>{l.title}</span>
                        <span className="n">{l.clicks.toLocaleString("en")}</span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ width: `${(l.clicks / maxClicks) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <aside className="preview-pane">
          <div className="preview-label">
            <span className="dot" />
            معاينة مباشرة
          </div>
          <div className="preview-frame-wrap">
            <iframe key={store.updatedAt} src="/" title="معاينة الصفحة العامة" />
          </div>
        </aside>
      </div>
    </div>
  );
}
