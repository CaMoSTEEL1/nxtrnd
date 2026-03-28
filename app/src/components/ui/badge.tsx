import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        default:     "bg-[var(--primary-subtle)] text-[var(--primary)] ring-[var(--primary)]/20",
        success:     "bg-[var(--success-subtle)] text-[var(--success)] ring-[var(--success)]/20",
        warning:     "bg-[var(--warning-subtle)] text-[var(--warning)] ring-[var(--warning)]/20",
        destructive: "bg-[var(--destructive-subtle)] text-[var(--destructive)] ring-[var(--destructive)]/20",
        muted:       "bg-transparent text-[var(--foreground-muted)] ring-[var(--border)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
