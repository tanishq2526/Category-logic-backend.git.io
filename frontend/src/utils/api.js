/*
 * Handover note: Small fetch wrapper.
 * Adds JSON headers by default and centralizes response parsing/errors for screens that choose to use it.
 */
const API = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const res = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  return res.json();
};

export default API;
