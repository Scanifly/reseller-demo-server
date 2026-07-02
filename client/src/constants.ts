// Positions accepted by the reseller user-creation API. The chosen position
// determines the user's default permissions unless overridden below.
export const POSITIONS: { value: string; label: string }[] = [
  { value: "designer", label: "Designer" },
  { value: "surveyor", label: "Surveyor" },
  { value: "financeProcurement", label: "Finance / Procurement" },
  { value: "salesMarketing", label: "Sales / Marketing" },
  { value: "operationsProjectManager", label: "Operations / Project Manager" },
  { value: "installer", label: "Installer" },
  { value: "executiveOwnerCEO", label: "Executive / Owner / CEO" },
  { value: "thirdPartyEngineer", label: "Third-Party Engineer" },
  { value: "dronePilot", label: "Drone Pilot" },
  { value: "maintenanceTech", label: "Maintenance Tech" },
  { value: "guest", label: "Guest" },
];

// Roles a reseller is allowed to assign. `admin` grants the admin role;
// leaving this unset defaults to `default` (and the position's permissions).
export const ROLES: { value: string; label: string }[] = [
  { value: "admin", label: "admin" },
  { value: "default", label: "default" },
];

// Permissions a reseller may assign, mirroring the API allow-list. Checking any
// of these overrides the permissions the position would otherwise grant.
export const PERMISSIONS: { value: string; label: string }[] = [
  { value: "adminTools", label: "Admin Tools" },
  { value: "billing", label: "Billing" },
  { value: "upload", label: "Create New Projects" },
  { value: "download", label: "Download" },
  { value: "uploadMedia", label: "Upload Media" },
  { value: "watt3d", label: "Watt3D" },
  { value: "simpleDesign", label: "Simple Design" },
  { value: "simpleDesignTechnical", label: "Simple Design (Technical)" },
  { value: "viewMyProjects", label: "View My Projects" },
  { value: "editCompanyModuleLibrary", label: "Edit Company Module Library" },
  { value: "proposalManage", label: "Proposal: Manage" },
  { value: "proposalCreate", label: "Proposal: Create" },
  { value: "proposalViewOnly", label: "Proposal: View Only" },
  { value: "proposalTemplateManage", label: "Proposal: Template Manage" },
  { value: "removeMediaCategories", label: "Remove Media Categories" },
];
