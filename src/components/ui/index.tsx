"use client";

import clsx, { type ClassValue } from "clsx";
import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { createPortal } from "react-dom";
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const VARIANT_CLASS = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-icon",
  danger: "btn-danger",
} as const;

export function Button({ variant = "primary", className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof VARIANT_CLASS }) {
  return (
    <button
      {...props}
      className={cn(VARIANT_CLASS[variant], "disabled:cursor-not-allowed disabled:opacity-50", className)}
    />
  );
}

export function Card({ className, children, ...props }: { className?: string; children?: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={cn("glass-panel p-4", className)}>
      {children}
    </div>
  );
}

export function Badge({ className, children }: { className?: string; children?: ReactNode }) {
  return <span className={cn("pill", className)}>{children}</span>;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("field", className)} />;
}

export function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  if (!open || typeof document === "undefined") return null;
  // Portal to <body>: glass panels use backdrop-filter, which would otherwise trap fixed overlays.
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title}>
      <div className="glass-panel max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          <Button variant="ghost" onClick={onClose} aria-label="Close dialog">
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function Tabs({ tabs, active, onChange, className }: { tabs: { key: string; label: string; count?: number }[]; active: string; onChange: (key: string) => void; className?: string }) {
  return (
    <div role="tablist" className={cn("flex flex-wrap gap-1.5", className)}>
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={t.key === active}
          onClick={() => onChange(t.key)}
          className="chip"
        >
          <span>{t.label}</span>
          {t.count !== undefined ? <span className="chip-count">{t.count}</span> : null}
        </button>
      ))}
    </div>
  );
}
