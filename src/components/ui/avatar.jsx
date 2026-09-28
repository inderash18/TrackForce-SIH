import * as React from 'react';
import { cn } from '../../lib/utils';
export const Avatar = ({ src, alt = 'Avatar', fallback = 'U', className, ...props }) => {
    const [hasError, setHasError] = React.useState(!src);
    return (<div className={cn('relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#E2E8F0] bg-slate-100 font-semibold text-xs text-[#172033] items-center justify-center', className)} {...props}>
      {!hasError && src ? (<img src={src} alt={alt} onError={() => setHasError(true)} className="aspect-square h-full w-full object-cover"/>) : (<span className="select-none uppercase">{fallback}</span>)}
    </div>);
};
