import { useState } from 'react'
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { WeatherAlert } from '@/app/actions/weather'

const severityConfig: Record<string, { badge: string; border: string; bg: string; icon: string }> = {
  Extreme: {
    badge: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    border: 'border-red-200 dark:border-red-900/50',
    bg: 'bg-red-50/50 dark:bg-red-950/20',
    icon: 'text-red-500 dark:text-red-400',
  },
  Severe: {
    badge: 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    border: 'border-orange-200 dark:border-orange-900/50',
    bg: 'bg-orange-50/50 dark:bg-orange-950/20',
    icon: 'text-orange-500 dark:text-orange-400',
  },
  Moderate: {
    badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    border: 'border-amber-200 dark:border-amber-900/50',
    bg: 'bg-amber-50/50 dark:bg-amber-950/20',
    icon: 'text-amber-500 dark:text-amber-400',
  },
  Minor: {
    badge: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    border: 'border-blue-200 dark:border-blue-900/50',
    bg: 'bg-blue-50/50 dark:bg-blue-950/20',
    icon: 'text-blue-500 dark:text-blue-400',
  },
  Unknown: {
    badge: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800',
    border: 'border-slate-200 dark:border-slate-800',
    bg: 'bg-slate-50/50 dark:bg-slate-950/20',
    icon: 'text-slate-500 dark:text-slate-400',
  },
}

export function AlertsBanner({ alerts }: { alerts: WeatherAlert[] | undefined }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (!alerts?.length) return null

  return (
    <div className="space-y-2">
      {alerts.map((alert) => {
        const config = severityConfig[alert.severity] ?? severityConfig.Unknown
        const isExpanded = expandedId === alert.id
        return (
          <div
            key={alert.id}
            className={`rounded-lg border p-4 ${config.border} ${config.bg}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className={`h-4 w-4 shrink-0 ${config.icon}`} />
                  <Badge
                    variant="outline"
                    className={`text-xs font-medium ${config.badge}`}
                  >
                    {alert.severity}
                  </Badge>
                  <span className="text-sm font-semibold truncate">
                    {alert.event}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {alert.headline}
                </p>
                {isExpanded && (
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <p className="leading-relaxed">{alert.description}</p>
                    {alert.instruction && (
                      <p className="font-medium text-foreground leading-relaxed">
                        {alert.instruction}
                      </p>
                    )}
                    <p className="text-xs opacity-70">
                      Source: {alert.senderName}
                    </p>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 h-7 w-7 p-0"
                onClick={() => setExpandedId(isExpanded ? null : alert.id)}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
