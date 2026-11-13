import { Permission, Position, Role, UserStatus } from "./scanifly.enums";

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
  /**
   * Only required if the email in your system does not match the user's email in Scanifly
   */
  scaniflyUserId?: string;
  email: string;
  name: string;
};

type AddDesignToScaniflyResponse = ScaniflyDesign;

type CreateDesignBody = {
  projectId: string;
  name: string;
  remote: boolean;
};

type CreateModuleLibraryBody = {
  userId: string;
  modules: AddModuleLibraryToScaniflyRequest["modules"];
};

type CreateProjectBody = {
  name: string;
  address: string;
  geolocation?: {
    latitude: number;
    longitude: number;
  };
};

type AddModuleLibraryToScaniflyRequest = {
  /**
   * The key is the name of the module
   */
  modules: { [key: string]: ScaniflyModule };
  /**
   * Email of user in your system
   */
  email: string;
  /**
   * Only required if the email in your system does not match the user's email in Scanifly
   */
  scaniflyUserId?: string;
};

type AddModuleLibraryToScaniflyResponse = {
  id: string;
  companyId?: string;
  userId: string;
  modules: { [key: string]: ScaniflyModule };
  createdAt?: string;
  updatedAt?: string;
};

type AddProjectToScaniflyRequest = {
  name: string;
  address: string;
  /**
   * Optional. When left out, Scanifly geocodes `address`.
   */
  geolocation?: {
    latitude: number;
    longitude: number;
  };
  /**
   * Email of user in your system who owns project.
   * The project is created in this user's Scanifly company.
   */
  email: string;
  /**
   * Only required if the email in your system does not match the user's email in Scanifly
   */
  scaniflyUserId?: string;
};

type AddProjectToScaniflyResponse = ScaniflyProject;

type AddUserToScaniflyRequest = {
  firstName: string;
  lastName: string;
  /**
   * This will control which permissions the user has in the Scanifly ecosystem.
   * See the README section "Permissions and Roles"
   */
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
  email: string;
  scaniflyProjectId: string;
  /**
   * Only required if the email in your system does not match the user's email in Scanifly
   */
  scaniflyUserId?: string;
};

type ListDesignsInScaniflyRequest = {
  scaniflyProjectId: string;
  /**
   * Email of user in your system to list the designs as
   */
  email: string;
  /**
   * Only required if the email in your system does not match the user's email in Scanifly
   */
  scaniflyUserId?: string;
};

type ListProjectsInScaniflyRequest = {
  /**
   * Email of user in your system to list the projects as
   */
  email: string;
  /**
   * Only required if the email in your system does not match the user's email in Scanifly
   */
  scaniflyUserId?: string;
  /**
   * 1-based page number
   */
  pageIndex?: number;
  /**
   * Projects per page, at most 150
   */
  size?: number;
};

type ListProjectsInScaniflyResponse = {
  items: ScaniflyProject[];
  totalCount: number;
  pageIndex?: number;
};

type GetDesignSettingsEmbedRequest = {
  email: string;
  /**
   * Only required if the email in your system does not match the user's email in Scanifly
   */
  scaniflyUserId?: string;
};

type GetDesignSettingsEmbedResponse = {
  /**
   * Set this as the iframe `src`. It carries no secret.
   */
  embedUrl: string;
  /**
   * Post this to the iframe in a `scanifly:embed-auth` message once the iframe posts
   * `scanifly:embed-ready`. Never put it in the URL.
   */
  token: string;
  /**
   * When `token` stops being accepted (ISO 8601)
   */
  expiresAt: string;
};

type PurchaseCreditsBody = {
  companyId: string;
  creditCount: number;
};

type PurchaseCreditsResponse = {
  amount: number;
  transactionSuccessful: boolean;
};

type PurchaseCreditsInScaniflyRequest = {
  creditCount: number;
  scaniflyCompanyId: string;
};

type PurchaseCreditsInScaniflyResponse = {
  totalBalance: number;
};

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

type ScaniflyCompany = {
  id: string;
  name: string;
};

/**
 * A design as returned by the Scanifly `/api/v1/designs` routes
 */
type ScaniflyDesign = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  /**
   * Link to the design in the Scanifly portal
   */
  designUrl?: string;
  /**
   * kW
   */
  systemSize?: number;
  /**
   * kWh
   */
  annualProduction?: number;
  /**
   * Annual production over the project's annual consumption
   */
  offset?: number;
};

type ScaniflyModule = {
  id: string;
  moduleName: string;
  model: string;
  manufacturer: string;
  wattage: number;
  moduleWidth: number;
  moduleHeight: number;
  units: number;
  /**
   * Mechanical type of the module
   */
  moduleMechType: string;
  textureMap: string;
  /**
   * Voltage temperature units
   * Example: c
   */
  unitsVoltageTemp: string;
  /**
   * Current temperature units
   * Example: c
   */
  unitsCurrTemp: string;

  /**
   * Power tolerance
   * Example: 0/3
   */
  powTol: string;
  /**
   * Rated voltage
   * Example: 46.5
   */
  ratVol?: string;
  /**
   * Rated current
   * Example: 9.77
   */
  ratCurr?: string;
  /**
   * Open circuit voltage
   * Example: 42.7
   */
  opnCirc?: string;
  /**
   * Maximum series fuse rating
   * Example: 20
   */
  maxSeriesFuse?: string;
  /**
   * Short circuit current
   * Example: 10.79
   */
  shrtCrc?: string;
  /**
   * Power temperature coefficient
   * Example: -0.3
   */
  powTemp?: string;
  /**
   * Coltage temperature coefficient
   * Example: -0.24
   */
  voltTemp?: string;
  /**
   * Current temperature coefficient
   * Example: 0.04
   */
  currTemp?: string;
  /**
   * Number of cells in the module
   */
  cell_quan?: number;
  /**
   * Weight of the module in pounds
   * Example: 40.79
   */
  weight?: number;
  /**
   * Maximum wind load in Pascals
   * Example: 3600
   */
  max_load_wind?: number;
  /**
   * Maximum snow load in Pascals
   * Example: 2600
   */
  max_load_snow?: number;
  notes?: string;
};

/**
 * A project as returned by the Scanifly `/api/v1/projects` routes
 */
type ScaniflyProject = {
  id: string;
  companyId: string;
  name: string;
  address: string;
  status?: string;
  geolocation: {
    longitude: number;
    latitude: number;
  };
  teammates?: string[];
  createdAt: string;
  updatedAt: string;
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

export type {
  AddCompanyToScaniflyRequest,
  AddCompanyToScaniflyResponse,
  AddDesignToScaniflyRequest,
  AddDesignToScaniflyResponse,
  AddModuleLibraryToScaniflyRequest,
  AddModuleLibraryToScaniflyResponse,
  AddProjectToScaniflyRequest,
  AddProjectToScaniflyResponse,
  AddUserToScaniflyRequest,
  AddUserToScaniflyResponse,
  CreateDesignBody,
  CreateModuleLibraryBody,
  CreateProjectBody,
  Get3dEmbedRequest,
  GetDesignSettingsEmbedRequest,
  GetDesignSettingsEmbedResponse,
  ListDesignsInScaniflyRequest,
  ListProjectsInScaniflyRequest,
  ListProjectsInScaniflyResponse,
  PurchaseCreditsBody,
  PurchaseCreditsResponse,
  PurchaseCreditsInScaniflyRequest,
  PurchaseCreditsInScaniflyResponse,
  ResellerType,
  ScaniflyCompany,
  ScaniflyDesign,
  ScaniflyProject,
  ScaniflyUser,
  UpdateJwksEndpointRequest,
};
