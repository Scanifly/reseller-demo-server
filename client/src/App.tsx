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

const Input = styled.input`
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  &::placeholder {
    color: #9ca3af;
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

const ErrorMessage = styled.p`
  color: #dc2626;
  font-size: 0.9rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px 16px;
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

function App() {
  const [email, setEmail] = useState(() => localStorage.getItem("scanifly_viewer_email") ?? "");
  const [projectId, setProjectId] = useState(() => localStorage.getItem("scanifly_viewer_project_id") ?? "");
  const [designId, setDesignId] = useState(() => localStorage.getItem("scanifly_viewer_design_id") ?? "");
  const [userId, setUserId] = useState(() => localStorage.getItem("scanifly_viewer_user_id") ?? "");
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>Scanifly 3D Viewer</Title>
          <Subtitle>
            Enter a user email to generate a JWT and open the 3D design viewer.
          </Subtitle>
        </Header>

        <Card>
          <Form onSubmit={handleSubmit}>
            <FieldGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); localStorage.setItem("scanifly_viewer_email", e.target.value); }}
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
                onChange={(e) => { setProjectId(e.target.value); localStorage.setItem("scanifly_viewer_project_id", e.target.value); }}
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
                onChange={(e) => { setDesignId(e.target.value); localStorage.setItem("scanifly_viewer_design_id", e.target.value); }}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="userId">
                Scanifly User ID{" "}
                <span style={{ fontWeight: 400, color: "#9ca3af" }}>
                  (optional)
                </span>
              </Label>
              <Input
                id="userId"
                type="text"
                placeholder="Only needed if email differs from Scanifly email"
                value={userId}
                onChange={(e) => { setUserId(e.target.value); localStorage.setItem("scanifly_viewer_user_id", e.target.value); }}
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
            <iframe src={iframeUrl} title="Scanifly 3D Viewer" allow="fullscreen" />
          </IframeWrapper>
        )}
      </Container>
    </>
  );
}

export default App;
