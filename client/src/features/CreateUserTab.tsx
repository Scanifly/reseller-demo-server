import { useState, type FormEvent } from "react";
import {
  Card,
  CheckboxGrid,
  CheckboxLabel,
  ErrorMessage,
  FieldGroup,
  Form,
  Hint,
  Input,
  Label,
  LinkButton,
  Select,
  SubmitButton,
  SuccessMessage,
} from "../theme/styled";
import { PERMISSIONS, POSITIONS, ROLES } from "../constants";
import { usePersistedArray, usePersistedString } from "../hooks/usePersisted";
import { postJson, toErrorMessage } from "../api";
import { STORAGE_KEYS, seedPersisted } from "../storage";
import { CompanySelect } from "../components/CompanySelect";
import type { Company, Tab } from "../types";

export function CreateUserTab({
  companies,
  companiesLoading,
  companiesError,
  onNavigate,
}: {
  companies: Company[];
  companiesLoading: boolean;
  companiesError: string | null;
  onNavigate: (tab: Tab) => void;
}) {
  const keys = STORAGE_KEYS.createUser;
  const [firstName, setFirstName] = usePersistedString(keys.firstName);
  const [lastName, setLastName] = usePersistedString(keys.lastName);
  const [cuEmail, setCuEmail] = usePersistedString(keys.email);
  const [phone, setPhone] = usePersistedString(keys.phone);
  const [companyId, setCompanyId] = usePersistedString(keys.company);
  const [position, setPosition] = usePersistedString(
    keys.position,
    "executiveOwnerCEO",
  );
  const [role, setRole] = usePersistedString(keys.role);
  const [permissions, setPermissions] = usePersistedArray(keys.permissions);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);

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
      const data = await postJson<{ userId: string }>("/scanifly/user", {
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
      });
      setCreatedUserId(data.userId);
    } catch (err) {
      setCreateError(toErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  const openCreatedUserInProjectTab = () => {
    if (!createdUserId) return;
    seedPersisted(STORAGE_KEYS.createProject.email, cuEmail);
    seedPersisted(STORAGE_KEYS.createProject.company, companyId);
    seedPersisted(STORAGE_KEYS.createProject.userId, createdUserId);
    onNavigate("createProject");
  };

  const openCreatedUserInViewer = () => {
    if (!createdUserId) return;
    seedPersisted(STORAGE_KEYS.viewer.email, cuEmail);
    seedPersisted(STORAGE_KEYS.viewer.userId, createdUserId);
    onNavigate("viewer");
  };

  return (
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
          <Label htmlFor="companyId">Company</Label>
          <CompanySelect
            id="companyId"
            value={companyId}
            onChange={setCompanyId}
            companies={companies}
            loading={companiesLoading}
            error={companiesError}
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
            <LinkButton type="button" onClick={openCreatedUserInProjectTab}>
              Create a project &amp; design for this user →
            </LinkButton>
            <LinkButton type="button" onClick={openCreatedUserInViewer}>
              Open this user in the 3D Viewer →
            </LinkButton>
          </SuccessMessage>
        )}
      </Form>
    </Card>
  );
}
