import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
  Snowflake,
  Tornado,
  Thermometer,
  ThermometerSnowflake,
  type LucideIcon,
} from 'lucide-react'

type WeatherStyle = {
  icon: LucideIcon
  color: string
  gradient: string
}

export function getWeatherStyle(shortForecast: string): WeatherStyle {
  const lower = shortForecast.toLowerCase()

  if (lower.includes('thunder'))
    return { icon: CloudLightning, color: 'text-violet-500 dark:text-violet-400', gradient: 'from-violet-50 to-transparent dark:from-violet-950/30 dark:to-transparent' }
  if (lower.includes('tornado') || lower.includes('funnel'))
    return { icon: Tornado, color: 'text-slate-600 dark:text-slate-300', gradient: 'from-slate-100 to-transparent dark:from-slate-900/40 dark:to-transparent' }
  if (lower.includes('snow') || lower.includes('blizzard'))
    return { icon: CloudSnow, color: 'text-sky-400 dark:text-sky-300', gradient: 'from-sky-50 to-transparent dark:from-sky-950/30 dark:to-transparent' }
  if (lower.includes('sleet') || lower.includes('freezing rain') || lower.includes('ice'))
    return { icon: Snowflake, color: 'text-cyan-400 dark:text-cyan-300', gradient: 'from-cyan-50 to-transparent dark:from-cyan-950/30 dark:to-transparent' }
  if (lower.includes('drizzle'))
    return { icon: CloudDrizzle, color: 'text-blue-300 dark:text-blue-300', gradient: 'from-blue-50/60 to-transparent dark:from-blue-950/20 dark:to-transparent' }
  if (lower.includes('rain') || lower.includes('shower'))
    return { icon: CloudRain, color: 'text-blue-400 dark:text-blue-400', gradient: 'from-blue-50 to-transparent dark:from-blue-950/30 dark:to-transparent' }
  if (lower.includes('fog') || lower.includes('mist') || lower.includes('haze'))
    return { icon: CloudFog, color: 'text-slate-300 dark:text-slate-400', gradient: 'from-slate-50 to-transparent dark:from-slate-900/30 dark:to-transparent' }
  if (lower.includes('overcast'))
    return { icon: Cloud, color: 'text-slate-400 dark:text-slate-400', gradient: 'from-slate-50 to-transparent dark:from-slate-900/30 dark:to-transparent' }
  if (lower.includes('partly') || lower.includes('mostly cloudy'))
    return { icon: CloudSun, color: 'text-amber-400 dark:text-amber-300', gradient: 'from-amber-50/60 to-transparent dark:from-amber-950/20 dark:to-transparent' }
  if (lower.includes('cloud'))
    return { icon: Cloud, color: 'text-slate-400 dark:text-slate-400', gradient: 'from-slate-50 to-transparent dark:from-slate-900/30 dark:to-transparent' }
  if (lower.includes('mostly sunny') || lower.includes('mostly clear'))
    return { icon: CloudSun, color: 'text-amber-400 dark:text-amber-300', gradient: 'from-amber-50/80 to-transparent dark:from-amber-950/20 dark:to-transparent' }
  if (lower.includes('sunny') || lower.includes('clear'))
    return { icon: Sun, color: 'text-amber-500 dark:text-amber-400', gradient: 'from-amber-50 to-transparent dark:from-amber-950/30 dark:to-transparent' }
  if (lower.includes('wind'))
    return { icon: Wind, color: 'text-slate-400 dark:text-slate-400', gradient: 'from-slate-50 to-transparent dark:from-slate-900/30 dark:to-transparent' }
  if (lower.includes('hot'))
    return { icon: Thermometer, color: 'text-orange-500 dark:text-orange-400', gradient: 'from-orange-50 to-transparent dark:from-orange-950/30 dark:to-transparent' }
  if (lower.includes('cold'))
    return { icon: ThermometerSnowflake, color: 'text-cyan-500 dark:text-cyan-400', gradient: 'from-cyan-50 to-transparent dark:from-cyan-950/30 dark:to-transparent' }

  return { icon: Sun, color: 'text-amber-500 dark:text-amber-400', gradient: 'from-amber-50 to-transparent dark:from-amber-950/30 dark:to-transparent' }
}
