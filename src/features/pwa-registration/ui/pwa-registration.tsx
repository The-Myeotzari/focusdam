"use client";

import { useEffect } from "react";

export function PwaRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      void cleanupDevelopmentServiceWorker();

      return;
    }

    void navigator.serviceWorker.register("/sw.js");
  }, []);

  return null;
}

async function cleanupDevelopmentServiceWorker() {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));

  if ("caches" in window) {
    const names = await caches.keys();
    await Promise.all(
      names
        .filter((name) => name.startsWith("focusdam-shell-"))
        .map((name) => caches.delete(name)),
    );
  }

  const reloadKey = "focusdam-service-worker-cleanup-reload";

  if (navigator.serviceWorker.controller && !sessionStorage.getItem(reloadKey)) {
    sessionStorage.setItem(reloadKey, "true");
    window.location.reload();
    return;
  }

  if (!navigator.serviceWorker.controller) {
    sessionStorage.removeItem(reloadKey);
  }
}
