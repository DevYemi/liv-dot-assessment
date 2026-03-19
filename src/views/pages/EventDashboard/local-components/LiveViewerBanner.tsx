import { Users } from 'lucide-react'

interface LiveViewerBannerProps {
  viewerCount: number
}

export function LiveViewerBanner({ viewerCount }: LiveViewerBannerProps) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-lg border border-red-900/50 bg-red-950/30 px-6 py-3">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.5)]" />
      <span className="text-sm font-semibold text-red-400">LIVE NOW</span>
      <span className="h-4 w-px bg-red-900" />
      <Users className="h-4 w-4 text-red-500" />
      <span className="text-sm font-medium text-red-300">
        {viewerCount.toLocaleString()} watching
      </span>
    </div>
  )
}
