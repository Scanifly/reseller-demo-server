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
  SubmitButton,
} from "../theme/styled";
import { usePersistedString } from "../hooks/usePersisted";
import { postJson, toErrorMessage } from "../api";
import { STORAGE_KEYS } from "../storage";

export function ViewerTab() {
  const keys = STORAGE_KEYS.viewer;
  const [email, setEmail] = usePersistedString(keys.email);
  const [projectId, setProjectId] = usePersistedString(keys.projectId);
  const [designId, setDesignId] = usePersistedString(keys.designId);
  const [userId, setUserId] = usePersistedString(keys.userId);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIframeUrl(null);
    setLoading(true);

    try {
      // The endpoint returns the URL as a plain JSON string.
      const url = await postJson<string>("/scanifly/3dUrl", {
        email,
        scaniflyProjectId: projectId,
        scaniflyDesignId: designId,
        ...(userId && { scaniflyUserId: userId }),
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
  );
}
