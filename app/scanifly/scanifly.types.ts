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
  scaniflyCompanyId: string;
  /**
   * Only required if the email in your system does not match the user's email in Scanifly
   */
  scaniflyUserId?: string;
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
  remote: boolean;
};

type CreateModuleLibraryBody = {
  userId: string;
  modules: AddModuleLibraryToScaniflyRequest["modules"];
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
  geolocation: {
    latitude: number;
    longitude: number;
  };
  /**
   * Email of user in your system who owns project
   */
  email: string;
  /**
   * Only required if the email in your system does not match the user's email in Scanifly
   */
  scaniflyUserId?: string;
  scaniflyCompanyId: string;
};

type AddProjectToScaniflyResponse = {
  name: string;
  teammates: string[];
  address: string;
  geolocation: {
    longitude: number;
    latitude: number;
  };
  companyId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  createdById: string;
};

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
  /**
   * Optional. Overrides the roles derived from `position`.
   * Only `admin` and `default` may be assigned by a reseller.
   * Omit to default to `[default]`.
   */
  roles?: Role[];
  /**
   * Optional. Overrides the permissions derived from `position`.
   * Omit to inherit the position's default permissions.
   */
  permissions?: Permission[];
};

type AddUserToScaniflyResponse = {
  userId: string;
};

type CompanyForReseller = {
  id: string;
  name: string;
};

/**
 * The companies this reseller may act on (its own company plus any that have
 * authorized it), returned to the client to populate the company dropdown.
 */
type ListResellerCompaniesResponse = CompanyForReseller[];

/**
 * Shape of a single page from Scanifly's paginated
 * `GET /api/v1/reseller/companies` endpoint.
 */
type PaginatedResellerCompaniesResponse = {
  items: CompanyForReseller[];
  totalCount: number;
  pageIndex?: number;
};

/**
 * Details Scanifly uses when it has to create the user on the fly the first time a
 * reseller-signed JWT names an email it does not recognise ("optimistic user creation").
 *
 * Optimistic creation only happens when the target company has granted your reseller the
 * `autoCreateUsers` permission, and it needs `scaniflyCompanyId` alongside these fields to
 * know which company to create the user in. Every field below is optional and falls back
 * to a Scanifly default.
 *
 * None of these values update a user who already exists — they are only read at creation.
 */
type OptimisticUserClaims = {
  /**
   * Defaults to "not provided"
   */
  firstName?: string;
  /**
   * Defaults to "not provided"
   */
  lastName?: string;
  /**
   * Defaults to "1234567890"
   */
  phone?: string;
  /**
   * Recorded on the created user. Defaults to `designer`, as does any value Scanifly does
   * not recognise.
   *
   * @note Unlike `POST /scanifly/user`, this does NOT drive the user's permissions.
   * An optimistically created user always gets the `default` role and the
   * `simpleDesignTechnical` permission, whatever position is sent.
   */
  position?: Position;
};

type Get3dEmbedRequest = {
  scaniflyDesignId: string;
  email: string;
  scaniflyProjectId: string;
  /**
   * Only required if the email in your system does not match the user's email in Scanifly
   */
  scaniflyUserId?: string;
  /**
   * The Scanifly company the user being authenticated belongs to.
   * Required for Scanifly to create the user on the fly if they do not exist yet
   * (see `OptimisticUserClaims`). Harmless when the user already exists.
   */
  scaniflyCompanyId?: string;
  /**
   * Details used only if Scanifly has to create the user on the fly.
   * Ignored when the user already exists.
   */
  newUser?: OptimisticUserClaims;
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
  CompanyForReseller,
  ListResellerCompaniesResponse,
  PaginatedResellerCompaniesResponse,
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
  OptimisticUserClaims,
  PurchaseCreditsBody,
  PurchaseCreditsResponse,
  PurchaseCreditsInScaniflyRequest,
  PurchaseCreditsInScaniflyResponse,
  ResellerType,
  ScaniflyUser,
  UpdateJwksEndpointRequest,
};
