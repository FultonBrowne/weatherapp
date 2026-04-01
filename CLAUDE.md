@AGENTS.md

# Weather App — Architecture & Ground Rules

## Tech Stack
- **Next.js 16** (App Router) — React 19
- **shadcn/ui** — all UI components
- **TanStack Query** — client state & server state management
- **Tailwind CSS v4** — styling
- **TypeScript** — strict

## Core Principles

### 1. Server Functions for All Backend Logic
Every backend operation goes through **server functions** using `'use server'` directives. No API routes, no route handlers — just server functions called directly from client code or forms.

```tsx
// app/actions/weather.ts
'use server'

export async function getWeather(city: string) {
  // This runs on the server. Called directly from client components.
  const data = await fetch(`...`)
  return data.json()
}
```

**Two invocation patterns:**
- **Forms**: `<form action={serverFunction}>` — function receives `FormData`
- **Direct calls**: From client components via TanStack Query's `queryFn` or `mutationFn`

### 2. TanStack Query for All Client State
All server data flows through TanStack Query. This replaces `useEffect` + `useState` fetch patterns entirely.

```tsx
// Fetching data — NO useEffect needed
const { data, isLoading } = useQuery({
  queryKey: ['weather', city],
  queryFn: () => getWeather(city),
  staleTime: 5 * 60 * 1000, // reasonable caching
})

// Mutations
const mutation = useMutation({
  mutationFn: saveLocation,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] }),
})
```

### 3. NO useEffect (Unless Truly Necessary)

**useEffect is a code smell in this architecture.** Almost every use case has a better alternative:

| Instead of useEffect for... | Use this instead |
|---|---|
| Fetching data | `useQuery` from TanStack Query |
| Responding to state changes | Derive state during render, or use `useMemo` |
| Subscribing to external stores | `useSyncExternalStore` |
| Running code on mount | Server Components (run on server), or `useQuery` with `enabled` |
| Transforming data for rendering | Compute it inline or `useMemo` |
| Resetting state when props change | Use a `key` prop on the component |
| Listening to events | Event handlers directly on elements |
| Syncing two pieces of state | Remove the redundant state — derive it |
| POST/mutation on user action | `useMutation` from TanStack Query |

**The only valid useEffect uses:**
- Synchronizing with non-React external systems (DOM APIs, third-party widgets, browser APIs like `IntersectionObserver`)
- Cleanup of subscriptions that have no hook equivalent

If you write a `useEffect`, add a comment explaining why no alternative works.

### 4. shadcn/ui for All UI
Use shadcn components for everything. Don't build custom UI primitives. Install new components as needed via `npx shadcn@latest add <component>`.

### 5. Smart Rendering Architecture
- **Server Components** (default): Fetch data, render static content, pass data down
- **Client Components** (`'use client'`): Only when interactivity is needed (forms, clicks, TanStack Query)
- Keep client boundaries as small and as low in the tree as possible
- Server Components can `await` data directly — no need for TanStack Query on the server

## Next.js 16 Breaking Changes (MUST FOLLOW)

### Async Request APIs
`cookies()`, `headers()`, `draftMode()`, `params`, and `searchParams` are now **async** and must be awaited:
```tsx
// CORRECT in Next.js 16
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}
```

### Middleware renamed to Proxy
- `middleware.ts` → `proxy.ts`
- Export function named `proxy`, not `middleware`
- Runs on `nodejs` runtime only (not edge)

### Caching
- `cacheLife()` and `cacheTag()` are stable (no `unstable_` prefix)
- `use cache` directive available with `cacheComponents: true` in next.config
- Turbopack is now the default bundler

## State Design Philosophy

**Derive, don't sync.** If a value can be computed from other state or props, compute it — don't store it in state and try to keep it in sync.

```tsx
// BAD: syncing state with useEffect
const [filteredItems, setFilteredItems] = useState(items)
useEffect(() => {
  setFilteredItems(items.filter(i => i.active))
}, [items])

// GOOD: derive during render
const filteredItems = items.filter(i => i.active)

// GOOD: memoize if expensive
const filteredItems = useMemo(() => items.filter(i => i.active), [items])
```

**Single source of truth.** URL state lives in the URL (searchParams). Server state lives in TanStack Query cache. UI state (modals, tabs) lives in local `useState`. Never duplicate between them.
