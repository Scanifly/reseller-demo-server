import moment from "moment";
import Config from "../config/config.service";
import { AddCompanyToScaniflyRequest, AddCompanyToScaniflyResponse, AddDesignToScaniflyRequest, AddDesignToScaniflyResponse, AddProjectToScaniflyRequest, AddProjectToScaniflyResponse, AddUserToScaniflyRequest, AddUserToScaniflyResponse, CreateDesignBody, CreateProjectBody, Get3dEmbedRequest, ResellerType, ScaniflyAuthenticationRequest, ScaniflyAuthenticationResponse, ScaniflyUser, UpdateJwksEndpointRequest } from "./scanifly.types";
import axios, { AxiosResponse } from 'axios';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import { ConfigService } from "../config";
import { AuthService } from "../auth";

class ScaniflyService {
  // eslint-disable-next-line no-use-before-define
  static #instance: ScaniflyService;

  #accessToken: string = '';

  #authService: AuthService;

  #configService: ConfigService;
  
  #refreshToken: string = '';

  #scaniflyCompanyId: string = '';

  #scaniflyEmail: string = '';

  #scaniflyPassword: string = '';

  #scaniflyUrl: string = '';

  private constructor() {
    this.#authService = new AuthService();
    this.#configService = Config.GetInstance();
    this.#scaniflyEmail = this.#configService.getScaniflyEmail();
    this.#scaniflyPassword = this.#configService.getScaniflyPassword();
    this.#scaniflyUrl = this.#configService.getScaniflyEndpoint();
  }

  static GetInstance() {
    if(!ScaniflyService.#instance) {
      ScaniflyService.#instance = new ScaniflyService();
    }
    return ScaniflyService.#instance;
  }

  async getAuthToken() {
    if(this.#accessToken.length) {
      const decoded = jsonwebtoken.decode(this.#accessToken, { complete: true });
      if(!decoded || !decoded.payload || !(decoded.payload! as JwtPayload).exp) {
        throw new Error('Could not decode Scanifly access token');
      }

      const expirationDate = new Date((decoded.payload as JwtPayload).exp! * 1000);

      const remainingSeconds = moment(expirationDate).diff(moment(new Date()), 'seconds');

      if(remainingSeconds <= 120) {
        // Refresh token if less than 2 minutes left 
        const result = await axios.request<ScaniflyAuthenticationResponse, AxiosResponse<ScaniflyAuthenticationResponse>, {}>({
          url: `${this.#scaniflyUrl}/auth/token/refresh`,
          method: 'POST',
          headers: {
            'Authorization-refresh': this.#refreshToken,
          }
        });

        this.#accessToken = result.data.accessToken;
        this.#refreshToken = result.data.refreshToken;
      }

      return this.#accessToken;
    }

    const result = await axios.request<ScaniflyAuthenticationResponse, AxiosResponse<ScaniflyAuthenticationResponse>, ScaniflyAuthenticationRequest>({
      url: `${this.#scaniflyUrl}/auth/login`,
      method: 'POST',
      data: {
        email: this.#scaniflyEmail,
        password: this.#scaniflyPassword,
      }
    });

    this.#accessToken = result.data.accessToken;
    this.#refreshToken = result.data.refreshToken;

    return this.#accessToken;
  }

  /**
   * Add a company to the Scanifly system and then use this ID when adding users to the company.
   * @returns companyId to be saved in your database and used when creating users in the Scanifly system
   */
  async addCompany(data: AddCompanyToScaniflyRequest): Promise<AddCompanyToScaniflyResponse> {
    const result = await axios.request<AddUserToScaniflyResponse, AxiosResponse<AddCompanyToScaniflyResponse>, AddCompanyToScaniflyRequest>({
      url: `${this.#scaniflyUrl}/reseller/company`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${await this.getAuthToken()}`,
      },
      data,
    });
    return result.data;
  }

  /**
   * Add a design to the Scanifly system and then use this ID when rendering the 3D embed
   */
  async addDesign({ scaniflyUserId, email, scaniflyCompanyId, scaniflyProjectId, name }: AddDesignToScaniflyRequest): Promise<AddDesignToScaniflyResponse> {
    // Get an access token for the user we want to "create the design" as
    const scaniflyAccessToken = await this.#authService.getJwt({
      emailInYourSystem: email,
      userIdInScanifly: scaniflyUserId,
      yourScaniflyCompanyId: await this.getScaniflyCompanyId(),
    })

    const result = await axios.request<CreateDesignBody, AxiosResponse<AddDesignToScaniflyResponse>, CreateDesignBody>({
      url: `${this.#scaniflyUrl}/projects/designs`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${scaniflyAccessToken}`,
      },
      data: {
        companyId: scaniflyCompanyId,
        projectId: scaniflyProjectId,
        name,
      },
    });
    return result.data;
  }

  /**
   * Add a project to the Scanifly system and then use this ID when creating designs for the project
   */
  async addProject({ email, scaniflyCompanyId, scaniflyUserId, ...rest }: AddProjectToScaniflyRequest): Promise<AddProjectToScaniflyResponse> {
    // Get an access token for the user we want to "create the project" as
    const scaniflyAccessToken = await this.#authService.getJwt({
      emailInYourSystem: email,
      userIdInScanifly: scaniflyUserId,
      yourScaniflyCompanyId: await this.getScaniflyCompanyId(),
    });

