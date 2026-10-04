# Drop your Ride N Care photos here

Upload your service photos into this folder (`src/assets/uploads/`) and tell
Buffy to wire them in. Name each file after the service it should appear on —
matching is then automatic:

| File name | Appears on |
|---|---|
| `bike-service.jpg` | /bike-service + homepage Bike Service card |
| `doorstep-bike-service.jpg` | /doorstep-bike-service |
| `bike-repair.jpg` | /bike-repair |
| `doorstep-bike-repair.jpg` | /doorstep-bike-repair |
| `periodic-bike-service.jpg` | /periodic-bike-service |
| `motorcycle-service.jpg` | /motorcycle-service |
| `scooter-service.jpg` | /scooter-service |
| `emergency-bike-repair.jpg` | /emergency-bike-repair |
| `bike-breakdown-assistance.jpg` | /bike-breakdown-assistance |
| `engine-repair.jpg` | /engine-repair |
| `brake-service.jpg` | /brake-service |
| `clutch-repair.jpg` | /clutch-repair |
| `battery-service.jpg` | /battery-service |
| `electrical-repair.jpg` | /electrical-repair |
| `general-two-wheeler-repair.jpg` | /general-two-wheeler-repair |
| `car-service.jpg` | /cars + homepage Car Service card |

Any JPG/PNG/WebP works — photos are auto-cropped to 4:3, resized to 1600px
wide and converted to optimized WebP before publishing. Higher resolution
than 1600px is welcome; nothing needs manual editing.

## How photos are wired in (actual pipeline)

Originals in this folder are never modified. Run:

```sh
node scripts/optimize-uploads.mjs
```

It centre-crops each photo to 4:3, writes 1600w + 800w WebP variants to
`src/assets/photos/`, and maps each source file to a descriptive slug (the
mapping table lives at the top of that script). Components import the photos
from the typed registry in `src/lib/photos.ts`, which also owns the unique alt
text and captions — edit alt text there, not in the components.
