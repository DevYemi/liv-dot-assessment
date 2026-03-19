import { Settings2, ImageIcon, X, Lock } from 'lucide-react'
import { Switch } from '@/views/globalComponents/shadcn-ui/switch'
import { Input } from '@/views/globalComponents/shadcn-ui/input'
import { Button } from '@/views/globalComponents/shadcn-ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/views/globalComponents/shadcn-ui/collapsible'
import { useRequirementToggle } from './useRequirementToggle'

export function RequirementToggle() {
  const {
    eventData,
    isTogglingRequirement,
    isUpdatingThumbnail,
    fileInputRef,
    priceInputValue,
    isUpdatingTicketPrice,
    isControlsLocked,
    setPriceInputValue,
    updateRequirementHandler,
    updateThumbnailHandler,
    updateTicketPriceHandler,
  } = useRequirementToggle()

  return (
    <Collapsible open>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-left text-xs font-medium text-zinc-500 transition-colors hover:border-zinc-700 hover:text-zinc-400">
        <Settings2 className="h-3.5 w-3.5" />
        <span>Event Controls — Requirements Needed Before Go Live</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {isControlsLocked && (
          <div className="mb-1 mt-1 flex items-center gap-2 rounded-lg border border-amber-800/50 bg-amber-950/40 px-3 py-2 text-xs text-amber-400">
            <Lock className="h-3.5 w-3.5 shrink-0" />
            <span>
              Event controls are locked while the event is{' '}
              <span className="font-semibold capitalize">
                {eventData.state}
              </span>
              .
            </span>
          </div>
        )}
        <div className="mt-1 space-y-1 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
          {eventData.requirements.map((req) => (
            <div
              key={req.key}
              className="flex items-center justify-between rounded px-2 py-1.5"
            >
              <span className="text-xs text-zinc-400">{req.label}</span>
              {req.key === 'thumbnailUploaded' ? (
                <div className="flex items-center gap-2">
                  {eventData.thumbnailUrl ? (
                    <div className="relative h-8 w-14 overflow-hidden rounded border border-zinc-700">
                      <img
                        src={eventData.thumbnailUrl}
                        alt="thumbnail"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-8 w-14 items-center justify-center rounded border border-zinc-700 bg-zinc-800">
                      <ImageIcon className="h-3.5 w-3.5 text-zinc-600" />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={updateThumbnailHandler}
                    disabled={isControlsLocked || isUpdatingThumbnail}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 border-zinc-700 bg-zinc-800 px-2 text-xs text-zinc-300 hover:bg-zinc-700"
                    disabled={isControlsLocked || isUpdatingThumbnail}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {eventData.thumbnailUrl ? 'Replace' : 'Upload'}
                  </Button>
                  {eventData.thumbnailUrl && (
                    <button
                      className="text-zinc-600 hover:text-zinc-400 disabled:opacity-50"
                      disabled={isControlsLocked || isUpdatingThumbnail}
                      onClick={() => updateThumbnailHandler(null)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ) : req.key === 'pricingConfigured' ? (
                <div className="flex items-center gap-2">
                  <div className="relative w-24">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                      $
                    </span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={priceInputValue}
                      onChange={(e) => setPriceInputValue(e.target.value)}
                      onKeyDown={(e) =>
                        !isControlsLocked &&
                        e.key === 'Enter' &&
                        updateTicketPriceHandler()
                      }
                      disabled={isControlsLocked || isUpdatingTicketPrice}
                      className="h-7 border-zinc-700 bg-zinc-800 pl-5 text-xs text-zinc-300 focus-visible:ring-violet-600"
                      placeholder="0.00"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 border-zinc-700 bg-zinc-800 px-2 text-xs text-zinc-300 hover:bg-zinc-700"
                    disabled={isControlsLocked || isUpdatingTicketPrice}
                    onClick={updateTicketPriceHandler}
                  >
                    Set
                  </Button>
                </div>
              ) : (
                <Switch
                  checked={req.satisfied}
                  disabled={isControlsLocked || isTogglingRequirement}
                  onCheckedChange={() => updateRequirementHandler(req.key)}
                  className="scale-75 data-checked:bg-violet-600"
                />
              )}
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
