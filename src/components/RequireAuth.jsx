import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

/**
 *   <RequireAuth><Dashboard /></RequireAuth>
 *   <RequireAuth roles={["clearing_agent"]}><AgentDashboard /></RequireAuth>
 *
 * Backend roles are "importer" and "clearing_agent".
 */
export default function RequireAuth({
  children,
  roles,
  platformAdmin,
  allowPendingAgent = false,
}) {
  const { isAuthenticated, role, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-[#173563]"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  if (roles && role && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  if (platformAdmin && !user?.isPlatformAdmin) {
    return <Navigate to="/" replace />;
  }

  // A clearing agent who isn't approved yet can only see the pending page.
  if (
    !allowPendingAgent &&
    role === "clearing_agent" &&
    user?.agentStatus &&
    user.agentStatus !== "approved"
  ) {
    return <Navigate to="/agent-pending" replace />;
  }

  return children;
}
