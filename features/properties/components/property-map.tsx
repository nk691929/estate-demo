import { MapPin, Navigation } from "lucide-react";

const SPREAD = 0.006;

export function PropertyMap({
  latitude,
  longitude,
  address,
}: {
  latitude: number;
  longitude: number;
  address: string;
}) {
  const valid =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180 &&
    !(latitude === 0 && longitude === 0);

  if (!valid) return null;

  const box = [
    longitude - SPREAD,
    latitude - SPREAD,
    longitude + SPREAD,
    latitude + SPREAD,
  ]
    .map((value) => value.toFixed(5))
    .join("%2C");

  const marker = `${latitude.toFixed(5)}%2C${longitude.toFixed(5)}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${box}&layer=mapnik&marker=${marker}`;

  const place = `${latitude},${longitude}`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${place}`;
  const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${place}`;

  const linkClass =
    "flex items-center gap-2 rounded-lg border border-foreground/20 px-4 py-2.5 text-sm transition hover:bg-foreground/5";

  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold">Location</h2>
      <p className="mb-3 flex items-center gap-1 text-sm text-foreground/60">
        <MapPin className="size-4 shrink-0" />
        {address}
      </p>

      <div className="overflow-hidden rounded-2xl border border-foreground/10">
        <iframe
          title={`Map showing ${address}`}
          src={src}
          sandbox="allow-scripts allow-same-origin"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-72 w-full border-0 sm:h-80"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <MapPin className="size-4" />
          Open in Google Maps
        </a>
        <a
          href={directionsLink}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <Navigation className="size-4" />
          Get directions
        </a>
      </div>

      <p className="mt-2 text-xs text-foreground/50">
        Map data © OpenStreetMap contributors
      </p>
    </section>
  );
}