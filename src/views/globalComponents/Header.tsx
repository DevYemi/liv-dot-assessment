import { Radio } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-600">
            <Radio className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-wider text-white">
            LIV<span className="text-violet-400">.</span>DOT
          </span>
        </div>
        <span className="ml-1 rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-xs text-zinc-500">
          Host Dashboard
        </span>
      </div>
    </header>
  )
}
