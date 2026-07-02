import { Hint, Select } from "../theme/styled";
import type { Company } from "../types";

/**
 * Company picker backed by the companies the reseller has access to. Falls back
 * to showing the raw persisted ID as an option so a previously-saved value is
 * never silently dropped while the list is loading or if it is no longer listed.
 */
export function CompanySelect({
  id,
  value,
  onChange,
  companies,
  loading,
  error,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  companies: Company[];
  loading: boolean;
  error: string | null;
}) {
  const isKnown = companies.some((c) => c.id === value);
  const placeholder = loading
    ? "Loading companies…"
    : companies.length === 0
      ? "No companies available"
      : "Select a company…";

  return (
    <>
      <Select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={loading && companies.length === 0}
      >
        <option value="">{placeholder}</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.id})
          </option>
        ))}
        {/* Preserve a saved value that isn't (yet) in the fetched list. */}
        {value && !isKnown && <option value={value}>{value}</option>}
      </Select>
      {error && (
        <Hint>Couldn't load companies: {error}. Selection may be stale.</Hint>
      )}
    </>
  );
}
