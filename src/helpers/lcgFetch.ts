import Cookies from "js-cookie";

export interface lcgFetchConfig {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  contentType?: string;
  body?: any;
}

export default function lcgFetch(config: lcgFetchConfig) {
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

  return fetch(url, fetchConfig);
}
