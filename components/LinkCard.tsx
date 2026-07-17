"use client";

import { useState } from "react";
import type { LinkItem } from "@/lib/types";
import { toWaUrl } from "@/lib/wa";
import { Icon } from "@/components/icons";

export default function LinkCard({
  link,
  index,
}: {
  link: LinkItem;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const numbers = link.numbers ?? [];
  const expandable = numbers.length > 0;

  const track = () => {
    fetch("/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: link.id }),
      keepalive: true,
    }).catch(() => {});
  };

  const copy = async (num: string, i: number) => {
    try {
      await navigator.clipboard.writeText(num);
      setCopiedIdx(i);
      setTimeout(() => setCopiedIdx(null), 1600);
    } catch {}
  };

  const inner = (
    <>
      <span className={`chip chip-${link.icon}`}>
        <Icon name={link.icon} />
      </span>
      <span className="card-texts">
        <span className="card-title">{link.title}</span>
        {link.subtitle ? <span className="card-sub">{link.subtitle}</span> : null}
      </span>
      <span className={`card-end ${expandable && open ? "rot" : ""}`}>
        <Icon name={expandable ? "chevron" : "external"} />
      </span>
    </>
  );

  return (
    <div
      className={`card-shell ${link.featured ? "featured" : ""}`}
      style={{ animationDelay: `${120 + index * 70}ms` }}
    >
      {expandable ? (
        <button
          type="button"
          className="card"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          {inner}
        </button>
      ) : (
        <a
          className="card"
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={track}
        >
          {inner}
        </a>
      )}

      {expandable && (
        <div className={`numbers ${open ? "open" : ""}`}>
          <div className="numbers-inner">
            {numbers.map((num, i) => (
              <div className="number-row" key={`${num}-${i}`}>
                <a
                  className="num-link"
                  href={toWaUrl(num)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={track}
                >
                  <span className="num-chip">
                    <Icon name="whatsapp" />
                  </span>
                  <span className="num-digits">{num}</span>
                  <span className="num-open">فتح المحادثة</span>
                </a>
                <button
                  type="button"
                  className="copy-btn"
                  onClick={() => copy(num, i)}
                  aria-label={`نسخ الرقم ${num}`}
                >
                  <Icon name={copiedIdx === i ? "check" : "copy"} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
