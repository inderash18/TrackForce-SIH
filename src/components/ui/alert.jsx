import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
const alertVariants = cva('relative w-full rounded-xl border p-4 text-xs [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground', {
    variants: {
        variant: {
            default: 'bg-white text-[#172033] border-[#E2E8F0]',
            info: 'bg-sky-50/80 border-sky-200 text-sky-900 [&>svg]:text-sky-600',
            success: 'bg-emerald-50/80 border-emerald-200 text-emerald-900 [&>svg]:text-emerald-600',
            warning: 'bg-amber-50/80 border-amber-200 text-amber-900 [&>svg]:text-amber-600',
            destructive: 'bg-red-50/80 border-red-200 text-red-900 [&>svg]:text-red-600',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});
const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (<div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}/>));
Alert.displayName = 'Alert';
const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (<h5 ref={ref} className={cn('mb-1 font-semibold leading-none tracking-tight', className)} {...props}/>));
AlertTitle.displayName = 'AlertTitle';
const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (<div ref={ref} className={cn('text-xs [&_p]:leading-relaxed opacity-90', className)} {...props}/>));
AlertDescription.displayName = 'AlertDescription';
export { Alert, AlertTitle, AlertDescription };
