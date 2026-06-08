export function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <a
        href="https://wa.me/918296950339?text=Hi%20Ride%20N%20Care%2C%20I'd%20like%20to%20book%20a%20service."
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition"
      >
        <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden>
          <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.348-.688.747-1.032 1.49-1.045 2.523v.144c.014.518.144 1.05.331 1.532.486 1.404 1.532 2.778 2.732 3.7 1.116.9 2.292 1.46 3.534 1.79.402.115.832.144 1.247.144.674 0 1.232-.158 1.776-.473.387-.215.71-.532.85-.946.066-.222.094-.46.094-.692 0-.137-.014-.273-.043-.41-.043-.207-.115-.272-.236-.36zM16 0C7.163 0 0 7.163 0 16c0 2.852.75 5.527 2.06 7.838L0 32l8.392-2.025A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.32c-2.485 0-4.804-.674-6.79-1.84l-.486-.287-5.04 1.218 1.247-4.92-.32-.515A13.31 13.31 0 0 1 2.68 16C2.68 8.652 8.652 2.68 16 2.68S29.32 8.652 29.32 16 23.348 29.32 16 29.32z"/>
        </svg>
      </a>
      <a
        href="tel:+918296950339"
        aria-label="Call Ride N Care"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-grad-primary text-primary-foreground shadow-glow hover:scale-110 transition"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden>
          <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/>
        </svg>
      </a>
    </div>
  );
}