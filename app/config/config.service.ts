import dotenv from "dotenv";

class ConfigService {
  // eslint-disable-next-line no-use-before-define
  static #instance: ConfigService;

  #isInitialized = false;

  private constructor() {}

  static GetInstance() {
    if (!ConfigService.#instance) {
      ConfigService.#instance = new ConfigService();
    }
    return ConfigService.#instance;
  }

  async init() {
    if (this.#isInitialized) {
      return;
    }

    dotenv.config();
    this.#isInitialized = true;
  }

  getKeyId() {
    return process.env["JWKS_KEY_ID"]!;
  }

  getPrivateKey() {
    return process.env["JWKS_PRIVATE_KEY"]!;
  }

  getPort() {
    return parseInt(process.env["PORT"]!);
  }

  getScanifly3dUrl() {
    return process.env["SCANIFLY_3D_URL"]!;
  }

  getScaniflyEndpoint() {
    return process.env["SCANIFLY_ENDPOINT"]!;
  }

  getScaniflyEmail() {
    return process.env["SCANIFLY_EMAIL"]!;
  }

  getScaniflyPassword() {
    return process.env["SCANIFLY_PASSWORD"]!;
  }

  getCorsOrigin() {
    return process.env["CORS_ORIGIN"]!;
  }

  getJwtIssuer() {
    return process.env["JWT_ISSUER"]!;
  }
}

export default ConfigService;
