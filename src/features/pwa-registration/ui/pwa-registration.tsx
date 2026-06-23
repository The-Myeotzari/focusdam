"use client";

import { useEffect } from "react";

export function PwaRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => void registration.unregister());
      });

      if ("caches" in window) {
        void caches.keys().then((names) => {
          names
            .filter((name) => name.startsWith("focusdam-shell-"))
            .forEach((name) => void caches.delete(name));
        });
      }

      return;
    }

    void navigator.serviceWorker.register("/sw.js");
  }, []);

  return null;
}
