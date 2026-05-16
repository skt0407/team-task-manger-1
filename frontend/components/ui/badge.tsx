import * as React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "bg-secondary text-secondary-foreground",
  success: "bg-emerald-500/15 text-emerald-400",
  warning: "bg-amber-500/15 text-amber-400",
  danger: "bg-rose-500/15 text-rose-400",
  info: "bg-cyan-500/15 text-cyan-400"
};

export const Badge = ({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) => (
  <span
    className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", variants[variant], className)}
    {...props}
  />
);
