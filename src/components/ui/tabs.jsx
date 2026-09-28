import * as React from 'react';
import { cn } from '../../lib/utils';
const TabsContext = React.createContext(undefined);
const Tabs = ({ value, onValueChange, className, children, ...props }) => {
    return (<TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn('flex flex-col space-y-4', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>);
};
const TabsList = React.forwardRef(({ className, ...props }, ref) => (<div ref={ref} className={cn('inline-flex h-9 items-center justify-start rounded-lg bg-slate-100 p-1 text-[#526176]', className)} role="tablist" {...props}/>));
TabsList.displayName = 'TabsList';
const TabsTrigger = React.forwardRef(({ className, value, children, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    if (!context)
        throw new Error('TabsTrigger must be used within Tabs');
    const isSelected = context.value === value;
    return (<button ref={ref} type="button" role="tab" aria-selected={isSelected} onClick={() => context.onValueChange(value)} className={cn('inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:pointer-events-none disabled:opacity-50', isSelected
            ? 'bg-[#172033] text-white shadow-xs'
            : 'text-[#526176] hover:text-[#172033] hover:bg-slate-200/60', className)} {...props}>
        {children}
      </button>);
});
TabsTrigger.displayName = 'TabsTrigger';
const TabsContent = React.forwardRef(({ className, value, children, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    if (!context)
        throw new Error('TabsContent must be used within Tabs');
    if (context.value !== value)
        return null;
    return (<div ref={ref} role="tabpanel" className={cn('ring-offset-background focus-visible:outline-none', className)} {...props}>
        {children}
      </div>);
});
TabsContent.displayName = 'TabsContent';
export { Tabs, TabsList, TabsTrigger, TabsContent };
