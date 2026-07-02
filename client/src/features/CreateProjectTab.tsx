import { useState, type FormEvent } from "react";
import {
  Card,
  ErrorMessage,
  FieldGroup,
  Form,
  Hint,
  Input,
  Label,
  LinkButton,
  SubmitButton,
  SuccessMessage,
} from "../theme/styled";
import { usePersistedString } from "../hooks/usePersisted";
import { postJson, toErrorMessage } from "../api";
import { STORAGE_KEYS, seedPersisted } from "../storage";
import { CompanySelect } from "../components/CompanySelect";
import type { Company, Tab } from "../types";

export function CreateProjectTab({
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
  const keys = STORAGE_KEYS.createProject;
  const [cpdEmail, setCpdEmail] = usePersistedString(keys.email);
  const [cpdCompanyId, setCpdCompanyId] = usePersistedString(keys.company);
  const [cpdUserId, setCpdUserId] = usePersistedString(keys.userId);
  const [projectName, setProjectName] = usePersistedString(
    keys.projectName,
    "Demo Project",
  );
  const [designName, setDesignName] = usePersistedString(
    keys.designName,
    "Demo Design",
  );
  const [address, setAddress] = usePersistedString(
    keys.address,
    "1 Market St, San Francisco, CA 94105",
  );
  const [latitude, setLatitude] = usePersistedString(keys.lat, "37.7936");
  const [longitude, setLongitude] = usePersistedString(keys.lng, "-122.3965");
  const [cpdCreating, setCpdCreating] = useState(false);
  const [cpdError, setCpdError] = useState<string | null>(null);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);
  const [createdDesignId, setCreatedDesignId] = useState<string | null>(null);

  const handleCreateProjectAndDesign = async (e: FormEvent) => {
    e.preventDefault();
    setCpdError(null);
    setCreatedProjectId(null);
    setCreatedDesignId(null);

    const lat = Number(latitude);
    const lng = Number(longitude);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setCpdError("Latitude and longitude must be valid numbers.");
      return;
    }

    setCpdCreating(true);
    try {
      // 1. Create the project owned by the (optionally specified) user.
      const project = await postJson<{ id: string }>("/scanifly/project", {
        name: projectName,
        address,
        geolocation: { latitude: lat, longitude: lng },
        email: cpdEmail,
        scaniflyCompanyId: cpdCompanyId,
        ...(cpdUserId && { scaniflyUserId: cpdUserId }),
      });
      setCreatedProjectId(project.id);

      // 2. Create a design against the project we just created.
      const design = await postJson<{ id: string }>("/scanifly/design", {
        scaniflyProjectId: project.id,
        scaniflyCompanyId: cpdCompanyId,
        email: cpdEmail,
        name: designName,
        ...(cpdUserId && { scaniflyUserId: cpdUserId }),
      });
      setCreatedDesignId(design.id);
    } catch (err) {
      setCpdError(toErrorMessage(err));
    } finally {
      setCpdCreating(false);
    }
  };

  const openCreatedProjectInViewer = () => {
    if (!createdProjectId || !createdDesignId) return;
    seedPersisted(STORAGE_KEYS.viewer.email, cpdEmail);
    seedPersisted(STORAGE_KEYS.viewer.projectId, createdProjectId);
    seedPersisted(STORAGE_KEYS.viewer.designId, createdDesignId);
    seedPersisted(STORAGE_KEYS.viewer.userId, cpdUserId);
    onNavigate("viewer");
  };

  return (
    <Card>
      <Form onSubmit={handleCreateProjectAndDesign}>
        <FieldGroup>
          <Label htmlFor="cpdEmail">
            Email Address <Hint>(user who will own the project)</Hint>
          </Label>
          <Input
            id="cpdEmail"
            type="email"
            placeholder="jane@example.com"
            value={cpdEmail}
            onChange={(e) => setCpdEmail(e.target.value)}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="cpdCompanyId">Company</Label>
          <CompanySelect
            id="cpdCompanyId"
            value={cpdCompanyId}
            onChange={setCpdCompanyId}
            companies={companies}
            loading={companiesLoading}
            error={companiesError}
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="cpdUserId">
            Scanifly User ID <Hint>(optional)</Hint>
          </Label>
          <Input
            id="cpdUserId"
            type="text"
            placeholder="Only needed if email differs from Scanifly email"
            value={cpdUserId}
            onChange={(e) => setCpdUserId(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            id="projectName"
            type="text"
            placeholder="Demo Project"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="designName">Design Name</Label>
          <Input
            id="designName"
            type="text"
            placeholder="Demo Design"
            value={designName}
            onChange={(e) => setDesignName(e.target.value)}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            type="text"
            placeholder="1 Market St, San Francisco, CA 94105"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="text"
            inputMode="decimal"
            placeholder="37.7936"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="text"
            inputMode="decimal"
            placeholder="-122.3965"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
          />
        </FieldGroup>

        <SubmitButton type="submit" disabled={cpdCreating}>
          {cpdCreating ? "Creating…" : "Create Project & Design"}
        </SubmitButton>

        {cpdError && <ErrorMessage>{cpdError}</ErrorMessage>}

        {createdProjectId && (
          <SuccessMessage>
            Project created. Project ID: <code>{createdProjectId}</code>
            {createdDesignId ? (
              <>
                <br />
                Design created. Design ID: <code>{createdDesignId}</code>
                <LinkButton type="button" onClick={openCreatedProjectInViewer}>
                  Open in the 3D Viewer →
                </LinkButton>
              </>
            ) : null}
          </SuccessMessage>
        )}
      </Form>
    </Card>
  );
}
