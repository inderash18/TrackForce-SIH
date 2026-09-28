import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs font-semibold ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-[#172033] text-white hover:bg-[#23304a] shadow-sm',
        secondary: 'bg-white text-[#172033] border border-[#E2E8F0] hover:bg-slate-50 hover:border-slate-300 shadow-xs',
        outline: 'border border-[#E2E8F0] bg-transparent text-[#172033] hover:bg-slate-100 hover:text-slate-900',
        accent: 'bg-[#0284C7] text-white hover:bg-[#0369a1] shadow-sm',
        ghost: 'text-[#526176] hover:bg-slate-100 hover:text-[#172033]',
        destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
        link: 'text-[#0284C7] underline-offset-4 hover:underline p-0 h-auto font-medium',
      },
      size: {
        default: 'h-9 px-3.5 py-2',
        sm: 'h-8 px-2.5 text-[11px] rounded-md',
        lg: 'h-10 px-5 text-sm rounded-lg',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
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
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
