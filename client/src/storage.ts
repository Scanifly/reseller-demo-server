/**
 * localStorage keys backing each tab's persisted form fields. Centralized here
 * so the persistence hooks and cross-tab handoffs (which seed another tab's
 * fields before switching to it) share a single source of truth.
 */
export const STORAGE_KEYS = {
  viewer: {
    email: "scanifly_viewer_email",
    projectId: "scanifly_viewer_project_id",
    designId: "scanifly_viewer_design_id",
    userId: "scanifly_viewer_user_id",
    company: "scanifly_viewer_company",
    firstName: "scanifly_viewer_first",
    lastName: "scanifly_viewer_last",
    phone: "scanifly_viewer_phone",
    position: "scanifly_viewer_position",
  },
  createUser: {
    firstName: "scanifly_cu_first",
    lastName: "scanifly_cu_last",
    email: "scanifly_cu_email",
    phone: "scanifly_cu_phone",
    company: "scanifly_cu_company",
    position: "scanifly_cu_position",
    role: "scanifly_cu_role",
    permissions: "scanifly_cu_permissions",
  },
  createProject: {
    email: "scanifly_cpd_email",
    company: "scanifly_cpd_company",
    userId: "scanifly_cpd_user_id",
    projectName: "scanifly_cpd_project_name",
    designName: "scanifly_cpd_design_name",
    address: "scanifly_cpd_address",
    lat: "scanifly_cpd_lat",
    lng: "scanifly_cpd_lng",
  },
} as const;

/**
 * Write a persisted value for a tab that is about to be shown. Tabs are
 * conditionally rendered, so switching to one remounts it and its
 * `usePersistedString` initializers re-read localStorage — meaning seeding a
 * key here and then navigating prefills the target tab's field.
 */
export function seedPersisted(key: string, value: string) {
  localStorage.setItem(key, value);
}