    const result = await axios.request<CreateProjectBody, AxiosResponse<AddProjectToScaniflyResponse>, CreateProjectBody>({
      url: `${this.#scaniflyUrl}/projects`,
      method: 'POST',
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
  }

  /**
   * If a user exists in your system, but not in Scanifly.
   * Call this API to add the user into Scanifly and then save the ID returned to you.
   * @note This requires a company ID to exist in Scanifly to associate the user with.
   * @returns userId to embed into JWT
   */
  async addUser(data: AddUserToScaniflyRequest): Promise<AddUserToScaniflyResponse> {
    const result = await axios.request<AddUserToScaniflyResponse, AxiosResponse<AddUserToScaniflyResponse>, AddUserToScaniflyRequest>({
      url: `${this.#scaniflyUrl}/reseller/user`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${await this.getAuthToken()}`,
      },
      data,
    });
    return result.data;
  }

  /**
   * Can be used with or without authentication
   * @returns URL that can be rendered to display the 3d embed
   */
  async get3dEmbed({ email, scaniflyProjectId, scaniflyDesignId, scaniflyUserId }: Get3dEmbedRequest): Promise<string> {
    const scanifly3dUrl = this.#configService.getScanifly3dUrl();

    let iFrameUrl =  `${scanifly3dUrl}/?ID=${scaniflyProjectId}&did=${scaniflyDesignId}&embed=true`;

    if(email && scaniflyUserId) {
      // Get an access token for the user we want to "create the project" as
      const scaniflyAccessToken = await this.#authService.getJwt({
        emailInYourSystem: email,
        userIdInScanifly: scaniflyUserId,
        yourScaniflyCompanyId: await this.getScaniflyCompanyId(),
      });
      iFrameUrl += `&token=${scaniflyAccessToken}`;
    }

    return iFrameUrl;
  }

  /**
   * Uses the scanifly email and password from your .env to retrieve your company ID
   */
  async getScaniflyCompanyId() {
    if(!this.#scaniflyCompanyId.length) {
      const result = await axios.request<ScaniflyUser, AxiosResponse<ScaniflyUser>>({
        url: `${this.#scaniflyUrl}/users/current`,
        method: 'GET',
        headers: {
        Authorization: `Bearer ${await this.getAuthToken()}`,
        },
      });
      this.#scaniflyCompanyId = result.data.companyId;
    }
    return this.#scaniflyCompanyId;
  }

  /**
   * Tell Scanifly which HTTPS endpoint to pull the JWKS public key from to validate a signed JWT
   */
  async updateJwksEndpoint(data: UpdateJwksEndpointRequest): Promise<ResellerType> {
    const result = await axios.request<ResellerType, AxiosResponse<ResellerType>, UpdateJwksEndpointRequest>({
      url: `${this.#scaniflyUrl}/reseller`,
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${await this.getAuthToken()}`,
      },
      data,
    });
    return result.data;
  }
}

export default ScaniflyService;