import { createContext, useContext, useEffect, useState } from "react";

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  // 1. Initialize state from localStorage
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    return savedState === "true"; // Defaults to false if nothing is saved
  });

  const toggleSidebar = () => {
    setCollapsed(prev => {
      const newState = !prev;
      // 2. Persist new state to localStorage
      localStorage.setItem("sidebar-collapsed", newState);
      return newState;
    });
  };

  useEffect(() => {
    // 3. Sync body classes with the current state
    document.body.classList.add("sidebar-mini", "layout-fixed");

    if (collapsed) {
      document.body.classList.add("sidebar-collapse");
    } else {
      document.body.classList.remove("sidebar-collapse");
    }
  }, [collapsed]);

  return (
    <LayoutContext.Provider value={{ collapsed, toggleSidebar }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);