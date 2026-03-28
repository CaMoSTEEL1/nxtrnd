import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-sm",
        secondary:
          "bg-[var(--background-card)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--primary-subtle)] hover:border-[var(--primary)]",
        ghost:
          "text-[var(--foreground-muted)] hover:bg-[var(--primary-subtle)] hover:text-[var(--foreground)]",
        destructive:
          "bg-[var(--destructive)] text-white hover:opacity-90",
        outline:
          "border border-[var(--primary)] text-[var(--primary)] bg-transparent hover:bg-[var(--primary-subtle)]",
      },
      size: {
        sm:  "h-8  px-3 text-xs",
        md:  "h-9  px-4",
        lg:  "h-10 px-6",
        icon:"h-9  w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export function Button({ className, variant, size, loading, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  );
}
