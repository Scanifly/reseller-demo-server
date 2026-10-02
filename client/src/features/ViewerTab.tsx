import { useState, type FormEvent } from "react";
import {
  Card,
  ErrorMessage,
  FieldGroup,
  Form,
  Hint,
  IframeWrapper,
  Input,
  Label,
  Section,
  SectionTitle,
  Select,
  SubmitButton,
} from "../theme/styled";
import { POSITIONS } from "../constants";
import { usePersistedString } from "../hooks/usePersisted";
import { postJson, toErrorMessage } from "../api";
import { STORAGE_KEYS } from "../storage";
import { CompanySelect } from "../components/CompanySelect";
import type { Company } from "../types";

export function ViewerTab({
  companies,
  companiesLoading,
  companiesError,
}: {
  companies: Company[];
  companiesLoading: boolean;
  companiesError: string | null;
}) {
  const keys = STORAGE_KEYS.viewer;
  const [email, setEmail] = usePersistedString(keys.email);
  const [companyId, setCompanyId] = usePersistedString(keys.company);
  const [projectId, setProjectId] = usePersistedString(keys.projectId);
  const [designId, setDesignId] = usePersistedString(keys.designId);
  const [userId, setUserId] = usePersistedString(keys.userId);
  const [firstName, setFirstName] = usePersistedString(keys.firstName);
  const [lastName, setLastName] = usePersistedString(keys.lastName);
  const [phone, setPhone] = usePersistedString(keys.phone);
  const [position, setPosition] = usePersistedString(keys.position);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIframeUrl(null);
    setLoading(true);

    // Only sent when something was actually filled in; every claim has a
    // Scanifly-side default, so an empty object is better left off entirely.
    const newUser = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phone && { phone }),
      ...(position && { position }),
    };

    try {
      // The endpoint returns the URL as a plain JSON string.
      const url = await postJson<string>("/scanifly/3dUrl", {
        email,
        scaniflyProjectId: projectId,
        scaniflyDesignId: designId,
        scaniflyCompanyId: companyId,
        ...(userId && { scaniflyUserId: userId }),
        ...(Object.keys(newUser).length && { newUser }),
      });
      setIframeUrl(url);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <Form onSubmit={handleSubmit}>
          <FieldGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="viewerCompanyId">
              Company <Hint>(the company the user belongs to)</Hint>
            </Label>
            <CompanySelect
              id="viewerCompanyId"
              value={companyId}
              onChange={setCompanyId}
              companies={companies}
              loading={companiesLoading}
              error={companiesError}
            />
            <Hint>
              Sent as the <code>sub_scanifly_company_id</code> claim. If this
              email has no Scanifly user yet and the company has granted your
              reseller the <code>autoCreateUsers</code> permission, Scanifly
              creates the user here instead of rejecting the token.
            </Hint>
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="projectId">Scanifly Project ID</Label>
            <Input
              id="projectId"
              type="text"
              placeholder="Project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="designId">Scanifly Design ID</Label>
            <Input
              id="designId"
              type="text"
              placeholder="Design ID"
              value={designId}
              onChange={(e) => setDesignId(e.target.value)}
              required
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="userId">
              Scanifly User ID <Hint>(optional)</Hint>
            </Label>
            <Input
              id="userId"
              type="text"
              placeholder="Only needed if email differs from Scanifly email"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </FieldGroup>

          <Section>
            <SectionTitle>
              New user details{" "}
              <Hint>
                (optional — only used if Scanifly has to create this user; each
                field falls back to the default shown)
              </Hint>
            </SectionTitle>

            <FieldGroup>
              <Label htmlFor="viewerFirstName">First Name</Label>
              <Input
                id="viewerFirstName"
                type="text"
                placeholder="not provided"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="viewerLastName">Last Name</Label>
              <Input
                id="viewerLastName"
                type="text"
                placeholder="not provided"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="viewerPhone">Phone</Label>
              <Input
                id="viewerPhone"
                type="tel"
                placeholder="1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="viewerPosition">Position</Label>
              <Select
                id="viewerPosition"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                <option value="">Use Scanifly default (designer)</option>
                {POSITIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </Select>
              <Hint>
                Recorded on the user, but it does not grant permissions here: a
                user created this way always gets the <code>default</code> role
                and the <code>simpleDesignTechnical</code> permission. Use the
                Create User tab to choose roles and permissions up front.
              </Hint>
            </FieldGroup>
          </Section>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Generating…" : "Open 3D Viewer"}
          </SubmitButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
      </Card>

      {iframeUrl && (
        <IframeWrapper>
          <iframe
            src={iframeUrl}
            title="Scanifly 3D Viewer"
            allow="fullscreen"
          />
        </IframeWrapper>
      )}
    </>
  );
}
