import { useEffect } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useBooking } from "@/components/booking/BookingProvider";
import { BookingButton } from "@/components/booking/BookingButton";

/**
 * Site-wide floating controls (owner redesign, preview-only 2026-10-04):
 *
 *  · Bottom bar  — Call · circular glowing Book Now (centre) · WhatsApp.
 *    Call and WhatsApp keep their exact existing actions/destinations
 *    (tel: link + openQuickBooking with data-ctc tracking). Book Now opens
 *    the same booking modal as the hero via the existing BookingButton.
 *  · SOS         — compact red pulsing shortcut at the top-right, directly
 *    below the header menu button, linking to the existing
 *    /breakdown-assistance page (destination unchanged — no new emergency
 *    functionality).
 *
 * Reversible: restore the previous two-column bar markup and delete the
 * .float-book / .rnc-sos rules in src/styles.css.
 */
export function FloatingActions() {
  const { openQuickBooking } = useBooking();

  // Commit marker for the ROOT layout (FloatingActions lives in __root):
  // this mount effect runs only after React has committed the root tree, so
  // the attribute is a trustworthy "root tree committed + effects flushed"
  // signal. Tests wait on [data-root-ready] together with the home layer's
  // [data-video-ready] instead of scroll-based probes (scrolling during load
  // was observed to interfere with route hydration on this low-memory box).
  useEffect(() => {
    document.querySelector(".float-bar")?.setAttribute("data-root-ready", "");
  }, []);

  return (
    <>
      {/* SOS — top-right below the side-panel/menu button (header is 73px) */}
      <Link
        to="/breakdown-assistance"
        aria-label="SOS — Breakdown Assistance"
        className="rnc-sos float-sos fixed right-3 top-[81px] z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-[11px] font-black tracking-wider text-white ring-1 ring-white/25 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6 sm:h-[52px] sm:w-[52px]"
      >
        SOS
      </Link>

      {/* Bottom floating bar — three balanced actions, Book Now centred */}
      <div className="float-bar fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-6 sm:pb-5 pointer-events-none">
        <div className="pointer-events-auto relative mx-auto flex w-full max-w-md items-center justify-between gap-2 rounded-2xl border border-border bg-card/95 px-2 py-2 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/80 sm:gap-3">
          <a
            href="tel:+918069409289"
            data-ctc="call_click"
            data-ctc-params='{"vehicle_type":"unknown"}'
            aria-label="Call Ride N Care"
            className="flex min-h-12 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl bg-grad-primary px-2 py-3 text-xs font-semibold text-primary-foreground shadow-glow transition hover:opacity-95 active:scale-[0.98] sm:gap-2 sm:px-4 sm:text-base"
          >
            <Phone className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
            <span className="truncate">Call</span>
          </a>

          {/* Central circular FAB — red neon theme (owner update 2026-10-04):
              red gradient + red accent ring and outer glow from .float-book
              styles, gentle attention wiggle. Opens the existing booking
              modal, unchanged. */}
          <BookingButton
            aria-label="Book Now"
            variant="ghost"
            className="float-book -mt-3 h-16 w-16 shrink-0 flex-col gap-0 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-800 p-0 text-white transition hover:brightness-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-white sm:h-[72px] sm:w-[72px]"
          >
            <span className="block text-[11px] font-black leading-[1.05] tracking-wide sm:text-xs">
              Book
            </span>
            <span className="block text-[11px] font-black leading-[1.05] tracking-wide sm:text-xs">
              Now
            </span>
          </BookingButton>

          <button
            type="button"
            onClick={openQuickBooking}
            data-ctc="whatsapp_click"
            data-ctc-params='{"vehicle_type":"unknown"}'
            aria-label="Book on WhatsApp"
            className="flex min-h-12 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl bg-whatsapp px-2 py-3 text-xs font-semibold text-whatsapp-foreground shadow-lg transition hover:opacity-95 active:scale-[0.98] sm:gap-2 sm:px-4 sm:text-base"
          >
            <MessageCircle className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
            <span className="truncate">WhatsApp</span>
          </button>
        </div>
      </div>
    </>
  );
}
