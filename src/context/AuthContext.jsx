import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  onIdTokenChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth, googleProvider } from "../lib/firebase";
import { api, ApiError } from "../lib/api";

/**
 * Auth model
 * ----------
 * The backend issues no session of its own -- it only verifies Firebase ID
 * tokens (dependencies.py -> verify_token -> auth.verify_id_token).
 *
 *   register()  POST /auth/register creates the Firebase user and returns a
 *               *custom token*; signInWithCustomToken() turns it into a session.
 *   login()     plain Firebase email/password sign-in.
 *   Every API call then carries `Authorization: Bearer <idToken>` (lib/api.js).
 *
 * `user` here is the Firestore profile from GET /auth/me:
 *   { id, name, email, role, profileComplete, ... }
 * and for clearing agents also: agencyId, isAgencyAdmin, agentStatus.
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(() => auth.currentUser);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const refreshProfile = useCallback(async () => {
    try {
      const me = await api.get("/auth/me");
      setProfile(me);
      setProfileError(null);
      return me;
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 404)) {
        setProfile(null);
      }
      setProfileError(err);
      throw err;
    }
  }, []);

  useEffect(() => {
    // Fires on: initial load, sign-in, sign-out, and token refresh.
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          await refreshProfile();
        } catch {
          /* profileError is set; let the UI decide what to show */
        }
      } else {
        setProfile(null);
        setProfileError(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [refreshProfile]);

  const login = useCallback(
    async (email, password, remember = true) => {
      // setPersistence must be called before signing in -- it decides where
      // this session is stored: browserLocalPersistence survives closing the
      // browser entirely ("remember me"), browserSessionPersistence clears
      // when the browser (not just the tab) is closed.
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence
      );
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      // Set firebaseUser directly from the credential instead of waiting on the
      // onIdTokenChanged listener below -- that listener fires independently and
      // isn't guaranteed to have updated state yet by the time the caller's
      // navigate() runs, which was bouncing people straight back to /signin
      // right after a successful sign-in (a real race, not a permissions issue).
      setFirebaseUser(cred.user);
      return refreshProfile();
    },
    [refreshProfile]
  );

  const register = useCallback(
    async ({ name, email, password, role, agencyCode, ...extra }) => {
      // `extra` carries optional independent clearing-agent fields:
      // phone, licenseNumber, licenseExpiry, experience, agentId, address.
      const body = {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        ...(agencyCode ? { agencyCode: agencyCode.trim() } : {}),
      };
      for (const [key, value] of Object.entries(extra)) {
        if (value !== undefined && value !== null && value !== "") {
          body[key] = typeof value === "string" ? value.trim() : value;
        }
      }
      const res = await api.post("/auth/register", body, { auth: false });
      const cred = await signInWithCustomToken(auth, res.token);
      setFirebaseUser(cred.user); // see note in login() above
      return refreshProfile();
    },
    [refreshProfile]
  );

  const registerAgency = useCallback(
    async ({ companyName, email, password }) => {
      const res = await api.post(
        "/agencies/register",
        { companyName: companyName.trim(), email: email.trim(), password },
        { auth: false }
      );
      const cred = await signInWithCustomToken(auth, res.token);
      setFirebaseUser(cred.user); // see note in login() above
      const profileData = await refreshProfile();
      // Return the agency too -- the caller needs agency.id for the profile step.
      return { user: profileData, agency: res.agency };
    },
    [refreshProfile]
  );

  const loginWithGoogle = useCallback(async () => {
    // Same persistence choice as login() -- Google sign-in has no
    // "remember me" checkbox, so always persist across browser restarts.
    await setPersistence(auth, browserLocalPersistence);
    const cred = await signInWithPopup(auth, googleProvider);
    setFirebaseUser(cred.user); // see note in login() above
    try {
      const profileData = await refreshProfile();
      return { isNewUser: false, profile: profileData };
    } catch (err) {
      // 404 means this Google account has no `users/{uid}` doc yet -- a
      // brand-new signup that still needs to pick a role (see
      // GoogleRoleSelect / completeGoogleProfile / completeGoogleAgency).
      if (err instanceof ApiError && err.status === 404) {
        return { isNewUser: true, profile: null };
      }
      throw err;
    }
  }, [refreshProfile]);

  const completeGoogleProfile = useCallback(
    async (body) => {
      await api.post("/auth/register-profile", body);
      return refreshProfile();
    },
    [refreshProfile]
  );

  const completeGoogleAgency = useCallback(
    async (body) => {
      const res = await api.post("/agencies/register-profile", body);
      const profileData = await refreshProfile();
      return { user: profileData, agency: res.agency };
    },
    [refreshProfile]
  );

  const logout = useCallback(async () => {
    await signOut(auth);
    setProfile(null);
  }, []);

  const deleteAccount = useCallback(async () => {
    if (!profile?.id) throw new ApiError("You are not signed in.", 401, null);
    await api.del(`/users/${profile.id}`);
    await signOut(auth);
    setProfile(null);
  }, [profile]);

  const resetPassword = useCallback(
    (email) => sendPasswordResetEmail(auth, email.trim()),
    []
  );

  const value = useMemo(
    () => ({
      firebaseUser,
      user: profile,
      role: profile?.role ?? null,
      isAuthenticated: !!firebaseUser,
      loading,
      profileError,
      login,
      register,
      registerAgency,
      loginWithGoogle,
      completeGoogleProfile,
      completeGoogleAgency,
      logout,
      deleteAccount,
      resetPassword,
      refreshProfile,
    }),
    [
      firebaseUser,
      profile,
      loading,
      profileError,
      login,
      register,
      registerAgency,
      loginWithGoogle,
      completeGoogleProfile,
      completeGoogleAgency,
      logout,
      deleteAccount,
      resetPassword,
      refreshProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an <AuthProvider>");
  return ctx;
}
