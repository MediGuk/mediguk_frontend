export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function isAuthenticated() {
  return !!getAccessToken();
}

export function clearAccessToken() {
  localStorage.removeItem("accessToken");
}