import Cookies from "js-cookie";

export interface FetchConfig {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  contentType?: string;
  body?: any;
}

export interface FetchResult {
  loading: boolean;
  error: string;
  data?: any;
}

export default async function lcgFetch(config: FetchConfig) {
  const url = process.env.REACT_APP_INVOKE_URL + config.endpoint;
  const token = Cookies.get("lcg-id-token") ?? "";

  const fetchConfig: RequestInit = {
    method: config.method,
    headers: {
      Authorization: token,
    },
  };

  // Attach Content-Type header if applicable
  if (config.contentType) {
    // @ts-ignore
    fetchConfig.headers = {
      ...fetchConfig.headers,
      "Content-Type": config.contentType,
    };
  }

  // Attach body if applicable
  if (config.body) {
    fetchConfig.body = config.body;
  }

  const response = await fetch(url, fetchConfig);

  if (response.status === 401) {
    Cookies.set("lcg-id-token", "");
    window.location.reload();
  }

  return response;
}
