enum Position {
  designer = "designer",
  surveyor = "surveyor",
  salesRep = "salesMarketing",
  operations = "operationsProjectManager",
  fieldTech = "dronePilot",
  owner = "executiveOwnerCEO",
}

enum Permission {
  adminTools = "adminTools",
  billing = "billing",
  upload = "upload",
  watt3d = "watt3d",
  removeMediaCategories = "removeMediaCategories",
  simpleDesign = "simpleDesign",
  salesManager = "salesManager",
  simpleDesignTechnical = "simpleDesignTechnical",
}

enum Role {
  admin = "admin",
  default = "default",
}

enum UserStatus {
  active = "active",
  inactive = "inactive",
  frozen = "frozen",
}

export {
  Position,
  Permission,
  Role,
  UserStatus,
}