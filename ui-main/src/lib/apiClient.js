import { create } from "apisauce";

import authStorage from "@/auth/storage";
import { toUserError } from "@/lib/userError";

const apiClient = create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

apiClient.addAsyncRequestTransform(async (request) => {
  const token = authStorage.getToken();
  if (token) request.headers["x-auth-token"] = token;
});

function sanitizeErrorObject(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return data;

  const next = { ...data };

  if (typeof next.message === "string") {
    next.message = toUserError(next.message);
  }
  if (typeof next.error === "string") {
    next.error = toUserError(next.error);
  }
  if (typeof next.errorMessage === "string") {
    next.errorMessage = toUserError(next.errorMessage);
  }
  if (next.generation && typeof next.generation === "object") {
    next.generation = sanitizeErrorObject(next.generation);
  }

  return next;
}

apiClient.addAsyncResponseTransform(async (response) => {
  if (response.status === 401) {
    authStorage.removeToken();
    localStorage.removeItem("hamdast-ai-user");
    window.location.href = "/";
    return;
  }

  if (!response.ok) {
    if (typeof response.data === "string") {
      response.data = {
        message: toUserError(response.data, undefined, {
          problem: response.problem,
          status: response.status,
        }),
      };
    } else if (response.data && typeof response.data === "object") {
      response.data = sanitizeErrorObject(response.data);
    } else {
      response.data = {
        message: toUserError(null, undefined, {
          problem: response.problem,
          status: response.status,
        }),
      };
    }
    return;
  }

  if (response.data && typeof response.data === "object") {
    if (typeof response.data.errorMessage === "string") {
      response.data.errorMessage = toUserError(response.data.errorMessage);
    }
    if (typeof response.data.error === "string") {
      response.data.error = toUserError(response.data.error);
    }
  }
});

export default apiClient;
