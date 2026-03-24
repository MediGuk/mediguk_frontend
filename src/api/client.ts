import { useAuth } from '@/context/AuthContext';
import { setAccessToken } from '@/utils/auth';
import { handleSessionExpired } from '@/utils/session';

export async function apiFetch(url: string, options: RequestInit = {}) 
{
  let isRefreshing = false;
  let refreshPromise: Promise<string> | null = null;
  let { token } = useAuth();

  let res = await fetch(url, {
    ...options,
    credentials: 'include', // IMPORTANT: allows cookies to be sent
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  // Token expirado
  if (res.status === 401) {
    console.log("🔄 Token expirado");

    if (!isRefreshing) {
      isRefreshing = true;

    refreshPromise = fetch('http://localhost:8080/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })
      .then(async (refreshRes) => {
        if (!refreshRes.ok) {
          throw new Error("Refresh failed");
        }

        const data = await refreshRes.json();

        localStorage.setItem("accessToken", data.jwtToken);

        return data.jwtToken;
      })
      .finally(() => {
        isRefreshing = false;
      });
    }

    // Esperar al refresh en curso
    const newToken = await refreshPromise;

    // Repetir request original
    res = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newToken}`,
        },
    });
  }

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'API Error');
  }

  return res.json();
}