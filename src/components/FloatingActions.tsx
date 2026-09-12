import { Bot, MessageCircle, Phone } from "lucide-react";
import { useBooking } from "@/components/booking/BookingProvider";

export function FloatingActions() {
  const { openAiBooking, openQuickBooking } = useBooking();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-6 sm:pb-5 pointer-events-none">
      <div className="pointer-events-auto mx-auto grid w-full max-w-2xl grid-cols-3 items-stretch gap-1.5 rounded-2xl border border-border bg-card/95 p-2 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/80 sm:gap-2">
        <a
          href="tel:+918296950339"
          aria-label="Call Ride N Care"
          className="flex min-h-12 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-grad-primary px-2 py-3 text-xs font-semibold text-primary-foreground shadow-glow transition hover:opacity-95 active:scale-[0.98] sm:gap-2 sm:px-4 sm:text-base"
        >
          <Phone className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
          <span className="truncate">Call</span>
        </a>
        <button
          type="button"
          onClick={openQuickBooking}
          aria-label="Book on WhatsApp"
          className="flex min-h-12 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-whatsapp px-2 py-3 text-xs font-semibold text-whatsapp-foreground shadow-lg transition hover:opacity-95 active:scale-[0.98] sm:gap-2 sm:px-4 sm:text-base"
        >
          <MessageCircle className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
          <span className="truncate">WhatsApp</span>
        </button>
        <button
          type="button"
          onClick={openAiBooking}
          aria-label="Book with AI"
          className="flex min-h-12 min-w-0 items-center justify-center gap-1.5 rounded-xl border border-primary bg-background px-2 py-3 text-xs font-semibold text-foreground transition hover:bg-card active:scale-[0.98] sm:gap-2 sm:px-4 sm:text-base"
        >
          <Bot className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" aria-hidden />
          <span className="truncate">Book with AI</span>
        </button>
      </div>
    </div>
  );
}
