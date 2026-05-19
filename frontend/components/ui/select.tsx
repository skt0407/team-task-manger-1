"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
  description?: string;
};

export function Select({
  value,
  options,
  placeholder = "Select",
  onChange,
  className
}: {
  value?: string;
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => setOpen((current) => !current)}
      >
        <span className={selected ? "" : "text-muted-foreground"}>{selected?.label ?? placeholder}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute z-40 mt-2 max-h-64 w-full overflow-auto rounded-md border bg-card p-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-secondary"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <span>
                <span className="block">{option.label}</span>
                {option.description && <span className="text-xs text-muted-foreground">{option.description}</span>}
              </span>
              {option.value === value && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
