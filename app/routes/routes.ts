/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from "@tsoa/runtime";
import { fetchMiddlewares, ExpressTemplateService } from "@tsoa/runtime";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ScaniflyController } from "./../scanifly/scanifly.controller";
import type {
  Request as ExRequest,
  Response as ExResponse,
  RequestHandler,
  Router,
} from "express";

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
  Get3dEmbedRequest: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        scaniflyUserId: { dataType: "string" },
        scaniflyProjectId: { dataType: "string", required: true },
        email: { dataType: "string", required: true },
        scaniflyDesignId: { dataType: "string", required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  AddCompanyToScaniflyResponse: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: { companyId: { dataType: "string", required: true } },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  AddCompanyToScaniflyRequest: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        email: { dataType: "string", required: true },
        address: {
          dataType: "nestedObjectLiteral",
          nestedProperties: {
            country: { dataType: "string", required: true },
            zip: { dataType: "string", required: true },
            state: { dataType: "string", required: true },
            city: { dataType: "string", required: true },
            line: { dataType: "string", required: true },
          },
          required: true,
        },
        name: { dataType: "string", required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  AddDesignToScaniflyResponse: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        id: { dataType: "string", required: true },
        updatedAt: { dataType: "string", required: true },
        createdAt: { dataType: "string", required: true },
        name: { dataType: "string", required: true },
        companyId: { dataType: "string", required: true },
        projectId: { dataType: "string", required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  AddDesignToScaniflyRequest: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        name: { dataType: "string", required: true },
        email: { dataType: "string", required: true },
        scaniflyUserId: { dataType: "string" },
        scaniflyCompanyId: { dataType: "string", required: true },
        scaniflyProjectId: { dataType: "string", required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  ScaniflyModule: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        notes: { dataType: "string" },
        max_load_snow: { dataType: "double" },
        max_load_wind: { dataType: "double" },
        weight: { dataType: "double" },
        cell_quan: { dataType: "double" },
        currTemp: { dataType: "string" },
        voltTemp: { dataType: "string" },
        powTemp: { dataType: "string" },
        shrtCrc: { dataType: "string" },
        maxSeriesFuse: { dataType: "string" },
        opnCirc: { dataType: "string" },
        ratCurr: { dataType: "string" },
        ratVol: { dataType: "string" },
        powTol: { dataType: "string", required: true },
        unitsCurrTemp: { dataType: "string", required: true },
        unitsVoltageTemp: { dataType: "string", required: true },
        textureMap: { dataType: "string", required: true },
        moduleMechType: { dataType: "string", required: true },
        units: { dataType: "double", required: true },
        moduleHeight: { dataType: "double", required: true },
        moduleWidth: { dataType: "double", required: true },
        wattage: { dataType: "double", required: true },
        manufacturer: { dataType: "string", required: true },
        model: { dataType: "string", required: true },
        moduleName: { dataType: "string", required: true },
        id: { dataType: "string", required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  AddModuleLibraryToScaniflyResponse: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        updatedAt: { dataType: "string" },
        createdAt: { dataType: "string" },
        modules: {
          dataType: "nestedObjectLiteral",
          nestedProperties: {},
          additionalProperties: { ref: "ScaniflyModule" },
          required: true,
        },
        userId: { dataType: "string", required: true },
        companyId: { dataType: "string" },
        id: { dataType: "string", required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  AddModuleLibraryToScaniflyRequest: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        scaniflyUserId: { dataType: "string" },
        email: { dataType: "string", required: true },
        modules: {
          dataType: "nestedObjectLiteral",
          nestedProperties: {},
          additionalProperties: { ref: "ScaniflyModule" },
          required: true,
        },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  AddProjectToScaniflyResponse: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        createdById: { dataType: "string", required: true },
        id: { dataType: "string", required: true },
        updatedAt: { dataType: "string", required: true },
        createdAt: { dataType: "string", required: true },
        createdBy: { dataType: "string", required: true },
        companyId: { dataType: "string", required: true },
        geolocation: {
          dataType: "nestedObjectLiteral",
          nestedProperties: {
            latitude: { dataType: "double", required: true },
            longitude: { dataType: "double", required: true },
          },
          required: true,
        },
        address: { dataType: "string", required: true },
        teammates: {
          dataType: "array",
          array: { dataType: "string" },
          required: true,
        },
        name: { dataType: "string", required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  AddProjectToScaniflyRequest: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        scaniflyCompanyId: { dataType: "string", required: true },
        scaniflyUserId: { dataType: "string" },
        email: { dataType: "string", required: true },
        geolocation: {
          dataType: "nestedObjectLiteral",
          nestedProperties: {
            longitude: { dataType: "double", required: true },
            latitude: { dataType: "double", required: true },
          },
          required: true,
        },
        address: { dataType: "string", required: true },
        name: { dataType: "string", required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  AddUserToScaniflyResponse: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: { userId: { dataType: "string", required: true } },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  Position: {
    dataType: "refEnum",
    enums: [
      "designer",
      "surveyor",
      "salesMarketing",
      "operationsProjectManager",
      "installer",
      "dronePilot",
      "maintenanceTech",
      "executiveOwnerCEO",
    ],
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  AddUserToScaniflyRequest: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        companyId: { dataType: "string", required: true },
        email: { dataType: "string", required: true },
        phone: { dataType: "string", required: true },
        position: { ref: "Position", required: true },
        lastName: { dataType: "string", required: true },
        firstName: { dataType: "string", required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  CompanyForReseller: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        name: { dataType: "string", required: true },
        id: { dataType: "string", required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  ResellerType: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        isActive: { dataType: "boolean", required: true },
        name: { dataType: "string", required: true },
        getJwtVerificationKeyEndpoint: { dataType: "string", required: true },
        updatedAt: { dataType: "string", required: true },
        createdAt: { dataType: "string", required: true },
        company: { ref: "CompanyForReseller", required: true },
        authorizedCompanies: {
          dataType: "array",
          array: { dataType: "refAlias", ref: "CompanyForReseller" },
          required: true,
        },
        id: { dataType: "string", required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  UpdateJwksEndpointRequest: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        getJwtVerificationKeyEndpoint: { dataType: "string", required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {
  noImplicitAdditionalProperties: "throw-on-extras",
  bodyCoercion: true,
});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
  // ###########################################################################################################
  //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
  //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
  // ###########################################################################################################

  const argsScaniflyController_get3dEmbed: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    requestBody: {
      in: "body",
      name: "requestBody",
      required: true,
      ref: "Get3dEmbedRequest",
    },
    validationErrorResponse: {
      in: "res",
      name: "400",
      required: true,
      dataType: "nestedObjectLiteral",
      nestedProperties: { message: { dataType: "string", required: true } },
    },
  };
  app.post(
    "/scanifly/3dUrl",
    ...fetchMiddlewares<RequestHandler>(ScaniflyController),
    ...fetchMiddlewares<RequestHandler>(
      ScaniflyController.prototype.get3dEmbed,
    ),

    async function ScaniflyController_get3dEmbed(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsScaniflyController_get3dEmbed,
          request,
          response,
        });

        const controller = new ScaniflyController();

        await templateService.apiHandler({
          methodName: "get3dEmbed",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsScaniflyController_addCompanyToScanifly: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    requestBody: {
      in: "body",
      name: "requestBody",
      required: true,
      ref: "AddCompanyToScaniflyRequest",
    },
    validationErrorResponse: {
      in: "res",
      name: "400",
      required: true,
      dataType: "nestedObjectLiteral",
      nestedProperties: { message: { dataType: "string", required: true } },
    },
  };
  app.post(
    "/scanifly/company",
    ...fetchMiddlewares<RequestHandler>(ScaniflyController),
    ...fetchMiddlewares<RequestHandler>(
      ScaniflyController.prototype.addCompanyToScanifly,
    ),

    async function ScaniflyController_addCompanyToScanifly(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsScaniflyController_addCompanyToScanifly,
          request,
          response,
        });

        const controller = new ScaniflyController();

        await templateService.apiHandler({
          methodName: "addCompanyToScanifly",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsScaniflyController_addDesignToScanifly: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    requestBody: {
      in: "body",
      name: "requestBody",
      required: true,
      ref: "AddDesignToScaniflyRequest",
    },
    validationErrorResponse: {
      in: "res",
      name: "400",
      required: true,
      dataType: "nestedObjectLiteral",
      nestedProperties: { message: { dataType: "string", required: true } },
    },
  };
  app.post(
    "/scanifly/design",
    ...fetchMiddlewares<RequestHandler>(ScaniflyController),
    ...fetchMiddlewares<RequestHandler>(
      ScaniflyController.prototype.addDesignToScanifly,
    ),

    async function ScaniflyController_addDesignToScanifly(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsScaniflyController_addDesignToScanifly,
          request,
          response,
        });

        const controller = new ScaniflyController();

        await templateService.apiHandler({
          methodName: "addDesignToScanifly",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsScaniflyController_addModuleLibraryToScanifly: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    requestBody: {
      in: "body",
      name: "requestBody",
      required: true,
      ref: "AddModuleLibraryToScaniflyRequest",
    },
    validationErrorResponse: {
      in: "res",
      name: "400",
      required: true,
      dataType: "nestedObjectLiteral",
      nestedProperties: { message: { dataType: "string", required: true } },
    },
  };
  app.post(
    "/scanifly/module-library",
    ...fetchMiddlewares<RequestHandler>(ScaniflyController),
    ...fetchMiddlewares<RequestHandler>(
      ScaniflyController.prototype.addModuleLibraryToScanifly,
    ),

    async function ScaniflyController_addModuleLibraryToScanifly(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsScaniflyController_addModuleLibraryToScanifly,
          request,
          response,
        });

        const controller = new ScaniflyController();

        await templateService.apiHandler({
          methodName: "addModuleLibraryToScanifly",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsScaniflyController_addProjectToScanifly: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    requestBody: {
      in: "body",
      name: "requestBody",
      required: true,
      ref: "AddProjectToScaniflyRequest",
    },
    validationErrorResponse: {
      in: "res",
      name: "400",
      required: true,
      dataType: "nestedObjectLiteral",
      nestedProperties: { message: { dataType: "string", required: true } },
    },
  };
  app.post(
    "/scanifly/project",
    ...fetchMiddlewares<RequestHandler>(ScaniflyController),
    ...fetchMiddlewares<RequestHandler>(
      ScaniflyController.prototype.addProjectToScanifly,
    ),

    async function ScaniflyController_addProjectToScanifly(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsScaniflyController_addProjectToScanifly,
          request,
          response,
        });

        const controller = new ScaniflyController();

        await templateService.apiHandler({
          methodName: "addProjectToScanifly",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsScaniflyController_addUserToScanifly: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    requestBody: {
      in: "body",
      name: "requestBody",
      required: true,
      ref: "AddUserToScaniflyRequest",
    },
    validationErrorResponse: {
      in: "res",
      name: "400",
      required: true,
      dataType: "nestedObjectLiteral",
      nestedProperties: { message: { dataType: "string", required: true } },
    },
  };
  app.post(
    "/scanifly/user",
    ...fetchMiddlewares<RequestHandler>(ScaniflyController),
    ...fetchMiddlewares<RequestHandler>(
      ScaniflyController.prototype.addUserToScanifly,
    ),

    async function ScaniflyController_addUserToScanifly(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsScaniflyController_addUserToScanifly,
          request,
          response,
        });

        const controller = new ScaniflyController();

        await templateService.apiHandler({
          methodName: "addUserToScanifly",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsScaniflyController_updateJwksEndpoint: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    requestBody: {
      in: "body",
      name: "requestBody",
      required: true,
      ref: "UpdateJwksEndpointRequest",
    },
    validationErrorResponse: {
      in: "res",
      name: "400",
      required: true,
      dataType: "nestedObjectLiteral",
      nestedProperties: { message: { dataType: "string", required: true } },
    },
  };
  app.patch(
    "/scanifly/reseller",
    ...fetchMiddlewares<RequestHandler>(ScaniflyController),
    ...fetchMiddlewares<RequestHandler>(
      ScaniflyController.prototype.updateJwksEndpoint,
    ),

    async function ScaniflyController_updateJwksEndpoint(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsScaniflyController_updateJwksEndpoint,
          request,
          response,
        });

        const controller = new ScaniflyController();

        await templateService.apiHandler({
          methodName: "updateJwksEndpoint",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
