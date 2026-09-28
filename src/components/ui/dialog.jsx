import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
const Dialog = ({ open, onOpenChange, children }) => {
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && open) {
                onOpenChange(false);
            }
        };
        if (open) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }
        else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onOpenChange]);
    if (!open)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
      {/* Dimmed backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={() => onOpenChange(false)} aria-hidden="true"/>
      {/* Dialog content container */}
      <div className="relative z-50 w-full flex items-center justify-center my-auto">{children}</div>
    </div>);
};
const DialogContent = React.forwardRef(({ className, children, onClose, ...props }, ref) => (<div ref={ref} className={cn('mx-auto w-full max-w-lg max-h-[calc(100dvh-20px)] overflow-y-auto rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-6 shadow-2xl transition-all duration-200', className)} {...props}>
    {children}
    {onClose && (<button type="button" onClick={onClose} className="absolute right-3.5 top-3.5 rounded-md p-1.5 text-[#526176] opacity-70 transition-opacity hover:opacity-100 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500" aria-label="Close">
        <X className="h-4 w-4"/>
      </button>)}
  </div>));
DialogContent.displayName = 'DialogContent';
const DialogHeader = ({ className, ...props }) => (<div className={cn('flex flex-col space-y-1.5 text-left mb-4', className)} {...props}/>);
DialogHeader.displayName = 'DialogHeader';
const DialogFooter = ({ className, ...props }) => (<div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t border-slate-100 mt-4', className)} {...props}/>);
DialogFooter.displayName = 'DialogFooter';
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (<h2 ref={ref} className={cn('text-lg font-bold leading-none tracking-tight text-[#172033]', className)} {...props}/>));
DialogTitle.displayName = 'DialogTitle';
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (<p ref={ref} className={cn('text-xs text-[#526176]', className)} {...props}/>));
DialogDescription.displayName = 'DialogDescription';
export { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, };
