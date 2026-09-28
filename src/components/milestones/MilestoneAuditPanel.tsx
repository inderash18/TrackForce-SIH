import React, { useState, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  Button,
  Input,
  Textarea,
  Badge,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Alert,
  AlertTitle,
  AlertDescription,
  Skeleton
} from '../ui';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Search,
  Layers,
  ShieldCheck
} from 'lucide-react';
import type { Project } from '../../types/project';

export interface MilestoneItem {
  id: string;
  code: string;
  name: string;
  package: string;
  targetDate: string;
  actualOrRevisedDate?: string;
  status: 'Completed' | 'In Progress' | 'Delayed' | 'Under Review';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  physicalWeightagePct: number;
  completedPct: number;
  auditedBy?: string;
  lastAuditedDate?: string;
  auditNotes?: string;
  delayMonths?: number;
  contractor: string;
}

interface MilestoneAuditPanelProps {
  project?: Project;
  onAuditSubmit?: (milestoneId: string, notes: string, status: string) => void;
}

export const MilestoneAuditPanel: React.FC<MilestoneAuditPanelProps> = ({
  project: _project,
  onAuditSubmit
}) => {
  // Sample initial milestone records mapped from project or baseline defaults
  const [milestones, setMilestones] = useState<MilestoneItem[]>([
    {
      id: 'MS-01',
      code: 'PKG-CIVIL-01',
      name: 'Right of Way (RoW) & Ground Clearance',
      package: 'Land & Environmental Clearance',
      targetDate: '15 Jan 2024',
      actualOrRevisedDate: '28 Feb 2024',
      status: 'Completed',
      riskLevel: 'low',
      physicalWeightagePct: 15,
      completedPct: 100,
      auditedBy: 'MoSPI National Oversight Cell',
      lastAuditedDate: '10 Mar 2024',
      auditNotes: '100% of required section handovers completed and gazetted.',
      contractor: 'L&T Infrastructure'
    },
    {
      id: 'MS-02',
      code: 'PKG-FOUND-02',
      name: 'Substructure & Pier Foundation Works',
      package: 'Civil Structures Package 1',
      targetDate: '30 Nov 2024',
      actualOrRevisedDate: '15 Jan 2025',
      status: 'Completed',
      riskLevel: 'low',
      physicalWeightagePct: 25,
      completedPct: 100,
      auditedBy: 'Implementing Agency Lead',
      lastAuditedDate: '20 Jan 2025',
      auditNotes: 'Deep pile foundation certified by structural consultant.',
      contractor: 'Afcons Infrastructure'
    },
    {
      id: 'MS-03',
      code: 'PKG-GIRDER-03',
      name: 'Viaduct Segment Casting & Erection',
      package: 'Superstructure Package 2',
      targetDate: '15 Sep 2025',
      actualOrRevisedDate: '30 Dec 2025',
      status: 'Delayed',
      riskLevel: 'critical',
      physicalWeightagePct: 30,
      completedPct: 58,
      delayMonths: 3.5,
      auditNotes: 'Casting yard output hampered by monsoon supply chain bottlenecks.',
      contractor: 'Tata Projects Ltd'
    },
    {
      id: 'MS-04',
      code: 'PKG-TRACK-04',
      name: 'Track Superstructure & Ballastless Laying',
      package: 'Permanent Way Package 3',
      targetDate: '28 Feb 2026',
      actualOrRevisedDate: '15 May 2026',
      status: 'Under Review',
      riskLevel: 'high',
      physicalWeightagePct: 20,
      completedPct: 22,
      delayMonths: 2.5,
      auditNotes: 'Pre-cast slab track supplier review pending technical signoff.',
      contractor: 'IRCON International'
    },
    {
      id: 'MS-05',
      code: 'PKG-SIG-05',
      name: 'Signaling, Telecomm & Traction Substation',
      package: 'Systems & Electrical Integration',
      targetDate: '31 Aug 2026',
      status: 'In Progress',
      riskLevel: 'medium',
      physicalWeightagePct: 10,
      completedPct: 15,
      contractor: 'Siemens Mobility Consortium'
    }
  ]);

  // Filtering states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [isLoading] = useState(false);

  // Dialog State
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneItem | null>(null);
  const [auditNotes, setAuditNotes] = useState('');
  const [auditDecision, setAuditDecision] = useState<'Verified' | 'Flagged for Escalation' | 'Revision Requested'>('Verified');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filter logic
  const filteredMilestones = useMemo(() => {
    return milestones.filter((m) => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (riskFilter !== 'all' && m.riskLevel !== riskFilter) return false;
      if (
        search &&
        !m.name.toLowerCase().includes(search.toLowerCase()) &&
        !m.code.toLowerCase().includes(search.toLowerCase()) &&
        !m.package.toLowerCase().includes(search.toLowerCase()) &&
        !m.contractor.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [milestones, search, statusFilter, riskFilter]);

  // Metric Aggregations
  const totalCount = milestones.length;
  const completedCount = milestones.filter((m) => m.status === 'Completed').length;
  const delayedCount = milestones.filter((m) => m.status === 'Delayed' || m.riskLevel === 'critical').length;
  const inProgressCount = milestones.filter((m) => m.status === 'In Progress' || m.status === 'Under Review').length;

  const handleOpenAudit = (item: MilestoneItem) => {
    setSelectedMilestone(item);
    setAuditNotes(item.auditNotes || '');
    setAuditDecision(item.status === 'Delayed' ? 'Flagged for Escalation' : 'Verified');
  };

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setMilestones((prev) =>
        prev.map((m) =>
          m.id === selectedMilestone.id
            ? {
                ...m,
                status: auditDecision === 'Verified' ? 'Completed' : auditDecision === 'Flagged for Escalation' ? 'Delayed' : 'Under Review',
                auditNotes,
                auditedBy: 'MoSPI Statutory Auditor',
                lastAuditedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
              }
            : m
        )
      );

      if (onAuditSubmit) {
        onAuditSubmit(selectedMilestone.id, auditNotes, auditDecision);
      }

      setIsSubmitting(false);
      setSelectedMilestone(null);
      setSuccessToast(`Milestone ${selectedMilestone.code} audit sign-off recorded successfully.`);
      setTimeout(() => setSuccessToast(null), 4000);
    }, 600);
  };

  const getStatusBadge = (status: MilestoneItem['status']) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="success">Completed</Badge>;
      case 'In Progress':
        return <Badge variant="accent">In Progress</Badge>;
      case 'Delayed':
        return <Badge variant="destructive">Delayed</Badge>;
      case 'Under Review':
        return <Badge variant="warning">Under Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRiskBadge = (risk: MilestoneItem['riskLevel']) => {
    switch (risk) {
      case 'critical':
        return <Badge variant="destructive">Critical Risk</Badge>;
      case 'high':
        return <Badge variant="warning">High Risk</Badge>;
      case 'medium':
        return <Badge variant="secondary">Moderate</Badge>;
      case 'low':
        return <Badge variant="success">On Track</Badge>;
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <Alert variant="success" className="animate-in fade-in slide-in-from-top-2 duration-200">
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>Audit Verified</AlertTitle>
          <AlertDescription>{successToast}</AlertDescription>
        </Alert>
      )}

      {/* 1. Summary Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-slate-300 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-medium text-slate-500">Total Milestones</CardDescription>
            <Layers className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#172033]">{totalCount}</div>
            <p className="text-[11px] text-[#526176] mt-1">100% of contracted packages</p>
          </CardContent>
        </Card>

        <Card className="hover:border-emerald-200 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-medium text-slate-500">Completed &amp; Signed</CardDescription>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">{completedCount}</div>
            <p className="text-[11px] text-[#526176] mt-1">
              {Math.round((completedCount / (totalCount || 1)) * 100)}% execution weight
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-sky-200 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-medium text-slate-500">Active / In Progress</CardDescription>
            <Clock className="h-4 w-4 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0284C7]">{inProgressCount}</div>
            <p className="text-[11px] text-[#526176] mt-1">Under field inspection</p>
          </CardContent>
        </Card>

        <Card className="hover:border-red-200 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-medium text-slate-500">Slippage &amp; Delays</CardDescription>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{delayedCount}</div>
            <p className="text-[11px] text-red-600 mt-1 font-medium">Requires cabinet intervention</p>
          </CardContent>
        </Card>
      </div>

      {/* 2. Filter & Action Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by package name, code, or contractor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs text-[#172033] shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <option value="all">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Delayed">Delayed</option>
              <option value="Under Review">Under Review</option>
            </select>

            {/* Risk Filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="h-9 rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs text-[#172033] shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Moderate</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical Risk</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setRiskFilter('all');
              }}
              className="text-xs"
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* 3. Milestone Table */}
      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[35%]">Milestone Package &amp; Code</TableHead>
              <TableHead>Target Date</TableHead>
              <TableHead>Weightage</TableHead>
              <TableHead>Physical Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Audit Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredMilestones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-[#526176]">
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <p className="text-xs font-semibold text-[#172033]">No milestone records found</p>
                    <p className="text-[11px] text-[#526176]">Try adjusting your search criteria or resetting filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredMilestones.map((m) => (
                <TableRow key={m.id} className="hover:bg-slate-50/80 transition-colors">
                  <TableCell>
                    <div className="font-semibold text-xs text-[#172033]">{m.name}</div>
                    <div className="text-[11px] text-[#526176] flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-slate-500">{m.code}</span>
                      <span>&middot;</span>
                      <span>{m.package}</span>
                      <span>&middot;</span>
                      <span className="text-slate-600">{m.contractor}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-medium text-[#172033]">{m.targetDate}</div>
                    {m.actualOrRevisedDate && (
                      <div className="text-[11px] text-amber-700 mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Revised: {m.actualOrRevisedDate}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-semibold text-[#172033]">{m.physicalWeightagePct}%</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            m.completedPct === 100
                              ? 'bg-emerald-600'
                              : m.status === 'Delayed'
                              ? 'bg-red-500'
                              : 'bg-[#0284C7]'
                          }`}
                          style={{ width: `${m.completedPct}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold tabular-nums text-slate-700">{m.completedPct}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {getStatusBadge(m.status)}
                      {getRiskBadge(m.riskLevel)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenAudit(m)}
                      className="inline-flex items-center gap-1 text-xs"
                    >
                      <FileCheck className="h-3.5 w-3.5" />
                      <span>Audit</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* 4. Audit Review Dialog */}
      <Dialog open={!!selectedMilestone} onOpenChange={(open) => !open && setSelectedMilestone(null)}>
        {selectedMilestone && (
          <DialogContent onClose={() => setSelectedMilestone(null)} className="max-w-xl">
            <form onSubmit={handleAuditSubmit}>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  {getStatusBadge(selectedMilestone.status)}
                  <span className="text-[11px] font-mono text-slate-500 uppercase">{selectedMilestone.code}</span>
                </div>
                <DialogTitle>{selectedMilestone.name}</DialogTitle>
                <DialogDescription>
                  Perform statutory milestone progress audit, verify physical delivery velocity, and record oversight notes.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                {/* Milestone Detail Grid */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Implementing Contractor</span>
                    <span className="font-semibold text-slate-900">{selectedMilestone.contractor}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Package Category</span>
                    <span className="font-semibold text-slate-900">{selectedMilestone.package}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Target Scheduled Date</span>
                    <span className="font-semibold text-slate-900">{selectedMilestone.targetDate}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Current Completion</span>
                    <span className="font-semibold text-slate-900">{selectedMilestone.completedPct}% physical progress</span>
                  </div>
                </div>

                {/* Delay Warning Callout */}
                {selectedMilestone.delayMonths && selectedMilestone.delayMonths > 0 && (
                  <Alert variant="warning">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Schedule Slippage Detected</AlertTitle>
                    <AlertDescription>
                      This milestone is currently delayed by ~{selectedMilestone.delayMonths} months past its baseline target date.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Audit Decision Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#172033]">Auditor Determination</label>
                  <select
                    value={auditDecision}
                    onChange={(e: any) => setAuditDecision(e.target.value)}
                    className="w-full h-9 rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs text-[#172033] shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  >
                    <option value="Verified">Verified &amp; Progress Confirmed</option>
                    <option value="Flagged for Escalation">Flagged for Escalation / Slippage Notice</option>
                    <option value="Revision Requested">Revision Requested (Data Rectification)</option>
                  </select>
                </div>

                {/* Audit Notes Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#172033]">Statutory Audit Notes &amp; Observations</label>
                  <Textarea
                    rows={3}
                    placeholder="Provide site inspection findings, vendor capacity feedback, or reason for status change..."
                    value={auditNotes}
                    onChange={(e) => setAuditNotes(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setSelectedMilestone(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default" disabled={isSubmitting}>
                  {isSubmitting ? 'Recording Audit...' : 'Submit Audit Sign-off'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
