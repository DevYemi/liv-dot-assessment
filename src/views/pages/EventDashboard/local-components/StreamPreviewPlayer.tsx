import {
  MediaController,
  MediaControlBar,
  MediaPlayButton,
  MediaMuteButton,
  MediaVolumeRange,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaFullscreenButton,
  MediaLiveButton,
  MediaLoadingIndicator,
} from 'media-chrome/react'
import HlsVideo from 'hls-video-element/react'
import { InfoIcon } from 'lucide-react'

// Public demo HLS stream (Big Buck Bunny via Mux)
const DEMO_STREAM_URL =
  'https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg.m3u8'

interface StreamPreviewPlayerProps {
  isLive: boolean
}

export function StreamPreviewPlayer({ isLive }: StreamPreviewPlayerProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl bg-black shadow-lg shadow-black/50">
      <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 text-xs text-zinc-400">
        <InfoIcon className="h-4 w-4 text-zinc-500" />
        {isLive ? 'Live' : 'Replay'} Stream Preview Player
      </div>

      <MediaController className="w-full block  ">
        <HlsVideo
          slot="media"
          src={DEMO_STREAM_URL}
          preload="auto"
          autoplay
          muted
          crossOrigin="anonymous"
          className="w-full aspect-[2.4] block"
        />
        {isLive && (
          <div slot="top-chrome" className="flex w-full p-4 justify-end">
            <MediaLiveButton className="py-1 px-2 rounded-[8px]">
              <span
                slot="indicator"
                className="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.5)]"
              />
              <span slot="text" className="text-xs">
                Live
              </span>
            </MediaLiveButton>
          </div>
        )}

        <MediaLoadingIndicator slot="centered-chrome" />

        <MediaControlBar className="bg-black/90 justify-between">
          <div className="flex flex-1 items-center gap-8">
            <MediaPlayButton />

            {!isLive && (
              <>
                <MediaTimeRange className="flex-1" />
                <MediaTimeDisplay showDuration />
              </>
            )}
          </div>

          <div className="flex  items-center justify-end gap-8">
            <MediaMuteButton />
            <MediaVolumeRange />
            <MediaFullscreenButton />
          </div>
        </MediaControlBar>
      </MediaController>

      {isLive && (
        <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 text-xs text-zinc-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
          Live stream — seek is disabled during broadcast
        </div>
      )}
    </div>
  )
}
