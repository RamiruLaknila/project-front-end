import { ApiError } from "./api";

const FIREBASE_MESSAGES = {
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/invalid-login-credentials": "Incorrect email or password.",
  "auth/too-many-requests":
    "Too many attempts. Please wait a moment and try again.",
  "auth/email-already-in-use": "An account with that email already exists.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/network-request-failed":
    "Network error. Check your connection and try again.",
  "auth/operation-not-allowed":
    "Email/password sign-in is not enabled for this Firebase project.",
};

/** Turn any auth/API failure into a message that's safe to show a user. */
export function authErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  if (!err) return fallback;
  if (err instanceof ApiError) return err.message || fallback;
  if (err.code && FIREBASE_MESSAGES[err.code]) return FIREBASE_MESSAGES[err.code];
  if (typeof err.message === "string" && err.message) {
    const match = err.message.match(/\(auth\/[\w-]+\)/); // "Firebase: ... (auth/x)."
    if (match) {
      const code = match[0].slice(1, -1);
      if (FIREBASE_MESSAGES[code]) return FIREBASE_MESSAGES[code];
    }
    return err.message;
  }
  return fallback;
}

/**
 * Where to send a user after sign-in, from their backend profile.
 * Backend roles: "importer" | "clearing_agent".
 */
export function landingPathForProfile(profile) {
  if (!profile) return "/";
  if (profile.role === "importer") {
    return profile.profileComplete ? "/dashboard" : "/complete-profile";
  }
  if (profile.role === "clearing_agent") {
    if (profile.agentStatus === "pending") return "/agent-pending";
    if (profile.agentStatus === "rejected") return "/agent-pending";
    if (profile.isIndependent) return "/individual-agent-dashboard";
    if (profile.isAgencyAdmin) return "/agent-admin-dashboard";
    return "/agent-dashboard"; // approved member of a multi-person agency
  }
  return "/";
}
