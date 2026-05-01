
import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "modern" | "minimalist";

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(
    (localStorage.getItem("app-theme") as Theme) || "modern"
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguageState] = useState(
    localStorage.getItem("app-language") || "en"
  );

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("app-theme", newTheme);
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebar-collapsed", String(newState));
      return newState;
    });
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("modern", "minimalist", "dark");
    if (theme !== "modern") {
      root.classList.add(theme);
    }
    if (theme === "modern") {
      root.classList.add("dark");
    }
  }, [theme]);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        isSidebarCollapsed,
        toggleSidebar,
        searchQuery,
        setSearchQuery,
        language,
        setLanguage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
