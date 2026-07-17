"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";

export default function ShareButton({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: name, url });
        return;
      }
      throw new Error("no-native-share");
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  return (
    <>
      <button
        type="button"
        className="share-btn"
        onClick={share}
        aria-label="مشاركة الصفحة"
      >
        <Icon name="share" />
      </button>
      {copied && <div className="toast">تم نسخ الرابط ✓</div>}
    </>
  );
}
