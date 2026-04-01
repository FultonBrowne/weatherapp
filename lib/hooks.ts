'use client'

import { useQuery } from '@tanstack/react-query'
import {
  searchCities,
  getWeatherPoint,
  getCurrentWeather,
  getForecast,
  getHourlyForecast,
  getAlerts,
  type GeocodingResult,
} from '@/app/actions/weather'

export function useCitySearch(query: string) {
  return useQuery({
    queryKey: ['cities', query],
    queryFn: () => searchCities(query),
    enabled: query.length >= 2,
    staleTime: 24 * 60 * 60 * 1000, // cities don't move
    placeholderData: [],
  })
}

export function useWeatherPoint(location: GeocodingResult | null) {
  return useQuery({
    queryKey: ['weatherPoint', location?.lat, location?.lon],
    queryFn: () => getWeatherPoint(location!.lat, location!.lon),
    enabled: !!location,
    staleTime: Infinity, // grid coordinates never change
  })
}

export function useCurrentWeather(stationsUrl: string | undefined) {
  return useQuery({
    queryKey: ['currentWeather', stationsUrl],
    queryFn: () => getCurrentWeather(stationsUrl!),
    enabled: !!stationsUrl,
    staleTime: 5 * 60 * 1000, // observations update ~every 10 min
    refetchInterval: 10 * 60 * 1000,
  })
}

export function useForecast(forecastUrl: string | undefined) {
  return useQuery({
    queryKey: ['forecast', forecastUrl],
    queryFn: () => getForecast(forecastUrl!),
    enabled: !!forecastUrl,
    staleTime: 30 * 60 * 1000, // forecast updates ~hourly
  })
}

export function useHourlyForecast(forecastHourlyUrl: string | undefined) {
  return useQuery({
    queryKey: ['hourlyForecast', forecastHourlyUrl],
    queryFn: () => getHourlyForecast(forecastHourlyUrl!),
    enabled: !!forecastHourlyUrl,
    staleTime: 15 * 60 * 1000,
  })
}

export function useAlerts(location: GeocodingResult | null) {
  return useQuery({
    queryKey: ['alerts', location?.lat, location?.lon],
    queryFn: () => getAlerts(location!.lat, location!.lon),
    enabled: !!location,
    staleTime: 2 * 60 * 1000, // alerts are time-sensitive
    refetchInterval: 5 * 60 * 1000,
  })
}
