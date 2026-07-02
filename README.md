## Scanifly Reseller Demo Server

> **For local development and evaluation only.**
>
> This server has **no authentication** on any of its endpoints. Every API route — including user creation, credit purchases, JWT signing, and JWKS endpoint registration — is open to any caller that can reach the server. Before adapting this code for a real deployment you must add authentication middleware that verifies every incoming request comes from your own application.

This is a NodeJS/Express HTTP server that will allow you to quickly test the Scanifly reseller APIs and see how to get your JWKS setup to be able to sign JWT's that Scanifly can then validate and use to authenticate your users into it's system.

## Setup & Running Locally

### Install Dependencies 
Clone the repository:
```bash
git clone git@github.com:Scanifly/reseller-demo-server.git
cd reseller-demo-server
```

### Postman

Inside the `app/routes/swagger.json` file is the openapi schema that you can import into Postman to easily test the APIs this server exposes.

### Setting Up Environment Variables

Copy the environment variable template file from `_env` to `.env`

```bash
cp _env .env
```

Your JWKS algorithm must be RS256 and you private key exported in PEM format.

If you do not already have a JWKS you can generate one for testing [here](https://jwkset.com/generate)

Place your private key in the `JWKS_PRIVATE_KEY` field in the .env.

Take the public key and put it in the `/app/jwks.json` file inside the `keys` array.

Place your key ID in the `JWKS_KEY_ID` field in the .env

The `SCANIFLY_API_KEY` value in your .env must be an API key belonging to an `admin` user of your Scanifly reseller account. This key is sent as the `x-api-token` header and authenticates the reseller API calls (create company/user, purchase credits, update JWKS endpoint) against the `/api/v1` endpoints. Generate the key in the Scanifly portal, or ask Scanifly to provision one for you.

> Project and design creation, and the 3D embed itself, are authenticated with the RS256 JWT that this server signs on your behalf (see JWKS setup below) — not the API key.

### Running Locally

####
This app is dockerized and can be run in a container by using the commands in the Makefile

```bash
make build-up
```

Alternatively if you want to modify the code and see your changes in real time you can run it locally with nodemon.

#### Prerequisites
- **Node.js** (v18+ recommended)
- **Yarn** (this repo uses Yarn 3.6.4)

If you don’t already have Yarn:
```bash
npm install -g yarn
```

To run the code locally with nodemon:

```bash
yarn install && yarn local
```
#### Configuring JWKS Validation

Scanifly needs to know the endpoint to reach out to validate a JWT against your JWKS public key.

That endpoint must be accessible via HTTPS.

A quick way to serve up this local node server via HTTPS is using [ngrok](https://ngrok.com/).

It does require a paid account to be able to serve via HTTPS.

Assuming you have a paid account and have a static domain on ngrok. 

On Mac you serve this demo server via that endpoint:
```bash
ngrok http --url=your_ngrok_domain 3002
```

Once you have your HTTPS URL you need to tell Scanifly to use that endpoint to validate your JWTs.

The PATCH scanifly/reseller endpoint can be used to accomplish that.

![Use the PATCH scanifly/reseller endpoint](./docs/postman.png)

### Getting A 3D URL

If the user already has a companyId and userId you can skip to step 3.

1. Create a company in Scanifly
2. Create a user in Scanifly to associate with the company
3. Create a project in Scanifly for a given address
4. Create a design in Scanifly to associate with the project
5. Get a 3D URL

### Permissions and Roles

When creating a user there is a field in the request body named `position`.

Each position has different permissions that control what actions can be performed inside the Scanifly ecosystem by that user.

| Role(s)                                                        | Create Projects | Simple Design| Pro Design |
| --------------------------------------- | :-------------: | :---------:| :-----------: |
| Owner                                   |        ✅        |      ✅      |       ✅       |
| Operations                              |        ✅        |      ✅      |       ✅       |
| Designer                                |        ✅        |      ✅      |       ✅       |
| Sales Rep                               |        ✅        |      ✅      |       ❌       |
| Surveyor / Field Tech                   |        ✅        |      ❌      |       ❌       |

#### Overriding the position defaults

`position` still sets the user's **default** role and permissions. To create users
whose access does not match a position preset — most commonly a company **admin** —
the create-user request (`POST /scanifly/user`) accepts two optional fields that
override those defaults:

| Field | Type | Effect |
| --- | --- | --- |
| `roles` | `string[]` | Replaces the default role. Resellers may assign only `admin` or `default`. Omit to default to `default`. |
| `permissions` | `string[]` | Replaces the position's default permissions entirely. Omit to inherit the position defaults. |

Both fields are **optional** and independent — you can override the role, the
permissions, or both. When a field is omitted the position-derived default is used,
so existing integrations are unaffected.

**Create an admin** by sending `roles: ["admin"]` (typically alongside the
`adminTools` permission):

```jsonc
POST /scanifly/user
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "+1 555 123 4567",
  "companyId": "<scanifly company id>",
  "position": "executiveOwnerCEO",
  "roles": ["admin"],
  "permissions": ["adminTools", "billing", "upload", "watt3d"]
}
```

Assignable `permissions` values: `adminTools`, `billing`, `upload` (create new
projects), `download`, `uploadMedia`, `watt3d`, `simpleDesign`,
`simpleDesignTechnical`, `viewMyProjects`, `editCompanyModuleLibrary`,
`proposalManage`, `proposalCreate`, `proposalViewOnly`, `proposalTemplateManage`,
`removeMediaCategories`. The deprecated `salesManager` and `mobile` permissions are
rejected.

> These fields are surfaced in the demo client under the **Create User** tab — the
> position dropdown sets the defaults, and the optional role dropdown and permission
> checkboxes apply the overrides above.

---