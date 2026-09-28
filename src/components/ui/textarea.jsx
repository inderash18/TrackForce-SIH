import * as React from 'react';
import { cn } from '../../lib/utils';
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
    return (<textarea className={cn('flex min-h-[80px] w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#172033] shadow-2xs placeholder:text-[#526176]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:border-sky-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors', className)} ref={ref} {...props}/>);
});
Textarea.displayName = 'Textarea';
export { Textarea };
