"use client";

import { useEffect } from "react";

export function DatabaseInitializer() {
  useEffect(() => {
    const initializeDatabase = async () => {
      if (localStorage.getItem("dbInitialized") === "true") return;

      try {
        console.log("🚀 Initializing database on app startup...");

        const response = await fetch("/api/init-db", {
          method: "POST",
        });

        const data = await response.json();

        if (response.ok) {
          console.log("✅ Database initialization successful:", data.message);
          localStorage.setItem("dbInitialized", "true");
        } else {
          console.error("❌ Database initialization failed:", data.error);
        }
      } catch (error) {
        console.error("❌ Database initialization error:", error);
      }
    };

    const timer = setTimeout(initializeDatabase, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
