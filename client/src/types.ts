/** A company the reseller has access to, as returned by `GET /scanifly/companies`. */
export type Company = { id: string; name: string };

/** The three top-level tabs of the demo UI. */
export type Tab = "createUser" | "createProject" | "viewer";
