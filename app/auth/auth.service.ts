import jsonwebtoken from "jsonwebtoken";
import { ConfigService } from "../config";
import type { OptimisticUserClaims } from "../scanifly/scanifly.types";

class AuthService {
  #configService: ConfigService;

  constructor() {
    this.#configService = ConfigService.GetInstance();
  }

  async getJwt({
    emailInYourSystem,
    userIdInScanifly,
    yourScaniflyCompanyId,
    companyIdInScaniflyForUser,
    newUser,
  }: {
    emailInYourSystem: string;
    userIdInScanifly?: string;
    yourScaniflyCompanyId: string;
    companyIdInScaniflyForUser?: string;
    newUser?: OptimisticUserClaims;
  }): Promise<string> {
    if (!userIdInScanifly && !emailInYourSystem) {
      throw new Error("Email or scanifly user ID required");
    }

    const token = jsonwebtoken.sign(
      {
        iss: this.#configService.getJwtIssuer(),
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
        /**
         * This is the company ID in Scanifly that the user being authenticated belongs to,
         * which is NOT your reseller company ID above.
         *
         * Send it whenever you know it. If we cannot resolve the user from
         * `sub_scanifly_user_id` or `sub`, and that company has granted your reseller the
         * `autoCreateUsers` permission, we create the user in that company and log them in
         * rather than rejecting the request. Without this claim there is nothing to create
         * the user in, so an unknown user is still rejected.
         */
        ...(companyIdInScaniflyForUser && {
          sub_scanifly_company_id: companyIdInScaniflyForUser,
        }),
        /**
         * The remaining claims are only read when we create the user; they are ignored for
         * a user that already exists. Each one has a default, so send only what you have.
         */
        ...(newUser?.firstName && { firstName: newUser.firstName }),
        ...(newUser?.lastName && { lastName: newUser.lastName }),
        ...(newUser?.phone && { phone: newUser.phone }),
        ...(newUser?.position && { position: newUser.position }),
      },
      this.#configService.getPrivateKey(),
      {
        algorithm: "RS256", // The `alg` field in your JWKS must be RS256
        expiresIn: "1h",
        keyid: this.#configService.getKeyId(), // Matches the `kid` in your JWKS
      },
    );
    return token;
  }
}

export default AuthService;
