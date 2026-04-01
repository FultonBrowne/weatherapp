'use server'

const NWS_USER_AGENT = '(weatherapp, contact@weatherapp.dev)'

// --- Types ---

export type GeocodingResult = {
  name: string
  displayName: string
  lat: number
  lon: number
}

export type WeatherPoint = {
  gridId: string
  gridX: number
  gridY: number
  city: string
  state: string
  timeZone: string
  forecastUrl: string
  forecastHourlyUrl: string
  stationsUrl: string
}

export type CurrentConditions = {
  temperature: number | null
  temperatureUnit: string
  textDescription: string
  windSpeed: number | null
  windDirection: number | null
  humidity: number | null
  icon: string
  timestamp: string
}

export type ForecastPeriod = {
  number: number
  name: string
  startTime: string
  endTime: string
  isDaytime: boolean
  temperature: number
  temperatureUnit: string
  probabilityOfPrecipitation: number | null
  windSpeed: string
  windDirection: string
  icon: string
  shortForecast: string
  detailedForecast: string
}

export type WeatherAlert = {
  id: string
  event: string
  headline: string
  description: string
  severity: string
  urgency: string
  certainty: string
  onset: string
  expires: string
  senderName: string
  instruction: string | null
}

// --- Server Functions ---

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 2) return []

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?` +
      new URLSearchParams({
        q: query,
        format: 'json',
        limit: '5',
        countrycodes: 'us',
        addressdetails: '1',
      }),
    {
      headers: { 'User-Agent': NWS_USER_AGENT },
    }
  )

  if (!res.ok) return []

  const data = await res.json()

  return data
    .filter((item: Record<string, unknown>) => {
      const type = item.type as string
      return ['city', 'town', 'village', 'administrative'].includes(type)
    })
    .map((item: Record<string, unknown>) => ({
      name: item.name as string,
      displayName: item.display_name as string,
      lat: parseFloat(item.lat as string),
      lon: parseFloat(item.lon as string),
    }))
}

export async function getWeatherPoint(
  lat: number,
  lon: number
): Promise<WeatherPoint> {
  const res = await fetch(
    `https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`,
    {
      headers: { 'User-Agent': NWS_USER_AGENT },
    }
  )

  if (!res.ok) {
    throw new Error(`Failed to resolve weather point: ${res.status}`)
  }

  const data = await res.json()
  const props = data.properties

  return {
    gridId: props.gridId,
    gridX: props.gridX,
    gridY: props.gridY,
    city: props.relativeLocation.properties.city,
    state: props.relativeLocation.properties.state,
    timeZone: props.timeZone,
    forecastUrl: props.forecast,
    forecastHourlyUrl: props.forecastHourly,
    stationsUrl: props.observationStations,
  }
}

export async function getCurrentWeather(
  stationsUrl: string
): Promise<CurrentConditions> {
  // Get nearest station
  const stationsRes = await fetch(stationsUrl, {
    headers: { 'User-Agent': NWS_USER_AGENT },
  })

  if (!stationsRes.ok) {
    throw new Error(`Failed to fetch stations: ${stationsRes.status}`)
  }

  const stationsData = await stationsRes.json()
  const stationId =
    stationsData.features[0]?.properties?.stationIdentifier

  if (!stationId) {
    throw new Error('No weather stations found nearby')
  }

  // Get latest observation
  const obsRes = await fetch(
    `https://api.weather.gov/stations/${stationId}/observations/latest`,
    {
      headers: { 'User-Agent': NWS_USER_AGENT },
    }
  )

  if (!obsRes.ok) {
    throw new Error(`Failed to fetch observations: ${obsRes.status}`)
  }

  const obsData = await obsRes.json()
  const obs = obsData.properties

  return {
    temperature: obs.temperature?.value != null
      ? Math.round(obs.temperature.value * 9 / 5 + 32)
      : null,
    temperatureUnit: 'F',
    textDescription: obs.textDescription ?? 'Unknown',
    windSpeed: obs.windSpeed?.value != null
      ? Math.round(obs.windSpeed.value * 0.621371)
      : null,
    windDirection: obs.windDirection?.value ?? null,
    humidity: obs.relativeHumidity?.value != null
      ? Math.round(obs.relativeHumidity.value)
      : null,
    icon: obs.icon ?? '',
    timestamp: obs.timestamp ?? new Date().toISOString(),
  }
}

export async function getForecast(
  forecastUrl: string
): Promise<ForecastPeriod[]> {
  const res = await fetch(forecastUrl, {
    headers: { 'User-Agent': NWS_USER_AGENT },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch forecast: ${res.status}`)
  }

  const data = await res.json()

  return data.properties.periods.map(
    (p: Record<string, unknown>) => ({
      number: p.number,
      name: p.name,
      startTime: p.startTime,
      endTime: p.endTime,
      isDaytime: p.isDaytime,
      temperature: p.temperature,
      temperatureUnit: p.temperatureUnit,
      probabilityOfPrecipitation:
        (p.probabilityOfPrecipitation as Record<string, unknown>)?.value ??
        null,
      windSpeed: p.windSpeed,
      windDirection: p.windDirection,
      icon: p.icon,
      shortForecast: p.shortForecast,
      detailedForecast: p.detailedForecast,
    })
  )
}

export async function getHourlyForecast(
  forecastHourlyUrl: string
): Promise<ForecastPeriod[]> {
  const res = await fetch(forecastHourlyUrl, {
    headers: { 'User-Agent': NWS_USER_AGENT },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch hourly forecast: ${res.status}`)
  }

  const data = await res.json()

  // Return next 24 hours only
  return data.properties.periods.slice(0, 24).map(
    (p: Record<string, unknown>) => ({
      number: p.number,
      name: p.name,
      startTime: p.startTime,
      endTime: p.endTime,
      isDaytime: p.isDaytime,
      temperature: p.temperature,
      temperatureUnit: p.temperatureUnit,
      probabilityOfPrecipitation:
        (p.probabilityOfPrecipitation as Record<string, unknown>)?.value ??
        null,
      windSpeed: p.windSpeed,
      windDirection: p.windDirection,
      icon: p.icon,
      shortForecast: p.shortForecast,
      detailedForecast: p.detailedForecast,
    })
  )
}

export async function getAlerts(
  lat: number,
  lon: number
): Promise<WeatherAlert[]> {
  const res = await fetch(
    `https://api.weather.gov/alerts/active?point=${lat.toFixed(4)},${lon.toFixed(4)}`,
    {
      headers: { 'User-Agent': NWS_USER_AGENT },
    }
  )

  if (!res.ok) {
    throw new Error(`Failed to fetch alerts: ${res.status}`)
  }

  const data = await res.json()

  return (data.features ?? []).map(
    (f: Record<string, Record<string, unknown>>) => ({
      id: f.properties.id,
      event: f.properties.event,
      headline: f.properties.headline,
      description: f.properties.description,
      severity: f.properties.severity,
      urgency: f.properties.urgency,
      certainty: f.properties.certainty,
      onset: f.properties.onset,
      expires: f.properties.expires,
      senderName: f.properties.senderName,
      instruction: f.properties.instruction ?? null,
    })
  )
}
