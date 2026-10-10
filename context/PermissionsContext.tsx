"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import PermissionDeniedModal from "@/components/ui/permission-denied-modal";

interface PermissionsContextType {
  role: "super-admin" | "admin" | "unknown";
  canWrite: boolean;
  ready: boolean;
  guard: (action: "create" | "edit" | "delete" | "update" | "restore" | "manage", callback: () => void | Promise<void>, event?: React.MouseEvent) => void;
}

const PermissionsContext = createContext<PermissionsContextType | null>(null);

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<"super-admin" | "admin" | "unknown">("unknown");
  const [canWrite, setCanWrite] = useState(false);
  const [ready, setReady] = useState(false);
  const [modalState, setModalState] = useState<{ isOpen: boolean; action: "create" | "edit" | "delete" | "update" | "restore" | "manage" | null; position: { x: number, y: number } | null }>({ isOpen: false, action: null, position: null });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setRole(data.role || "unknown");
          setCanWrite(!!data.canWrite);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch permissions:", err);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => { cancelled = true; };
  }, []);

  const guard = useCallback(
    (action: "create" | "edit" | "delete" | "update" | "restore" | "manage", callback: () => void | Promise<void>, event?: React.MouseEvent) => {
      if (role === "super-admin" || canWrite) {
        callback();
      } else {
        const position = event ? { x: event.clientX, y: event.clientY } : null;
        setModalState({ isOpen: true, action, position });
      }
    },
    [role, canWrite]
  );

  return (
    <PermissionsContext.Provider value={{ role, canWrite, ready, guard }}>
      {children}
      {modalState.isOpen && modalState.action && (
        <PermissionDeniedModal 
          action={modalState.action} 
          position={modalState.position}
          onClose={() => setModalState({ isOpen: false, action: null, position: null })} 
        />
      )}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
}
