import { useCallback, useEffect, useRef, useState } from 'react'
import Loading from '../../components/Loading'
import { useAuth } from '../../context/AuthContext'
import {
  AGENT_SERVICE_URL,
  API_BASE_URL,
  LANGGRAPH_SERVICE_URL,
  checkApiHealth,
  fetchGatewayCandidateStats,
  fetchGatewayMetricsDashboard,
  fetchServiceHealth,
  postControlCenterAuditEvent,
  fetchControlCenterAuditReplay,
  fetchControlCenterDashboardAggregates,
  fetchTask20Challenges,
  fetchTask20Decisions,
  fetchTask20Organizations,
  fetchTask20PolicyDefinitions,
  fetchTask20SetuSignals,
  fetchTask20WorkforceTraceReplay,
  type GatewayMetricsDashboard,
  type Task20TraceReplay,
  type GatewayCandidateStats,
  type ServiceHealthSnapshot,
  type ControlCenterTraceEvent,
  type ControlCenterDashboardAggregates,
  type ControlCenterAuditReplay,
} from '../../services/api'

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

type Zone = 'executive' | 'hiring' | 'workforce' | 'growth' | 'org' | 'governance' | 'replay'

interface KpiCard {
  label: string
  value: string | number
  delta?: string
  deltaPositive?: boolean
  sublabel?: string
  alert?: boolean
  warning?: boolean
}

type TraceEvent = ControlCenterTraceEvent

interface Task20GovernanceData {
  organizations: Record<string, unknown>[]
  policies: Record<string, unknown>[]
  challenges: Record<string, unknown>[]
  decisions: Record<string, unknown>[]
  setuSignals: Record<string, unknown>[]
  workforceTrace: Task20TraceReplay | null
}

interface ControlCenterLiveData {
  gatewayHealth: { healthy: boolean; data?: Record<string, unknown> | null } | null
  gatewayMetrics: GatewayMetricsDashboard | null
  candidateStats: GatewayCandidateStats | null
  dashboardAggregates: ControlCenterDashboardAggregates | null
  auditReplay: ControlCenterAuditReplay | null
  task20: Task20GovernanceData | null
  agentHealth: ServiceHealthSnapshot | null
  langgraphHealth: ServiceHealthSnapshot | null
  fetchedAt: string | null
  errors: string[]
  correlationIds: string[]
}

function buildServiceCard(label: string, service: ServiceHealthSnapshot | null, fallbackSource: string): KpiCard {
  if (!service) {
    return {
      label,
      value: 'Offline',
      sublabel: `${fallbackSource} unavailable`,
      alert: true,
    }
  }

  const timestamp = service.timestamp ? new Date(service.timestamp).toLocaleTimeString() : 'no timestamp'
  const version = service.version ? `v${service.version}` : 'version n/a'

  return {
    label,
    value: service.healthy ? 'Healthy' : service.status || 'Degraded',
    sublabel: `${service.baseUrl} · ${version} · ${timestamp}`,
    alert: !service.healthy,
    warning: !service.healthy && service.status !== 'offline',
  }
}

function buildGatewayCard(
  gatewayHealth: { healthy: boolean; data?: Record<string, unknown> | null } | null,
  detail: string,
): KpiCard {
  if (!gatewayHealth) {
    return {
      label: 'Gateway',
      value: 'Unknown',
      sublabel: detail,
      warning: true,
    }
  }

  return {
    label: 'Gateway',
    value: gatewayHealth.healthy ? 'Healthy' : 'Offline',
    sublabel: detail,
    alert: !gatewayHealth.healthy,
  }
}

function serviceBaseSource(service: ServiceHealthSnapshot | null, fallback: string): string {
  return service?.baseUrl ? `${service.baseUrl}/health` : fallback
}

function readNumber(source: unknown, keys: string[], fallback = 0): number {
  if (!source || typeof source !== 'object') return fallback

  const record = source as Record<string, unknown>

  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'number' && Number.isFinite(value)) return value
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value)
      if (Number.isFinite(parsed)) return parsed
    }
  }

  return fallback
}

