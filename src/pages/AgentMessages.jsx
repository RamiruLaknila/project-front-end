import AgentMemberSidebar from "../components/AgentMemberSidebar";
import AgentMessagesPanel from "../components/AgentMessagesPanel";

function AgentMessages() {
  return (
    <AgentMessagesPanel
      sidebar={<AgentMemberSidebar />}
      workspaceLabel="Agency Member Workspace"
    />
  );
}

export default AgentMessages;
