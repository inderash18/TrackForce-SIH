import * as React from 'react';
import { cn } from '../../lib/utils';
const DropdownContext = React.createContext(null);
export const DropdownMenu = ({ children }) => {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef(null);
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);
    return (<DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>);
};
export const DropdownMenuTrigger = ({ children, className }) => {
    const ctx = React.useContext(DropdownContext);
    if (!ctx)
        return null;
    return (<div onClick={() => ctx.setOpen((prev) => !prev)} className={cn('cursor-pointer inline-flex', className)}>
      {children}
    </div>);
};
export const DropdownMenuContent = ({ children, className, align = 'right' }) => {
    const ctx = React.useContext(DropdownContext);
    if (!ctx || !ctx.open)
        return null;
    return (<div className={cn('absolute z-50 mt-1.5 min-w-[180px] rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-100', align === 'right' ? 'right-0' : 'left-0', className)}>
      {children}
    </div>);
};
export const DropdownMenuItem = ({ children, onClick, className, destructive }) => {
    const ctx = React.useContext(DropdownContext);
    return (<div onClick={() => {
            if (onClick)
                onClick();
            if (ctx)
                ctx.setOpen(false);
        }} className={cn('relative flex cursor-pointer select-none items-center rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none transition-colors hover:bg-slate-100', destructive ? 'text-red-600 hover:bg-red-50' : 'text-[#172033]', className)}>
      {children}
    </div>);
};
