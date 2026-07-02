import Config from "../config/config.service";
import {
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
  PurchaseCreditsBody,
  PurchaseCreditsInScaniflyRequest,
  PurchaseCreditsInScaniflyResponse,
  PurchaseCreditsResponse,
  ResellerType,
  ScaniflyUser,
  UpdateJwksEndpointRequest,
} from "./scanifly.types";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ConfigService } from "../config";
import { AuthService } from "../auth";

class ScaniflyService {
  // eslint-disable-next-line no-use-before-define
  static #instance: ScaniflyService;

  #authService: AuthService;

  #configService: ConfigService;

  #scaniflyCompanyId: string = "";

  #scaniflyUrl: string = "";

  private constructor() {
    this.#authService = new AuthService();
    this.#configService = Config.GetInstance();
    this.#scaniflyUrl = this.#configService.getScaniflyEndpoint();
  }

  /**
   * Reseller admin API-key header sent on every /api/v1 reseller request.
   * The key must belong to an admin user of your reseller company.
   */
  #apiKeyHeaders() {
    return { "x-api-token": this.#configService.getApiKey() };
  }

  static GetInstance() {
    if (!ScaniflyService.#instance) {
      ScaniflyService.#instance = new ScaniflyService();
    }
    return ScaniflyService.#instance;
  }

  /**
   * Add a company to the Scanifly system and then use this ID when adding users to the company.
   * @returns companyId to be saved in your database and used when creating users in the Scanifly system
   */
  async addCompany(
    data: AddCompanyToScaniflyRequest,
  ): Promise<AddCompanyToScaniflyResponse> {
    try {
      const result = await axios.request<
        AddUserToScaniflyResponse,
        AxiosResponse<AddCompanyToScaniflyResponse>,
        AddCompanyToScaniflyRequest
      >({
        url: `${this.#scaniflyUrl}/api/v1/reseller/company`,
        method: "POST",
        headers: this.#apiKeyHeaders(),
        data,
      });
      return result.data;
    } catch (err: any) {
      if (err instanceof AxiosError) {
        console.error(
          `HTTP request failed with status code ${err.response?.status} ${err.response?.data?.message}`,
        );
        throw new Error(err.response?.data.message);
      }
      throw err;
    }
  }

  /**
   * Add a design to the Scanifly system and then use this ID when rendering the 3D embed
   */
  async addDesign({
    scaniflyUserId,
    email,
    scaniflyCompanyId,
    scaniflyProjectId,
    name,
  }: AddDesignToScaniflyRequest): Promise<AddDesignToScaniflyResponse> {
    try {
      // Get an access token for the user we want to "create the design" as
      const scaniflyAccessToken = await this.#authService.getJwt({
        emailInYourSystem: email,
        userIdInScanifly: scaniflyUserId,
        yourScaniflyCompanyId: await this.getScaniflyCompanyId(),
      });

