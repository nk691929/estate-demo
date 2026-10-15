import Form from "next/form";
import { Search } from "lucide-react";

const fieldClass =
  "h-12 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-neutral-900";

export function PropertySearchForm() {
  return (
    <Form
      action="/properties"
      className="grid gap-3 rounded-2xl bg-white p-4 text-left shadow-xl md:grid-cols-4"
    >
      <select name="purpose" defaultValue="" className={fieldClass}>
        <option value="">Buy or rent</option>
        <option value="sale">Buy</option>
        <option value="rent">Rent</option>
      </select>

      <select name="type" defaultValue="" className={fieldClass}>
        <option value="">Any type</option>
        <option value="house">House</option>
        <option value="apartment">Apartment</option>
        <option value="plot">Plot</option>
        <option value="commercial">Commercial</option>
      </select>

      <input
        name="city"
        placeholder="City, e.g. Lahore"
        className={fieldClass}
      />

      <button
        type="submit"
        className="flex h-12 items-center justify-center gap-2 rounded-lg bg-neutral-900 font-medium text-white transition hover:bg-neutral-700"
      >
        <Search className="size-4" />
        Search
      </button>
    </Form>
  );
}