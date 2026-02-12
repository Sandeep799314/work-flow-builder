import { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import WorkflowForm from "./pages/WorkflowForm";
import RunWorkflow from "./pages/RunWorkFlow";
import RunHistory from "./pages/RunHistory";
import StatusPage from "./pages/StatusPage";

export default function App() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "create":
        return <WorkflowForm />;
      case "run":
        return <RunWorkflow />;
      case "history":
        return <RunHistory />;
      case "status":
        return <StatusPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout setPage={setPage}>
      {renderPage()}
    </Layout>
  );
}
