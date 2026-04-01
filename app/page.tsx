import { WeatherDashboard } from '@/components/weather/weather-dashboard'

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12 sm:py-20 bg-gradient-to-b from-background via-background to-muted/30">
      <WeatherDashboard />
    </main>
  )
}
