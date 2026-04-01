import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import type { ForecastPeriod } from '@/app/actions/weather'
import { getWeatherStyle } from '@/lib/weather-icons'

function formatHour(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
  })
}

export function HourlyForecast({
  periods,
  isLoading,
}: {
  periods: ForecastPeriod[] | undefined
  isLoading: boolean
}) {
  if (isLoading) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            Hourly Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!periods?.length) return null

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          Hourly Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="flex gap-6 pb-3">
            {periods.map((period) => {
              const { icon: Icon, color } = getWeatherStyle(period.shortForecast)
              return (
                <div
                  key={period.number}
                  className="flex flex-col items-center gap-1.5 min-w-[4rem]"
                >
                  <span className="text-xs text-muted-foreground">
                    {period.number === 1 ? 'Now' : formatHour(period.startTime)}
                  </span>
                  <Icon
                    className={`h-6 w-6 stroke-[1.5] ${color}`}
                    aria-label={period.shortForecast}
                  />
                  <span className="text-sm font-medium">
                    {period.temperature}°
                  </span>
                  {period.probabilityOfPrecipitation != null &&
                    period.probabilityOfPrecipitation > 0 && (
                      <span className="text-xs text-blue-500 dark:text-blue-400">
                        {period.probabilityOfPrecipitation}%
                      </span>
                    )}
                </div>
              )
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
