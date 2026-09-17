import IndividualAgentSidebar from "../components/IndividualAgentSidebar";
import AgentMessagesPanel from "../components/AgentMessagesPanel";

function IndividualAgentMessages() {
  return (
    <AgentMessagesPanel
      sidebar={<IndividualAgentSidebar />}
      workspaceLabel="Individual Agent Workspace"
    />
  );
}

export default IndividualAgentMessages;
