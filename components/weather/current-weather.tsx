import { Droplets, Wind } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { CurrentConditions, WeatherPoint } from '@/app/actions/weather'
import { getWeatherStyle } from '@/lib/weather-icons'

function windDirectionToCardinal(degrees: number | null): string {
  if (degrees == null) return ''
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(degrees / 45) % 8]
}

export function CurrentWeather({
  conditions,
  point,
  isLoading,
}: {
  conditions: CurrentConditions | undefined
  point: WeatherPoint | undefined
  isLoading: boolean
}) {
  if (isLoading) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-16 w-32" />
              <Skeleton className="h-5 w-48" />
            </div>
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!conditions || !point) return null

  const { icon: Icon, color, gradient } = getWeatherStyle(conditions.textDescription)

  return (
    <Card className={`border-border/50 shadow-sm overflow-hidden bg-gradient-to-br ${gradient}`}>
      <CardContent className="p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
              {point.city}, {point.state}
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              {conditions.temperature != null ? (
                <span className="text-7xl font-light tracking-tighter">
                  {conditions.temperature}°
                </span>
              ) : (
                <span className="text-7xl font-light tracking-tighter text-muted-foreground">
                  --°
                </span>
              )}
            </div>
            <p className="mt-2 text-lg text-muted-foreground">
              {conditions.textDescription}
            </p>
          </div>
          <Icon
            className={`h-16 w-16 stroke-[1.25] ${color}`}
            aria-label={conditions.textDescription}
          />
        </div>

        <div className="mt-6 flex gap-8 text-sm text-muted-foreground">
          {conditions.humidity != null && (
            <div className="flex items-center gap-1.5">
              <Droplets className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-foreground font-medium">{conditions.humidity}%</span>
              <span>humidity</span>
            </div>
          )}
          {conditions.windSpeed != null && (
            <div className="flex items-center gap-1.5">
              <Wind className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-foreground font-medium">{conditions.windSpeed} mph</span>
              <span>
                {windDirectionToCardinal(conditions.windDirection)} wind
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
