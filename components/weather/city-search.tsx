import { useState, useRef, useCallback } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useCitySearch } from '@/lib/hooks'
import type { GeocodingResult } from '@/app/actions/weather'

export function CitySearch({
  onSelect,
}: {
  onSelect: (city: GeocodingResult) => void
}) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: cities = [], isLoading } = useCitySearch(debouncedQuery)

  const handleChange = useCallback((value: string) => {
    setQuery(value)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(value)
      setIsOpen(true)
    }, 300)
  }, [])

  const handleSelect = useCallback(
    (city: GeocodingResult) => {
      setQuery(city.name)
      setIsOpen(false)
      onSelect(city)
    },
    [onSelect]
  )

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
        <Input
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => debouncedQuery.length >= 2 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="h-12 pl-10 text-base bg-card border-border/50 shadow-sm focus-visible:ring-amber-500/20 focus-visible:border-amber-500/40"
        />
      </div>
      {isOpen && debouncedQuery.length >= 2 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border border-border/50 bg-card shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">
              Searching...
            </div>
          ) : cities.length === 0 ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">
              No cities found
            </div>
          ) : (
            cities.map((city, i) => (
              <button
                key={`${city.lat}-${city.lon}-${i}`}
                className="w-full px-4 py-3 text-left text-sm hover:bg-accent transition-colors cursor-pointer"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(city)}
              >
                <span className="font-medium">{city.name}</span>
                <span className="text-muted-foreground ml-1 text-xs">
                  {city.displayName.split(',').slice(1, 3).join(',')}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
