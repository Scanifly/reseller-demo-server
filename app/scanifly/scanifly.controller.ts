import {
  Body,
  Controller,
  Patch,
  Post,
  Res,
  Route,
  SuccessResponse,
  Tags,
  TsoaResponse,
} from "tsoa";
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
  Get3dEmbedRequest,
  PurchaseCreditsInScaniflyRequest,
  PurchaseCreditsInScaniflyResponse,
  ResellerType,
  UpdateJwksEndpointRequest,
} from "./scanifly.types";
import ScaniflyService from "./scanifly.service";

@Route("scanifly")
@Tags("Scanifly")
class ScaniflyController extends Controller {
  #scaniflyService: ScaniflyService;

  constructor() {
    super();
    this.#scaniflyService = ScaniflyService.GetInstance();
  }

  /**
   * Retrieve a URL to the Scanifly 3D embed to render in an iFrame.
   * Passing in the `email` and `scaniflyUserId` will allow the user to be authenticated into Scanifly.
   * Assuming that the user was created by your reseller or has authorized your reseller
   */
  @SuccessResponse("201", "Created")
  @Post("/3dUrl")
  public async get3dEmbed(
    @Body() requestBody: Get3dEmbedRequest,
    @Res() validationErrorResponse: TsoaResponse<400, { message: string }>,
  ): Promise<string> {
    try {
      const result = await this.#scaniflyService.get3dEmbed(requestBody);
      return result;
    } catch (err: any) {
      console.error(err);
      return validationErrorResponse(400, { message: err.message });
    }
  }

  /**
   * Add a company to the Scanifly system and then use this ID when adding users to the company.
   * @returns companyId to be saved in your database and used when creating users/projects/designs in the Scanifly system
   */
  @SuccessResponse("201", "Created")
  @Post("/company")
  public async addCompanyToScanifly(
    @Body() requestBody: AddCompanyToScaniflyRequest,
    @Res() validationErrorResponse: TsoaResponse<400, { message: string }>,
  ): Promise<AddCompanyToScaniflyResponse> {
    try {
      const result = await this.#scaniflyService.addCompany(requestBody);
      return result;
    } catch (err: any) {
      console.error(err);
      return validationErrorResponse(400, { message: err.message });
    }
  }

  /**
   * Call this API to add a design into Scanifly and then use this ID when rendering the 3D embed
   * @note This requires a project ID to exist in Scanifly to associate the design with.
   */
  @SuccessResponse("201", "Created")
  @Post("/design")
  public async addDesignToScanifly(
    @Body() requestBody: AddDesignToScaniflyRequest,
    @Res() validationErrorResponse: TsoaResponse<400, { message: string }>,
  ): Promise<AddDesignToScaniflyResponse> {
    try {
      const result = await this.#scaniflyService.addDesign(requestBody);
      return result;
    } catch (err: any) {
      console.error(err);
      return validationErrorResponse(400, { message: err.message });
    }
  }

  /**
   * Call this API to add a module library into Scanifly for users to interact with on the design canvas
   */
  @SuccessResponse("201", "Created")
  @Post("/module-library")
  public async addModuleLibraryToScanifly(
    @Body() requestBody: AddModuleLibraryToScaniflyRequest,
    @Res() validationErrorResponse: TsoaResponse<400, { message: string }>,
  ): Promise<AddModuleLibraryToScaniflyResponse> {
    try {
      const result = await this.#scaniflyService.addModuleLibrary(requestBody);
      return result;
    } catch (err: any) {
      console.error(err);
      return validationErrorResponse(400, { message: err.message });
    }
  }

  /**
   * Call this API to add a project into Scanifly and then save the ID returned to you to associate designs with.
   * @note This requires a company ID to exist in Scanifly to associate the project with.
   */
  @SuccessResponse("201", "Created")
  @Post("/project")
  public async addProjectToScanifly(
    @Body() requestBody: AddProjectToScaniflyRequest,
    @Res() validationErrorResponse: TsoaResponse<400, { message: string }>,
  ): Promise<AddProjectToScaniflyResponse> {
    try {
      const result = await this.#scaniflyService.addProject(requestBody);
      return result;
    } catch (err: any) {
      console.error(err);
      return validationErrorResponse(400, { message: err.message });
    }
  }

  /**
   * If you want to give a company/user the ability to spend nearmap credits
   * Call this API to add credits to the company in Scanifly
   * @note This requires a company ID to exist in Scanifly to purchase the credits for
   * @returns updated balance
   */
  @SuccessResponse("201", "Created")
  @Post("/credit")
  public async purchaseCreditsInScanifly(
    @Body() requestBody: PurchaseCreditsInScaniflyRequest,
    @Res() validationErrorResponse: TsoaResponse<400, { message: string }>,
  ): Promise<PurchaseCreditsInScaniflyResponse> {
    try {
      const result = await this.#scaniflyService.purchaseCredits(requestBody);
      return result;
    } catch (err: any) {
      console.error(err);
      return validationErrorResponse(400, { message: err.message });
    }
  }

  /**
   * If a user exists in your system, but not in Scanifly.
   * Call this API to add the user into Scanifly and then save the ID returned to you.
   * @note This requires a company ID to exist in Scanifly to associate the user with.
   * @returns userId to embed into JWT
   */
  @SuccessResponse("201", "Created")
  @Post("/user")
  public async addUserToScanifly(
    @Body() requestBody: AddUserToScaniflyRequest,
    @Res() validationErrorResponse: TsoaResponse<400, { message: string }>,
  ): Promise<AddUserToScaniflyResponse> {
    try {
      const result = await this.#scaniflyService.addUser(requestBody);
      return result;
    } catch (err: any) {
      console.error(err);
      return validationErrorResponse(400, { message: err.message });
    }
  }

  /**
   * Tell Scanifly which HTTPS endpoint to pull the JWKS public key from to validate a signed JWT
   */
  @SuccessResponse("200", "Updated")
  @Patch("/reseller")
  public async updateJwksEndpoint(
    @Body() requestBody: UpdateJwksEndpointRequest,
    @Res() validationErrorResponse: TsoaResponse<400, { message: string }>,
  ): Promise<ResellerType> {
    try {
      const result =
        await this.#scaniflyService.updateJwksEndpoint(requestBody);
      return result;
    } catch (err: any) {
      console.error(err);
      return validationErrorResponse(400, { message: err.message });
    }
  }
}

export { ScaniflyController };
