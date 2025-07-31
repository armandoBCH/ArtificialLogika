"use client";

import * as React from "react";


import { cn } from "./utils";

// Simplified context menu implementation without @radix-ui/react-context-menu
// This is a basic implementation for TypeScript compatibility

interface ContextMenuProps {
  children: React.ReactNode;
}

function ContextMenu({ children }: ContextMenuProps) {
  return <div data-slot="context-menu">{children}</div>;
}

interface ContextMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
}

function ContextMenuTrigger({ children, className }: ContextMenuTriggerProps) {
  return (
    <div data-slot="context-menu-trigger" className={className}>
      {children}
    </div>
  );
}

interface ContextMenuContentProps {
  children: React.ReactNode;
  className?: string;
}

function ContextMenuContent({ children, className }: ContextMenuContentProps) {
  return (
    <div
      data-slot="context-menu-content"
      className={cn(
        "bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface ContextMenuItemProps {
  children: React.ReactNode;
  className?: string;
  inset?: boolean;
  variant?: "default" | "destructive";
  onClick?: () => void;
}

function ContextMenuItem({
  children,
  className,
  inset,
  variant = "default",
  onClick,
}: ContextMenuItemProps) {
  return (
    <div
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        inset && "pl-8",
        variant === "destructive" && "text-destructive",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface ContextMenuLabelProps {
  children: React.ReactNode;
  className?: string;
  inset?: boolean;
}

function ContextMenuLabel({ children, className, inset }: ContextMenuLabelProps) {
  return (
    <div
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "text-foreground px-2 py-1.5 text-sm font-medium",
        inset && "pl-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface ContextMenuSeparatorProps {
  className?: string;
}

function ContextMenuSeparator({ className }: ContextMenuSeparatorProps) {
  return (
    <div
      data-slot="context-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
    />
  );
}

interface ContextMenuShortcutProps {
  children: React.ReactNode;
  className?: string;
}

function ContextMenuShortcut({ children, className }: ContextMenuShortcutProps) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
    >
      {children}
    </span>
  );
}

// Simplified exports for compatibility
const ContextMenuGroup = ContextMenu;
const ContextMenuPortal = ContextMenu;
const ContextMenuSub = ContextMenu;
const ContextMenuSubContent = ContextMenuContent;
const ContextMenuSubTrigger = ContextMenuTrigger;
const ContextMenuRadioGroup = ContextMenu;
const ContextMenuCheckboxItem = ContextMenuItem;
const ContextMenuRadioItem = ContextMenuItem;

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
