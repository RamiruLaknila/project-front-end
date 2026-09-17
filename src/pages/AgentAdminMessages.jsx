import AgentAdminSidebar from "../components/AgentAdminSidebar";
import AgentMessagesPanel from "../components/AgentMessagesPanel";

function AgentAdminMessages() {
  return (
    <AgentMessagesPanel
      sidebar={<AgentAdminSidebar />}
      workspaceLabel="Agency Workspace"
    />
  );
}

export default AgentAdminMessages;
