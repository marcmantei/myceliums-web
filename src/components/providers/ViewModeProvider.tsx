"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type ViewMode = "enduser" | "developer";

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isDeveloper: boolean;
}

const ViewModeContext = createContext<ViewModeContextType>({
  viewMode: "enduser",
  setViewMode: () => {},
  isDeveloper: false,
});

const STORAGE_KEY = "myceliums-view-mode";

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>("enduser");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "developer") {
      setViewModeState("developer");
    }
    setMounted(true);
  }, []);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  };

  // Prevent hydration mismatch — render as enduser until mounted
  const effectiveMode = mounted ? viewMode : "enduser";

  return (
    <ViewModeContext.Provider
      value={{
        viewMode: effectiveMode,
        setViewMode,
        isDeveloper: effectiveMode === "developer",
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  return useContext(ViewModeContext);
}
