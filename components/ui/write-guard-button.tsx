"use client";

import React from "react";
import { Lock } from "lucide-react";
import { usePermissions } from "@/context/PermissionsContext";
import { Button } from "@/components/ui/button";

type ButtonProps = React.ComponentProps<typeof Button>;

interface WriteGuardButtonProps extends ButtonProps {
  action: "create" | "edit" | "delete" | "update" | "restore" | "manage";
}

export function WriteGuardButton({ action, onClick, children, className = "", ...props }: WriteGuardButtonProps) {
  const { role, canWrite, guard, ready } = usePermissions();

  const isRestricted = ready && role !== "super-admin" && !canWrite;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isRestricted) {
      e.preventDefault();
      e.stopPropagation();
      guard(action, () => {}, e);
      return;
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button
      {...props}
      type={isRestricted ? "button" : props.type || "button"}
      onClick={handleClick}
      className={`${className} ${isRestricted ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {children}
    </Button>
  );
}
