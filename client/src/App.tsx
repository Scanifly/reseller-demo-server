import { useState, type FormEvent } from "react";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, sans-serif;
    background: #f5f7fa;
    color: #1a1a2e;
    min-height: 100vh;
  }
`;

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a2e;
`;

const Subtitle = styled.p`
  margin-top: 8px;
  color: #6b7280;
  font-size: 0.95rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 4px;
  background: #e5e7eb;
  padding: 4px;
  border-radius: 10px;
  margin-bottom: 24px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
  background: ${({ $active }) => ($active ? "#ffffff" : "transparent")};
  color: ${({ $active }) => ($active ? "#1a1a2e" : "#6b7280")};
  box-shadow: ${({ $active }) =>
    $active ? "0 1px 2px rgba(0, 0, 0, 0.1)" : "none"};

  &:hover {
    color: #1a1a2e;
  }
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 32px;
  margin-bottom: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
`;

const Hint = styled.span`
  font-weight: 400;
  color: #9ca3af;
`;

const inputStyles = `
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.15s;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Input = styled.input`
  ${inputStyles}
`;

const Select = styled.select`
  ${inputStyles}
  cursor: pointer;
`;

const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 8px 16px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #374151;
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  background: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LinkButton = styled.button`
  align-self: flex-start;
  margin-top: 8px;
  padding: 8px 16px;
  background: transparent;
  color: #2563eb;
  border: 1px solid #93c5fd;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #eff6ff;
  }
`;

const ErrorMessage = styled.p`
  color: #dc2626;
  font-size: 0.9rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px 16px;
`;

const SuccessMessage = styled.div`
  color: #065f46;
  font-size: 0.9rem;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  padding: 12px 16px;

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    background: #d1fae5;
    padding: 2px 6px;
    border-radius: 4px;
  }
`;

const IframeWrapper = styled.div`
  width: 100%;
  height: 700px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

// Positions accepted by the reseller user-creation API. The chosen position
// determines the user's default permissions unless overridden below.
const POSITIONS: { value: string; label: string }[] = [
  { value: "designer", label: "Designer" },
  { value: "surveyor", label: "Surveyor" },
  { value: "financeProcurement", label: "Finance / Procurement" },
  { value: "salesMarketing", label: "Sales / Marketing" },
  { value: "operationsProjectManager", label: "Operations / Project Manager" },
  { value: "installer", label: "Installer" },
  { value: "executiveOwnerCEO", label: "Executive / Owner / CEO" },
  { value: "thirdPartyEngineer", label: "Third-Party Engineer" },
  { value: "dronePilot", label: "Drone Pilot" },
  { value: "maintenanceTech", label: "Maintenance Tech" },
  { value: "guest", label: "Guest" },
];

// Roles a reseller is allowed to assign. `admin` grants the admin role;
// leaving this unset defaults to `default` (and the position's permissions).
const ROLES: { value: string; label: string }[] = [
  { value: "admin", label: "admin" },
  { value: "default", label: "default" },
];

// Permissions a reseller may assign, mirroring the API allow-list. Checking any
// of these overrides the permissions the position would otherwise grant.
const PERMISSIONS: { value: string; label: string }[] = [
  { value: "adminTools", label: "Admin Tools" },
  { value: "billing", label: "Billing" },
  { value: "upload", label: "Create New Projects" },
  { value: "download", label: "Download" },
  { value: "uploadMedia", label: "Upload Media" },
  { value: "watt3d", label: "Watt3D" },
  { value: "simpleDesign", label: "Simple Design" },
  { value: "simpleDesignTechnical", label: "Simple Design (Technical)" },
  { value: "viewMyProjects", label: "View My Projects" },
  { value: "editCompanyModuleLibrary", label: "Edit Company Module Library" },
  { value: "proposalManage", label: "Proposal: Manage" },
  { value: "proposalCreate", label: "Proposal: Create" },
  { value: "proposalViewOnly", label: "Proposal: View Only" },
  { value: "proposalTemplateManage", label: "Proposal: Template Manage" },
  { value: "removeMediaCategories", label: "Remove Media Categories" },
];

/** Persist a string field to localStorage, mirroring the existing pattern. */
function usePersistedString(key: string, initial = "") {
  const [value, setValue] = useState(
    () => localStorage.getItem(key) ?? initial,
  );
  const set = (next: string) => {
    setValue(next);
    localStorage.setItem(key, next);
  };
  return [value, set] as const;
}

