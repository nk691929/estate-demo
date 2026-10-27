"use client";

import "leaflet/dist/leaflet.css";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import { Link2, LocateFixed } from "lucide-react";

import { extractCoordinates } from "@/lib/map-link";
import { resolveMapLink } from "../map-link-actions";

export const DEFAULT_LAT = "31.5204";
export const DEFAULT_LNG = "74.3587";

const PIN_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><path d="M16 0C7.2 0 0 7.1 0 15.9 0 27 16 40 16 40s16-13 16-24.1C32 7.1 24.8 0 16 0z" fill="#dc2626" stroke="#ffffff" stroke-width="2"/><circle cx="16" cy="16" r="6" fill="#ffffff"/></svg>';

function toPoint(lat: string, lng: string): [number, number] | null {
  if (lat.trim() === "" || lng.trim() === "") return null;

  const a = Number(lat);
  const b = Number(lng);

  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  if (Math.abs(a) > 90 || Math.abs(b) > 180) return null;

  return [a, b];
}

const buttonClass =
  "flex items-center gap-2 rounded-lg border border-foreground/20 px-4 py-2.5 text-sm transition hover:bg-foreground/5 disabled:opacity-50";

export function LocationPicker({
  latitude,
  longitude,
  onChange,
}: {
  latitude: string;
  longitude: string;
  onChange: (latitude: string, longitude: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const onChangeRef = useRef(onChange);
  const initialPoint = useRef(toPoint(latitude, longitude));

  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const emit = useCallback((lat: number, lng: number) => {
    onChangeRef.current(lat.toFixed(6), lng.toFixed(6));
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      const start: [number, number] = initialPoint.current ?? [
        Number(DEFAULT_LAT),
        Number(DEFAULT_LNG),
      ];

      const map = L.map(containerRef.current).setView(
        start,
        initialPoint.current ? 16 : 12
      );

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const marker = L.marker(start, {
        draggable: true,
        title: "Property location",
        icon: L.divIcon({
          className: "",
          html: PIN_SVG,
          iconSize: [32, 40],
          iconAnchor: [16, 40],
        }),
      }).addTo(map);

      map.on("click", (event) => {
        marker.setLatLng(event.latlng);
        emit(event.latlng.lat, event.latlng.lng);
      });

      marker.on("dragend", () => {
        const position = marker.getLatLng();
        emit(position.lat, position.lng);
      });

      mapRef.current = map;
      markerRef.current = marker;
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [emit]);

  useEffect(() => {
    const point = toPoint(latitude, longitude);
    const map = mapRef.current;
    const marker = markerRef.current;

    if (!point || !map || !marker) return;

    marker.setLatLng(point);
    if (!map.getBounds().contains(point)) {
      map.setView(point, Math.max(map.getZoom(), 15));
    }
  }, [latitude, longitude]);

  function locateMe() {
    if (!navigator.geolocation) {
      setMessage("This browser cannot share its location. Click the map instead.");
      return;
    }

    setBusy(true);
    setMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        emit(position.coords.latitude, position.coords.longitude);
        setMessage(
          `Location set (accurate to about ${Math.round(position.coords.accuracy)} m). Drag the pin if needed.`
        );
        setBusy(false);
      },
      () => {
        setMessage(
          "Could not get your location. Allow location access for this site, or click the map instead."
        );
        setBusy(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function applyLink() {
    const text = link.trim();
    if (!text) return;

    setMessage(null);

    const direct = extractCoordinates(text);
    if (direct) {
      emit(direct.lat, direct.lng);
      setMessage("Location set from your link.");
      setLink("");
      return;
    }

    setBusy(true);

    try {
      const result = await resolveMapLink(text);

      if (result.ok) {
        emit(result.lat, result.lng);
        setMessage("Location set from your link.");
        setLink("");
      } else {
        setMessage(result.error);
      }
    } catch {
      setMessage(
        "Could not read that link. Check your connection, or click the map instead."
      );
    }

    setBusy(false);
  }

  const notSet = latitude === DEFAULT_LAT && longitude === DEFAULT_LNG;

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-medium">Location on map</h2>
        <p className="text-xs text-foreground/65">
          Click the map or drag the pin to the property.
        </p>
      </div>

      {notSet && (
        <p
          role="status"
          className="rounded-lg border border-yellow-500/40 bg-yellow-500/5 px-3 py-2 text-sm"
        >
          Location not set yet. The pin is at the city centre. Click the map to
          place it on the property.
        </p>
      )}

      <div
        ref={containerRef}
        className="relative isolate z-0 h-72 w-full overflow-hidden rounded-2xl border border-foreground/20 sm:h-96"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={locateMe}
          disabled={busy}
          className={buttonClass}
        >
          <LocateFixed className="size-4" />
          Use my current location
        </button>
      </div>

      <div className="flex gap-2">
        <input
          value={link}
          onChange={(event) => setLink(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void applyLink();
            }
          }}
          placeholder="Paste a Google Maps link, or: 31.5204, 74.3587"
          aria-label="Google Maps link or coordinates"
          className="h-11 min-w-0 flex-1 rounded-lg border border-foreground/20 bg-background px-3 text-sm outline-none focus:border-foreground"
        />
        <button
          type="button"
          onClick={() => void applyLink()}
          disabled={busy || link.trim() === ""}
          className={buttonClass}
        >
          <Link2 className="size-4" />
          Find
        </button>
      </div>

      {message && (
        <p role="status" className="text-sm text-foreground/70">
          {message}
        </p>
      )}
    </section>
  );
}