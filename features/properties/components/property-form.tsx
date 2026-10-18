"use client";

import { useState } from "react";

import type { PropertyFormValues } from "../validation";
import { useRouter } from "next/navigation";

type SaveResult =
  | { ok: true; redirectTo?: string }
  | { ok: false; error: string };

const inputClass =
  "h-11 w-full rounded-lg border border-foreground/20 bg-background px-3 text-sm outline-none focus:border-foreground";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

export function PropertyForm({
  initial,
  action,
  submitLabel,
}: {
  initial: PropertyFormValues;
  action: (values: PropertyFormValues) => Promise<SaveResult>;
  submitLabel: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<PropertyFormValues>(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof PropertyFormValues>(
    key: K,
    value: PropertyFormValues[K]
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setState("idle");
  }

  const bind = (key: Exclude<keyof PropertyFormValues, "featured">) => ({
    value: values[key],
    onChange: (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => set(key, event.target.value),
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    setError(null);

    const result = await action(values);

    if (result.ok) {
      if (result.redirectTo) {
        setValues(initial);
        setState("idle");
        router.push(result.redirectTo);
        return;
      }
      setState("saved");
    } else {
      setState("error");
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Title">
        <input {...bind("title")} className={inputClass} />
      </Field>

      <Field label="Description">
        <textarea
          {...bind("description")}
          rows={5}
          className="w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Price (PKR)">
          <input {...bind("price")} inputMode="numeric" className={inputClass} />
        </Field>
        <Field label="Purpose">
          <select {...bind("purpose")} className={inputClass}>
            <option value="sale">For sale</option>
            <option value="rent">For rent (per month)</option>
          </select>
        </Field>
        <Field label="Type">
          <select {...bind("type")} className={inputClass}>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="plot">Plot</option>
            <option value="commercial">Commercial</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="City">
          <input {...bind("city")} className={inputClass} />
        </Field>
        <Field label="Area">
          <input {...bind("area")} className={inputClass} />
        </Field>
        <Field label="Address">
          <input {...bind("address")} className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Bedrooms (optional)">
          <input {...bind("bedrooms")} inputMode="numeric" className={inputClass} />
        </Field>
        <Field label="Bathrooms (optional)">
          <input {...bind("bathrooms")} inputMode="numeric" className={inputClass} />
        </Field>
        <Field label="Size">
          <input {...bind("size")} inputMode="decimal" className={inputClass} />
        </Field>
        <Field label="Size unit">
          <select {...bind("sizeUnit")} className={inputClass}>
            <option value="marla">Marla</option>
            <option value="kanal">Kanal</option>
            <option value="sqft">Square feet</option>
          </select>
        </Field>
      </div>

      <Field label="Features (separated by commas)">
        <input
          {...bind("features")}
          placeholder="Parking, Gas, Security"
          className={inputClass}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Latitude">
          <input {...bind("latitude")} inputMode="decimal" className={inputClass} />
        </Field>
        <Field label="Longitude">
          <input {...bind("longitude")} inputMode="decimal" className={inputClass} />
        </Field>
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={values.featured}
          onChange={(event) => set("featured", event.target.checked)}
          className="size-4"
        />
        Show on the home page as a featured property
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={state === "saving"}
          className="h-11 rounded-lg bg-foreground px-6 font-medium text-background transition hover:opacity-80 disabled:opacity-50"
        >
          {state === "saving" ? "Saving..." : submitLabel}
        </button>
        {state === "saved" && (
          <span className="text-sm text-green-500">
            Saved. The website now shows your changes.
          </span>
        )}
        {state === "error" && (
          <span className="text-sm text-red-500">{error}</span>
        )}
      </div>
    </form>
  );
}