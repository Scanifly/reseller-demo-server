enum Position {
  'designer' = 'designer',
  'surveyor' = 'surveyor',
  'salesMarketing' = 'salesMarketing',
  'operationsProjectManager' = 'operationsProjectManager',
  'installer' = 'installer',
  'dronePilot' = 'dronePilot',
}

type AddCompanyToScaniflyRequest = {
  name: string;
  address: {
    line: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  email: string;
};

type AddCompanyToScaniflyResponse = {
  companyId: string;
};

type AddDesignToScaniflyRequest = {
  scaniflyProjectId: string;
  scaniflyCompanyId: string;
  scaniflyUserId: string;
  email: string;
  name: string;
};

type AddDesignToScaniflyResponse = {
  projectId: string;
  companyId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  id: string;
};

type CreateDesignBody = {
  projectId: string;
  companyId: string;
  name: string;
};

type CreateProjectBody = {
  name: string;
  address: string;
  geolocation: {
    latitude: number;
    longitude: number;
  };
  createdBy: string;
  companyId: string;
};

type AddProjectToScaniflyRequest = {
  name: string;
  address: string;
  geolocation: {
    latitude: number;
    longitude: number;
  };
  /**
   * Email of user in your system who owns project
   */
  email: string;
  scaniflyUserId: string;
  scaniflyCompanyId: string;
};

type AddProjectToScaniflyResponse = {
  name: string;
  teammates: string[];
  address: string;
  geolocation: {
    longitude: number;
    latitude: number;
  },
  companyId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  createdById: string;
}

type AddUserToScaniflyRequest = {
  firstName: string;
  lastName: string;
  position: Position;
  phone: string;
  email: string;
  companyId: string;
};

type AddUserToScaniflyResponse = {
  userId: string;
};

type CompanyForReseller = {
  id: string;
  name: string;
};

type Get3dEmbedRequest = {
  scaniflyDesignId: string;
  email?: string;
  scaniflyProjectId: string;
  scaniflyUserId?: string;
};

enum Permission {
  adminTools = "adminTools",
  billing = "billing",
  upload = "upload",
  download = "download",
  mobile = "mobile",
  watt3d = "watt3d",
  removeMediaCategories = "removeMediaCategories",
  simpleDesign = "simpleDesign",
  salesManager = "salesManager",
  simpleDesignTechnical = "simpleDesignTechnical"
}

type ResellerType = {
  id: string;
  authorizedCompanies: CompanyForReseller[];
  company: CompanyForReseller;
  createdAt: string;
  updatedAt: string;
  getJwtVerificationKeyEndpoint: string;
  name: string;
  isActive: boolean;
};

enum Role {
  scaniflyAdmin = "scaniflyAdmin",
  scaniflyBillingAdmin = "scaniflyBillingAdmin",
  designServiceProvider = "designServiceProvider",
  admin = "admin",
  default = "default",
  qa = "qa"
}

type ScaniflyAuthenticationRequest = {
  email: string;
  password: string;
};

type ScaniflyAuthenticationResponse = {
  accessToken: string;
  refreshToken: string;
};

type ScaniflyUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  job?: string;
  phone?: string;
  position: Position;
  positionDescription: string;
  roles: Role[];
  permissions: Permission[];
  foldersAccess: string[] | null;
  companyId: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};

type UpdateJwksEndpointRequest = {
  getJwtVerificationKeyEndpoint: string;
};

enum UserStatus {
  active = "active",
  inactive = "inactive",
  frozen = "frozen"
}

export type {
  AddCompanyToScaniflyRequest,
  AddCompanyToScaniflyResponse,
  AddDesignToScaniflyRequest,
  AddDesignToScaniflyResponse,
  AddProjectToScaniflyRequest,
  AddProjectToScaniflyResponse,
  AddUserToScaniflyRequest,
  AddUserToScaniflyResponse,
  CreateDesignBody,
  CreateProjectBody,
  Get3dEmbedRequest,
  Position,
  ResellerType,
  ScaniflyAuthenticationRequest,
  ScaniflyAuthenticationResponse,
  ScaniflyUser,
  UpdateJwksEndpointRequest,
};