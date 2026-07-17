"use client";

import { useState } from "react";
import type { LinkItem } from "@/lib/types";
import { Icon } from "@/components/icons";

/** One collapsible card holding all TikTok accounts (dropdown display mode). */
export default function TikTokGroup({
  links,
  index,
}: {
  links: LinkItem[];
  index: number;
}) {
  const [open, setOpen] = useState(false);

  const track = (id: string) => {
    fetch("/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      keepalive: true,
    }).catch(() => {});
  };

  const rowTitle = (l: LinkItem) =>
    l.title.replace(/^تيك توك\s*[—–-]\s*/, "") || l.title;

  return (
    <div className="card-shell" style={{ animationDelay: `${120 + index * 70}ms` }}>
      <button
        type="button"
        className="card"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="chip chip-tiktok">
          <Icon name="tiktok" />
        </span>
        <span className="card-texts">
          <span className="card-title">تيك توك</span>
          <span className="card-sub">
            {links.length} حسابات — اضغط للعرض
          </span>
        </span>
        <span className={`card-end ${open ? "rot" : ""}`}>
          <Icon name="chevron" />
        </span>
      </button>

      <div className={`numbers ${open ? "open" : ""}`}>
        <div className="numbers-inner">
          {links.map((l) => (
            <div className="number-row" key={l.id}>
              <a
                className="num-link"
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track(l.id)}
              >
                <span className="num-chip tt">
                  <Icon name="tiktok" />
                </span>
                <span className="tt-texts">
                  <span className="tt-title">{rowTitle(l)}</span>
                  {l.subtitle ? <span className="tt-sub">{l.subtitle}</span> : null}
                </span>
                <span className="num-open">
                  <Icon name="external" className="tt-ext" />
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