function toPercentDisplay(value: number): string {
  if (!Number.isFinite(value)) return '0%'
  const normalized = value <= 1 ? value * 100 : value
  return `${normalized.toFixed(normalized >= 10 ? 0 : 1)}%`
}

function toMsDisplay(value: number): string {
  return `${value.toFixed(value >= 100 ? 0 : 1)} ms`
}

function toHoursDisplay(value: number): string {
  return `${value.toFixed(1)} h`
}

function card(label: string, value: string | number, sublabel: string, severity: 'normal' | 'warning' | 'alert' = 'normal'): KpiCard {
  return {
    label,
    value,
    sublabel,
    warning: severity === 'warning',
    alert: severity === 'alert',
  }
}

function buildExecutiveCards(liveData: ControlCenterLiveData | null): KpiCard[] {
  const performance = liveData?.gatewayMetrics?.performance_summary ?? {}
  return [
    buildGatewayCard(liveData?.gatewayHealth ?? null, `${API_BASE_URL}/metrics/dashboard`),
    buildServiceCard('Agent', liveData?.agentHealth ?? null, serviceBaseSource(liveData?.agentHealth ?? null, AGENT_SERVICE_URL)),
    buildServiceCard('LangGraph', liveData?.langgraphHealth ?? null, serviceBaseSource(liveData?.langgraphHealth ?? null, LANGGRAPH_SERVICE_URL)),
    card(
      'Avg Response Time',
      toMsDisplay(readNumber(performance, ['avg_response_time_ms', 'avg_response_time'])),
      'Gateway performance_summary · raw',
    ),
    card('P95 Response Time', toMsDisplay(readNumber(performance, ['p95_response_time_ms', 'p95_response_time'])), 'Gateway performance_summary', 'warning'),
  ]
}

function buildHiringCards(liveData: ControlCenterLiveData | null): KpiCard[] {
  const candidateStats = liveData?.candidateStats ?? null
  const business = liveData?.gatewayMetrics?.business_metrics ?? {}
  return [
    card('Total Candidates', readNumber(candidateStats, ['total_candidates'], readNumber(business, ['total_candidates'])), 'Gateway /v1/candidates/stats'),
    card('Active Jobs', readNumber(candidateStats, ['active_jobs'], readNumber(business, ['active_jobs', 'total_job_postings'])), 'Gateway /v1/candidates/stats'),
    card('Pending Interviews', readNumber(candidateStats, ['pending_interviews'], readNumber(business, ['interviews_scheduled'])), 'Gateway /v1/candidates/stats'),
    card('Recent Matches', readNumber(candidateStats, ['recent_matches'], readNumber(business, ['total_matches_generated'])), 'Gateway /v1/candidates/stats'),
    card('Applications Today', readNumber(business, ['applications_today']), 'Gateway metrics_dashboard · raw', 'warning'),
    card('New Candidates This Week', readNumber(candidateStats, ['new_candidates_this_week']), 'Gateway /v1/candidates/stats'),
  ]
}

function buildFunnelStages(liveData: ControlCenterLiveData | null): { label: string; count: number; color: string }[] {
  const funnel = liveData?.dashboardAggregates?.hiring_funnel
  if (funnel && funnel.length > 0) {
    return funnel
  }
  const stats = liveData?.candidateStats
  const sourcing = readNumber(stats, ['total_candidates'])
  const screening = Math.max(readNumber(stats, ['recent_matches']), 0)
  const interview = Math.max(readNumber(stats, ['pending_interviews']), 0)
  const offer = 0
  return [
    { label: 'Sourcing', count: sourcing, color: 'bg-indigo-500' },
    { label: 'Screening', count: screening, color: 'bg-violet-500' },
    { label: 'Interview', count: interview, color: 'bg-purple-500' },
    { label: 'Offer', count: offer, color: 'bg-fuchsia-500' },
  ]
}

function buildDepartmentLoad(liveData: ControlCenterLiveData | null): { dept: string; load: number; color: string }[] {
  const deptLoad = liveData?.dashboardAggregates?.department_load
  if (deptLoad && deptLoad.length > 0) {
    return deptLoad.map(({ dept, load, color }) => ({ dept, load, color }))
  }
  return []
}

