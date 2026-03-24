export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function isAuthenticated() {
  return !!getAccessToken();
}

export function clearAccessToken() {
  localStorage.removeItem("accessToken");
}

export function setAccessToken(token: string) {
  localStorage.setItem("accessToken", token);
}
