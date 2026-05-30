import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

type Zone = 'executive' | 'hiring' | 'workforce' | 'growth' | 'org' | 'replay'

interface KpiCard {
  label: string
  value: string | number
  delta?: string
  deltaPositive?: boolean
  sublabel?: string
  alert?: boolean
  warning?: boolean
}

interface TraceEvent {
  ts: string
  service: string
  op: string
  correlation_id: string
  status: 'success' | 'failure' | 'in_progress'
}

// ────────────────────────────────────────────────────────────────────────────
// Static mock data (read-only intelligence — no execution authority)
// In production, replace with API calls to /v1/dashboard/* endpoints.
// ────────────────────────────────────────────────────────────────────────────

const EXEC_KPIS: KpiCard[] = [
  { label: 'Workforce Health', value: 'Stable', sublabel: 'No critical escalations', deltaPositive: true },
  { label: 'Active Headcount', value: 240, sublabel: 'candidates in pipeline' },
  { label: 'Open Roles', value: 25, sublabel: 'across all tenants', warning: true },
  { label: 'Payroll State', value: 'Calculated', sublabel: 'Artha-owned — visibility only', deltaPositive: true },
  { label: 'Open Escalations', value: 3, sublabel: 'pending HR action', alert: true },
]

const HIRING_KPIS: KpiCard[] = [
  { label: 'Pipeline: Sourcing', value: 98, sublabel: 'candidates' },
  { label: 'Pipeline: Screening', value: 57, sublabel: 'candidates' },
  { label: 'Pipeline: Interview', value: 42, sublabel: 'scheduled' },
  { label: 'Pipeline: Offer', value: 8, sublabel: 'offers extended' },
  { label: 'Avg Time-to-Fill', value: '18 days', sublabel: 'across open roles', warning: true },
  { label: 'Recruiter Load', value: '94%', sublabel: 'utilisation avg', warning: true },
]

const WORKFORCE_KPIS: KpiCard[] = [
  { label: 'Pending HR Requests', value: 12, sublabel: 'awaiting action', alert: true },
  { label: 'SLA Breaches', value: 3, sublabel: 'requests overdue', alert: true },
  { label: 'Attendance Flags', value: 7, sublabel: 'anomalies (team-level, aggregated)', warning: true },
  { label: 'Leave Requests Open', value: 19, sublabel: 'pending approval' },
  { label: 'Reimbursement Backlog', value: 5, sublabel: 'pending finance review' },
]

const GROWTH_KPIS: KpiCard[] = [
  { label: 'Learning Completion', value: '68%', sublabel: 'team avg this quarter', deltaPositive: true },
  { label: 'Active Mentorships', value: 14, sublabel: 'mentor–mentee pairs active', deltaPositive: true },
  { label: 'Skill Gaps Flagged', value: 6, sublabel: 'team-level deficits identified', warning: true },
  { label: 'Growth Trajectory', value: 'Broadening', sublabel: 'team aggregate direction', deltaPositive: true },
]

const ORG_KPIS: KpiCard[] = [
  { label: 'Staffing Gap Score', value: 'Moderate', sublabel: '7 critical vacancies', warning: true },
  { label: 'Cross-Team Risk', value: 'Low', sublabel: 'dependency health stable', deltaPositive: true },
  { label: 'Dept Load: Engineering', value: '87%', sublabel: 'capacity utilisation', warning: true },
  { label: 'Dept Load: Design', value: '62%', sublabel: 'capacity utilisation', deltaPositive: true },
]