function buildWorkforceCards(liveData: ControlCenterLiveData | null): KpiCard[] {
  const system = liveData?.gatewayMetrics?.system_metrics ?? {}
  return [
    card('CPU Usage', toPercentDisplay(readNumber(system, ['cpu_usage', 'cpu_percent'])), 'Gateway system_metrics', readNumber(system, ['cpu_usage', 'cpu_percent']) >= 80 ? 'warning' : 'normal'),
    card('Memory Usage', toPercentDisplay(readNumber(system, ['memory_usage_percent', 'memory_percent'])), 'Gateway system_metrics', readNumber(system, ['memory_usage_percent', 'memory_percent']) >= 80 ? 'warning' : 'normal'),
    card('Disk Usage', toPercentDisplay(readNumber(system, ['disk_usage_percent', 'disk_percent'])), 'Gateway system_metrics', readNumber(system, ['disk_usage_percent', 'disk_percent']) >= 80 ? 'warning' : 'normal'),
    card('Active Connections', readNumber(system, ['active_connections', 'database_connections']), 'Gateway system_metrics'),
    card('Current Active Users', readNumber(system, ['active_users']), 'Gateway system_metrics'),
  ]
}

function buildGrowthCards(liveData: ControlCenterLiveData | null): KpiCard[] {
  const business = liveData?.gatewayMetrics?.business_metrics ?? {}
  const candidateStats = liveData?.candidateStats ?? null
  return [
    card('Total Matches Generated', readNumber(business, ['total_matches_generated']), 'Gateway business_metrics'),
    card('Total Resumes Processed', readNumber(business, ['total_resumes_processed']), 'Gateway business_metrics'),
    card('Platform Uptime', toHoursDisplay(readNumber(business, ['platform_uptime_hours'])), 'Gateway business_metrics'),
    card('Total Feedback Submissions', readNumber(candidateStats, ['total_feedback_submissions']), 'Gateway /v1/candidates/stats'),
  ]
}

function buildOrgCards(liveData: ControlCenterLiveData | null): KpiCard[] {
  const performance = liveData?.gatewayMetrics?.performance_summary ?? {}
  const business = liveData?.gatewayMetrics?.business_metrics ?? {}
  return [
    card('Requests Per Minute', readNumber(performance, ['requests_per_minute']), 'Gateway performance_summary', readNumber(performance, ['requests_per_minute']) >= 200 ? 'warning' : 'normal'),
    card('Total Requests', readNumber(performance, ['total_requests']), 'Gateway performance_summary'),
    card('Error Rate', toPercentDisplay(readNumber(performance, ['error_rate'])), 'Gateway performance_summary', readNumber(performance, ['error_rate']) > 0.05 ? 'warning' : 'normal'),
    card('Active Users', readNumber(business, ['current_active_users']), 'Gateway business_metrics'),
  ]
}

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

