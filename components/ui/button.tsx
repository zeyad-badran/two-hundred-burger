import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-sear text-char hover:bg-sear-light active:bg-sear-dark shadow-[0_10px_30px_-10px_rgba(232,163,61,0.5)] hover:shadow-[0_14px_36px_-8px_rgba(232,163,61,0.6)] hover:-translate-y-0.5',
        outline:
          'border border-cream/25 text-cream hover:border-sear hover:text-sear hover:-translate-y-0.5',
        whatsapp:
          'bg-[#25D366] text-char hover:bg-[#2ee076] hover:-translate-y-0.5 shadow-[0_10px_30px_-10px_rgba(37,211,102,0.5)]',
        ghost: 'text-cream-muted hover:text-cream',
      },
      size: {
        default: 'h-12 px-6',
        sm: 'h-10 px-4 text-xs',
        lg: 'h-14 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
