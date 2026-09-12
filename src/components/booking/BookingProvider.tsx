import { createContext, lazy, Suspense, useCallback, useContext, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const BookingFlow = lazy(() => import("@/components/booking/BookingFlow").then((module) => ({ default: module.BookingFlow })));
const AiBooking = lazy(() => import("@/components/booking/AiBooking").then((module) => ({ default: module.AiBooking })));
const QuickWhatsAppBooking = lazy(() =>
  import("@/components/booking/QuickWhatsAppBooking").then((module) => ({ default: module.QuickWhatsAppBooking })),
);

type Mode = "flow" | "ai" | "quick";

interface BookingApi {
  openBooking: (opts?: { vehicle?: "bike" | "car"; packageId?: string }) => void;
  openAiBooking: () => void;
  openQuickBooking: () => void;
}

const BookingContext = createContext<BookingApi | null>(null);

export function useBooking(): BookingApi {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("flow");
  const [vehicle, setVehicle] = useState<"bike" | "car" | undefined>();
  const [packageId, setPackageId] = useState<string | undefined>();
  const [seed, setSeed] = useState(0);

  const api = useMemo<BookingApi>(
    () => ({
      openBooking: (opts) => {
        setMode("flow");
        setVehicle(opts?.vehicle);
        setPackageId(opts?.packageId);
        setSeed((s) => s + 1);
        setOpen(true);
      },
      openAiBooking: () => {
        setMode("ai");
        setSeed((s) => s + 1);
        setOpen(true);
      },
      openQuickBooking: () => {
        setMode("quick");
        setSeed((s) => s + 1);
        setOpen(true);
      },
    }),
    [],
  );

  const close = useCallback(() => setOpen(false), []);

  const title = mode === "ai" ? "Book with AI" : mode === "quick" ? "Book Your Ride N Care Service" : "Book Your Ride N Care Service";

  return (
    <BookingContext.Provider value={api}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-lg overflow-x-hidden overflow-y-auto rounded-2xl p-4 sm:max-h-[92dvh] sm:w-[calc(100vw-1.5rem)] sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-left text-xl">{title}</DialogTitle>
          </DialogHeader>
          <div key={`${mode}-${seed}`} className="min-w-0">
            <Suspense fallback={<div className="py-10 text-center text-sm text-muted-foreground">Opening booking…</div>}>
              {mode === "flow" && <BookingFlow initialVehicle={vehicle} initialPackageId={packageId} onDone={close} />}
              {mode === "ai" && <AiBooking />}
              {mode === "quick" && (
                <QuickWhatsAppBooking
                  onFullBooking={() => {
                    setMode("flow");
                    setVehicle(undefined);
                    setPackageId(undefined);
                    setSeed((s) => s + 1);
                  }}
                />
              )}
            </Suspense>
          </div>
        </DialogContent>
      </Dialog>
    </BookingContext.Provider>
  );
}
