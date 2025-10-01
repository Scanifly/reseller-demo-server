import jsonwebtoken from "jsonwebtoken";
import { ConfigService } from "../config";

class AuthService {
  #configService: ConfigService;

  constructor() {
    this.#configService = ConfigService.GetInstance();
  }

  async getJwt({
    emailInYourSystem,
    userIdInScanifly,
    yourScaniflyCompanyId,
  }: {
    emailInYourSystem: string;
    userIdInScanifly?: string;
    yourScaniflyCompanyId: string;
  }): Promise<string> {
    if (!userIdInScanifly && !emailInYourSystem) {
      throw new Error("Email or scanifly user ID required");
    }

    const token = jsonwebtoken.sign(
      {
        iss: "http://your-domain.com",
        aud: "scanifly",
        /**
         * You can either provide us the user ID in Scanifly or the user's email for us to look them up
         * in our system.
         */
        sub: emailInYourSystem,
        /**
         * This is the user ID in Scanifly of the user that you are providing authentication for.
         * This is only required if the email is not provided in the `sub` field.
         */
        ...(userIdInScanifly && { sub_scanifly_user_id: userIdInScanifly }),
        /**
         * This is your company ID in Scanifly.
         * It is required so we can lookup which JWKS endpoint to validate the JWT against
         */
        iss_scanifly_company_id: yourScaniflyCompanyId,
      },
      this.#configService.getPrivateKey(),
      {
        algorithm: "RS256", // The `alg` field in your JWKS must be RS256
        expiresIn: "24h",
        keyid: this.#configService.getKeyId(), // Matches the `kid` in your JWKS
      },
    );
    return token;
  }
}

export default AuthService;
