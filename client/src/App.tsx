import { useState } from "react";
import { GlobalStyle } from "./theme/GlobalStyle";
import {
  Container,
  Header,
  Subtitle,
  TabButton,
  Tabs,
  Title,
} from "./theme/styled";
import { useCompanies } from "./hooks/useCompanies";
import { CreateUserTab } from "./features/CreateUserTab";
import { CreateProjectTab } from "./features/CreateProjectTab";
import { ViewerTab } from "./features/ViewerTab";
import type { Tab } from "./types";

function App() {
  const [tab, setTab] = useState<Tab>("createUser");
  const {
    companies,
    loading: companiesLoading,
    error: companiesError,
  } = useCompanies();

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
            $active={tab === "createProject"}
            onClick={() => setTab("createProject")}
          >
            Create Project &amp; Design
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
          <CreateUserTab
            companies={companies}
            companiesLoading={companiesLoading}
            companiesError={companiesError}
            onNavigate={setTab}
          />
        )}

        {tab === "createProject" && (
          <CreateProjectTab
            companies={companies}
            companiesLoading={companiesLoading}
            companiesError={companiesError}
            onNavigate={setTab}
          />
        )}

        {tab === "viewer" && (
          <ViewerTab
            companies={companies}
            companiesLoading={companiesLoading}
            companiesError={companiesError}
          />
        )}
      </Container>
    </>
  );
}

export default App;