      const result = await axios.request<
        CreateDesignBody,
        AxiosResponse<AddDesignToScaniflyResponse>,
        CreateDesignBody
      >({
        url: `${this.#scaniflyUrl}/projects/designs`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${scaniflyAccessToken}`,
        },
        data: {
          companyId: scaniflyCompanyId,
          projectId: scaniflyProjectId,
          name,
          remote: true,
        },
      });
      return result.data;
    } catch (err: any) {
      if (err instanceof AxiosError) {
        console.error(
          `HTTP request failed with status code ${err.response?.status} ${err.response?.data?.message}`,
        );
        throw new Error(
          err.response?.data.message ?? err.response?.statusText ?? err.message,
        );
      }
      throw err;
    }
  }

  /**
   * Add a library of modules to the user's Scanifly module library to be used in the design space
   */
  async addModuleLibrary({
    scaniflyUserId,
    email,
    modules,
  }: AddModuleLibraryToScaniflyRequest): Promise<AddModuleLibraryToScaniflyResponse> {
    try {
      // Get an access token for the user we want to "create the design" as
      const scaniflyAccessToken = await this.#authService.getJwt({
        emailInYourSystem: email,
        userIdInScanifly: scaniflyUserId,
        yourScaniflyCompanyId: await this.getScaniflyCompanyId(),
      });

      let userId = scaniflyUserId;
      if (!userId) {
        userId = await this.getScaniflyUserId(scaniflyAccessToken);
      }

      const result = await axios.request<
        CreateModuleLibraryBody,
        AxiosResponse<AddModuleLibraryToScaniflyResponse>,
        CreateModuleLibraryBody
      >({
        url: `${this.#scaniflyUrl}/module-library`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${scaniflyAccessToken}`,
        },
        data: {
          userId,
          modules,
        },
      });
      return result.data;
    } catch (err: any) {
      if (err instanceof AxiosError) {
        console.error(
          `HTTP request failed with status code ${err.response?.status} ${err.response?.data?.message}`,
        );
        throw new Error(
          err.response?.data.message ?? err.response?.statusText ?? err.message,
        );
      }
      throw err;
    }
  }

  /**
   * Add a project to the Scanifly system and then use this ID when creating designs for the project
   */
  async addProject({
    email,
    scaniflyCompanyId,
    scaniflyUserId,
    ...rest
  }: AddProjectToScaniflyRequest): Promise<AddProjectToScaniflyResponse> {
    try {
      // Get an access token for the user we want to "create the project" as
      const scaniflyAccessToken = await this.#authService.getJwt({
        emailInYourSystem: email,
        userIdInScanifly: scaniflyUserId,
        yourScaniflyCompanyId: await this.getScaniflyCompanyId(),
      });

      const result = await axios.request<
        CreateProjectBody,
        AxiosResponse<AddProjectToScaniflyResponse>,
        CreateProjectBody
      >({
        url: `${this.#scaniflyUrl}/projects`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${scaniflyAccessToken}`,
        },
        data: {
          ...rest,
          companyId: scaniflyCompanyId,
          createdBy: email,
        },
      });
      return result.data;
    } catch (err: any) {
      if (err instanceof AxiosError) {
        console.error(
          `HTTP request failed with status code ${err.response?.status} ${err.response?.data?.message}`,
        );
        throw new Error(
          err.response?.data.message ?? err.response?.statusText ?? err.message,
        );
      }
      throw err;
    }
  }

  /**
   * If a user exists in your system, but not in Scanifly.
   * Call this API to add the user into Scanifly and then save the ID returned to you.
   * @note This requires a company ID to exist in Scanifly to associate the user with.
   * @returns userId to embed into JWT
   */
  async addUser(
    data: AddUserToScaniflyRequest,
  ): Promise<AddUserToScaniflyResponse> {
    try {
      const result = await axios.request<
        AddUserToScaniflyResponse,
        AxiosResponse<AddUserToScaniflyResponse>,
        AddUserToScaniflyRequest
      >({
        url: `${this.#scaniflyUrl}/api/v1/reseller/user`,
        method: "POST",
        headers: this.#apiKeyHeaders(),
        data,
      });
      return result.data;
    } catch (err: any) {
      if (err instanceof AxiosError) {
        console.error(
          `HTTP request failed with status code ${err.response?.status} ${err.response?.data?.message}`,
        );
        throw new Error(
          err.response?.data.message ?? err.response?.statusText ?? err.message,
        );
      }
      throw err;
    }
  }

  /**
   * Can be used with or without authentication
   * @returns URL that can be rendered to display the 3d embed
   */
  async get3dEmbed({
    email,
    scaniflyProjectId,
    scaniflyDesignId,
    scaniflyUserId,
  }: Get3dEmbedRequest): Promise<string> {
    const scanifly3dUrl = this.#configService.getScanifly3dUrl();

    let iFrameUrl = `${scanifly3dUrl}/?ID=${scaniflyProjectId}&did=${scaniflyDesignId}`;

    if (email) {
      // Get an access token for the user we want to "create the project" as
      const scaniflyAccessToken = await this.#authService.getJwt({
        emailInYourSystem: email,
        userIdInScanifly: scaniflyUserId,
        yourScaniflyCompanyId: await this.getScaniflyCompanyId(),
      });
      iFrameUrl += `&token=${scaniflyAccessToken}`;
    } else {
      iFrameUrl += `&embed=true`;
    }

    return iFrameUrl;
  }

  /**
   * Uses the scanifly email and password from your .env to retrieve your company ID
   */
  async getScaniflyCompanyId() {
    if (!this.#scaniflyCompanyId.length) {
      const result = await axios.request<
        ScaniflyUser,
        AxiosResponse<ScaniflyUser>
      >({
        url: `${this.#scaniflyUrl}/api/v1/users/current`,
        method: "GET",
        headers: this.#apiKeyHeaders(),
      });
      this.#scaniflyCompanyId = result.data.companyId;
    }
    return this.#scaniflyCompanyId;
  }

  /**
   * Uses the Scanifly access token passed in to get the users ID
   */
  async getScaniflyUserId(scaniflyAccessToken: string) {
    const result = await axios.request<
      ScaniflyUser,
      AxiosResponse<ScaniflyUser>
    >({
      url: `${this.#scaniflyUrl}/users/current`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${scaniflyAccessToken}`,
      },
    });
    return result.data.id;
  }

  /**
   * If you want to give a company/user the ability to spend nearmap credits
   * Call this API to add credits to the company in Scanifly
   * @note This requires a company ID to exist in Scanifly to purchase the credits for
   * @returns updated balance
   */
  async purchaseCredits(
    {
      scaniflyCompanyId,
      ...rest
    }: PurchaseCreditsInScaniflyRequest,
  ): Promise<PurchaseCreditsInScaniflyResponse> {
    try {
      const result = await axios.request<
        PurchaseCreditsResponse,
        AxiosResponse<PurchaseCreditsResponse>,
        PurchaseCreditsBody
      >({
        url: `${this.#scaniflyUrl}/api/v1/reseller/subscription/credits`,
        method: "POST",
        headers: this.#apiKeyHeaders(),
        data: {
          ...rest,
          companyId: scaniflyCompanyId,
        },
      });
      return {
        totalBalance: result.data.amount,
      }
    } catch (err: any) {
      if (err instanceof AxiosError) {
        console.error(
          `HTTP request failed with status code ${err.response?.status} ${err.response?.data?.message}`,
        );
        throw new Error(
          err.response?.data.message ?? err.response?.statusText ?? err.message,
        );
      }
      throw err;
    }
  }

  /**
   * Tell Scanifly which HTTPS endpoint to pull the JWKS public key from to validate a signed JWT
   */
  async updateJwksEndpoint(
    data: UpdateJwksEndpointRequest,
  ): Promise<ResellerType> {
    try {
      const result = await axios.request<
        ResellerType,
        AxiosResponse<ResellerType>,
        UpdateJwksEndpointRequest
      >({
        url: `${this.#scaniflyUrl}/api/v1/reseller`,
        method: "PATCH",
        headers: this.#apiKeyHeaders(),
        data,
      });
      return result.data;
    } catch (err: any) {
      if (err instanceof AxiosError) {
        console.error(
          `HTTP request failed with status code ${err.response?.status} ${err.response?.data?.message}`,
        );
        throw new Error(
          err.response?.data.message ?? err.response?.statusText ?? err.message,
        );
      }
      throw err;
    }
  }
}

export default ScaniflyService;
