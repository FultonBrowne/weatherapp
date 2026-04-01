import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import type { ForecastPeriod } from '@/app/actions/weather'
import { getWeatherStyle } from '@/lib/weather-icons'

export function WeeklyForecast({
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
            7-Day Forecast
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!periods?.length) return null

  // Group into day pairs (daytime + nighttime)
  const days: { day: ForecastPeriod; night: ForecastPeriod | undefined }[] = []
  for (const period of periods) {
    if (period.isDaytime) {
      days.push({ day: period, night: undefined })
    } else if (days.length > 0 && !days[days.length - 1].night) {
      days[days.length - 1].night = period
    } else {
      // Night without preceding day (e.g. "Tonight" first)
      days.push({ day: period, night: undefined })
    }
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          7-Day Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {days.map(({ day, night }, i) => {
            const { icon: Icon, color } = getWeatherStyle(day.shortForecast)
            return (
              <div key={day.number}>
                {i > 0 && <Separator className="my-3" />}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium w-24 shrink-0">
                    {day.name}
                  </span>
                  <Icon
                    className={`h-5 w-5 stroke-[1.5] shrink-0 ${color}`}
                    aria-label={day.shortForecast}
                  />
                  <span className="text-sm text-muted-foreground flex-1 min-w-0 truncate">
                    {day.shortForecast}
                  </span>
                  <div className="text-sm text-right shrink-0 w-20">
                    <span className="font-medium">{day.temperature}°</span>
                    {night && (
                      <span className="text-muted-foreground ml-1">
                        / {night.temperature}°
                      </span>
                    )}
                  </div>
                  {day.probabilityOfPrecipitation != null &&
                    day.probabilityOfPrecipitation > 0 && (
                      <span className="text-xs text-blue-500 dark:text-blue-400 shrink-0 w-8 text-right">
                        {day.probabilityOfPrecipitation}%
                      </span>
                    )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