function ExecutiveZone({ cards, sourceSummary }: { cards: KpiCard[]; sourceSummary: string }) {
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
        {cards.map((k) => (
          <KpiPill key={k.label} card={k} />
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 italic">
        Payroll state shown as visibility cue only. Payroll ownership: Artha. No execution authority surfaced here.
      </p>
      <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
        Live source: {sourceSummary}
      </p>
    </div>
  )
}

function HiringZone({
  cards,
  sourceSummary,
  funnelStages,
}: {
  cards: KpiCard[]
  sourceSummary: string
  funnelStages: { label: string; count: number; color: string }[]
}) {
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
        {cards.map((k) => (
          <KpiPill key={k.label} card={k} />
        ))}
      </div>
      {/* Pipeline funnel visualisation */}
      <div className="mt-5 flex items-end gap-2 h-24">
        {funnelStages.map((stage) => {
          const maxCount = Math.max(...funnelStages.map((entry) => entry.count), 1)
          const heightPct = Math.round((stage.count / maxCount) * 100)
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
      <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
        Live source: {sourceSummary}
      </p>
    </div>
  )
}

function WorkforceOpsZone({ cards, sourceSummary }: { cards: KpiCard[]; sourceSummary: string }) {
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
        {cards.map((k) => (
          <KpiPill key={k.label} card={k} />
        ))}
      </div>
      <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
        Live source: {sourceSummary}
      </p>
    </div>
  )
}

function GrowthZone({ cards, sourceSummary }: { cards: KpiCard[]; sourceSummary: string }) {
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
        {cards.map((k) => (
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
      <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
        Live source: {sourceSummary}
      </p>
    </div>
  )
}

function OrgVisibilityZone({
  cards,
  sourceSummary,
  departmentLoad,
}: {
  cards: KpiCard[]
  sourceSummary: string
  departmentLoad: { dept: string; load: number; color: string }[]
}) {
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
        {cards.map((k) => (
          <KpiPill key={k.label} card={k} />
        ))}
      </div>
      {/* Department load heatmap (visual-only) */}
      <div className="rounded-xl border border-slate-200/50 dark:border-slate-700/40 bg-white/60 dark:bg-slate-800/50 p-4 backdrop-blur-sm">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">Department Load Heatmap (aggregated)</p>
        <div className="space-y-2">
          {departmentLoad.map((d) => (
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
      <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
        Live source: {sourceSummary}
      </p>
      </div>
    </div>
  )
}

function ReplayTraceZone({ traceEvents, traceNote }: { traceEvents: TraceEvent[]; traceNote: string }) {
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
          {traceEvents.map((ev, idx) => (
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
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 italic">{traceNote}</p>
      </div>
    </div>
  )
}

function GovernanceZone({ task20 }: { task20: Task20GovernanceData | null }) {
  const orgCount = task20?.organizations.length ?? 0
  const policyCount = task20?.policies.length ?? 0
  const challengeCount = task20?.challenges.length ?? 0
  const decisionCount = task20?.decisions.length ?? 0
  const signalCount = task20?.setuSignals.length ?? 0

  return (
    <div>
      <ZoneHeader
        title="Task20 Governance Visibility"
        subtitle="Org hierarchy · Policy · Challenges · Decisions · SETU lineage (read-only)"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        }
      />
      <div className="mb-4 rounded-lg border border-amber-200/60 dark:border-amber-700/40 bg-amber-50/50 dark:bg-amber-950/20 px-3 py-2 text-[10px] text-amber-800 dark:text-amber-200">
        Pending Rishabh approval for production default. Feature flag: VITE_ENABLE_TASK20_GOVERNANCE=true
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        <KpiPill card={card('Organizations', orgCount, '/v1/workforce/organizations')} />
        <KpiPill card={card('Policies', policyCount, '/v1/policies/definitions')} />
        <KpiPill card={card('Challenges', challengeCount, '/v1/governance/challenges')} />
        <KpiPill card={card('Decisions', decisionCount, '/v1/decisions')} />
        <KpiPill card={card('SETU Signals', signalCount, '/v1/setu/signals')} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200/50 dark:border-slate-700/40 p-4">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">OARDE Layer Separation</p>
          <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
            <p><strong>Observation:</strong> workforce + SETU signal counts above</p>
            <p><strong>Assessment:</strong> policy definitions loaded from registry</p>
            <p><strong>Recommendation:</strong> challenge records (advisory)</p>
            <p><strong>Decision:</strong> decision ledger entries (external owner)</p>
            <p><strong>Execution:</strong> blocked — no mutate actions in UI</p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200/50 dark:border-slate-700/40 p-4">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Workforce Trace Replay</p>
          {task20?.workforceTrace?.events?.length ? (
            <div className="space-y-1 max-h-40 overflow-y-auto text-[10px] font-mono text-slate-600 dark:text-slate-400">
              {task20.workforceTrace.events.map((ev, i) => (
                <p key={i}>{ev.action} · {ev.outcome} · {ev.correlation_id?.slice(0, 8)}</p>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-slate-500">No workforce audit events in scope yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Main Control Center
// ────────────────────────────────────────────────────────────────────────────

// Feature flag (Vite env): set VITE_ENABLE_CONTROL_CENTER=true to enable
const ENABLE_CONTROL_CENTER = import.meta.env.VITE_ENABLE_CONTROL_CENTER === 'true'
const ENABLE_TASK20_GOVERNANCE = import.meta.env.VITE_ENABLE_TASK20_GOVERNANCE === 'true'
const CONTROL_CENTER_REFRESH_MS = 30_000

const ZONES: { id: Zone; label: string; short: string }[] = [
  { id: 'executive', label: 'Executive', short: 'Exec' },
  { id: 'hiring', label: 'Hiring', short: 'Hiring' },
  { id: 'workforce', label: 'Workforce Ops', short: 'Ops' },
  { id: 'growth', label: 'Growth', short: 'Growth' },
  { id: 'org', label: 'Org Visibility', short: 'Org' },
  ...(ENABLE_TASK20_GOVERNANCE ? [{ id: 'governance' as Zone, label: 'Governance', short: 'Gov' }] : []),
  { id: 'replay', label: 'Replay / Trace', short: 'Trace' },
]

function readPolicyScopeLabel(liveData: ControlCenterLiveData | null): string | null {
  const fromStats = liveData?.candidateStats as { policy_scope?: { scope_label?: string } } | null
  const fromMetrics = liveData?.gatewayMetrics as { policy_scope?: { scope_label?: string } } | null
  return fromStats?.policy_scope?.scope_label || fromMetrics?.policy_scope?.scope_label || null
}

export default function ControlCenter() {
  const [activeZone, setActiveZone] = useState<Zone>('executive')
  const [liveData, setLiveData] = useState<ControlCenterLiveData | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [loadingLiveData, setLoadingLiveData] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const loadingRef = useRef(false)
  const hasLiveDataRef = useRef(false)
  const { userRole, loading } = useAuth()

  const ALLOWED_ROLES = new Set(['client', 'recruiter', 'admin'])

  const loadControlCenterData = useCallback(async (silent = false) => {
    if (loadingRef.current) return
    loadingRef.current = true

    if (!silent) {
      setRefreshing(true)
      if (!hasLiveDataRef.current) {
        setLoadingLiveData(true)
      }
    }

    const errors: string[] = []

    try {
      const task20Promise = ENABLE_TASK20_GOVERNANCE
        ? Promise.all([
            fetchTask20Organizations().catch(() => ({ items: [] })),
            fetchTask20PolicyDefinitions().catch(() => ({ items: [] })),
            fetchTask20Challenges().catch(() => ({ items: [] })),
            fetchTask20Decisions().catch(() => ({ items: [] })),
            fetchTask20SetuSignals().catch(() => ({ items: [] })),
            fetchTask20WorkforceTraceReplay().catch(() => null),
          ])
        : Promise.resolve(null)

      const [
        gatewayHealth,
        gatewayMetricsResponse,
        candidateStatsResponse,
        aggregatesResponse,
        auditReplayResponse,
        agentHealth,
        langgraphHealth,
        task20Results,
      ] = await Promise.all([
        checkApiHealth(),
        fetchGatewayMetricsDashboard().catch((error) => {
          errors.push(
            `Gateway metrics unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`,
          )
          return null
        }),
        fetchGatewayCandidateStats().catch((error) => {
          errors.push(
            `Gateway candidate stats unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`,
          )
          return null
        }),
        fetchControlCenterDashboardAggregates().catch((error) => {
          errors.push(
            `Dashboard aggregates unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`,
          )
          return null
        }),
        fetchControlCenterAuditReplay().catch((error) => {
          errors.push(
            `Audit replay unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`,
          )
          return null
        }),
        fetchServiceHealth(AGENT_SERVICE_URL, 'BHIV AI Agent'),
        fetchServiceHealth(LANGGRAPH_SERVICE_URL, 'langgraph-orchestrator'),
        task20Promise,
      ])

      const task20Data: Task20GovernanceData | null = task20Results
        ? {
            organizations: task20Results[0].items,
            policies: task20Results[1].items,
            challenges: task20Results[2].items,
            decisions: task20Results[3].items,
            setuSignals: task20Results[4].items,
            workforceTrace: task20Results[5],
          }
        : null

      if (!gatewayHealth.healthy) {
        errors.push('Gateway health check returned an unhealthy state')
      }

      if (!agentHealth.healthy) {
        errors.push(`Agent status: ${agentHealth.status}`)
      }

      if (!langgraphHealth.healthy) {
        errors.push(`LangGraph status: ${langgraphHealth.status}`)
      }

      const correlationIds = [
        gatewayMetricsResponse?.meta?.correlationId,
        candidateStatsResponse?.meta?.correlationId,
        aggregatesResponse?.meta?.correlationId,
        auditReplayResponse?.meta?.correlationId,
        auditReplayResponse?.data?.correlation_id,
        String(agentHealth.raw?.correlation_id || ''),
        String(langgraphHealth.raw?.correlation_id || ''),
      ].filter(Boolean) as string[]

      setLiveData({
        gatewayHealth: {
          healthy: gatewayHealth.healthy,
          data: (gatewayHealth.data as Record<string, unknown> | null | undefined) ?? null,
        },
        gatewayMetrics: gatewayMetricsResponse?.data ?? null,
        candidateStats: candidateStatsResponse?.data ?? null,
        dashboardAggregates: aggregatesResponse?.data ?? null,
        auditReplay: auditReplayResponse?.data ?? null,
        task20: task20Data,
        agentHealth,
        langgraphHealth,
        fetchedAt: new Date().toISOString(),
        errors,
        correlationIds,
      })
      hasLiveDataRef.current = true
      setLastRefresh(new Date())

      if (!silent) {
        void postControlCenterAuditEvent({
          action: 'control_center_refresh',
          outcome: errors.length ? 'failure' : 'success',
          detail: errors.length ? errors.join(' | ') : 'Live control center refresh succeeded',
          correlation_id: correlationIds[0],
          context: {
            source: 'control_center',
            partial_failure: errors.length > 0,
          },
        }).catch(() => undefined)
      }
    } finally {
      loadingRef.current = false
      if (!silent) {
        setLoadingLiveData(false)
        setRefreshing(false)
      }
    }
  }, [])

  useEffect(() => {
    if (!ENABLE_CONTROL_CENTER || loading || !ALLOWED_ROLES.has(String(userRole))) {
      return
    }

    void loadControlCenterData()
    const intervalId = window.setInterval(() => {
      void loadControlCenterData(true)
    }, CONTROL_CENTER_REFRESH_MS)

    return () => window.clearInterval(intervalId)
  }, [loading, userRole, loadControlCenterData])

  useEffect(() => {
    if (loading || !userRole) return
    const allowed = ALLOWED_ROLES.has(String(userRole))
    void postControlCenterAuditEvent({
      action: 'control_center_view',
      outcome: allowed ? 'success' : 'denied',
      detail: allowed ? 'Access granted' : `Denied for role ${String(userRole)}`,
      context: {
        role: String(userRole),
      },
    }).catch(() => undefined)
  }, [loading, userRole])

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

  const gatewaySource = `${API_BASE_URL}/metrics/dashboard`
  const executiveCards = buildExecutiveCards(liveData)
  const hiringCards = buildHiringCards(liveData)
  const workforceCards = buildWorkforceCards(liveData)
  const growthCards = buildGrowthCards(liveData)
  const orgCards = buildOrgCards(liveData)
  const funnelStages = buildFunnelStages(liveData)
  const departmentLoad = buildDepartmentLoad(liveData)
  const policyScopeLabel = readPolicyScopeLabel(liveData)

  if (loadingLiveData && !liveData) {
    return <Loading message="Loading live control center..." />
  }

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
              Last refresh: {lastRefresh ? lastRefresh.toLocaleTimeString() : 'Pending'}
            </span>
            <button
              id="control-center-refresh-btn"
              onClick={() => void loadControlCenterData(false)}
              title={refreshing ? 'Refreshing live data' : 'Refresh dashboard'}
              disabled={refreshing || loadingRef.current}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors disabled:opacity-60"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 pt-6">
        {policyScopeLabel ? (
          <div className="mb-3 rounded-lg border border-slate-200/70 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/50 px-4 py-2 text-[11px] text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Data scope:</span>{' '}
            {policyScopeLabel}
            <span className="text-slate-500 dark:text-slate-500">
              {' '}
              — metrics and hiring counts are limited to your role boundary (JWT on gateway).
            </span>
          </div>
        ) : null}
        <div className="mb-4 rounded-xl border border-indigo-200/50 dark:border-indigo-700/30 bg-indigo-50/60 dark:bg-indigo-950/20 px-4 py-3">
          <p className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
            Governance Stage Separation
          </p>
          <div className="flex flex-wrap gap-2 text-[10px]">
            <span className="px-2 py-1 rounded-full bg-white/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/50">Observe: enabled</span>
            <span className="px-2 py-1 rounded-full bg-white/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/50">Assess: enabled</span>
            <span className="px-2 py-1 rounded-full bg-white/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/50">Recommend: advisory only</span>
            <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/50">Decision: external owner</span>
            <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/50">Execute: blocked in dashboard</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <KpiPill card={buildGatewayCard(liveData?.gatewayHealth ?? null, gatewaySource)} />
          <KpiPill card={buildServiceCard('Agent', liveData?.agentHealth ?? null, serviceBaseSource(liveData?.agentHealth ?? null, AGENT_SERVICE_URL))} />
          <KpiPill card={buildServiceCard('LangGraph', liveData?.langgraphHealth ?? null, serviceBaseSource(liveData?.langgraphHealth ?? null, LANGGRAPH_SERVICE_URL))} />
          <KpiPill
            card={{
              label: 'Live Sync',
              value: lastRefresh ? lastRefresh.toLocaleTimeString() : 'Pending',
              sublabel: liveData?.errors.length
                ? 'Partial live data'
                : 'Auto-refresh every 30s in background',
              warning: Boolean(liveData?.errors.length),
            }}
          />
        </div>

        {liveData?.errors.length ? (
          <div className="mt-4 rounded-xl border border-amber-200/70 dark:border-amber-700/30 bg-amber-50/80 dark:bg-amber-950/20 px-4 py-3 text-xs text-amber-800 dark:text-amber-200">
            Live fallback active: {liveData.errors.join(' • ')}
          </div>
        ) : null}
        {liveData?.correlationIds.length ? (
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Correlation IDs: {liveData.correlationIds.join(' | ')}
          </div>
        ) : null}
      </div>

      {/* ── Active Zone Panel ── */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="rounded-2xl border border-white/60 dark:border-slate-700/40 bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl shadow-xl p-5 sm:p-7">
          {activeZone === 'executive' && (
            <ExecutiveZone cards={executiveCards} sourceSummary={`${gatewaySource} + authenticated Agent and LangGraph /health checks`} />
          )}
          {activeZone === 'hiring' && (
            <HiringZone cards={hiringCards} sourceSummary="Gateway business_metrics + /v1/candidates/stats (raw + aggregated)" funnelStages={funnelStages} />
          )}
          {activeZone === 'workforce' && (
            <WorkforceOpsZone cards={workforceCards} sourceSummary="Gateway business_metrics bucket" />
          )}
          {activeZone === 'growth' && (
            <GrowthZone cards={growthCards} sourceSummary="Gateway business_metrics bucket" />
          )}
          {activeZone === 'org' && (
            <OrgVisibilityZone cards={orgCards} sourceSummary="Gateway performance_summary + system_metrics (aggregated)" departmentLoad={departmentLoad} />
          )}
          {activeZone === 'governance' && ENABLE_TASK20_GOVERNANCE && (
            <GovernanceZone task20={liveData?.task20 ?? null} />
          )}
          {activeZone === 'replay' && (
            <ReplayTraceZone
              traceEvents={liveData?.auditReplay?.events ?? []}
              traceNote={
                liveData?.auditReplay?.events?.length
                  ? `Live audit replay (${liveData.auditReplay.source}, correlation: ${liveData.auditReplay.correlation_id || 'n/a'}). Advisory trace only — not execution authority.`
                  : 'No audit events in scope yet. Refresh after control-center activity or gateway operations.'
              }
            />
          )}
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
