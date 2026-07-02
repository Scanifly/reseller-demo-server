import { useEffect, useState } from "react";
import { getJson, toErrorMessage } from "../api";
import type { Company } from "../types";

/**
 * Fetch the companies the reseller has access to once on mount. Lives in the
 * always-mounted shell (App) so the list is fetched a single time and shared
 * with the tabs that need it, rather than re-fetched on every tab switch.
 */
export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getJson<Company[]>("/scanifly/companies");
        if (!cancelled) setCompanies(data);
      } catch (err) {
        if (!cancelled) setError(toErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { companies, loading, error };
}
