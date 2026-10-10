"use client";

import { useEffect } from "react";
import { Lock } from "lucide-react";

interface PermissionDeniedModalProps {
  action: "create" | "edit" | "delete" | "update" | "restore" | "manage";
  position?: { x: number, y: number } | null;
  onClose: () => void;
}

export default function PermissionDeniedModal({ action, position, onClose }: PermissionDeniedModalProps) {
  useEffect(() => {
    // Auto-close after 3 seconds
    const timer = setTimeout(() => onClose(), 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const config = {
    create: "No permission to create",
    edit: "No permission to edit",
    update: "No permission to edit",
    delete: "No permission to delete",
    restore: "No permission to restore",
    manage: "No permission for this action",
  };

  const text = config[action] || config.manage;

  const content = (
    <div className="bg-[#0f172a] px-4 py-2 rounded-full shadow-xl flex items-center gap-2.5 whitespace-nowrap border border-white/5">
      <Lock className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
      <p className="text-[13px] font-medium text-slate-400">{text}</p>
    </div>
  );

  // If no position provided, fallback to a bottom-center floating toast
  if (!position) {
    return (
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-200 pointer-events-none">
        {content}
      </div>
    );
  }

  // Ensure the popup stays within viewport bounds
  const popoverWidth = 180;
  const popoverHeight = 40;
  
  // Place it slightly above and to the right of the cursor
  let left = position.x + 15;
  let top = position.y - 15 - popoverHeight;

  // Adjust if going off screen horizontally
  if (left + popoverWidth > window.innerWidth) {
    left = position.x - popoverWidth - 15;
  }
  // Adjust if going off screen vertically
  if (top < 0) {
    top = position.y + 20; // place below instead
  }

  return (
    <div 
      className="fixed z-[9999] animate-in zoom-in-95 fade-in duration-150 pointer-events-none"
      style={{ left: `${left}px`, top: `${top}px` }}
    >
      {content}
    </div>
  );
}