const REPLAY_EVENTS: TraceEvent[] = [
  { ts: '2026-05-26T13:33:51Z', service: 'Gateway', op: 'POST /v1/jobs', correlation_id: 'trace_conv_17_257502', status: 'success' },
  { ts: '2026-05-26T13:35:21Z', service: 'Agent', op: 'GET /v1/match/6a15.../top', correlation_id: 'trace_conv_17_257502', status: 'success' },
  { ts: '2026-05-26T13:35:21Z', service: 'Gateway', op: 'POST /v1/candidate/apply', correlation_id: 'trace_conv_17_257502', status: 'success' },
  { ts: '2026-05-26T13:35:21Z', service: 'LangGraph', op: 'POST /api/v1/webhooks/candidate-applied', correlation_id: 'trace_conv_17_257502', status: 'success' },
  { ts: '2026-05-26T13:35:22Z', service: 'Gateway', op: 'GET /api/v1/workflow/status/{id}', correlation_id: 'trace_conv_17_257502', status: 'success' },
]

// ────────────────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────────────────

function KpiPill({ card }: { card: KpiCard }) {
  const borderColor = card.alert
    ? 'border-red-400/40 dark:border-red-500/30'
    : card.warning
    ? 'border-amber-400/40 dark:border-amber-500/30'
    : 'border-white/10 dark:border-slate-700/50'

  const bgColor = card.alert
    ? 'bg-red-50/80 dark:bg-red-950/30'
    : card.warning
    ? 'bg-amber-50/80 dark:bg-amber-950/30'
    : 'bg-white/70 dark:bg-slate-800/60'

  const valuColor = card.alert
    ? 'text-red-600 dark:text-red-400'
    : card.warning
    ? 'text-amber-600 dark:text-amber-400'
    : 'text-slate-900 dark:text-white'

  return (
    <div
      className={`rounded-2xl border ${borderColor} ${bgColor} backdrop-blur-md p-4 flex flex-col gap-1 shadow-sm hover:shadow-md transition-shadow`}
    >
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
        {card.label}
      </p>
      <p className={`text-2xl font-bold font-heading ${valuColor}`}>{card.value}</p>
      {card.sublabel && (
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{card.sublabel}</p>
      )}
      {card.alert && (
        <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-red-600 dark:text-red-400">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Attention required
        </span>
      )}
    </div>
  )
}

