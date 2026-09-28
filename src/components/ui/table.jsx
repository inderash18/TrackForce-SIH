import * as React from 'react';
import { cn } from '../../lib/utils';
const Table = React.forwardRef(({ className, ...props }, ref) => (<div className="relative w-full overflow-auto rounded-xl border border-[#E2E8F0]">
    <table ref={ref} className={cn('w-full caption-bottom text-xs text-left', className)} {...props}/>
  </div>));
Table.displayName = 'Table';
const TableHeader = React.forwardRef(({ className, ...props }, ref) => (<thead ref={ref} className={cn('bg-slate-50 border-b border-[#E2E8F0]', className)} {...props}/>));
TableHeader.displayName = 'TableHeader';
const TableBody = React.forwardRef(({ className, ...props }, ref) => (<tbody ref={ref} className={cn('[&_tr:last-child]:border-0 divide-y divide-[#E2E8F0]', className)} {...props}/>));
TableBody.displayName = 'TableBody';
const TableFooter = React.forwardRef(({ className, ...props }, ref) => (<tfoot ref={ref} className={cn('border-t border-[#E2E8F0] bg-slate-50 font-medium', className)} {...props}/>));
TableFooter.displayName = 'TableFooter';
const TableRow = React.forwardRef(({ className, ...props }, ref) => (<tr ref={ref} className={cn('border-b border-[#E2E8F0] transition-colors hover:bg-slate-50/70 data-[state=selected]:bg-slate-100', className)} {...props}/>));
TableRow.displayName = 'TableRow';
const TableHead = React.forwardRef(({ className, ...props }, ref) => (<th ref={ref} className={cn('h-10 px-4 text-left align-middle font-semibold text-[#526176] [&:has([role=checkbox])]:pr-0', className)} {...props}/>));
TableHead.displayName = 'TableHead';
const TableCell = React.forwardRef(({ className, ...props }, ref) => (<td ref={ref} className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0 text-[#172033]', className)} {...props}/>));
TableCell.displayName = 'TableCell';
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, };
