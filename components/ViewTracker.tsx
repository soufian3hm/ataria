"use client";

import { useEffect } from "react";

export default function ViewTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("fadk_viewed")) return;
      sessionStorage.setItem("fadk_viewed", "1");
    } catch {}
    fetch("/api/view", { method: "POST", keepalive: true }).catch(() => {});
  }, []);
  return null;
}