/** Persist a string-array field (e.g. selected permissions) to localStorage. */
function usePersistedArray(key: string) {
  const [value, setValue] = useState<string[]>(() => {
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const set = (next: string[]) => {
    setValue(next);
    localStorage.setItem(key, JSON.stringify(next));
  };
  return [value, set] as const;
}

type Tab = "createUser" | "viewer";

function App() {
  const [tab, setTab] = useState<Tab>("createUser");

  // --- 3D viewer form state ---
  const [email, setEmail] = usePersistedString("scanifly_viewer_email");
  const [projectId, setProjectId] = usePersistedString(
    "scanifly_viewer_project_id",
  );
  const [designId, setDesignId] = usePersistedString(
    "scanifly_viewer_design_id",
  );
  const [userId, setUserId] = usePersistedString("scanifly_viewer_user_id");
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Create user form state ---
  const [firstName, setFirstName] = usePersistedString("scanifly_cu_first");
  const [lastName, setLastName] = usePersistedString("scanifly_cu_last");
  const [cuEmail, setCuEmail] = usePersistedString("scanifly_cu_email");
  const [phone, setPhone] = usePersistedString("scanifly_cu_phone");
  const [companyId, setCompanyId] = usePersistedString("scanifly_cu_company");
  const [position, setPosition] = usePersistedString(
    "scanifly_cu_position",
    "executiveOwnerCEO",
  );
  const [role, setRole] = usePersistedString("scanifly_cu_role");
  const [permissions, setPermissions] = usePersistedArray(
    "scanifly_cu_permissions",
  );
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIframeUrl(null);
    setLoading(true);

    try {
      const response = await fetch("/scanifly/3dUrl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          scaniflyProjectId: projectId,
          scaniflyDesignId: designId,
          ...(userId && { scaniflyUserId: userId }),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.message ?? `Server responded with ${response.status}`,
        );
      }

      // The endpoint returns the URL as a plain JSON string
      const url: string = await response.json();
      setIframeUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (value: string) => {
    setPermissions(
      permissions.includes(value)
        ? permissions.filter((p) => p !== value)
        : [...permissions, value],
    );
  };

  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreatedUserId(null);
    setCreating(true);

    try {
      const response = await fetch("/scanifly/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email: cuEmail,
          phone,
          companyId,
          position,
          // Only send overrides when provided so the API falls back to the
          // position's default role/permissions otherwise.
          ...(role && { roles: [role] }),
          ...(permissions.length && { permissions }),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.message ?? `Server responded with ${response.status}`,
        );
      }

      const data: { userId: string } = await response.json();
      setCreatedUserId(data.userId);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setCreating(false);
    }
  };

  const openCreatedUserInViewer = () => {
    if (!createdUserId) return;
    setEmail(cuEmail);
    setUserId(createdUserId);
    setTab("viewer");
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>Scanifly Reseller Demo</Title>
          <Subtitle>
            Create Scanifly users via the reseller API, then open the 3D design
            viewer as one of them.
          </Subtitle>
        </Header>

        <Tabs>
          <TabButton
            type="button"
            $active={tab === "createUser"}
            onClick={() => setTab("createUser")}
          >
            Create User
          </TabButton>
          <TabButton
            type="button"
            $active={tab === "viewer"}
            onClick={() => setTab("viewer")}
          >
            3D Viewer
          </TabButton>
        </Tabs>

        {tab === "createUser" && (
          <Card>
            <Form onSubmit={handleCreateUser}>
              <FieldGroup>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="cuEmail">Email Address</Label>
                <Input
                  id="cuEmail"
                  type="email"
                  placeholder="jane@example.com"
                  value={cuEmail}
                  onChange={(e) => setCuEmail(e.target.value)}
                  required
                />
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 555 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="companyId">Company ID</Label>
                <Input
                  id="companyId"
                  type="text"
                  placeholder="Scanifly company ID to add the user to"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  required
                />
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="position">Position</Label>
                <Select
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                >
                  {POSITIONS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </Select>
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="role">
                  Role <Hint>(optional — overrides position default)</Hint>
                </Label>
                <Select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Use position default (default)</option>
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </Select>
              </FieldGroup>

              <FieldGroup>
                <Label>
                  Permissions{" "}
                  <Hint>
                    (optional — leave all unchecked to inherit the position's
                    defaults)
                  </Hint>
                </Label>
                <CheckboxGrid>
                  {PERMISSIONS.map((p) => (
                    <CheckboxLabel key={p.value}>
                      <input
                        type="checkbox"
                        checked={permissions.includes(p.value)}
                        onChange={() => togglePermission(p.value)}
                      />
                      {p.label}
                    </CheckboxLabel>
                  ))}
                </CheckboxGrid>
              </FieldGroup>

              <SubmitButton type="submit" disabled={creating}>
                {creating ? "Creating…" : "Create User"}
              </SubmitButton>

              {createError && <ErrorMessage>{createError}</ErrorMessage>}

              {createdUserId && (
                <SuccessMessage>
                  User created. Scanifly user ID: <code>{createdUserId}</code>
                  <LinkButton type="button" onClick={openCreatedUserInViewer}>
                    Open this user in the 3D Viewer →
                  </LinkButton>
                </SuccessMessage>
              )}
            </Form>
          </Card>
        )}

        {tab === "viewer" && (
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
        )}
      </Container>
    </>
  );
}

export default App;
