import { createContext, useContext } from "react";

export const SiteContentContext = createContext(null);

export const fullUrl = (u) =>
  u && u.startsWith("/api/") ? `${process.env.REACT_APP_BACKEND_URL}${u}` : u;

export function useSiteContent() {
  const content = useContext(SiteContentContext);
  const images = content?.images || {};

  const get = (key, fallback) => {
    if (key.includes(".")) {
      const [k, i] = key.split(".");
      const arr = images[k];
      if (Array.isArray(arr) && arr[+i]) return fullUrl(arr[+i]);
      return fallback;
    }
    return fullUrl(images[key]) || fallback;
  };

  return { content, get };
}
