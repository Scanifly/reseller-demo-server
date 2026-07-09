enum Position {
  designer = "designer",
  surveyor = "surveyor",
  financeProcurement = "financeProcurement",
  salesMarketing = "salesMarketing",
  operationsProjectManager = "operationsProjectManager",
  installer = "installer",
  executiveOwnerCEO = "executiveOwnerCEO",
  thirdPartyEngineer = "thirdPartyEngineer",
  dronePilot = "dronePilot",
  maintenanceTech = "maintenanceTech",
  guest = "guest",
}

/**
 * Permissions a reseller is allowed to assign to a user.
 * Mirrors the allow-list enforced by Scanifly's `/api/v1/reseller/user` endpoint,
 * which accepts every permission except the deprecated `salesManager` and `mobile`.
 */
enum Permission {
  adminTools = "adminTools",
  billing = "billing",
  /**
   * The value is historically named `upload` but grants "create new projects".
   */
  createNewProjects = "upload",
  download = "download",
  uploadMedia = "uploadMedia",
  watt3d = "watt3d",
  simpleDesign = "simpleDesign",
  simpleDesignTechnical = "simpleDesignTechnical",
  viewMyProjects = "viewMyProjects",
  editCompanyModuleLibrary = "editCompanyModuleLibrary",
  proposalManage = "proposalManage",
  proposalCreate = "proposalCreate",
  proposalViewOnly = "proposalViewOnly",
  proposalTemplateManage = "proposalTemplateManage",
  removeMediaCategories = "removeMediaCategories",
}

/**
 * Roles a reseller is allowed to assign to a user.
 * Scanifly's `/api/v1/reseller/user` endpoint only permits `admin` and `default`.
 */
enum Role {
  admin = "admin",
  default = "default",
}

enum UserStatus {
  active = "active",
  inactive = "inactive",
  frozen = "frozen",
}

export { Position, Permission, Role, UserStatus };