function ZoneHeader({
  title,
  subtitle,
  icon,
}: {
  title: string
  subtitle: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-heading font-bold text-slate-900 dark:text-white leading-tight">
          {title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: TraceEvent['status'] }) {
  const cls =
    status === 'success'
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
      : status === 'failure'
      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${cls}`}>
      {status}
    </span>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Zone panels
// ────────────────────────────────────────────────────────────────────────────

function ExecutiveZone() {
  return (
    <div>
      <ZoneHeader
        title="Executive Zone"
        subtitle="Workforce health · Hiring health · Payroll state · Escalations"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {EXEC_KPIS.map((k) => (
          <KpiPill key={k.label} card={k} />
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 italic">
        Payroll state shown as visibility cue only. Payroll ownership: Artha. No execution authority surfaced here.
      </p>
    </div>
  )
}

function HiringZone() {
  return (
    <div>
      <ZoneHeader
        title="Hiring Zone"
        subtitle="Candidate pipeline · Recruiter visibility · Interview state · Onboarding state"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {HIRING_KPIS.map((k) => (
          <KpiPill key={k.label} card={k} />
        ))}
      </div>
      {/* Pipeline funnel visualisation */}
      <div className="mt-5 flex items-end gap-2 h-24">
        {[
          { label: 'Sourcing', count: 98, color: 'bg-indigo-500' },
          { label: 'Screening', count: 57, color: 'bg-violet-500' },
          { label: 'Interview', count: 42, color: 'bg-purple-500' },
          { label: 'Offer', count: 8, color: 'bg-fuchsia-500' },
        ].map((stage) => {
          const heightPct = Math.round((stage.count / 98) * 100)
          return (
            <div key={stage.label} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{stage.count}</span>
              <div
                className={`w-full rounded-t-lg ${stage.color} opacity-80`}
                style={{ height: `${heightPct}%` }}
              />
              <span className="text-[10px] text-slate-500 dark:text-slate-400">{stage.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WorkforceOpsZone() {
  return (
    <div>
      <ZoneHeader
        title="Workforce Operations Zone"
        subtitle="Attendance · HR requests · Leave · Reimbursements · Payroll cues"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {WORKFORCE_KPIS.map((k) => (
          <KpiPill key={k.label} card={k} />
        ))}
      </div>
    </div>
  )
}

function GrowthZone() {
  return (
    <div>
      <ZoneHeader
        title="Growth & Development Zone"
        subtitle="Learning · Mentorship · Skill trajectory · Aspirations — human-centric, no surveillance"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {GROWTH_KPIS.map((k) => (
          <KpiPill key={k.label} card={k} />
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-indigo-200/40 dark:border-indigo-700/30 bg-indigo-50/50 dark:bg-indigo-950/20 p-4">
        <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1">
          Growth Privacy Guardrail Active
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          All metrics shown are team-level aggregates. Individual growth trajectories are visible only to the employee and their HR partner (with consent). No leaderboards, no dopamine loops, no individual ranking.
        </p>
      </div>
    </div>
  )
}

function OrgVisibilityZone() {
  return (
    <div>
      <ZoneHeader
        title="Organizational Visibility Zone"
        subtitle="Department map · Dependency risk · Staffing gaps · Bottlenecks"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {ORG_KPIS.map((k) => (
          <KpiPill key={k.label} card={k} />
        ))}
      </div>
      {/* Department load heatmap (visual-only) */}
      <div className="rounded-xl border border-slate-200/50 dark:border-slate-700/40 bg-white/60 dark:bg-slate-800/50 p-4 backdrop-blur-sm">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">Department Load Heatmap (aggregated)</p>
        <div className="space-y-2">
          {[
            { dept: 'Engineering', load: 87, color: 'bg-amber-500' },
            { dept: 'Product', load: 71, color: 'bg-indigo-500' },
            { dept: 'Design', load: 62, color: 'bg-emerald-500' },
            { dept: 'Sales', load: 55, color: 'bg-emerald-500' },
            { dept: 'HR', load: 43, color: 'bg-emerald-400' },
          ].map((d) => (
            <div key={d.dept} className="flex items-center gap-3">
              <span className="text-xs text-slate-600 dark:text-slate-400 w-20 truncate">{d.dept}</span>
              <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div className={`${d.color} h-2 rounded-full`} style={{ width: `${d.load}%` }} />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-8 text-right">
                {d.load}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ReplayTraceZone() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div>
      <ZoneHeader
        title="Replay / Trace Zone"
        subtitle="Audit trail · Replay reconstruction · Observability evidence"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <KpiPill card={{ label: 'Last Replay', value: '2026-05-26', sublabel: '13:35:22Z — SUCCESS', deltaPositive: true }} />
        <KpiPill card={{ label: 'Trace Density', value: '5 hops', sublabel: 'correlation ID: trace_conv_17_257502' }} />
        <KpiPill card={{ label: 'Unreconciled Events', value: 0, sublabel: 'all events matched', deltaPositive: true }} />
      </div>

      <div className="rounded-xl border border-slate-200/50 dark:border-slate-700/40 bg-white/60 dark:bg-slate-800/50 p-4 backdrop-blur-sm">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Audit Trace — Correlation ID: <code className="font-mono text-indigo-600 dark:text-indigo-400">trace_conv_17_257502</code>
        </p>
        <div className="space-y-2">
          {REPLAY_EVENTS.map((ev, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-3 py-2"
            >
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpanded(expanded === String(idx) ? null : String(idx))}>
                <StatusBadge status={ev.status} />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{ev.ts}</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{ev.service}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">{ev.op}</span>
                <svg
                  className={`w-3 h-3 text-slate-400 ml-auto shrink-0 transition-transform ${expanded === String(idx) ? 'rotate-90' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              {expanded === String(idx) && (
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-mono space-y-1">
                  <p>correlation_id: {ev.correlation_id}</p>
                  <p>service: {ev.service}</p>
                  <p>operation: {ev.op}</p>
                  <p>timestamp: {ev.ts}</p>
                  <p>status: {ev.status}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 italic">
          Replay engine: <code className="font-mono">evidence/replay/replay_script.js</code> — deterministic state reconstruction from ordered audit logs.
        </p>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Main Control Center
// ────────────────────────────────────────────────────────────────────────────

// Feature flag (Vite env): set VITE_ENABLE_CONTROL_CENTER=true to enable
const ENABLE_CONTROL_CENTER = import.meta.env.VITE_ENABLE_CONTROL_CENTER === 'true'

const ZONES: { id: Zone; label: string; short: string }[] = [
  { id: 'executive', label: 'Executive', short: 'Exec' },
  { id: 'hiring', label: 'Hiring', short: 'Hiring' },
  { id: 'workforce', label: 'Workforce Ops', short: 'Ops' },
  { id: 'growth', label: 'Growth', short: 'Growth' },
  { id: 'org', label: 'Org Visibility', short: 'Org' },
  { id: 'replay', label: 'Replay / Trace', short: 'Trace' },
]

export default function ControlCenter() {
  const [activeZone, setActiveZone] = useState<Zone>('executive')
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const { userRole, loading } = useAuth()

  const ALLOWED_ROLES = new Set(['client', 'recruiter', 'admin', 'system'])

  // Feature gating & RBAC: if the feature is disabled, render a small notice.
  if (!ENABLE_CONTROL_CENTER) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-600">Control Center feature is disabled (VITE_ENABLE_CONTROL_CENTER=false).</p>
      </div>
    )
  }

  // While auth loads, show nothing to avoid flicker/unauthorized rendering
  if (loading) return null

  if (!ALLOWED_ROLES.has(String(userRole))) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">Access denied: you do not have permission to view the Control Center.</p>
      </div>
    )
  }

  useEffect(() => {
    // Simulate periodic refresh awareness (real: would re-fetch from /v1/dashboard/*)
    const id = setInterval(() => setLastRefresh(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-900 animate-fade-in">
      {/* ── Top Rail ── */}
      <div className="sticky top-0 z-40 border-b border-slate-200/60 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-heading font-bold text-slate-900 dark:text-white leading-tight">
                Sampada Workforce Control Center
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                BHIV · Intelligence Layer · Visibility Only
              </p>
            </div>
          </div>

          {/* Zone nav tabs */}
          <nav className="flex gap-1 overflow-x-auto flex-1 sm:justify-center" aria-label="Control Center Zones">
            {ZONES.map((z) => (
              <button
                key={z.id}
                id={`zone-tab-${z.id}`}
                onClick={() => setActiveZone(z.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeZone === z.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="sm:hidden">{z.short}</span>
                <span className="hidden sm:inline">{z.label}</span>
              </button>
            ))}
          </nav>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              Last refresh: {lastRefresh.toLocaleTimeString()}
            </span>
            <button
              id="control-center-refresh-btn"
              onClick={() => setLastRefresh(new Date())}
              title="Refresh dashboard"
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Active Zone Panel ── */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="rounded-2xl border border-white/60 dark:border-slate-700/40 bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl shadow-xl p-5 sm:p-7">
          {activeZone === 'executive' && <ExecutiveZone />}
          {activeZone === 'hiring' && <HiringZone />}
          {activeZone === 'workforce' && <WorkforceOpsZone />}
          {activeZone === 'growth' && <GrowthZone />}
          {activeZone === 'org' && <OrgVisibilityZone />}
          {activeZone === 'replay' && <ReplayTraceZone />}
        </div>

        {/* Constitutional Footer */}
        <div className="mt-4 rounded-xl border border-slate-200/40 dark:border-slate-700/30 bg-slate-50/60 dark:bg-slate-900/30 px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <strong className="text-slate-700 dark:text-slate-300">Constitutional Boundary:</strong>{' '}
            This Control Center is read-only intelligence. It surfaces signals and visibility — it does not issue commands, mutate state, or hold execution authority.
            All execution decisions remain with owning systems (Niyantran, Artha, Gateway) under Rishabh Yadav's direction.
          </p>
        </div>
      </div>
    </div>
  )
}
