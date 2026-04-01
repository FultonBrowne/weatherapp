'use client'

import { useState } from 'react'
import { CloudSun } from 'lucide-react'
import type { GeocodingResult } from '@/app/actions/weather'
import {
  useWeatherPoint,
  useCurrentWeather,
  useForecast,
  useHourlyForecast,
  useAlerts,
} from '@/lib/hooks'
import { CitySearch } from './city-search'
import { CurrentWeather } from './current-weather'
import { HourlyForecast } from './hourly-forecast'
import { WeeklyForecast } from './weekly-forecast'
import { AlertsBanner } from './alerts-banner'

export function WeatherDashboard() {
  const [location, setLocation] = useState<GeocodingResult | null>(null)

  const { data: point, isLoading: pointLoading } = useWeatherPoint(location)

  const { data: currentWeather, isLoading: currentLoading } =
    useCurrentWeather(point?.stationsUrl)

  const { data: forecast, isLoading: forecastLoading } =
    useForecast(point?.forecastUrl)

  const { data: hourly, isLoading: hourlyLoading } =
    useHourlyForecast(point?.forecastHourlyUrl)

  const { data: alerts } = useAlerts(location)

  const isLoading = pointLoading || currentLoading

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-light tracking-tight">Weather</h1>
        <p className="text-muted-foreground text-sm">
          Real-time forecasts from the National Weather Service
        </p>
        <div className="flex justify-center">
          <CitySearch onSelect={setLocation} />
        </div>
      </div>

      {location && (
        <div className="space-y-4">
          <AlertsBanner alerts={alerts} />
          <CurrentWeather
            conditions={currentWeather}
            point={point}
            isLoading={isLoading}
          />
          <HourlyForecast periods={hourly} isLoading={hourlyLoading} />
          <WeeklyForecast periods={forecast} isLoading={forecastLoading} />
        </div>
      )}

      {!location && (
        <div className="text-center py-20 text-muted-foreground">
          <CloudSun className="h-16 w-16 mx-auto mb-4 stroke-[1.25] text-amber-400 dark:text-amber-300" />
          <p className="text-lg font-light">
            Search for a city to get started
          </p>
        </div>
      )}
    </div>
  )
}
