import Cookies from "js-cookie";

export interface lcgFetchConfig {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  contentType: string;
  body: any;
}

export default function lcgFetch(config: lcgFetchConfig) {
  const url = process.env.REACT_APP_INVOKE_URL + config.endpoint;
  const token = Cookies.get("lcg-id-token") ?? "";

  return fetch(url, {
    method: config.method,
    headers: {
      Authorization: token,
      "Content-Type": config.contentType,
    },
    body: config.body,
  });
}
