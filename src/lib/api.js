import { auth } from "./firebase";

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/$/, "");

/**
 * Thrown for any non-2xx response (and for network failures, with status 0).
 * `status` is the HTTP status, `data` is the parsed response body.
 */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * @param {string} path                 e.g. "/shipments"
 * @param {object} [opts]
 * @param {string} [opts.method="GET"]
 * @param {any}    [opts.body]          JSON-serialisable value, or a FormData
 * @param {boolean}[opts.auth=true]     attach the Firebase ID token
 * @param {object} [opts.headers]
 * @param {AbortSignal} [opts.signal]
 */
export async function request(
  path,
  { method = "GET", body, auth: needsAuth = true, headers = {}, signal } = {}
) {
  const finalHeaders = { Accept: "application/json", ...headers };
  let payload = body;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  if (body !== undefined && body !== null && !isFormData) {
    finalHeaders["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  if (needsAuth) {
    const user = auth.currentUser;
    if (!user) throw new ApiError("You are not signed in.", 401, null);
    // getIdToken() returns a cached token, or transparently refreshes it if the
    // current one is within ~5 min of expiry.
    finalHeaders.Authorization = `Bearer ${await user.getIdToken()}`;
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: payload,
      signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    throw new ApiError(
      "Could not reach the server. Is the backend running?",
      0,
      null
    );
  }

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const detail =
      data && typeof data === "object" && "detail" in data
        ? data.detail
        : typeof data === "string" && data
          ? data
          : `Request failed (${res.status})`;
    // FastAPI validation errors come back as an array of {loc, msg, ...}.
    const message = Array.isArray(detail)
      ? detail.map((d) => d?.msg || JSON.stringify(d)).join("; ")
      : String(detail);
    throw new ApiError(message, res.status, data);
  }

  return data;
}

/**
 * Fetches a binary response (e.g. a downloaded file) as a Blob, with the same
 * auth header as `request()`. A plain <a href> or <img src> can't carry the
 * Authorization header, so callers that want to preview/download a protected
 * file must go through this and turn the Blob into an object URL.
 */
export async function getBlob(path) {
  const user = auth.currentUser;
  if (!user) throw new ApiError("You are not signed in.", 401, null);
  const token = await user.getIdToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new ApiError(`Request failed (${res.status})`, res.status, null);
  }
  return res.blob();
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  del: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};
