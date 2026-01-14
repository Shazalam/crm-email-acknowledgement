"use client";

interface PermissionModalProps {
  isOpen: boolean;
  onRequestLocation: () => void;
  onDismiss: () => void;
}

export function LocationPermissionModal({
  isOpen,
  onRequestLocation,
  onDismiss,
}: PermissionModalProps) {
  if (!isOpen) return null;

  const handleRequestClick = () => {
    console.log("🎯 User clicked 'Allow Location'");
    onRequestLocation();
  };

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/50
        px-4
      "
      aria-modal="true"
      role="dialog"
    >
      <div
        className="
          w-full max-w-md
          rounded-2xl
          bg-white
          shadow-2xl
          border border-slate-200
          p-5 sm:p-6
          animate-[fadeIn_0.15s_ease-out]
      "
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-xl">
            📍
          </div>
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900">
              Enable location services
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Share your location so we can suggest nearby pickup spots and
              faster search results.
            </p>
          </div>
        </div>

        {/* Info box */}
        <div className="mt-4 rounded-xl bg-slate-50 px-3.5 py-3 text-xs sm:text-sm text-slate-600">
          Your browser will show a permission popup next. Make sure to choose{" "}
          <span className="font-semibold text-slate-800">“Allow”</span> to
          continue.
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col">
          {/* <button
            type="button"
            onClick={onDismiss}
            className="
              w-full sm:w-1/2
              inline-flex items-center justify-center
              rounded-xl border border-slate-300
              bg-white
              px-4 py-2.5
              text-sm font-medium text-slate-700
              hover:bg-slate-50
              focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-1
              transition
            "
          >
            Not now
          </button> */}

          <button
            type="button"
            onClick={handleRequestClick}
            className="
              w-full
              inline-flex items-center justify-center gap-1.5
              rounded-xl
              bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl
              px-4 py-2.5
              text-sm font-semibold text-white
              cursor-pointer
              transition
            "
          >
            <span>✓</span>
            <span>Allow location</span>
          </button>
        </div>

        {/* Footer note */}
        <p className="mt-4 text-[11px] sm:text-xs text-slate-500 leading-snug">
          Your location is used only for this session and is not stored
          permanently.
        </p>
      </div>
    </div>
  );
}
