import { useEffect, useRef, useState } from "react";
import { LocateFixed, MapPinned } from "lucide-react";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const loadGoogleMaps = () =>
  new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve(window.google.maps);
      return;
    }

    if (!apiKey) {
      reject(new Error("Google Maps API key missing."));
      return;
    }

    const existing = document.querySelector("script[data-google-maps]");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google.maps));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";
    script.onload = () => resolve(window.google.maps);
    script.onerror = reject;
    document.head.appendChild(script);
  });

export default function MapsPicker({ value, onChange }) {
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const markerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [status, setStatus] = useState(apiKey ? "Loading map picker..." : "Google Maps key not configured.");

  useEffect(() => {
    let isMounted = true;

    loadGoogleMaps()
      .then((maps) => {
        if (!isMounted || !mapRef.current) {
          return;
        }

        const center = { lat: value?.lat || 28.6139, lng: value?.lng || 77.209 };
        const map = new maps.Map(mapRef.current, {
          center,
          zoom: value?.lat ? 13 : 5,
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            { featureType: "poi", stylers: [{ visibility: "off" }] },
            { featureType: "transit", stylers: [{ visibility: "off" }] }
          ]
        });

        markerRef.current = new maps.Marker({ position: center, map });
        const geocoder = new maps.Geocoder();

        const selectPosition = (latLng, label = "") => {
          markerRef.current.setPosition(latLng);
          map.panTo(latLng);
          geocoder.geocode({ location: latLng }, (results) => {
            const address = label || results?.[0]?.formatted_address || `${latLng.lat().toFixed(5)}, ${latLng.lng().toFixed(5)}`;
            onChange({ label: address, lat: latLng.lat(), lng: latLng.lng() });
          });
        };

        map.addListener("click", (event) => selectPosition(event.latLng));

        if (inputRef.current && maps.places) {
          const autocomplete = new maps.places.Autocomplete(inputRef.current, {
            fields: ["formatted_address", "geometry", "name"]
          });
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place.geometry?.location) {
              selectPosition(place.geometry.location, place.formatted_address || place.name);
            }
          });
        }

        setMapReady(true);
        setStatus("Click the map or search a place.");
      })
      .catch(() => {
        if (isMounted) {
          setMapReady(false);
          setStatus("Use browser location or type your current location.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          label: `Current location (${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)})`,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        onChange(next);
        setStatus("Current location selected.");
      },
      () => setStatus("Could not access location permission.")
    );
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/10">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <MapPinned className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="field pl-11"
            onChange={(event) => onChange({ ...value, label: event.target.value })}
            placeholder="Search or type current location"
            ref={inputRef}
            value={value?.label || ""}
          />
        </div>
        <button className="btn-secondary shrink-0" onClick={useCurrentLocation} type="button">
          <LocateFixed size={18} />
          Use my location
        </button>
      </div>
      <div
        className={`mt-3 h-52 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900 ${mapReady ? "" : "grid place-items-center"}`}
        ref={mapRef}
      >
        {!mapReady && <span className="px-5 text-center text-sm font-semibold text-slate-500 dark:text-slate-300">{status}</span>}
      </div>
      <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{status}</p>
    </div>
  );
}
